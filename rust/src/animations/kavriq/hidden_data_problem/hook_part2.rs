use anyhow::Result;
use glam::Vec3;
use murali::colors::*;

use super::common::*;

const DURATION: f32 = 15.0;
const GIF_STOPS: &[f32] = &[1.4, 4.5, 7.9, 11.4, 14.2];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.0);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "A single RAG-based run can pull 5,000 to 30,000 tokens",
        0.3,
        palette.ink,
        Vec3::new(0.0, 2.9, 0.1),
    );
    let subtitle = label(
        &mut scene,
        "of retrieved context alone, before the model has even started thinking.",
        0.22,
        palette.muted,
        Vec3::new(0.0, 2.34, 0.1),
    );
    ids.extend([title, subtitle]);

    let panel = panel(&mut scene, Vec3::new(0.0, -0.12, 0.0), 8.0, 4.7, palette.learning);
    ids.push(panel);

    let run = large_card(
        &mut scene,
        "one agent run",
        Vec3::new(0.0, 0.85, 0.1),
        2.45,
        palette.kavriq,
    );
    ids.extend(run.iter().copied());

    let scale_line = line(
        &mut scene,
        Vec3::new(-2.95, -0.22, 0.0),
        Vec3::new(2.95, -0.22, 0.0),
        0.09,
        rgba(palette.learning, 0.84),
    );
    let min_label = label(
        &mut scene,
        "5k",
        0.18,
        rgba(WHITE, 0.86),
        Vec3::new(-3.1, -0.56, 0.1),
    );
    let max_label = label(
        &mut scene,
        "30k",
        0.18,
        rgba(WHITE, 0.86),
        Vec3::new(3.1, -0.56, 0.1),
    );
    ids.extend([scale_line, min_label, max_label]);

    let context = large_card(
        &mut scene,
        "retrieved context",
        Vec3::new(0.0, -1.34, 0.1),
        3.2,
        palette.learning,
    );
    ids.extend(context.iter().copied());

    let note = label(
        &mut scene,
        "before the model has even started thinking",
        0.26,
        palette.warning,
        Vec3::new(0.0, -2.52, 0.1),
    );
    let closing = label(
        &mut scene,
        "That is already a huge amount of generated system context.",
        0.24,
        rgba(WHITE, 0.88),
        Vec3::new(0.0, -3.16, 0.1),
    );
    ids.extend([note, closing]);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    appear(&mut timeline, &[panel], 0.4, 0.6);
    write_text(&mut timeline, &[title], 0.8, 1.5);
    write_text(&mut timeline, &[subtitle], 1.9, 1.3);
    draw(&mut timeline, &[run[0]], 3.2, 0.45);
    write_text(&mut timeline, &[run[1]], 3.45, 0.38);
    draw(&mut timeline, &[scale_line], 4.2, 0.45);
    write_text(&mut timeline, &[min_label, max_label], 4.65, 0.45);
    draw(&mut timeline, &[context[0]], 5.35, 0.5);
    write_text(&mut timeline, &[context[1]], 5.62, 0.45);
    pulse(&mut timeline, context[0], 6.8);
    write_text(&mut timeline, &[note], 8.0, 1.15);
    write_text(&mut timeline, &[closing], 10.55, 1.15);
    pulse(&mut timeline, closing, 12.1);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/hook-part-2",
        [(14.25, Some("hook_part_2_final.png"))],
        Some(("hook_part_2_loop", GIF_STOPS)),
        true,
    )
}
