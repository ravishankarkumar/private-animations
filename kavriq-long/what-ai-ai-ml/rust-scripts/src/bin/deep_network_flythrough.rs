//! Six layers, one hundred nodes on each sheet.
//!
//! The network is built in view, then the shot falls through the layers and
//! pulls back so the same network can be read again.
//!
//! ```text
//! cargo run --release --bin deep-network-flythrough -- --preview
//! cargo run --release --bin deep-network-flythrough -- --export
//! ```

use std::path::PathBuf;

use glam::{Vec3, Vec4, vec2};
use murali::backend::renderer::vertex::mesh::MeshVertex;
use murali::engine::camera::Projection;
use murali::engine::export::{ExportSettings, PngCompressionMode};
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;
use murali::frontend::collection::composite::SmoothGround;
use murali::frontend::layout::{Bounded, Bounds};
use murali::projection::{Mesh, Project, ProjectionCtx, RenderPrimitive};
use murali::{App, SceneView, SceneViewPlayback, ScreenshotCapture};

const LAYERS: usize = 6;
const NODES: usize = 100;
/// Links drawn per node. A full 100×100 matrix would paint the gaps solid.
const FANOUT: usize = 3;
/// Half-extent of a layer sheet. Wide enough that the beads and their halos stay apart.
const HALF: f32 = 3.5;
const GAP: f32 = 10.2;
const PLANE_Y: f32 = 0.12;
/// Open corridor the camera flies through. Small against the sheet, so the side view stays full.
const TUNNEL_Y: f32 = PLANE_Y + 0.2;
const TUNNEL_Z: f32 = -0.08;
const TUNNEL_RADIUS: f32 = 0.34;
/// Nodes sweep down each sheet, input layer first. The next sheet starts
/// before the previous one finishes, so a link can be drawn as soon as both
/// of its nodes have arrived.
const BIRTH_LEAD: f32 = 0.22;
const LAYER_STEP: f32 = 0.52;
const LAYER_FILL: f32 = 1.35;
const NODE_POP: f32 = 0.16;
const EDGE_DRAW: f32 = 0.34;
/// Hold on the wide shot until the last stroke has landed, then the dive.
const BIRTH: f32 = 5.05;
/// Cruise from the closer lean into the mouth. Matched to the tunnel speed.
const APPROACH_DUR: f32 = 2.35;
/// Lean, approach, tunnel, climb, and the return.
const FLIGHT: f32 = 2.3 + APPROACH_DUR + 2.42 + 8.70 + 3.80;
const SHOT: f32 = BIRTH + FLIGHT;
const FOV_BEAUTY: f32 = 28.0 * std::f32::consts::PI / 180.0;
const FOV_DIVE: f32 = 66.0 * std::f32::consts::PI / 180.0;

const BACKGROUND: Vec4 = Vec4::new(7.0 / 255.0, 10.0 / 255.0, 22.0 / 255.0, 1.0);
/// Smooth floor, low enough that the sheet beads stay clear of the crests.
const FLOOR_AT: Vec3 = Vec3::new(0.0, -6.6, 0.0);
const FLOOR_WIDTH: f32 = 260.0;
const FLOOR_DEPTH: f32 = 180.0;
const FLOOR_AMPLITUDE: f32 = 1.85;
const FLOOR_COLUMNS: usize = 241;
const FLOOR_ROWS: usize = 169;
const LAYER_TINT: [[f32; 3]; LAYERS] = [
    [126.0 / 255.0, 214.0 / 255.0, 242.0 / 255.0],
    [150.0 / 255.0, 188.0 / 255.0, 248.0 / 255.0],
    [176.0 / 255.0, 164.0 / 255.0, 255.0 / 255.0],
    [198.0 / 255.0, 176.0 / 255.0, 255.0 / 255.0],
    [218.0 / 255.0, 196.0 / 255.0, 255.0 / 255.0],
    [236.0 / 255.0, 214.0 / 255.0, 255.0 / 255.0],
];
const ROSE: [f32; 3] = [206.0 / 255.0, 150.0 / 255.0, 172.0 / 255.0];
const PULSE: [f32; 3] = [214.0 / 255.0, 246.0 / 255.0, 255.0 / 255.0];
/// Forward packets cross the whole stack about once every two seconds.
const FLOW_RATE: f32 = 0.45;
const WHITE: [f32; 3] = [246.0 / 255.0, 244.0 / 255.0, 255.0 / 255.0];

