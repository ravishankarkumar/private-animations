use anyhow::Result;
use glam::{Vec3, Vec4};
use murali::App;
use murali::colors::*;
use murali::engine::export::ExportSettings;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::TattvaId;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::circle::Circle;
use murali::frontend::collection::primitives::line::Line;
use murali::frontend::collection::text::label::Label;
use std::path::PathBuf;

const DURATION: f32 = 5.6;
const GIF_STOPS: &[f32] = &[0.45, 1.1, 1.85, 2.65, 3.45, 4.35, 5.15];

fn rgba(color: Vec4, alpha: f32) -> Vec4 {
    Vec4::new(color.x, color.y, color.z, alpha)
}

fn add_label(scene: &mut Scene, text: &str, size: f32, color: Vec4, pos: Vec3) -> TattvaId {
    scene.add_tattva(Label::new(text, size).with_color(color), pos)
}

fn add_ring(scene: &mut Scene, radius: f32, stroke: f32, color: Vec4) -> TattvaId {
    scene.add_tattva(
        Circle::new(radius, 96, rgba(color, 0.0)).with_stroke(stroke, color),
        Vec3::new(0.0, 0.25, 0.0),
    )
}

fn add_dot(scene: &mut Scene, pos: Vec3, radius: f32, color: Vec4) -> TattvaId {
    scene.add_tattva(
        Circle::new(radius, 36, color).with_stroke(0.014, rgba(WHITE, 0.72)),
        pos,
    )
}

fn appear(timeline: &mut Timeline, ids: &[TattvaId], at: f32, duration: f32) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::OutCubic)
            .appear()
            .spawn();
    }
}

fn draw(timeline: &mut Timeline, ids: &[TattvaId], at: f32, duration: f32) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::OutCubic)
            .draw()
            .spawn();
    }
}

fn write_text(timeline: &mut Timeline, ids: &[TattvaId], at: f32, duration: f32) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::OutCubic)
            .typewrite_text()
            .spawn();
    }
}

