use anyhow::Result;
use glam::{Quat, Vec3, Vec4};
use murali::App;
use murali::colors::*;
use murali::engine::camera::Projection;
use murali::engine::export::ExportSettings;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::TattvaId;
use murali::frontend::animation::Ease;
use murali::frontend::collection::graph::parametric_surface::{
    ParametricSurface, SurfaceRenderMode,
};
use murali::frontend::collection::primitives::circle::Circle;
use murali::frontend::collection::text::label::Label;
use std::f32::consts::{PI, TAU};
use std::path::PathBuf;

const DURATION: f32 = 7.2;
const GIF_STOPS: &[f32] = &[0.5, 1.3, 2.2, 3.1, 4.0, 4.9, 5.8, 6.7];

fn rgba(color: Vec4, alpha: f32) -> Vec4 {
    Vec4::new(color.x, color.y, color.z, alpha)
}

// ---------------------------------------------------------------------------
// Siri colours
// ---------------------------------------------------------------------------

const SIRI_CYAN:   Vec4 = Vec4::new(0.18, 0.90, 0.98, 1.0);
const SIRI_BLUE:   Vec4 = Vec4::new(0.24, 0.58, 1.00, 1.0);
const SIRI_PURPLE: Vec4 = Vec4::new(0.48, 0.28, 0.98, 1.0);
const SIRI_ROSE:   Vec4 = Vec4::new(0.92, 0.20, 0.76, 1.0);

// ---------------------------------------------------------------------------
// Closed orbital ribbon
//
// Sweeps u ∈ [0, TAU] around the origin in the XZ plane. The ribbon has
// a sinusoidal vertical lift (gives 3-D curvature) and a tapered width
// envelope. When placed at a tilted rotation it reads as a curved surface
// wrapping around the orb.
//
// color_fn maps height h → RGBA: transparent at the midline, brighter/whiter
// toward the peaks, producing the luminous Siri glow.
// ---------------------------------------------------------------------------

fn siri_orbital(radius: f32, half_w: f32, lift: f32, phase: f32, color: Vec4) -> ParametricSurface {
    ParametricSurface::new((0.0, TAU), (-1.0, 1.0), move |u, v| {
        // Smooth width taper: widest where the ribbon arcs away from midplane
        let envelope = 0.72 + 0.28 * (2.0 * u + phase * 1.3).cos();
        let wave     = lift * (u + phase).sin();
        Vec3::new(
            radius * u.cos(),
            wave + v * half_w * envelope.max(0.0),
            radius * u.sin(),
        )
    })
    .with_samples(120, 22)
    .with_write_progress(0.0)
    .with_render_mode(SurfaceRenderMode::Solid)
    .with_color_fn(move |h| {
        // t = 0 at midline, 1 at the wave peaks
        let t = ((h / lift.max(0.01)) * 0.5 + 0.5).clamp(0.0, 1.0);
        rgba(color, 0.08 + t * 0.14).lerp(rgba(WHITE, 0.38), t * t)
    })
}

// ---------------------------------------------------------------------------
// Translucent sphere shell — gives the overall spherical volume impression
// ---------------------------------------------------------------------------

fn siri_shell(radius: f32, color: Vec4, alpha: f32) -> ParametricSurface {
    ParametricSurface::new((0.14, PI - 0.14), (0.0, TAU), move |u, v| {
        let sin_u = u.sin();
        Vec3::new(
            radius * sin_u * v.cos(),
            radius * u.cos() * 0.90,   // gently flatten poles
            radius * sin_u * v.sin(),
        )
    })
    .with_samples(52, 52)
    .with_write_progress(0.0)
    .with_render_mode(SurfaceRenderMode::Solid)
    .with_color(rgba(color, alpha))
}

// ---------------------------------------------------------------------------
// Timeline helpers
// ---------------------------------------------------------------------------

fn appear(timeline: &mut Timeline, ids: &[TattvaId], at: f32, dur: f32) {
    for &id in ids {
        timeline.animate(id).at(at).for_duration(dur)
            .ease(Ease::OutCubic).appear().spawn();
    }
}