struct Node {
    layer: usize,
    position: Vec3,
    seed: f32,
    /// When this bead starts to grow in.
    born: f32,
}

struct Edge {
    from: Vec3,
    to: Vec3,
    from_layer: usize,
    initial: f32,
    target: f32,
    seed: f32,
    backward: bool,
    /// Stroke starts only after both endpoints have finished appearing.
    draw_at: f32,
}

struct LiveNetwork {
    time: f32,
    eye: Vec3,
    fov: f32,
    nodes: Vec<Node>,
    edges: Vec<Edge>,
}

impl LiveNetwork {
    fn new() -> Self {
        let mut nodes = build_nodes();
        assign_birth(&mut nodes);
        let edges = build_edges(&nodes);
        Self {
            time: 0.0,
            eye: orbit(74.0, -66.0, 12.0),
            fov: FOV_BEAUTY,
            nodes,
            edges,
        }
    }
}

impl Project for LiveNetwork {
    fn project(&self, ctx: &mut ProjectionCtx) {
        let time = self.time;
        // Training waits until the sheets and the strokes exist.
        let live = (time - BIRTH).max(0.0);
        let epoch = Ease::InOutCubic.eval(((live - 0.85) / 9.4).clamp(0.0, 1.0));
        let settle = smoothstep(epoch);

        for edge in &self.edges {
            let draw = edge_draw(time, edge.draw_at);
            if draw <= 0.02 {
                continue;
            }
            let end = edge.from.lerp(edge.to, draw);
            let weight = weight_at(edge, settle, live);
            let magnitude = weight.abs();
            let color = edge_color(edge.from_layer, weight, magnitude);
            let midpoint = (edge.from + end) * 0.5;
            let fraction = if weight >= 0.0 {
                0.0011 + magnitude * 0.0022
            } else {
                0.0006 + magnitude * 0.0011
            };
            let thickness = world_span(self.eye, midpoint, self.fov, fraction).clamp(0.004, 0.028);
            ctx.emit(RenderPrimitive::Line {
                start: edge.from,
                end,
                thickness,
                color,
                dash_length: 0.0,
                gap_length: 0.0,
                dash_offset: 0.0,
            });

            if draw >= 0.999 && magnitude > 0.3 {
                // Born at the input sheet once the head leaves it. A full
                // segment at travel == 0 sits still on that sheet all through
                // the build.
                let travel = fract(live * FLOW_RATE) * (LAYERS - 1) as f32;
                let local = travel - edge.from_layer as f32;
                let span = 0.14;
                if travel > 0.05 && local > 0.03 && local < 1.0 {
                    let start_t = (local - span).max(0.0);
                    let end_t = local;
                    if end_t - start_t > 0.02 {
                        ctx.emit(RenderPrimitive::Line {
                            start: edge.from.lerp(edge.to, start_t),
                            end: edge.from.lerp(edge.to, end_t),
                            thickness: world_span(
                                self.eye,
                                edge.from,
                                self.fov,
                                0.0038 + magnitude * 0.0013,
                            )
                            .clamp(0.008, 0.10),
                            color: Vec4::new(PULSE[0], PULSE[1], PULSE[2], 0.5 + magnitude * 0.22),
                            dash_length: 0.0,
                            gap_length: 0.0,
                            dash_offset: 0.0,
                        });
                    }
                }
            }

            if draw >= 0.999 && magnitude > 0.34 && settle < 0.97 {
                let messy = fract(live * 0.72 + edge.seed);
                let fade = 1.0 - settle;
                let (start, end) = pulse_segment(edge.from, edge.to, messy, 0.05);
                ctx.emit(RenderPrimitive::Line {
                    start,
                    end,
                    thickness: world_span(self.eye, start, self.fov, 0.0022 + magnitude * 0.0011)
                        .clamp(0.005, 0.04),
                    color: Vec4::new(
                        PULSE[0],
                        PULSE[1],
                        PULSE[2],
                        (0.28 + magnitude * 0.45) * fade,
                    ),
                    dash_length: 0.0,
                    gap_length: 0.0,
                    dash_offset: 0.0,
                });
            }

            if draw >= 0.999 && edge.backward && settle < 0.96 && magnitude > 0.2 {
                let back = fract(live * 0.48 + edge.seed * 0.37);
                let (start, end) = pulse_segment(edge.from, edge.to, 1.0 - back, 0.04);
                ctx.emit(RenderPrimitive::Line {
                    start,
                    end,
                    thickness: world_span(self.eye, start, self.fov, 0.0024).clamp(0.006, 0.03),
                    color: Vec4::new(ROSE[0], ROSE[1], ROSE[2], 0.34 * (1.0 - settle)),
                    dash_length: 0.0,
                    gap_length: 0.0,
                    dash_offset: 0.0,
                });
            }
        }

        let mut cores = MeshBuilder::with_capacity(self.nodes.len() * 60);
        let mut halos = MeshBuilder::with_capacity(self.nodes.len() * 32);
        for node in &self.nodes {
            let reveal = node_reveal(time, node.born);
            if reveal <= 0.02 {
                continue;
            }
            let wave = fract(live * FLOW_RATE);
            let layer_t = node.layer as f32 / (LAYERS - 1) as f32;
            let glow = (-24.0 * (layer_t - wave).powi(2)).exp() * settle * settle;
            let flicker =
                (1.0 - settle) * (0.35 + 0.65 * (live * 3.1 + node.seed * 12.0).sin().abs());
            let tint = LAYER_TINT[node.layer];
            let body = mix3(tint, WHITE, 0.12 + glow.max(flicker) * 0.5);
            let build = 0.74 + node.seed * 0.5;
            let radius = world_span(self.eye, node.position, self.fov, 0.009 + glow * 0.003)
                .clamp(0.028, 0.10)
                * build
                * reveal;
            // Core alpha stays 1. A partial alpha on any vertex would make the
            // whole bead mesh transparent and drop its depth write.
            cores.push_sphere(
                node.position,
                radius,
                [1.0, 1.0, 1.0, 1.0],
                Some(body),
                12,
                20,
            );
            halos.push_sphere(
                node.position,
                radius * 1.38,
                [tint[0], tint[1], tint[2], (0.08 + glow * 0.22) * reveal],
                None,
                6,
                12,
            );
        }
        // The first frames have no beads yet. An empty vertex buffer is rejected.
        if !cores.vertices.is_empty() {
            ctx.emit(RenderPrimitive::Mesh(cores.finish()));
        }
        if !halos.vertices.is_empty() {
            ctx.emit(RenderPrimitive::Mesh(halos.finish()));
        }
    }
}

