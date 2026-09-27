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
use std::f32::consts::TAU;
use std::path::PathBuf;

const DURATION: f32 = 7.2;
const GIF_STOPS: &[f32] = &[0.5, 1.3, 2.2, 3.1, 4.0, 4.9, 5.8, 6.7];

fn rgba(color: Vec4, alpha: f32) -> Vec4 {
    Vec4::new(color.x, color.y, color.z, alpha)
}

const SIRI_CYAN: Vec4 = Vec4::new(0.18, 0.90, 0.98, 1.0);
const SIRI_BLUE: Vec4 = Vec4::new(0.24, 0.58, 1.00, 1.0);
const SIRI_PURPLE: Vec4 = Vec4::new(0.48, 0.28, 0.98, 1.0);
const SIRI_ROSE: Vec4 = Vec4::new(0.92, 0.20, 0.76, 1.0);

/// A closed orbital ribbon in the XZ plane, with sinusoidal vertical lift.
/// When tilted 60-80° it reads as a clearly 3-D elliptical surface — the
/// core of the Siri visual.  Alpha is kept high so the ribbons are
/// immediately legible; the color_fn brightens toward the wave peaks.
fn siri_orbital(radius: f32, half_w: f32, lift: f32, phase: f32, color: Vec4) -> ParametricSurface {
    ParametricSurface::new((0.0, TAU), (-1.0, 1.0), move |u, v| {
        let envelope = (0.72 + 0.28 * (2.0 * u + phase * 1.4).cos()).max(0.0);
        let wave = lift * (u + phase).sin();
        Vec3::new(
            radius * u.cos(),
            wave + v * half_w * envelope,
            radius * u.sin(),
        )
    })
    .with_samples(120, 24)
    .with_write_progress(0.0)
    .with_render_mode(SurfaceRenderMode::Solid)
    .with_color_fn(move |h| {
        let t = ((h / lift.max(0.01)) * 0.5 + 0.5).clamp(0.0, 1.0);
        // dim at midline (t≈0.5) → bright + white-tinted at peaks (t→1)
        rgba(color, 0.20 + t * 0.32).lerp(rgba(WHITE, 0.28), t * t)
    })
}

fn appear(timeline: &mut Timeline, ids: &[TattvaId], at: f32, dur: f32) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(dur)
            .ease(Ease::OutCubic)
            .appear()
            .spawn();
    }
}