pub fn run() -> Result<()> {
    let mut scene    = Scene::new();
    let mut timeline = Timeline::new();

    // Perspective camera — tilted slightly above so 3-D depth is visible
    scene.camera_mut().projection = Projection::Perspective {
        fov_y_rad: 36.0_f32.to_radians(),
        aspect:    16.0 / 9.0,
        near:      0.1,
        far:       100.0,
    };
    scene.camera_mut().position = Vec3::new(-1.6, 1.4, 5.4);
    scene.camera_mut().target   = Vec3::new(0.0, 0.05, 0.0);

    // -----------------------------------------------------------------------
    // Footer watermark
    // -----------------------------------------------------------------------
    let footer = scene.add_tattva(
        Label::new("Built with Murali Engine", 0.14).with_color(rgba(WHITE, 0.45)),
        Vec3::new(2.85, -2.82, 0.1),
    );

    // -----------------------------------------------------------------------
    // Core — bright central orb
    // -----------------------------------------------------------------------
    let core_glow = scene.add_tattva(
        Circle::new(0.52, 96, rgba(SIRI_CYAN, 0.12))
            .with_stroke(0.022, rgba(SIRI_CYAN, 0.48)),
        Vec3::new(0.0, 0.0, 0.10),
    );
    let core = scene.add_tattva(
        Circle::new(0.22, 72, rgba(WHITE, 0.90))
            .with_stroke(0.018, rgba(SIRI_CYAN, 0.92)),
        Vec3::new(0.0, 0.0, 0.18),
    );

    // -----------------------------------------------------------------------
    // Sphere shells — subtle volume halos
    // -----------------------------------------------------------------------
    let shell_cyan   = scene.add_tattva(siri_shell(1.76, SIRI_CYAN,   0.07), Vec3::ZERO);
    let shell_purple = scene.add_tattva(siri_shell(1.52, SIRI_PURPLE, 0.07), Vec3::ZERO);

    // -----------------------------------------------------------------------
    // Orbital ribbons — four closed loops, each tilted differently
    // -----------------------------------------------------------------------
    //  orb_cyan:   near-horizontal, main cyan band
    //  orb_blue:   steeply tilted ~60° around Z
    //  orb_purple: tilted ~50° around X, opposite handedness
    //  orb_rose:   diagonal tilt, fills the remaining gap
    let orb_cyan   = scene.add_tattva(siri_orbital(1.56, 0.30, 0.68, 0.00, SIRI_CYAN),   Vec3::ZERO);
    let orb_blue   = scene.add_tattva(siri_orbital(1.42, 0.26, 0.60, 1.57, SIRI_BLUE),   Vec3::ZERO);
    let orb_purple = scene.add_tattva(siri_orbital(1.48, 0.28, 0.64, 3.14, SIRI_PURPLE), Vec3::ZERO);
    let orb_rose   = scene.add_tattva(siri_orbital(1.34, 0.22, 0.55, 4.71, SIRI_ROSE),   Vec3::ZERO);

    // -----------------------------------------------------------------------
    // Initial orientations — tilt each surface so they surround the core
    // like Siri's interlocking curved planes
    // -----------------------------------------------------------------------
    scene.set_rotation(shell_cyan,   Quat::from_axis_angle(Vec3::X,  0.30));
    scene.set_rotation(shell_purple, Quat::from_axis_angle(Vec3::Z, -0.48));

    scene.set_rotation(orb_cyan,   Quat::from_axis_angle(Vec3::Z, -0.20));
    scene.set_rotation(orb_blue,
        Quat::from_axis_angle(Vec3::X,  1.18) * Quat::from_axis_angle(Vec3::Z,  0.38),
    );
    scene.set_rotation(orb_purple,
        Quat::from_axis_angle(Vec3::Y,  0.82) * Quat::from_axis_angle(Vec3::Z, -0.58),
    );
    scene.set_rotation(orb_rose,
        Quat::from_axis_angle(Vec3::X, -0.52) * Quat::from_axis_angle(Vec3::Z,  2.08),
    );

    // -----------------------------------------------------------------------
    // Hide all tattvas — timeline reveals them
    // -----------------------------------------------------------------------
    let all_ids = [
        footer, core_glow, core,
        shell_cyan, shell_purple,
        orb_cyan, orb_blue, orb_purple, orb_rose,
    ];
    for &id in &all_ids {
        scene.hide_tattva(id);
    }

    // -----------------------------------------------------------------------
    // Appearance sequence
    // -----------------------------------------------------------------------
    appear(&mut timeline, &[footer],               0.10, 0.55);
    appear(&mut timeline, &[core_glow, core],       0.20, 0.55);

    // Shells write in
    for (i, &id) in [shell_cyan, shell_purple].iter().enumerate() {
        timeline.animate(id)
            .at(0.38 + i as f32 * 0.18)
            .for_duration(1.05)
            .ease(Ease::InOutCubic)
            .write_surface()
            .spawn();
    }

    // Orbital ribbons write in, staggered inside → out
    for (i, &id) in [orb_cyan, orb_blue, orb_purple, orb_rose].iter().enumerate() {
        timeline.animate(id)
            .at(0.72 + i as f32 * 0.18)
            .for_duration(1.15)
            .ease(Ease::InOutCubic)
            .write_surface()
            .spawn();
    }

    // -----------------------------------------------------------------------
    // Continuous rotation — each surface spins around a different axis so
    // the overall structure looks alive and 3-D (Siri "breathing" motion)
    // -----------------------------------------------------------------------
    let spin_start = 1.30;
    let spin_dur   = DURATION - spin_start;

    // Shells
    timeline.animate(shell_cyan)
        .at(spin_start).for_duration(spin_dur).ease(Ease::Linear)
        .rotate_to(Quat::from_axis_angle(Vec3::X, 0.30) * Quat::from_axis_angle(Vec3::Y, TAU))
        .spawn();
    timeline.animate(shell_purple)
        .at(spin_start).for_duration(spin_dur * 1.12).ease(Ease::Linear)
        .rotate_to(Quat::from_axis_angle(Vec3::Z, -0.48) * Quat::from_axis_angle(Vec3::Y, -TAU * 0.88))
        .spawn();

    // Orbital ribbons — each spinning on its own tilted axis
    let orb_rotations = [
        (
            orb_cyan,
            Quat::from_axis_angle(Vec3::Z, -0.20) * Quat::from_axis_angle(Vec3::Y, TAU * 0.78),
        ),
        (
            orb_blue,
            Quat::from_axis_angle(Vec3::X,  1.18) * Quat::from_axis_angle(Vec3::Z, 0.38 + TAU * 0.85),
        ),
        (
            orb_purple,
            Quat::from_axis_angle(Vec3::Y,  0.82 - TAU * 0.72) * Quat::from_axis_angle(Vec3::Z, -0.58),
        ),
        (
            orb_rose,
            Quat::from_axis_angle(Vec3::X, -0.52 + TAU * 0.80) * Quat::from_axis_angle(Vec3::Z, 2.08),
        ),
    ];

    for (i, (id, target_rot)) in orb_rotations.into_iter().enumerate() {
        timeline.animate(id)
            .at(spin_start + i as f32 * 0.04)
            .for_duration(spin_dur)
            .ease(Ease::Linear)
            .rotate_to(target_rot)
            .spawn();
    }

    // -----------------------------------------------------------------------
    // Core pulse — two gentle breath cycles
    // -----------------------------------------------------------------------
    for &(t_in, t_out) in &[(2.4f32, 3.6f32), (5.0f32, 6.1f32)] {
        for &(id, s) in &[(core_glow, 1.28f32), (core, 1.18f32)] {
            timeline.animate(id).at(t_in).for_duration(1.0)
                .ease(Ease::InOutQuad).scale_to(Vec3::splat(s)).spawn();
            timeline.animate(id).at(t_out).for_duration(0.90)
                .ease(Ease::InOutQuad).scale_to(Vec3::splat(1.0)).spawn();
        }
    }

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    timeline.wait_until(DURATION);
    scene.play(timeline);

    scene.capture_screenshots_named([(6.7, Some("murali_ai_orb_final.png"))]);
    scene.capture_gif("murali_ai_orb_loop", GIF_STOPS.iter().copied());

    let settings = ExportSettings {
        duration_seconds: DURATION,
        artifact_dir: PathBuf::from("rendered_output/murali-ai-orb"),
        video_enabled: true,
        preserve_frame_exports: false,
        ..ExportSettings::from_scene(&scene)
    };

    App::new()?
        .with_scene(scene)
        .with_export_settings(settings)
        .run_app()
}