impl Bounded for LiveNetwork {
    fn local_bounds(&self) -> Bounds {
        let reach_x = (LAYERS as f32 - 1.0) * 0.5 * GAP + 0.4;
        let reach_y = HALF + PLANE_Y.abs() + 0.4;
        Bounds::new(vec2(-reach_x, -reach_y), vec2(reach_x, reach_y))
    }
}

fn floor_mesh(eye: Vec3) -> SmoothGround {
    SmoothGround::new()
        .with_size(FLOOR_WIDTH, FLOOR_DEPTH)
        .with_amplitude(FLOOR_AMPLITUDE)
        .with_samples(FLOOR_COLUMNS, FLOOR_ROWS)
        .with_horizon(BACKGROUND)
        .with_eye(eye - FLOOR_AT)
}

struct MeshBuilder {
    vertices: Vec<MeshVertex>,
    indices: Vec<u32>,
}

impl MeshBuilder {
    fn with_capacity(spheres: usize) -> Self {
        Self {
            vertices: Vec::with_capacity(spheres),
            indices: Vec::with_capacity(spheres * 2),
        }
    }

    fn push_sphere(
        &mut self,
        center: Vec3,
        radius: f32,
        color: [f32; 4],
        shade: Option<[f32; 3]>,
        stacks: u32,
        slices: u32,
    ) {
        let stacks = stacks.max(2);
        let slices = slices.max(3);
        let base = self.vertices.len() as u32;
        let light = Vec3::new(0.22, 0.84, 0.48).normalize();
        for stack in 0..=stacks {
            let phi = std::f32::consts::PI * stack as f32 / stacks as f32;
            let y = radius * phi.cos();
            let ring = radius * phi.sin();
            for slice in 0..=slices {
                let theta = std::f32::consts::TAU * slice as f32 / slices as f32;
                let normal = Vec3::new(ring * theta.cos(), y, ring * theta.sin());
                let vertex_color = if let Some(tint) = shade {
                    let facing = normal.normalize_or_zero().dot(light).clamp(0.0, 1.0);
                    let ink = mix3(tint, WHITE, 0.22 + facing * facing * 0.78);
                    [ink[0], ink[1], ink[2], color[3]]
                } else {
                    color
                };
                self.vertices.push(MeshVertex {
                    position: [
                        center.x + normal.x,
                        center.y + normal.y,
                        center.z + normal.z,
                    ],
                    color: vertex_color,
                });
            }
        }
        let stride = slices + 1;
        for stack in 0..stacks {
            for slice in 0..slices {
                let i0 = base + stack * stride + slice;
                let i1 = i0 + stride;
                self.indices
                    .extend_from_slice(&[i0, i1, i0 + 1, i0 + 1, i1, i1 + 1]);
            }
        }
    }

