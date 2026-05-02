use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;

use super::common::*;

const DURATION: f32 = 4.8;
const GIF_STOPS: &[f32] = &[0.35, 1.15, 2.1, 3.1, 4.35];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.5);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "AI creates a data problem",
        0.48,
        palette.ink,
        Vec3::new(0.0, 3.1, 0.1),
    );
    let sub = label(
        &mut scene,
        "not just a data requirement",
        0.24,
        palette.muted,
        Vec3::new(0.0, 2.58, 0.1),
    );
    ids.extend([title, sub]);

    let model = large_card(
        &mut scene,
        "agent run",
        Vec3::new(0.0, 0.74, 0.1),
        1.8,
        palette.kavriq,
    );
    ids.extend(model.iter().copied());

    let inputs = [
        ("user request", Vec3::new(-4.4, 1.42, 0.1), BLUE_B),
        (
            "knowledge base",
            Vec3::new(-4.4, 0.02, 0.1),
            palette.learning,
        ),
    ];
    let outputs = [
        ("prompt", Vec3::new(3.7, 2.08, 0.1), palette.kavriq),
        (
            "retrieved chunks",
            Vec3::new(4.28, 1.18, 0.1),
            palette.learning,
        ),
        ("tool calls", Vec3::new(4.35, 0.24, 0.1), palette.warning),
        ("model output", Vec3::new(4.1, -0.72, 0.1), palette.kavriq),
        ("feedback", Vec3::new(3.55, -1.62, 0.1), palette.enterprise),
    ];

    let mut input_ids = Vec::new();
    let mut output_ids = Vec::new();
    let mut arrows = Vec::new();
    for (text, pos, accent) in inputs {
        input_ids.extend(card(&mut scene, text, pos, 1.9, accent));
        arrows.push(arrow(
            &mut scene,
            Vec2::new(pos.x + 0.98, pos.y),
            Vec2::new(-0.95, 0.74),
            0.04,
            rgba(accent, 0.72),
        ));
    }
    for (text, pos, accent) in outputs {
        output_ids.extend(card(&mut scene, text, pos, 1.86, accent));
        arrows.push(arrow(
            &mut scene,
            Vec2::new(0.95, 0.74),
            Vec2::new(pos.x - 0.98, pos.y),
            0.035,
            rgba(accent, 0.68),
        ));
    }
    ids.extend(input_ids.iter().chain(output_ids.iter()).copied());
    ids.extend(arrows.iter().copied());

    let claim = label(
        &mut scene,
        "Every run leaves traces.",
        0.33,
        palette.warning,
        Vec3::new(0.0, -2.78, 0.1),
    );
    ids.push(claim);
    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    write_text(&mut timeline, &[title], 0.1, 0.75);
    write_text(&mut timeline, &[sub], 0.62, 0.55);
    for (index, chunk) in input_ids.chunks(2).enumerate() {
        draw(&mut timeline, &[chunk[0]], 0.85 + index as f32 * 0.12, 0.35);
        write_text(&mut timeline, &[chunk[1]], 0.98 + index as f32 * 0.12, 0.35);
    }
    draw(&mut timeline, &[model[0]], 1.3, 0.5);
    write_text(&mut timeline, &[model[1]], 1.52, 0.35);
    draw(&mut timeline, &arrows[..2], 1.65, 0.32);
    for (index, arrow_id) in arrows[2..].iter().enumerate() {
        draw(&mut timeline, &[*arrow_id], 2.0 + index as f32 * 0.18, 0.28);
    }
    for (index, chunk) in output_ids.chunks(2).enumerate() {
        let at = 2.1 + index as f32 * 0.18;
        draw(&mut timeline, &[chunk[0]], at, 0.28);
        write_text(&mut timeline, &[chunk[1]], at + 0.08, 0.34);
    }
    write_text(&mut timeline, &[claim], 3.55, 0.55);
    pulse(&mut timeline, claim, 4.05);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/hook",
        [(4.35, Some("hook_final.png"))],
        Some(("hook_loop", GIF_STOPS)),
        true,
    )
}
