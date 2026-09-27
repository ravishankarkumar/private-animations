use anyhow::Result;
use glam::Vec3;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::noisy_circle::NoisyCircle;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 30.0;
const GIF_STOPS: &[f32] = &[1.0, 4.6, 8.8, 12.8, 17.4, 22.4, 28.4];

struct FloatingPill {
    ids: Vec<TattvaId>,
    start: Vec3,
    drift_a: Vec3,
    drift_b: Vec3,
}

fn fade_ids(
    timeline: &mut murali::engine::timeline::Timeline,
    ids: &[TattvaId],
    to: f32,
    at: f32,
    duration: f32,
) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::InOutCubic)
            .fade_to(to)
            .spawn();
    }
}

fn move_ids(
    timeline: &mut murali::engine::timeline::Timeline,
    ids: &[TattvaId],
    to: Vec3,
    at: f32,
    duration: f32,
) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::InOutQuad)
            .move_to(to)
            .spawn();
    }
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "Security tension is real",
        0.34,
        palette.ink,
        Vec3::new(0.0, 3.38, 0.1),
    );
    ids.push(title);

    let core_colors = [
        rgba(palette.governance, 0.58),
        rgba(palette.warning, 0.46),
        rgba(palette.kavriq, 0.42),
        rgba(palette.enterprise, 0.36),
    ];
    let core_strokes = [0.052, 0.044, 0.038, 0.032];
    let core_seeds = [3.2, 7.8, 12.4, 16.9];
    let core_amps = [0.12, 0.10, 0.085, 0.07];
    let core_speeds = [0.8, 0.96, 1.12, 1.28];
    let mut core_ids = Vec::new();
    for index in 0..4 {
        let id = scene.add_tattva(
            NoisyCircle::new(1.62, core_colors[index])
                .with_noise_amplitude(core_amps[index])
                .with_noise_space_radius(1.05 + index as f32 * 0.12)
                .with_noise_seed(core_seeds[index])
                .with_stroke(core_strokes[index], core_colors[index]),
            Vec3::new(0.0, 0.12, 0.04 + index as f32 * 0.02),
        );
        core_ids.push(id);
        ids.push(id);
    }

    let security = label(
        &mut scene,
        "Security",
        0.42,
        palette.ink,
        Vec3::new(0.0, 0.12, 0.24),
    );
    ids.push(security);

    let pill_specs = [
        (
            "private user intent",
            Vec3::new(-3.15, 1.7, 0.1),
            Vec3::new(-2.92, 1.92, 0.1),
            Vec3::new(-3.34, 1.5, 0.1),
            2.45,
            palette.governance,
        ),
        (
            "business context",
            Vec3::new(3.12, 1.6, 0.1),
            Vec3::new(3.36, 1.82, 0.1),
            Vec3::new(2.88, 1.42, 0.1),
            2.15,
            palette.warning,
        ),
        (
            "regulated data",
            Vec3::new(-3.18, -1.28, 0.1),
            Vec3::new(-2.92, -1.04, 0.1),
            Vec3::new(-3.36, -1.5, 0.1),
            2.0,
            palette.enterprise,
        ),
        (
            "explainability",
            Vec3::new(3.18, -1.22, 0.1),
            Vec3::new(3.42, -0.98, 0.1),
            Vec3::new(2.96, -1.46, 0.1),
            1.92,
            palette.kavriq,
        ),
        (
            "memory vs risk",
            Vec3::new(0.0, 2.16, 0.1),
            Vec3::new(0.16, 2.42, 0.1),
            Vec3::new(-0.14, 1.96, 0.1),
            2.0,
            palette.warning,
        ),
        (
            "access control",
            Vec3::new(0.0, -2.0, 0.1),
            Vec3::new(-0.16, -1.76, 0.1),
            Vec3::new(0.16, -2.22, 0.1),
            2.02,
            palette.kavriq,
        ),
        (
            "audit trail",
            Vec3::new(-1.76, 2.52, 0.1),
            Vec3::new(-1.5, 2.7, 0.1),
            Vec3::new(-1.98, 2.34, 0.1),
            1.65,
            palette.enterprise,
        ),
        (
            "data minimization",
            Vec3::new(1.92, 2.46, 0.1),
            Vec3::new(2.18, 2.68, 0.1),
            Vec3::new(1.68, 2.26, 0.1),
            2.22,
            palette.governance,
        ),
        (
            "retention policy",
            Vec3::new(-1.98, -2.36, 0.1),
            Vec3::new(-1.72, -2.12, 0.1),
            Vec3::new(-2.2, -2.56, 0.1),
            2.08,
            palette.warning,
        ),
        (
            "risky database",
            Vec3::new(1.96, -2.38, 0.1),
            Vec3::new(2.24, -2.12, 0.1),
            Vec3::new(1.74, -2.58, 0.1),
            2.0,
            palette.governance,
        ),
    ];

    let mut pills = Vec::new();
    for (text, start, drift_a, drift_b, width, accent) in pill_specs {
        let group = card(&mut scene, text, start, width, accent);
        ids.extend(group.iter().copied());
        pills.push(FloatingPill {
            ids: group,
            start,
            drift_a,
            drift_b,
        });
    }

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    write_text(&mut timeline, &[title], 0.18, 0.62);

    for (index, id) in core_ids.iter().enumerate() {
        draw(&mut timeline, &[*id], 0.8 + index as f32 * 0.12, 0.45);
        timeline
            .animate(*id)
            .at(1.2 + index as f32 * 0.06)
            .for_duration(27.6)
            .ease(Ease::Linear)
            .noise_evolve_with_speed(core_speeds[index])
            .spawn();
    }
    write_text(&mut timeline, &[security], 1.35, 0.5);

    let pill_starts = [2.2f32, 3.15, 4.1, 5.05, 6.0, 6.95, 7.9, 8.85, 9.8, 10.75];
    for (index, pill) in pills.iter().enumerate() {
        let at = pill_starts[index];
        appear(&mut timeline, &pill.ids, at, 0.22);
        move_ids(&mut timeline, &pill.ids, pill.drift_a, at + 0.35, 4.2);
        move_ids(&mut timeline, &pill.ids, pill.drift_b, at + 4.75, 4.6);
        move_ids(&mut timeline, &pill.ids, pill.start, at + 9.35, 4.6);
    }

    pulse(&mut timeline, security, 12.4);
    pulse(&mut timeline, security, 18.2);

    fade_ids(&mut timeline, &ids, 0.0, 29.0, 0.6);
    fade_ids(&mut timeline, &footer_ids, 0.0, 29.1, 0.45);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/security-tension",
        [(28.8, Some("security_tension_final.png"))],
        Some(("security_tension_loop", GIF_STOPS)),
        true,
    )
}