    fn finish(self) -> std::sync::Arc<Mesh> {
        Mesh::from_tessellation(self.vertices, self.indices)
    }
}

fn build_network_scene() -> anyhow::Result<Scene> {
    let mut scene = Scene::new();
    scene.set_background(BACKGROUND);
    scene.camera_mut().projection = Projection::Perspective {
        fov_y_rad: FOV_BEAUTY,
        aspect: 16.0 / 9.0,
        near: 0.06,
        far: 320.0,
    };
    scene.camera_mut().up = Vec3::Y;

    // Look slightly off the origin so the near sheet stays inside the frame
    // while the six planes still read left to right.
    let appreciate = Vec3::new(-0.8, 0.1, 0.0);
    let appreciate_back = Vec3::new(0.8, 0.1, 0.0);
    // Closer than the old 98 / 90 orbits, so the sheets fill the frame.
    // The lean stays outside the net: nearer than this clips the corners
    // before the dive lens has opened.
    let beauty_start = orbit(72.0, -60.0, 10.0);
    let beauty_lean = orbit(70.0, -56.0, 8.0);
    let tunnel = Vec3::new(0.0, TUNNEL_Y, TUNNEL_Z);
    let mouth = Vec3::new(layer_x(0) - 6.5, tunnel.y, tunnel.z);
    // Far down the same tunnel axis. A short look target made the heading
    // bunch into the last moment of the dive.
    let mouth_look = Vec3::new(38.0, tunnel.y, tunnel.z);
    let through = Vec3::new(layer_x(4) + 1.5, tunnel.y, tunnel.z);
    // Same heading as the first climb step, so the cruise does not snap.
    let through_look = Vec3::new(48.80, 0.32, 0.05);
    let beauty_return = orbit(74.0, 56.0, 8.5);
    let beauty_hold = orbit(68.0, 52.0, 7.0);

    let birth_from = orbit(74.0, -66.0, 12.0);
    scene.camera_mut().position = birth_from;
    scene.camera_mut().target = appreciate;

    let network_id = scene.add_tattva(LiveNetwork::new(), Vec3::ZERO);
    let floor_id = scene.add_tattva(floor_mesh(birth_from), FLOOR_AT);
    let mut timeline = Timeline::new();

    timeline.call_during_reversible(
        0.0,
        SHOT,
        move |scene, progress| {
            let eye = scene.camera().position;
            let fov = match scene.camera().projection {
                Projection::Perspective { fov_y_rad, .. } => fov_y_rad,
                Projection::Orthographic { .. } => FOV_BEAUTY,
            };
            if let Some(network) = scene.get_tattva_typed_mut::<LiveNetwork>(network_id) {
                network.state.time = progress * SHOT;
                network.state.eye = eye;
                network.state.fov = fov;
            }
            if let Some(floor) = scene.get_tattva_typed_mut::<SmoothGround>(floor_id) {
                floor.state.eye = eye - FLOOR_AT;
                floor.state.phase = progress * SHOT * 0.035;
            }
        },
        move |scene| {
            if let Some(network) = scene.get_tattva_typed_mut::<LiveNetwork>(network_id) {
                network.state.time = 0.0;
            }
            if let Some(floor) = scene.get_tattva_typed_mut::<SmoothGround>(floor_id) {
                floor.state.phase = 0.0;
            }
        },
    );

    // Slow drift while the network is built. InOutQuad rests at the end, so
    // the existing lean starts from a stop.
    frame_to(
        &mut timeline,
        0.0,
        BIRTH,
        beauty_start,
        appreciate,
        Ease::InOutQuad,
    );
    frame_to(
        &mut timeline,
        BIRTH,
        2.3,
        beauty_lean,
        appreciate,
        Ease::InOutQuad,
    );
    // Same speed on both segments, so the camera cruises into the tunnel
    // instead of rushing the doorway and then braking.
    let approach_at = BIRTH + 2.3;
    let through_at = approach_at + APPROACH_DUR;
    let climb_at = through_at + 2.42;
    frame_to(
        &mut timeline,
        approach_at,
        APPROACH_DUR,
        mouth,
        mouth_look,
        Ease::Linear,
    );
    frame_to(
        &mut timeline,
        through_at,
        2.42,
        through,
        through_look,
        Ease::Linear,
    );
    // Rise clear of the sheets, then turn onto them, while the eye is still
    // over the mesh. Look targets sit on a fixed-length ray aimed at the
    // network, and each step is under twenty degrees.
    let climb: [(f32, f32, Vec3, Vec3); 10] = [
        (
            climb_at + 0.00,
            0.52,
            Vec3::new(18.96, 3.48, 1.30),
            Vec3::new(49.94, -3.95, -1.70),
        ),
        (
            climb_at + 0.52,
            0.56,
            Vec3::new(20.46, 5.34, 2.25),
            Vec3::new(47.91, -9.71, -4.39),
        ),
        (
            climb_at + 1.08,
            0.57,
            Vec3::new(21.62, 6.62, 3.00),
            Vec3::new(42.97, -14.97, -7.12),
        ),
        (
            climb_at + 1.65,
            0.52,
            Vec3::new(22.56, 7.55, 3.60),
            Vec3::new(36.69, -18.23, -9.05),
        ),
        (
            climb_at + 2.17,
            0.52,
            Vec3::new(23.56, 8.42, 4.23),
            Vec3::new(29.35, -19.55, -10.19),
        ),
        (
            climb_at + 2.70,
            0.59,
            Vec3::new(24.95, 9.45, 5.12),
            Vec3::new(20.92, -18.32, -10.27),
        ),
        (
            climb_at + 3.29,
            0.52,
            Vec3::new(26.77, 10.43, 6.28),
            Vec3::new(14.62, -14.78, -9.23),
        ),
        (
            climb_at + 3.81,
            0.50,
            Vec3::new(29.78, 11.00, 8.20),
            Vec3::new(11.11, -9.66, -7.57),
        ),
        (
            climb_at + 4.31,
            0.55,
            Vec3::new(35.24, 11.00, 11.69),
            Vec3::new(11.39, -3.39, -4.07),
        ),
        (
            climb_at + 4.86,
            0.54,
            Vec3::new(41.29, 11.00, 15.55),
            Vec3::new(13.19, 2.38, 2.90),
        ),
    ];
    for (at, duration, position, target) in climb {
        frame_to(&mut timeline, at, duration, position, target, Ease::Linear);
    }
    frame_to(
        &mut timeline,
        climb_at + 5.40,
        3.30,
        beauty_return,
        appreciate_back,
        Ease::Linear,
    );
    frame_to(
        &mut timeline,
        climb_at + 8.70,
        3.80,
        beauty_hold,
        appreciate_back,
        Ease::OutQuad,
    );

    timeline
        .animate_camera()
        .at(approach_at)
        .for_duration(APPROACH_DUR)
        .ease(Ease::InOutQuad)
        .fov_to(FOV_DIVE)
        .spawn();
    timeline
        .animate_camera()
        .at(climb_at + 5.40)
        .for_duration(3.2)
        .ease(Ease::InOutCubic)
        .fov_to(FOV_BEAUTY)
        .spawn();

    scene.play(timeline)?;
    Ok(scene)
}

