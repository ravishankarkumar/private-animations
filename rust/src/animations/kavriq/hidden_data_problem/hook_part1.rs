use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;

use super::common::*;

const DURATION: f32 = 15.0;
const GIF_STOPS: &[f32] = &[1.2, 4.2, 7.4, 10.4, 13.8];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.4);
    let mut ids = Vec::new();

    let opening = label(
        &mut scene,
        "We're always told that AI needs a lot of data to work.",
        0.34,
        palette.ink,
        Vec3::new(0.0, 3.26, 0.1),
    );
    let pause_line = label(
        &mut scene,
        "But here's what no one really talks about...",
        0.28,
        rgba(WHITE, 0.86),
        Vec3::new(0.0, 2.72, 0.1),
    );
    let reversal = label(
        &mut scene,
        "AI systems are now generating data. Massive amounts of it.",
        0.3,
        palette.warning,
        Vec3::new(0.0, 2.2, 0.1),
    );
    ids.extend([opening, pause_line, reversal]);

    let model = large_card(
        &mut scene,
        "agent run",
        Vec3::new(0.0, 0.52, 0.1),
        2.1,
        palette.kavriq,
    );
    ids.extend(model.iter().copied());

    let input_title = label(
        &mut scene,
        "What we usually imagine",
        0.2,
        rgba(BLUE_A, 0.82),
        Vec3::new(-4.2, 2.42, 0.1),
    );
    let output_title = label(
        &mut scene,
        "What the run creates",
        0.2,
        rgba(palette.warning, 0.92),
        Vec3::new(4.1, 2.42, 0.1),
    );
    ids.extend([input_title, output_title]);

    let inputs = [
        ("documents", Vec3::new(-4.35, 1.52, 0.1), BLUE_B),
        ("database", Vec3::new(-4.08, 0.58, 0.1), palette.learning),
        ("chat history", Vec3::new(-4.36, -0.38, 0.1), BLUE_B),
        ("training data", Vec3::new(-4.02, -1.34, 0.1), palette.enterprise),
    ];
    let outputs = [
        ("prompt", Vec3::new(3.8, 1.72, 0.1), palette.kavriq),
        ("retrieved context", Vec3::new(4.44, 0.84, 0.1), palette.learning),
        ("tool calls", Vec3::new(4.16, -0.04, 0.1), palette.warning),
        ("reasoning", Vec3::new(3.56, -0.92, 0.1), PURPLE_B),
        ("model output", Vec3::new(2.88, -1.82, 0.1), palette.kavriq),
    ];

    let mut input_ids = Vec::new();
    let mut input_arrows = Vec::new();
    for (text, pos, accent) in inputs {
        input_ids.extend(card(&mut scene, text, pos, 1.9, accent));
        input_arrows.push(arrow(
            &mut scene,
            Vec2::new(pos.x + 0.98, pos.y),
            Vec2::new(-1.05, 0.52),
            0.04,
            rgba(accent, 0.72),
        ));
    }

    let mut output_ids = Vec::new();
    let mut output_arrows = Vec::new();
    for (text, pos, accent) in outputs {
        output_ids.extend(card(&mut scene, text, pos, 2.0, accent));
        output_arrows.push(arrow(
            &mut scene,
            Vec2::new(1.05, 0.52),
            Vec2::new(pos.x - 1.06, pos.y),
            0.035,
            rgba(accent, 0.72),
        ));
    }
    ids.extend(input_ids.iter().copied());
    ids.extend(output_ids.iter().copied());
    ids.extend(input_arrows.iter().copied());
    ids.extend(output_arrows.iter().copied());

    let claim = label(
        &mut scene,
        "Every single run leaves behind more data.",
        0.34,
        palette.warning,
        Vec3::new(0.0, -3.12, 0.1),
    );
    ids.push(claim);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    write_text(&mut timeline, &[opening], 0.3, 1.6);
    appear(&mut timeline, &[input_title], 2.0, 0.45);
    draw(&mut timeline, &[model[0]], 2.25, 0.5);
    write_text(&mut timeline, &[model[1]], 2.5, 0.38);
    for (index, chunk) in input_ids.chunks(2).enumerate() {
        let at = 2.95 + index as f32 * 0.56;
        draw(&mut timeline, &[input_arrows[index]], at, 0.32);
        draw(&mut timeline, &[chunk[0]], at + 0.08, 0.3);
        write_text(&mut timeline, &[chunk[1]], at + 0.14, 0.3);
    }
    write_text(&mut timeline, &[pause_line], 6.9, 1.1);
    timeline
        .animate(opening)
        .at(8.0)
        .for_duration(0.7)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();
    pulse(&mut timeline, model[0], 8.65);
    pulse(&mut timeline, model[1], 8.8);
    write_text(&mut timeline, &[reversal], 9.1, 1.35);
    appear(&mut timeline, &[output_title], 10.05, 0.45);
    for (index, arrow_id) in output_arrows.iter().enumerate() {
        let at = 10.7 + index as f32 * 0.56;
        draw(&mut timeline, &[*arrow_id], at, 0.26);
    }
    for (index, chunk) in output_ids.chunks(2).enumerate() {
        let at = 10.85 + index as f32 * 0.56;
        draw(&mut timeline, &[chunk[0]], at, 0.3);
        write_text(&mut timeline, &[chunk[1]], at + 0.08, 0.28);
    }
    write_text(&mut timeline, &[claim], 13.15, 0.9);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/hook-part-1",
        [(14.2, Some("hook_part_1_final.png"))],
        Some(("hook_part_1_loop", GIF_STOPS)),
        true,
    )
}
