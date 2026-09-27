use anyhow::Result;
use glam::{Vec2, Vec3, Vec4};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 14.0;
const GIF_STOPS: &[f32] = &[0.7, 2.4, 4.5, 6.7, 8.8, 10.8, 12.6, 13.5];

fn add_box(
    scene: &mut murali::engine::scene::Scene,
    text: &str,
    pos: Vec3,
    width: f32,
    height: f32,
    accent: Vec4,
) -> Vec<TattvaId> {
    murali::frontend::collection::composite::Card::new(text, width, height)
        .with_radius(0.12)
        .with_fill(rgba(accent, 0.16))
        .with_stroke(0.028, rgba(accent, 0.82))
        .with_text_style(0.18, rgba(WHITE, 0.94))
        .add_to_scene(scene, pos)
        .all()
        .to_vec()
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

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.58)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.6);
    let mut ids = Vec::new();

    let old_world = label(
        &mut scene,
        "In traditional systems, logs were optional.",
        0.28,
        palette.muted,
        Vec3::new(0.0, 3.12, 0.1),
    );
    let new_world = label(
        &mut scene,
        "In AI systems, logs are the system.",
        0.44,
        palette.warning,
        Vec3::new(0.0, 2.42, 0.1),
    );
    ids.extend([old_world, new_world]);

    let optional_system = add_box(
        &mut scene,
        "system",
        Vec3::new(-4.55, 0.85, 0.1),
        1.85,
        0.68,
        BLUE_B,
    );
    let optional_logs = add_box(
        &mut scene,
        "logs",
        Vec3::new(-4.55, -0.55, 0.1),
        1.25,
        0.48,
        palette.governance,
    );
    let optional_arrow = arrow(
        &mut scene,
        Vec2::new(-4.55, 0.36),
        Vec2::new(-4.55, -0.12),
        0.036,
        rgba(palette.governance, 0.72),
    );
    ids.extend(optional_system.iter().chain(optional_logs.iter()).copied());
    ids.push(optional_arrow);

    let ai_system = add_box(
        &mut scene,
        "AI system",
        Vec3::new(2.65, 0.15, 0.1),
        2.55,
        0.84,
        palette.kavriq,
    );
    ids.extend(ai_system.iter().copied());

    let sources = [
        (
            "prompt + output",
            Vec3::new(-2.25, 1.65, 0.1),
            2.2,
            palette.kavriq,
            Vec2::new(-1.15, 1.38),
            Vec2::new(1.28, 0.62),
            "debugging",
            Vec3::new(0.15, 1.34, 0.1),
        ),
        (
            "tool calls",
            Vec3::new(-2.6, 0.32, 0.1),
            1.7,
            palette.governance,
            Vec2::new(-1.72, 0.32),
            Vec2::new(1.26, 0.25),
            "observability",
            Vec3::new(-0.18, 0.52, 0.1),
        ),
        (
            "tool outputs",
            Vec3::new(-2.3, -1.02, 0.1),
            1.95,
            palette.warning,
            Vec2::new(-1.32, -0.82),
            Vec2::new(1.22, -0.08),
            "replay + audit",
            Vec3::new(0.08, -0.52, 0.1),
        ),
        (
            "user feedback",
            Vec3::new(2.65, -1.72, 0.1),
            1.95,
            palette.enterprise,
            Vec2::new(2.65, -1.26),
            Vec2::new(2.65, -0.34),
            "quality improvement",
            Vec3::new(4.58, -0.98, 0.1),
        ),
    ];

    let mut source_groups = Vec::new();
    let mut source_arrows = Vec::new();
    let mut purpose_labels = Vec::new();
    for (text, pos, width, accent, from, to, purpose, purpose_pos) in sources {
        let group = add_box(&mut scene, text, pos, width, 0.54, accent);
        let arrow_id = arrow(&mut scene, from, to, 0.038, rgba(accent, 0.76));
        let purpose_id = label(
            &mut scene,
            purpose,
            0.18,
            rgba(WHITE, 0.76),
            purpose_pos,
        );
        ids.extend(group.iter().copied());
        ids.push(arrow_id);
        ids.push(purpose_id);
        source_groups.push(group);
        source_arrows.push(arrow_id);
        purpose_labels.push(purpose_id);
    }

    let conclusion = label(
        &mut scene,
        "Because logs improve the AI itself, they become part of the system.",
        0.28,
        palette.warning,
        Vec3::new(0.0, -3.02, 0.1),
    );
    ids.push(conclusion);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    appear(&mut timeline, &[old_world], 0.16, 0.32);
    appear(&mut timeline, &optional_system, 0.55, 0.28);
    appear(&mut timeline, &optional_logs, 0.85, 0.22);
    draw(&mut timeline, &[optional_arrow], 1.02, 0.22);
    indicate_id(&mut timeline, optional_logs[1], 1.72);

    fade_ids(
        &mut timeline,
        &[old_world, optional_arrow],
        0.0,
        2.4,
        0.55,
    );
    fade_ids(&mut timeline, &optional_system, 0.1, 2.4, 0.55);
    fade_ids(&mut timeline, &optional_logs, 0.1, 2.4, 0.55);

    write_text(&mut timeline, &[new_world], 2.9, 0.5);
    appear(&mut timeline, &ai_system, 3.05, 0.3);

    for (index, group) in source_groups.iter().enumerate() {
        let at = 3.7 + index as f32 * 1.2;
        appear(&mut timeline, group, at, 0.24);
        draw(&mut timeline, &[source_arrows[index]], at + 0.18, 0.26);
        write_text(&mut timeline, &[purpose_labels[index]], at + 0.32, 0.28);
        indicate_id(&mut timeline, ai_system[1], at + 0.62);
    }

    indicate_id(&mut timeline, source_groups[0][1], 8.95);
    indicate_id(&mut timeline, source_groups[1][1], 9.25);
    indicate_id(&mut timeline, source_groups[2][1], 9.55);
    indicate_id(&mut timeline, source_groups[3][1], 9.85);

    write_text(&mut timeline, &[conclusion], 10.65, 0.62);
    indicate_id(&mut timeline, conclusion, 11.62);
    pulse(&mut timeline, ai_system[0], 11.45);
    pulse(&mut timeline, ai_system[1], 11.52);
    indicate_id(&mut timeline, new_world, 12.05);

    fade_ids(&mut timeline, &ids, 0.0, 13.15, 0.6);
    fade_ids(&mut timeline, &footer_ids, 0.0, 13.25, 0.4);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/logs-are-system",
        [(13.1, Some("logs_are_system_final.png"))],
        Some(("logs_are_system_loop", GIF_STOPS)),
        true
    )
}