fn frame_to(
    timeline: &mut Timeline,
    at: f32,
    duration: f32,
    position: Vec3,
    target: Vec3,
    ease: Ease,
) {
    timeline
        .animate_camera()
        .at(at)
        .for_duration(duration)
        .ease(ease)
        .frame_to(position, target)
        .spawn();
}

fn build_stage(network: Scene) -> anyhow::Result<Scene> {
    let mut scene = Scene::new();
    scene.set_background(BACKGROUND);
    scene.add_scene_view(
        SceneView::new(network)
            .size(vec2(16.0, 9.0))
            .background(BACKGROUND)
            .playback(SceneViewPlayback::Once),
        Vec3::ZERO,
    );

    let approach_at = BIRTH + 2.3;
    let through_at = approach_at + APPROACH_DUR;
    let climb_at = through_at + 2.42;
    scene.add_screenshot_capture(
        ScreenshotCapture::new([
            0.55,
            1.7,
            3.4,
            4.7,
            BIRTH + 2.05,
            approach_at + APPROACH_DUR * (1.85 / 3.28),
            through_at - 0.08,
            through_at + 0.82,
            climb_at + 1.60,
            climb_at + 4.30,
            climb_at + 5.40 + 1.80,
            climb_at + 8.70 + 1.80,
        ])
        .with_names([
            Some("deep-network-birth-nodes.png"),
            Some("deep-network-birth-links.png"),
            Some("deep-network-birth-knit.png"),
            Some("deep-network-birth-done.png"),
            Some("deep-network-afar.png"),
            Some("deep-network-falling.png"),
            Some("deep-network-mouth.png"),
            Some("deep-network-inside.png"),
            Some("deep-network-climbing.png"),
            Some("deep-network-emerging.png"),
            Some("deep-network-pullback.png"),
            Some("deep-network-return.png"),
        ]),
    );
    Ok(scene)
}