pub fn run() -> Result<()> {
    let mut scene = Scene::new();
    let mut timeline = Timeline::new();

    scene.camera_mut().projection = Projection::Perspective {
        fov_y_rad: 38.0_f32.to_radians(),
        aspect: 16.0 / 9.0,
        near: 0.1,
        far: 100.0,
    };
    // Slightly off-axis so all four tilted ribbons read with depth
    scene.camera_mut().position = Vec3::new(-1.2, 1.6, 5.2);
    scene.camera_mut().target = Vec3::new(0.0, 0.0, 0.0);

    // ── Footer ──────────────────────────────────────────────────────────────
    let footer = scene.add_tattva(
        Label::new("Built with Murali Engine", 0.14).with_color(rgba(WHITE, 0.45)),
        Vec3::new(2.85, -2.82, 0.1),
    );

    // ── Core ────────────────────────────────────────────────────────────────
    let core_glow = scene.add_tattva(
        Circle::new(0.42, 96, rgba(SIRI_CYAN, 0.16)).with_stroke(0.022, rgba(SIRI_CYAN, 0.60)),
        Vec3::new(0.0, 0.0, 0.10),
    );
    let core = scene.add_tattva(
        Circle::new(0.18, 72, rgba(WHITE, 0.92)).with_stroke(0.018, rgba(SIRI_CYAN, 0.92)),
        Vec3::new(0.0, 0.0, 0.18),
    );

    // ── Orbital ribbons ──────────────────────────────────────────────────────
    // All four share a similar radius so they overlap and form an orb.
    // The STEEP tilts below (≈70-80°) are what makes them read as
    // elliptical 3-D surfaces rather than flat rings.
    let orb_cyan = scene.add_tattva(siri_orbital(1.60, 0.40, 0.52, 0.00, SIRI_CYAN), Vec3::ZERO);
    let orb_blue = scene.add_tattva(siri_orbital(1.55, 0.38, 0.48, 1.57, SIRI_BLUE), Vec3::ZERO);
    let orb_purple = scene.add_tattva(
        siri_orbital(1.58, 0.42, 0.50, 3.14, SIRI_PURPLE),
        Vec3::ZERO,
    );
    let orb_rose = scene.add_tattva(siri_orbital(1.52, 0.36, 0.46, 4.71, SIRI_ROSE), Vec3::ZERO);

    // Steep tilts — 70-80° so each ring appears as a clear ellipse in screen space
    scene.set_rotation(orb_cyan, Quat::from_axis_angle(Vec3::X, 1.32));
    scene.set_rotation(orb_blue, Quat::from_axis_angle(Vec3::Z, 1.28));
    scene.set_rotation(
        orb_purple,
        Quat::from_axis_angle(Vec3::X, 0.85) * Quat::from_axis_angle(Vec3::Z, -0.72),
    );
    scene.set_rotation(
        orb_rose,
        Quat::from_axis_angle(Vec3::X, -0.80) * Quat::from_axis_angle(Vec3::Z, 0.68),
    );

    // ── Hide → reveal ────────────────────────────────────────────────────────
    let all_ids = [
        footer, core_glow, core, orb_cyan, orb_blue, orb_purple, orb_rose,
    ];
    for &id in &all_ids {
        scene.hide_tattva(id);
    }

    appear(&mut timeline, &[footer], 0.10, 0.55);
    appear(&mut timeline, &[core_glow, core], 0.22, 0.55);

    for (i, &id) in [orb_cyan, orb_blue, orb_purple, orb_rose]
        .iter()
        .enumerate()
    {
        timeline
            .animate(id)
            .at(0.55 + i as f32 * 0.20)
            .for_duration(1.20)
            .ease(Ease::InOutCubic)
            .write_surface()
            .spawn();
    }

    // ── Continuous spin — each ribbon rotates on its own axis ────────────────
    let spin_start = 1.35;
    let spin_dur = DURATION - spin_start;

    let spin_targets = [
        (
            orb_cyan,
            Quat::from_axis_angle(Vec3::X, 1.32) * Quat::from_axis_angle(Vec3::Y, TAU * 0.80),
        ),
        (
            orb_blue,
            Quat::from_axis_angle(Vec3::Z, 1.28) * Quat::from_axis_angle(Vec3::Y, -TAU * 0.75),
        ),
        (
            orb_purple,
            Quat::from_axis_angle(Vec3::X, 0.85)
                * Quat::from_axis_angle(Vec3::Z, -0.72 + TAU * 0.70),
        ),
        (
            orb_rose,
            Quat::from_axis_angle(Vec3::X, -0.80)
                * Quat::from_axis_angle(Vec3::Z, 0.68 - TAU * 0.65),
        ),
    ];

    for (i, (id, target)) in spin_targets.into_iter().enumerate() {
        timeline
            .animate(id)
            .at(spin_start + i as f32 * 0.04)
            .for_duration(spin_dur)
            .ease(Ease::Linear)
            .rotate_to(target)
            .spawn();
    }

    // ── Core pulse (two breath cycles) ───────────────────────────────────────
    for &(t_in, t_out) in &[(2.5f32, 3.7f32), (5.1f32, 6.2f32)] {
        for &(id, s) in &[(core_glow, 1.30f32), (core, 1.20f32)] {
            timeline
                .animate(id)
                .at(t_in)
                .for_duration(1.0)
                .ease(Ease::InOutQuad)
                .scale_to(Vec3::splat(s))
                .spawn();
            timeline
                .animate(id)
                .at(t_out)
                .for_duration(0.90)
                .ease(Ease::InOutQuad)
                .scale_to(Vec3::splat(1.0))
                .spawn();
        }
    }

    // ── Render ───────────────────────────────────────────────────────────────
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
