use anyhow::Result;
use glam::Vec3;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::particle_belt::ParticleBelt;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 37.0;
const GIF_STOPS: &[f32] = &[1.0, 5.2, 10.0, 15.2, 21.0, 27.4, 34.8];

struct OrbitPill {
    ids: Vec<TattvaId>,
    start: Vec3,
    drift_a: Vec3,
    drift_b: Vec3,
    merge: Vec3,
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

fn scale_ids(
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
            .ease(Ease::InOutCubic)
            .scale_to(to)
            .spawn();
    }
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let center = large_card(
        &mut scene,
        "AI Systems",
        Vec3::new(0.0, 0.15, 0.14),
        2.45,
        palette.kavriq,
    );
    ids.extend(center.iter().copied());

    let belt = scene.add_tattva(
        ParticleBelt::new(2.38)
            .with_band_width(0.32)
            .with_particle_count(150)
            .with_particle_size_range(0.012, 0.03)
            .with_palette(vec![
                rgba(palette.kavriq, 0.92),
                rgba(palette.learning, 0.88),
                rgba(palette.warning, 0.86),
                rgba(palette.enterprise, 0.88),
                rgba(palette.governance, 0.86),
            ])
            .with_band_breathing(0.05, 1.0)
            .with_radial_jitter(0.08, 2.0)
            .with_orbit_speed(0.3)
            .with_seed(14.6),
        Vec3::new(0.0, 0.15, 0.04),
    );
    ids.push(belt);

    let title = label(
        &mut scene,
        "What wins next is not just better models",
        0.28,
        rgba(palette.ink, 0.9),
        Vec3::new(0.0, 3.42, 0.1),
    );
    let final_line = label(
        &mut scene,
        "part of the intelligence itself",
        0.34,
        palette.warning,
        Vec3::new(0.0, -3.08, 0.1),
    );
    ids.extend([title, final_line]);

    let pill_specs = [
        (
            "data management",
            Vec3::new(-3.18, 1.62, 0.1),
            Vec3::new(-2.92, 1.84, 0.1),
            Vec3::new(-3.38, 1.42, 0.1),
            Vec3::new(-1.75, 1.05, 0.1),
            2.25,
            palette.kavriq,
        ),
        (
            "log management",
            Vec3::new(3.16, 1.58, 0.1),
            Vec3::new(3.42, 1.82, 0.1),
            Vec3::new(2.92, 1.36, 0.1),
            Vec3::new(1.82, 1.02, 0.1),
            2.15,
            palette.governance,
        ),
        (
            "feedback loops",
            Vec3::new(-3.38, -0.32, 0.1),
            Vec3::new(-3.12, -0.06, 0.1),
            Vec3::new(-3.62, -0.56, 0.1),
            Vec3::new(-2.0, -0.25, 0.1),
            2.1,
            palette.enterprise,
        ),
        (
            "evaluation",
            Vec3::new(3.36, -0.28, 0.1),
            Vec3::new(3.62, -0.02, 0.1),
            Vec3::new(3.12, -0.52, 0.1),
            Vec3::new(2.02, -0.18, 0.1),
            1.75,
            palette.learning,
        ),
        (
            "retention",
            Vec3::new(-2.72, -2.02, 0.1),
            Vec3::new(-2.48, -1.76, 0.1),
            Vec3::new(-2.94, -2.26, 0.1),
            Vec3::new(-1.45, -1.32, 0.1),
            1.65,
            palette.warning,
        ),
        (
            "access control",
            Vec3::new(2.74, -2.0, 0.1),
            Vec3::new(2.98, -1.74, 0.1),
            Vec3::new(2.5, -2.24, 0.1),
            Vec3::new(1.48, -1.28, 0.1),
            2.02,
            palette.kavriq,
        ),
        (
            "security",
            Vec3::new(0.0, 2.28, 0.1),
            Vec3::new(0.16, 2.54, 0.1),
            Vec3::new(-0.16, 2.04, 0.1),
            Vec3::new(0.0, 1.52, 0.1),
            1.58,
            palette.governance,
        ),
        (
            "observability",
            Vec3::new(0.0, -2.36, 0.1),
            Vec3::new(-0.16, -2.1, 0.1),
            Vec3::new(0.18, -2.6, 0.1),
            Vec3::new(0.0, -1.58, 0.1),
            2.0,
            palette.enterprise,
        ),
        (
            "learning",
            Vec3::new(-1.18, 2.78, 0.1),
            Vec3::new(-0.94, 2.98, 0.1),
            Vec3::new(-1.4, 2.58, 0.1),
            Vec3::new(-0.62, 1.95, 0.1),
            1.48,
            palette.learning,
        ),
        (
            "governance",
            Vec3::new(1.24, 2.76, 0.1),
            Vec3::new(1.48, 2.98, 0.1),
            Vec3::new(1.02, 2.56, 0.1),
            Vec3::new(0.65, 1.92, 0.1),
            1.88,
            palette.warning,
        ),
    ];

    let mut pills = Vec::new();
    for (text, start, drift_a, drift_b, merge, width, accent) in pill_specs {
        let group = card(&mut scene, text, start, width, accent);
        ids.extend(group.iter().copied());
        pills.push(OrbitPill {
            ids: group,
            start,
            drift_a,
            drift_b,
            merge,
        });
    }

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    appear(&mut timeline, &[belt], 0.15, 0.65);
    draw(&mut timeline, &[center[0]], 0.45, 0.55);
    write_text(&mut timeline, &[center[1]], 0.88, 0.48);
    write_text(&mut timeline, &[title], 1.25, 0.6);

    timeline
        .animate(belt)
        .at(0.9)
        .for_duration(32.0)
        .ease(Ease::Linear)
        .belt_evolve_with_speed(0.62)
        .spawn();

    let pill_starts = [2.2f32, 3.15, 4.1, 5.05, 6.0, 6.95, 7.9, 8.85, 9.8, 10.75];
    for (index, pill) in pills.iter().enumerate() {
        let at = pill_starts[index];
        appear(&mut timeline, &pill.ids, at, 0.24);
        move_ids(&mut timeline, &pill.ids, pill.drift_a, at + 0.4, 4.8);
        move_ids(&mut timeline, &pill.ids, pill.drift_b, at + 5.4, 5.2);
        move_ids(&mut timeline, &pill.ids, pill.start, at + 10.9, 5.4);
    }

    fade_ids(&mut timeline, &[title], 0.18, 16.8, 1.0);
    pulse(&mut timeline, center[0], 18.2);
    pulse(&mut timeline, center[1], 18.35);

    for (index, pill) in pills.iter().enumerate() {
        let at = 23.0 + index as f32 * 0.18;
        move_ids(&mut timeline, &pill.ids, pill.merge, at, 3.6);
        scale_ids(&mut timeline, &pill.ids, Vec3::splat(0.92), at, 3.6);
    }

    timeline
        .animate(belt)
        .at(23.8)
        .for_duration(5.0)
        .ease(Ease::InOutCubic)
        .scale_to(Vec3::splat(0.86))
        .spawn();

    write_text(&mut timeline, &[final_line], 31.0, 0.65);
    pulse(&mut timeline, final_line, 33.0);

    fade_ids(&mut timeline, &ids, 0.0, 36.0, 0.7);
    fade_ids(&mut timeline, &footer_ids, 0.0, 36.1, 0.5);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/intelligence-itself",
        [(35.6, Some("intelligence_itself_final.png"))],
        Some(("intelligence_itself_loop", GIF_STOPS)),
        true,
    )
}