fn main() -> anyhow::Result<()> {
    let scene = build_stage(build_network_scene()?)?;
    let mut settings = ExportSettings::from_scene(&scene);
    settings.width = 1920;
    settings.fps = 30;
    settings.video_enabled = true;
    settings.preserve_frame_exports = false;
    settings.png_compression = PngCompressionMode::Fast;
    settings.artifact_dir = PathBuf::from("deep_network_flythrough");
    settings.clear_color = BACKGROUND;

    App::new()?
        .with_scene(scene)
        .with_export_settings(settings)
        .run_app()
}

fn build_nodes() -> Vec<Node> {
    let mut points = Vec::with_capacity(LAYERS * NODES);
    let inset = HALF - 0.1;
    for layer in 0..LAYERS {
        let plane_x = layer_x(layer);
        for index in 0..NODES {
            let (depth, height) = scatter(layer, index);
            let mut y = PLANE_Y + (height * 2.0 - 1.0) * inset;
            let mut z = (depth * 2.0 - 1.0) * inset;
            (y, z) = clear_tunnel(y, z, hash((layer * 40 + index) as f32));
            points.push(Node {
                layer,
                position: Vec3::new(plane_x, y, z),
                seed: hash((layer * 1000 + index * 17 + 3) as f32),
                born: 0.0,
            });
        }
    }
    points
}

