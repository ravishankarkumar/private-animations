use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;

use super::common::*;

const DURATION: f32 = 45.0;
const GIF_STOPS: &[f32] = &[1.8, 6.0, 11.2, 17.5, 23.0, 29.4, 35.6, 41.8, 44.2];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.5);
    let mut ids = Vec::new();

    let opening = label(
        &mut scene,
        "We're always told that AI needs a lot of data to work.",
        0.34,
        palette.ink,
        Vec3::new(0.0, 3.28, 0.1),
    );
    let pause_line = label(
        &mut scene,
        "But here's what no one really talks about...",
        0.28,
        rgba(WHITE, 0.86),
        Vec3::new(0.0, 2.78, 0.1),
    );
    let reversal = label(
        &mut scene,
        "AI systems are now generating data. Massive amounts of it.",
        0.3,
        palette.warning,
        Vec3::new(0.0, 2.3, 0.1),
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
        "What we think about",
        0.2,
        rgba(BLUE_A, 0.8),
        Vec3::new(-4.2, 2.42, 0.1),
    );
    let output_title = label(
        &mut scene,
        "What the run creates",
        0.2,
        rgba(palette.warning, 0.9),
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
        ("feedback", Vec3::new(1.1, -2.2, 0.1), palette.enterprise),
        ("eval score", Vec3::new(-0.88, -2.16, 0.1), palette.governance),
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
        output_ids.extend(card(&mut scene, text, pos, 2.05, accent));
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

    let token_panel = panel(
        &mut scene,
        Vec3::new(0.0, -0.24, 0.0),
        6.7,
        2.42,
        palette.learning,
    );
    let token_title = label(
        &mut scene,
        "A single RAG-based run can pull 5,000 to 30,000 tokens",
        0.28,
        palette.ink,
        Vec3::new(0.0, 0.54, 0.1),
    );
    let token_sub = label(
        &mut scene,
        "of retrieved context alone, before the model has even started thinking.",
        0.2,
        palette.muted,
        Vec3::new(0.0, 0.08, 0.1),
    );
    let token_bar = line(
        &mut scene,
        Vec3::new(-2.55, -0.62, 0.0),
        Vec3::new(2.55, -0.62, 0.0),
        0.08,
        rgba(palette.learning, 0.84),
    );
    let token_left = label(
        &mut scene,
        "5k",
        0.18,
        rgba(WHITE, 0.86),
        Vec3::new(-2.7, -0.96, 0.1),
    );
    let token_right = label(
        &mut scene,
        "30k",
        0.18,
        rgba(WHITE, 0.86),
        Vec3::new(2.72, -0.96, 0.1),
    );
    let context_card = large_card(
        &mut scene,
        "retrieved context",
        Vec3::new(0.0, -1.55, 0.1),
        2.78,
        palette.learning,
    );
    ids.extend([token_panel, token_title, token_sub, token_bar, token_left, token_right]);
    ids.extend(context_card.iter().copied());

    let stack_title = label(
        &mut scene,
        "Then add everything else the run creates",
        0.28,
        palette.ink,
        Vec3::new(0.0, 2.2, 0.1),
    );
    let stack_cards = [
        ("prompt", Vec3::new(-3.95, 0.92, 0.1), palette.kavriq),
        ("tool calls", Vec3::new(-1.9, 0.92, 0.1), palette.warning),
        ("reasoning", Vec3::new(0.0, 0.92, 0.1), PURPLE_B),
        ("model output", Vec3::new(2.15, 0.92, 0.1), palette.kavriq),
        ("feedback", Vec3::new(-1.45, -0.22, 0.1), palette.enterprise),
        ("evaluation score", Vec3::new(1.35, -0.22, 0.1), palette.governance),
    ];
    let mut stack_ids = Vec::new();
    for (text, pos, accent) in stack_cards {
        stack_ids.extend(card(&mut scene, text, pos, 2.0, accent));
    }
    let stack_claim = label(
        &mut scene,
        "That is not a side effect. That's the job.",
        0.34,
        palette.warning,
        Vec3::new(0.0, -2.05, 0.1),
    );
    ids.push(stack_title);
    ids.extend(stack_ids.iter().copied());
    ids.push(stack_claim);

    let final_line = label(
        &mut scene,
        "This changes how we build AI systems.",
        0.38,
        palette.ink,
        Vec3::new(0.0, 0.34, 0.1),
    );
    let final_sub = label(
        &mut scene,
        "If you are serious about building AI systems, pause here and really think about that.",
        0.22,
        palette.muted,
        Vec3::new(0.0, -0.32, 0.1),
    );
    let final_rule = line(
        &mut scene,
        Vec3::new(-2.55, -1.08, 0.0),
        Vec3::new(2.55, -1.08, 0.0),
        0.05,
        rgba(palette.warning, 0.72),
    );
    ids.extend([final_line, final_sub, final_rule]);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);

    write_text(&mut timeline, &[opening], 0.35, 1.5);
    appear(&mut timeline, &[input_title], 1.8, 0.45);
    draw(&mut timeline, &[model[0]], 2.2, 0.5);
    write_text(&mut timeline, &[model[1]], 2.45, 0.38);

    for (index, chunk) in input_ids.chunks(2).enumerate() {
        let at = 2.9 + index as f32 * 0.55;
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
    pulse(&mut timeline, model[0], 8.6);
    pulse(&mut timeline, model[1], 8.8);
    write_text(&mut timeline, &[reversal], 9.1, 1.4);
    appear(&mut timeline, &[output_title], 10.2, 0.45);

    for (index, arrow_id) in output_arrows.iter().enumerate() {
        let at = 10.9 + index as f32 * 0.6;
        draw(&mut timeline, &[*arrow_id], at, 0.26);
    }
    for (index, chunk) in output_ids.chunks(2).enumerate() {
        let at = 11.05 + index as f32 * 0.6;
        draw(&mut timeline, &[chunk[0]], at, 0.3);
        write_text(&mut timeline, &[chunk[1]], at + 0.08, 0.28);
    }

    appear(&mut timeline, &[token_panel], 16.8, 0.55);
    write_text(&mut timeline, &[token_title], 17.4, 1.25);
    write_text(&mut timeline, &[token_sub], 18.25, 1.2);
    draw(&mut timeline, &[token_bar], 19.2, 0.5);
    write_text(&mut timeline, &[token_left, token_right], 19.55, 0.45);
    draw(&mut timeline, &[context_card[0]], 20.1, 0.45);
    write_text(&mut timeline, &[context_card[1]], 20.35, 0.42);
    pulse(&mut timeline, context_card[0], 21.3);

    write_text(&mut timeline, &[stack_title], 24.2, 1.0);
    for (index, chunk) in stack_ids.chunks(2).enumerate() {
        let at = 25.2 + index as f32 * 0.62;
        draw(&mut timeline, &[chunk[0]], at, 0.32);
        write_text(&mut timeline, &[chunk[1]], at + 0.12, 0.3);
    }
    write_text(&mut timeline, &[stack_claim], 31.1, 1.1);
    pulse(&mut timeline, stack_claim, 32.6);

    timeline
        .animate(reversal)
        .at(35.2)
        .for_duration(0.9)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();
    timeline
        .animate(stack_claim)
        .at(35.3)
        .for_duration(0.9)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();
    write_text(&mut timeline, &[final_line], 36.2, 1.25);
    write_text(&mut timeline, &[final_sub], 38.0, 1.4);
    draw(&mut timeline, &[final_rule], 40.0, 0.55);
    pulse(&mut timeline, final_line, 41.5);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/hook",
        [(44.0, Some("hook_final.png"))],
        Some(("hook_loop", GIF_STOPS)),
        true,
    )
}
