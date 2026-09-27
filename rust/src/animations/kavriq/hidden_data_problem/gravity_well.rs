use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::noisy_circle::NoisyCircle;
use murali::frontend::collection::primitives::particle_belt::ParticleBelt;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 22.0;
const GIF_STOPS: &[f32] = &[1.0, 4.6, 8.6, 11.8, 14.8, 18.2, 21.2];

struct OrbitNode {
    ids: Vec<TattvaId>,
    start: Vec3,
    drift: Vec3,
    collapse: Vec3,
}

fn rotate_point(point: Vec3, angle: f32) -> Vec3 {
    let r = Vec2::new(point.x, point.y);
    let c = angle.cos();
    let s = angle.sin();
    Vec3::new(r.x * c - r.y * s, r.x * s + r.y * c, point.z)
}

fn indicate_label(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.62)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
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
            .ease(Ease::InOutCubic)
            .move_to(to)
            .spawn();
    }
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
    let (mut scene, mut timeline, palette) = new_scene(10.9);
    let mut ids = Vec::new();

    let center = large_card(
        &mut scene,
        "AI system",
        Vec3::new(0.0, 0.0, 0.12),
        2.25,
        palette.kavriq,
    );
    ids.extend(center.iter().copied());

    let belt = scene.add_tattva(
        ParticleBelt::new(2.25)
            .with_band_width(0.28)
            .with_particle_count(120)
            .with_particle_size_range(0.012, 0.032)
            .with_palette(vec![
                rgba(palette.kavriq, 0.92),
                rgba(palette.learning, 0.88),
                rgba(palette.warning, 0.86),
                rgba(palette.enterprise, 0.88),
                rgba(palette.governance, 0.86),
            ])
            .with_band_breathing(0.05, 1.0)
            .with_radial_jitter(0.07, 2.0)
            .with_orbit_speed(0.34)
            .with_seed(8.2),
        Vec3::new(0.0, 0.0, 0.02),
    );
    ids.push(belt);

    let ambient_colors = [
        rgba(palette.kavriq, 0.82),
        rgba(palette.learning, 0.78),
        rgba(palette.warning, 0.82),
    ];
    let ambient_speeds = [0.9, 1.05, 1.18];
    let ambient_strokes = [0.046, 0.04, 0.034];
    let mut ambient_noisy = Vec::new();
    for (index, (&color, (&speed, &stroke))) in ambient_colors
        .iter()
        .zip(ambient_speeds.iter().zip(ambient_strokes.iter()))
        .enumerate()
    {
        let id = scene.add_tattva(
            NoisyCircle::new(0.7, color)
                .with_noise_amplitude(0.09 - index as f32 * 0.015)
                .with_noise_space_radius(1.08 + index as f32 * 0.14)
                .with_noise_seed(3.4 + index as f32 * 4.1)
                .with_stroke(stroke, color),
            Vec3::new(0.0, 0.0, 0.22 + index as f32 * 0.02),
        );
        scene.set_scale(id, Vec3::splat(0.52));
        ambient_noisy.push((id, speed));
        ids.push(id);
    }

    let pulse_palette = [palette.kavriq, palette.learning, palette.warning];
    let pulse_strokes = [0.052, 0.044, 0.036];
    let pulse_speeds = [1.2, 1.34, 1.48];
    let mut pulse_batches: Vec<Vec<TattvaId>> = Vec::new();
    for batch_index in 0..3 {
        let mut batch = Vec::new();
        for (color_index, (&color, (&stroke, &speed))) in pulse_palette
            .iter()
            .zip(pulse_strokes.iter().zip(pulse_speeds.iter()))
            .enumerate()
        {
            let id = scene.add_tattva(
                NoisyCircle::new(0.72, rgba(color, 0.9 - color_index as f32 * 0.08))
                    .with_noise_amplitude(0.095 - color_index as f32 * 0.016)
                    .with_noise_space_radius(1.12 + color_index as f32 * 0.12)
                    .with_noise_seed(21.0 + batch_index as f32 * 7.0 + color_index as f32 * 2.3)
                    .with_stroke(stroke, rgba(color, 0.86 - color_index as f32 * 0.08)),
                Vec3::new(0.0, 0.0, 0.34 + batch_index as f32 * 0.02 + color_index as f32 * 0.01),
            );
            scene.set_scale(id, Vec3::splat(0.22));
            batch.push(id);
            ids.push(id);
            let _ = speed;
        }
        pulse_batches.push(batch);
    }

    let node_specs = [
        ("logging", Vec3::new(-2.9, 1.25, 0.1), BLUE_B, 1.7, 0.10),
        ("evaluation", Vec3::new(2.25, 1.62, 0.1), palette.learning, 1.95, -0.08),
        ("storage", Vec3::new(3.05, -0.18, 0.1), palette.warning, 1.65, 0.12),
        ("governance", Vec3::new(1.9, -1.98, 0.1), palette.governance, 2.05, -0.1),
        ("privacy", Vec3::new(-1.8, -2.15, 0.1), RED_B, 1.7, 0.08),
        ("feedback", Vec3::new(-3.15, -0.72, 0.1), palette.enterprise, 1.85, -0.12),
        (
            "knowledge base",
            Vec3::new(0.05, 2.45, 0.1),
            palette.kavriq,
            2.3,
            0.06,
        ),
    ];

    let mut orbit_nodes = Vec::new();
    for (text, pos, accent, width, drift_angle) in node_specs {
        let ids_pair = card(&mut scene, text, pos, width, accent);
        let drift = rotate_point(pos, drift_angle);
        let collapse = Vec3::new(pos.x * 0.18, pos.y * 0.18, pos.z);
        ids.extend(ids_pair.iter().copied());
        orbit_nodes.push(OrbitNode {
            ids: ids_pair,
            start: pos,
            drift,
            collapse,
        });
    }

    hide_all(&mut scene, &ids);

    appear(&mut timeline, &[belt], 0.1, 0.7);
    draw(&mut timeline, &[center[0]], 0.45, 0.55);
    write_text(&mut timeline, &[center[1]], 0.82, 0.45);
    for (index, node) in orbit_nodes.iter().enumerate() {
        appear(&mut timeline, &node.ids, 1.0 + index as f32 * 0.18, 0.34);
    }

    timeline
        .animate(belt)
        .at(0.8)
        .for_duration(16.2)
        .ease(Ease::Linear)
        .belt_evolve_with_speed(0.7)
        .spawn();

    for (index, node) in orbit_nodes.iter().enumerate() {
        let at = 2.1 + index as f32 * 0.14;
        move_ids(&mut timeline, &node.ids, node.drift, at, 3.8);
        move_ids(&mut timeline, &node.ids, node.start, at + 3.8, 2.8);
    }

    pulse(&mut timeline, center[0], 9.5);
    indicate_label(&mut timeline, center[1], 9.68);
    pulse(&mut timeline, center[0], 10.2);
    indicate_label(&mut timeline, center[1], 10.35);

    timeline
        .animate(belt)
        .at(10.0)
        .for_duration(2.2)
        .ease(Ease::InCubic)
        .scale_to(Vec3::ZERO)
        .spawn();

    for (index, node) in orbit_nodes.iter().enumerate() {
        let at = 10.0 + index as f32 * 0.12;
        move_ids(&mut timeline, &node.ids, node.collapse, at, 1.7);
        scale_ids(&mut timeline, &node.ids, Vec3::splat(0.62), at, 1.7);
        fade_ids(&mut timeline, &node.ids, 0.0, at + 0.35, 1.25);
    }

    for (index, (id, speed)) in ambient_noisy.iter().enumerate() {
        let start = 10.08 + index as f32 * 0.12;
        draw(&mut timeline, &[*id], start, 0.42);
        timeline
            .animate(*id)
            .at(start)
            .for_duration(6.2)
            .ease(Ease::Linear)
            .noise_evolve_with_speed(*speed)
            .spawn();
        timeline
            .animate(*id)
            .at(start + 0.04)
            .for_duration(1.9)
            .ease(Ease::OutCubic)
            .scale_to(Vec3::splat(2.0))
            .spawn();
    }

    scale_ids(
        &mut timeline,
        &[center[0], center[1]],
        Vec3::splat(0.24),
        10.15,
        1.6,
    );
    fade_ids(&mut timeline, &[center[0], center[1]], 0.0, 10.55, 1.05);
    scale_ids(
        &mut timeline,
        &ambient_noisy.iter().map(|(id, _)| *id).collect::<Vec<_>>(),
        Vec3::splat(0.18),
        10.0,
        1.8,
    );
    fade_ids(
        &mut timeline,
        &ambient_noisy.iter().map(|(id, _)| *id).collect::<Vec<_>>(),
        0.24,
        11.25,
        1.15,
    );

    for (batch_index, batch) in pulse_batches.iter().enumerate() {
        let start = 11.45 + batch_index as f32 * 2.25;
        for &id in batch {
            draw(&mut timeline, &[id], start, 0.34);
        }
        for (color_index, &id) in batch.iter().enumerate() {
            let target_scale = 2.25 + batch_index as f32 * 0.72 + color_index as f32 * 0.26;
            timeline
                .animate(id)
                .at(start + 0.08)
                .for_duration(2.1)
                .ease(Ease::OutCubic)
                .scale_to(Vec3::splat(target_scale))
                .spawn();
            timeline
                .animate(id)
                .at(start)
                .for_duration(2.2)
                .ease(Ease::Linear)
                .noise_evolve_with_speed(1.22 + color_index as f32 * 0.16)
                .spawn();
            timeline
                .animate(id)
                .at(start + 0.38)
                .for_duration(1.8)
                .ease(Ease::OutCubic)
                .fade_to(0.0)
                .spawn();
        }
    }

    fade_ids(
        &mut timeline,
        &ambient_noisy.iter().map(|(id, _)| *id).collect::<Vec<_>>(),
        0.0,
        17.4,
        2.0,
    );
    timeline
        .animate(belt)
        .at(17.6)
        .for_duration(2.2)
        .ease(Ease::InOutCubic)
        .fade_to(0.0)
        .spawn();
    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/gravity-well",
        [(21.0, Some("gravity_well_final.png"))],
        Some(("gravity_well_loop", GIF_STOPS)),
        true,
    )
}