fn assign_birth(nodes: &mut [Node]) {
    let step = LAYER_FILL / (NODES - 1) as f32;
    for layer in 0..LAYERS {
        let mut order: Vec<usize> = (0..NODES).collect();
        order.sort_by(|&left, &right| {
            let a = nodes[layer * NODES + left].position;
            let b = nodes[layer * NODES + right].position;
            b.y.total_cmp(&a.y).then(a.z.total_cmp(&b.z))
        });
        for (rank, index) in order.into_iter().enumerate() {
            nodes[layer * NODES + index].born =
                BIRTH_LEAD + layer as f32 * LAYER_STEP + rank as f32 * step;
        }
    }
}

fn node_reveal(time: f32, born: f32) -> f32 {
    Ease::OutCubic.eval(((time - born) / NODE_POP).clamp(0.0, 1.0))
}

fn edge_draw(time: f32, draw_at: f32) -> f32 {
    smoothstep(((time - draw_at) / EDGE_DRAW).clamp(0.0, 1.0))
}

fn build_edges(nodes: &[Node]) -> Vec<Edge> {
    let mut links = Vec::with_capacity((LAYERS - 1) * NODES * FANOUT);
    for layer in 0..LAYERS - 1 {
        for index in 0..NODES {
            let from = &nodes[layer * NODES + index];
            for target_index in fanout(layer, index) {
                let to = &nodes[(layer + 1) * NODES + target_index];
                let seed = hash((layer * 8000 + index * 130 + target_index * 17) as f32);
                let initial = seed * 2.0 - 1.0;
                let keep = hash(seed * 19.0 + 4.0);
                let sign = if hash(seed * 23.0 + 8.0) > 0.7 {
                    -1.0
                } else {
                    1.0
                };
                let magnitude = if keep > 0.42 {
                    0.25 + keep * 0.75
                } else {
                    keep * 0.18
                };
                links.push(Edge {
                    from: from.position,
                    to: to.position,
                    from_layer: layer,
                    initial,
                    target: sign * magnitude,
                    seed,
                    backward: hash(seed * 29.0 + 2.0) > 0.8,
                    draw_at: from.born.max(to.born) + NODE_POP,
                });
            }
        }
    }
    links
}

fn fanout(layer: usize, index: usize) -> Vec<usize> {
    let mut chosen = Vec::with_capacity(FANOUT);
    let mut salt = 1.0;
    while chosen.len() < FANOUT && salt < 48.0 {
        let pick = (hash((layer as f32) * 997.0 + (index as f32) * 131.0 + salt * 17.0)
            * NODES as f32)
            .floor() as usize;
        salt += 1.0;
        let pick = pick.min(NODES - 1);
        if !chosen.contains(&pick) {
            chosen.push(pick);
        }
    }
    chosen
}

