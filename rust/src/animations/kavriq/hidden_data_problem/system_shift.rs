use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 19.0;
const GIF_STOPS: &[f32] = &[0.8, 3.6, 7.2, 10.8, 14.8, 18.2];

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

fn shift_ids(
    timeline: &mut murali::engine::timeline::Timeline,
    ids: &[TattvaId],
    at: f32,
    duration: f32,
    to: Vec3,
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

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.6);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "So what's actually changing?",
        0.34,
        palette.ink,
        Vec3::new(0.0, 3.8, 0.1),
    );
    ids.push(title);

    let input = large_card(
        &mut scene,
        "data in",
        Vec3::new(-4.25, 0.45, 0.1),
        1.9,
        palette.enterprise,
    );
    let system = large_card(
        &mut scene,
        "system",
        Vec3::new(0.0, 0.45, 0.1),
        2.2,
        palette.kavriq,
    );
    let output = large_card(
        &mut scene,
        "result",
        Vec3::new(4.25, 0.45, 0.1),
        1.95,
        palette.learning,
    );
    ids.extend(input.iter().chain(system.iter()).chain(output.iter()).copied());

    let pipe_left = arrow(
        &mut scene,
        Vec2::new(-3.1, 0.45),
        Vec2::new(-1.42, 0.45),
        0.05,
        rgba(palette.enterprise, 0.78),
    );
    let pipe_right = arrow(
        &mut scene,
        Vec2::new(1.42, 0.45),
        Vec2::new(3.1, 0.45),
        0.05,
        rgba(palette.learning, 0.78),
    );
    ids.extend([pipe_left, pipe_right]);

    let consume = label(
        &mut scene,
        "consume data",
        0.28,
        rgba(palette.ink, 0.92),
        Vec3::new(0.0, -2.15, 0.1),
    );
    let generate = label(
        &mut scene,
        "generate data",
        0.28,
        palette.warning,
        Vec3::new(0.0, -2.15, 0.1),
    );
    let static_pipeline = label(
        &mut scene,
        "static pipeline",
        0.26,
        rgba(palette.ink, 0.9),
        Vec3::new(0.0, -2.72, 0.1),
    );
    let feedback_loop = label(
        &mut scene,
        "continuous feedback loop",
        0.26,
        palette.kavriq,
        Vec3::new(0.0, -2.72, 0.1),
    );
    let debugging = label(
        &mut scene,
        "logging for debugging",
        0.24,
        rgba(palette.ink, 0.82),
        Vec3::new(0.0, -3.28, 0.1),
    );
    let learning = label(
        &mut scene,
        "logging for learning",
        0.24,
        palette.learning,
        Vec3::new(0.0, -3.28, 0.1),
    );
    ids.extend([consume, generate, static_pipeline, feedback_loop, debugging, learning]);

    let artifacts = [
        ("prompt", Vec3::new(-1.8, 2.0, 0.1), 1.55, palette.kavriq),
        ("output", Vec3::new(1.72, 2.0, 0.1), 1.58, palette.learning),
        ("tool call", Vec3::new(-2.2, -1.05, 0.1), 1.92, palette.governance),
        ("feedback", Vec3::new(1.95, -1.05, 0.1), 1.82, palette.enterprise),
        ("eval", Vec3::new(0.0, 2.48, 0.1), 1.22, palette.warning),
    ];

    let mut artifact_groups = Vec::new();
    let mut artifact_targets = Vec::new();
    for (text, pos, width, accent) in artifacts {
        let group = card(&mut scene, text, pos, width, accent);
        ids.extend(group.iter().copied());
        artifact_groups.push(group);
        artifact_targets.push(pos);
    }

    let loop_top = line(
        &mut scene,
        Vec3::new(-5.0, 3.0, 0.0),
        Vec3::new(5.0, 3.0, 0.0),
        0.04,
        rgba(palette.kavriq, 0.72),
    );
    let loop_right = arrow(
        &mut scene,
        Vec2::new(5.0, 3.0),
        Vec2::new(5.0, -1.8),
        0.04,
        rgba(palette.kavriq, 0.72),
    );
    let loop_bottom = line(
        &mut scene,
        Vec3::new(5.0, -1.8, 0.0),
        Vec3::new(-5.0, -1.8, 0.0),
        0.04,
        rgba(palette.kavriq, 0.72),
    );
    let loop_left = arrow(
        &mut scene,
        Vec2::new(-5.0, -1.8),
        Vec2::new(-5.0, 3.0),
        0.04,
        rgba(palette.kavriq, 0.72),
    );
    ids.extend([loop_top, loop_right, loop_bottom, loop_left]);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    write_text(&mut timeline, &[title], 0.18, 0.55);

    appear(&mut timeline, &input, 1.0, 0.35);
    appear(&mut timeline, &system, 1.2, 0.35);
    appear(&mut timeline, &output, 1.4, 0.35);
    draw(&mut timeline, &[pipe_left], 1.55, 0.28);
    draw(&mut timeline, &[pipe_right], 1.9, 0.28);
    write_text(&mut timeline, &[consume], 2.25, 0.42);
    write_text(&mut timeline, &[static_pipeline], 2.85, 0.4);
    write_text(&mut timeline, &[debugging], 3.45, 0.4);

    pulse(&mut timeline, input[0], 4.3);
    pulse(&mut timeline, system[0], 4.85);
    pulse(&mut timeline, output[0], 5.4);

    fade_ids(&mut timeline, &[consume], 0.0, 6.15, 0.35);
    write_text(&mut timeline, &[generate], 6.35, 0.45);

    for (index, group) in artifact_groups.iter().enumerate() {
        let at = 6.75 + index as f32 * 0.55;
        appear(&mut timeline, group, at, 0.2);
        for &id in group {
            timeline
                .animate(id)
                .at(at)
                .for_duration(0.6)
                .ease(Ease::OutCubic)
                .move_to(artifact_targets[index])
                .from_vec3(Vec3::new(0.0, 0.7, 0.12))
                .spawn();
        }
    }

    shift_ids(&mut timeline, &input, 9.6, 0.8, Vec3::new(-3.55, 0.18, 0.1));
    shift_ids(&mut timeline, &system, 9.6, 0.8, Vec3::new(0.0, 0.18, 0.1));
    shift_ids(&mut timeline, &output, 9.6, 0.8, Vec3::new(3.55, 0.18, 0.1));
    fade_ids(&mut timeline, &[static_pipeline], 0.0, 9.55, 0.35);
    write_text(&mut timeline, &[feedback_loop], 9.85, 0.45);

    fade_ids(&mut timeline, &[pipe_left, pipe_right], 0.0, 10.0, 0.45);
    draw(&mut timeline, &[loop_top], 10.2, 0.42);
    draw(&mut timeline, &[loop_right], 10.65, 0.42);
    draw(&mut timeline, &[loop_bottom], 11.1, 0.42);
    draw(&mut timeline, &[loop_left], 11.55, 0.42);
    pulse(&mut timeline, system[0], 12.15);

    fade_ids(&mut timeline, &[debugging], 0.0, 13.5, 0.35);
    write_text(&mut timeline, &[learning], 13.75, 0.42);
    pulse(&mut timeline, artifact_groups[0][0], 14.4);
    pulse(&mut timeline, artifact_groups[1][0], 14.7);
    pulse(&mut timeline, artifact_groups[3][0], 15.0);
    pulse(&mut timeline, learning, 15.5);

    fade_ids(&mut timeline, &ids, 0.0, 18.2, 0.55);
    fade_ids(&mut timeline, &footer_ids, 0.0, 18.25, 0.45);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/system-shift",
        [(18.0, Some("system_shift_final.png"))],
        Some(("system_shift_loop", GIF_STOPS)),
        true,
    )
}