pub fn run() -> Result<()> {
    let mut scene = Scene::new();
    let mut timeline = Timeline::new();
    scene.camera_mut().position = Vec3::new(0.0, 0.0, 8.8);

    let cyan = Vec4::new(0.20, 0.84, 0.96, 1.0);
    let teal = TEAL_B;
    let blue = BLUE_B;
    let green = GREEN_B;
    let amber = GOLD_B;
    let soft_text = rgba(WHITE, 0.82);

    let mut ids = Vec::new();

    let title = add_label(
        &mut scene,
        "Murali AI",
        0.46,
        soft_text,
        Vec3::new(0.0, 2.98, 0.1),
    );
    let subtitle = add_label(
        &mut scene,
        "intelligence is active",
        0.2,
        rgba(BLUE_A, 0.68),
        Vec3::new(0.0, 2.55, 0.1),
    );
    ids.extend([title, subtitle]);

    let outer = add_ring(&mut scene, 1.86, 0.025, rgba(cyan, 0.34));
    let mid = add_ring(&mut scene, 1.32, 0.032, rgba(teal, 0.52));
    let inner = add_ring(&mut scene, 0.74, 0.045, rgba(cyan, 0.78));
    ids.extend([outer, mid, inner]);

    let core_glow = scene.add_tattva(
        Circle::new(0.56, 96, rgba(cyan, 0.12)).with_stroke(0.025, rgba(cyan, 0.54)),
        Vec3::new(0.0, 0.25, 0.04),
    );
    let core = scene.add_tattva(
        Circle::new(0.26, 64, rgba(cyan, 0.92)).with_stroke(0.02, WHITE),
        Vec3::new(0.0, 0.25, 0.12),
    );
    let core_label = add_label(
        &mut scene,
        "AI",
        0.18,
        Vec4::new(0.03, 0.06, 0.08, 1.0),
        Vec3::new(0.0, 0.25, 0.2),
    );
    ids.extend([core_glow, core, core_label]);

    let node_specs = [
        (Vec3::new(-1.55, 1.02, 0.1), teal),
        (Vec3::new(-1.20, -0.86, 0.1), blue),
        (Vec3::new(0.0, -1.36, 0.1), amber),
        (Vec3::new(1.20, -0.86, 0.1), green),
        (Vec3::new(1.55, 1.02, 0.1), cyan),
    ];
    let mut nodes = Vec::new();
    let mut spokes = Vec::new();
    for (pos, color) in node_specs {
        spokes.push(scene.add_tattva(
            Line::new(
                Vec3::new(0.0, 0.25, 0.0),
                Vec3::new(pos.x, pos.y, 0.0),
                0.018,
                rgba(color, 0.38),
            ),
            Vec3::ZERO,
        ));
        nodes.push(add_dot(&mut scene, pos, 0.075, rgba(color, 0.92)));
    }
    ids.extend(spokes.iter().chain(nodes.iter()).copied());

    let signal = add_dot(
        &mut scene,
        Vec3::new(-1.55, 1.02, 0.18),
        0.055,
        rgba(WHITE, 0.95),
    );
    ids.push(signal);

    let lower_claim = add_label(
        &mut scene,
        "authored with Murali Engine",
        0.18,
        rgba(WHITE, 0.46),
        Vec3::new(0.0, -2.72, 0.1),
    );
    let built = add_label(
        &mut scene,
        "Built with Murali Engine",
        0.15,
        rgba(WHITE, 0.5),
        Vec3::new(3.2, -3.4, 0.1),
    );
    ids.extend([lower_claim, built]);

    for &id in &ids {
        scene.hide_tattva(id);
    }

    write_text(&mut timeline, &[title], 0.1, 0.7);
    write_text(&mut timeline, &[subtitle], 0.62, 0.5);
    appear(&mut timeline, &[built], 0.2, 0.6);

    draw(&mut timeline, &[inner], 0.95, 0.5);
    appear(&mut timeline, &[core_glow, core], 1.05, 0.42);
    write_text(&mut timeline, &[core_label], 1.22, 0.25);

    draw(&mut timeline, &[mid], 1.42, 0.55);
    draw(&mut timeline, &[outer], 1.72, 0.65);

    for (index, &spoke) in spokes.iter().enumerate() {
        draw(&mut timeline, &[spoke], 2.05 + index as f32 * 0.08, 0.24);
    }
    for (index, &node) in nodes.iter().enumerate() {
        appear(&mut timeline, &[node], 2.18 + index as f32 * 0.1, 0.26);
    }

    appear(&mut timeline, &[signal], 2.55, 0.2);
    let signal_path = [
        Vec3::new(-1.55, 1.02, 0.18),
        Vec3::new(1.55, 1.02, 0.18),
        Vec3::new(1.20, -0.86, 0.18),
        Vec3::new(0.0, -1.36, 0.18),
        Vec3::new(-1.20, -0.86, 0.18),
        Vec3::new(-1.55, 1.02, 0.18),
    ];
    for (index, window) in signal_path.windows(2).enumerate() {
        timeline
            .animate(signal)
            .at(2.78 + index as f32 * 0.34)
            .for_duration(0.28)
            .ease(Ease::InOutCubic)
            .move_to(window[1])
            .from_vec3(window[0])
            .spawn();
    }

    for (index, ring) in [inner, mid, outer].into_iter().enumerate() {
        timeline
            .animate(ring)
            .at(3.1 + index as f32 * 0.22)
            .for_duration(1.05)
            .ease(Ease::OutCubic)
            .scale_to(Vec3::splat(1.14 + index as f32 * 0.08))
            .spawn();
        timeline
            .animate(ring)
            .at(3.55 + index as f32 * 0.22)
            .for_duration(0.82)
            .ease(Ease::OutCubic)
            .fade_to(0.22)
            .from(0.78)
            .spawn();
    }

    write_text(&mut timeline, &[lower_claim], 4.25, 0.58);
    timeline
        .animate(core_glow)
        .at(4.42)
        .for_duration(0.65)
        .ease(Ease::InOutQuad)
        .scale_to(Vec3::splat(1.18))
        .spawn();
    timeline
        .animate(core)
        .at(4.42)
        .for_duration(0.65)
        .ease(Ease::InOutQuad)
        .scale_to(Vec3::splat(1.12))
        .spawn();

    timeline.wait_until(DURATION);
    scene.play(timeline);
    scene.capture_screenshots_named([(5.15, Some("murali_ai_indicator_final.png"))]);
    scene.capture_gif("murali_ai_indicator_loop", GIF_STOPS.iter().copied());

    let settings = ExportSettings {
        duration_seconds: DURATION,
        artifact_dir: PathBuf::from("rendered_output/murali-ai-indicator"),
        video_enabled: true,
        preserve_frame_exports: false,
        ..ExportSettings::from_scene(&scene)
    };

    App::new()?
        .with_scene(scene)
        .with_export_settings(settings)
        .run_app()
}