fn scatter(layer: usize, index: usize) -> (f32, f32) {
    let g = 1.324_717_957_244_746;
    let n = (index + 1) as f32;
    let u = fract(0.5 + n / g + layer as f32 * 0.173);
    let v = fract(0.5 + n / (g * g) + layer as f32 * 0.271);
    let jx = (hash((layer * 40 + index * 3 + 1) as f32) - 0.5) * 0.045;
    let jy = (hash((layer * 40 + index * 5 + 2) as f32) - 0.5) * 0.045;
    ((u + jx).clamp(0.02, 0.98), (v + jy).clamp(0.02, 0.98))
}

fn clear_tunnel(y: f32, z: f32, salt: f32) -> (f32, f32) {
    let dy = y - TUNNEL_Y;
    let dz = z - TUNNEL_Z;
    let distance = (dy * dy + dz * dz).sqrt();
    if distance >= TUNNEL_RADIUS {
        return (y, z);
    }
    let (uy, uz) = if distance > 1.0e-4 {
        (dy / distance, dz / distance)
    } else {
        let angle = salt * std::f32::consts::TAU;
        (angle.cos(), angle.sin())
    };
    // Scatter past the rim so the cleared nodes do not draw a bright ring.
    let rim = TUNNEL_RADIUS * (1.2 + salt * 1.15);
    (TUNNEL_Y + uy * rim, TUNNEL_Z + uz * rim)
}

fn layer_x(layer: usize) -> f32 {
    (layer as f32 - (LAYERS as f32 - 1.0) * 0.5) * GAP
}

fn orbit(distance: f32, azimuth_deg: f32, elevation_deg: f32) -> Vec3 {
    let azimuth = azimuth_deg.to_radians();
    let elevation = elevation_deg.to_radians();
    let horizontal = elevation.cos() * distance;
    Vec3::new(
        azimuth.sin() * horizontal,
        elevation.sin() * distance,
        azimuth.cos() * horizontal,
    )
}

fn weight_at(edge: &Edge, settle: f32, time: f32) -> f32 {
    let wobble = (time * 5.4 + edge.seed * 18.0).sin() * (1.0 - settle) * 0.42;
    (mix(edge.initial, edge.target, settle) + wobble).clamp(-1.0, 1.0)
}

fn edge_color(from_layer: usize, weight: f32, magnitude: f32) -> Vec4 {
    let from = LAYER_TINT[from_layer];
    let to = LAYER_TINT[(from_layer + 1).min(LAYERS - 1)];
    let tint = mix3(from, to, 0.5);
    if weight >= 0.0 {
        let ink = mix3(tint, WHITE, magnitude * 0.36);
        Vec4::new(ink[0], ink[1], ink[2], 0.16 + magnitude * 0.38)
    } else {
        let ink = mix3(tint, ROSE, 0.78);
        Vec4::new(ink[0], ink[1], ink[2], 0.05 + magnitude * 0.24)
    }
}

fn world_span(eye: Vec3, point: Vec3, fov: f32, fraction: f32) -> f32 {
    let distance = eye.distance(point).max(0.45);
    let view_height = 2.0 * distance * (fov * 0.5).tan().max(0.08);
    view_height * fraction
}

fn pulse_segment(from: Vec3, to: Vec3, along: f32, half_span: f32) -> (Vec3, Vec3) {
    let start = (along - half_span).clamp(0.0, 1.0);
    let end = (along + half_span * 0.4).clamp(0.0, 1.0);
    (from.lerp(to, start), from.lerp(to, end))
}

fn hash(value: f32) -> f32 {
    fract((value * 127.1 + 311.7).sin() * 43758.5453)
}

fn smoothstep(value: f32) -> f32 {
    let value = value.clamp(0.0, 1.0);
    value * value * (3.0 - 2.0 * value)
}

fn mix(from: f32, to: f32, amount: f32) -> f32 {
    from + (to - from) * amount
}

fn mix3(from: [f32; 3], to: [f32; 3], amount: f32) -> [f32; 3] {
    [
        mix(from[0], to[0], amount),
        mix(from[1], to[1], amount),
        mix(from[2], to[2], amount),
    ]
}

fn fract(value: f32) -> f32 {
    value - value.floor()
}
