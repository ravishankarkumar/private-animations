use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;

use super::common::*;

const DURATION: f32 = 9.0;
const GIF_STOPS: &[f32] = &[0.8, 1.8, 2.8, 3.8, 4.8, 5.8, 7.0, 8.5];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(12.5);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "The Hidden Data Problem",
        0.46,
        palette.ink,
        Vec3::new(0.0, 3.72, 0.1),
    );
    let subtitle = label(
        &mut scene,
        "AI does not just need data. It creates it.",
        0.25,
        palette.muted,
        Vec3::new(0.0, 3.28, 0.1),
    );
    ids.extend([title, subtitle]);

    let left_panel = panel(&mut scene, Vec3::new(-3.55, 1.0, 0.0), 5.5, 3.15, BLUE_A);
    let left_title = label(
        &mut scene,
        "Traditional software",
        0.24,
        rgba(BLUE_A, 0.9),
        Vec3::new(-3.55, 2.32, 0.1),
    );
    ids.extend([left_panel, left_title]);

    let input = large_card(
        &mut scene,
        "Input",
        Vec3::new(-5.55, 1.18, 0.08),
        1.24,
        BLUE_B,
    );
    let service = large_card(
        &mut scene,
        "Service",
        Vec3::new(-3.55, 1.18, 0.08),
        1.36,
        BLUE_B,
    );
    let output = large_card(
        &mut scene,
        "Output",
        Vec3::new(-1.55, 1.18, 0.08),
        1.32,
        BLUE_B,
    );
    ids.extend(
        input
            .iter()
            .chain(service.iter())
            .chain(output.iter())
            .copied(),
    );

    let deterministic_a = arrow(
        &mut scene,
        Vec2::new(-4.82, 1.18),
        Vec2::new(-4.18, 1.18),
        0.05,
        BLUE_A,
    );
    let deterministic_b = arrow(
        &mut scene,
        Vec2::new(-2.82, 1.18),
        Vec2::new(-2.18, 1.18),
        0.05,
        BLUE_A,
    );
    let same_io = label(
        &mut scene,
        "same input -> same output",
        0.18,
        rgba(WHITE, 0.68),
        Vec3::new(-3.55, 0.38, 0.1),
    );
    let optional_logs = card(
        &mut scene,
        "logs: mostly debug failures",
        Vec3::new(-3.55, -0.35, 0.08),
        3.0,
        BLUE_A,
    );
    ids.extend([deterministic_a, deterministic_b, same_io]);
    ids.extend(optional_logs.iter().copied());

    let right_panel = panel(
        &mut scene,
        Vec3::new(3.55, 0.24, 0.0),
        5.8,
        4.92,
        palette.kavriq,
    );
    let right_title = label(
        &mut scene,
        "Agentic AI run",
        0.28,
        palette.kavriq,
        Vec3::new(3.55, 2.34, 0.1),
    );
    ids.extend([right_panel, right_title]);

    let agent_halo = circle(
        &mut scene,
        0.88,
        Vec3::new(3.55, 0.35, 0.06),
        rgba(palette.kavriq, 0.12),
        rgba(palette.kavriq, 0.62),
    );
    let agent_core = circle(
        &mut scene,
        0.36,
        Vec3::new(3.55, 0.35, 0.12),
        rgba(palette.kavriq, 0.84),
        WHITE,
    );
    let agent_label = label(
        &mut scene,
        "run",
        0.19,
        Vec3::new(0.02, 0.05, 0.07).extend(1.0),
        Vec3::new(3.55, 0.35, 0.2),
    );
    ids.extend([agent_halo, agent_core, agent_label]);

    let artifacts = [
        ("prompt", Vec3::new(2.08, 1.42, 0.1), palette.kavriq),
        (
            "retrieved chunks",
            Vec3::new(4.92, 1.42, 0.1),
            palette.learning,
        ),
        ("tool calls", Vec3::new(5.08, 0.22, 0.1), palette.warning),
        ("model output", Vec3::new(4.76, -1.02, 0.1), palette.kavriq),
        ("feedback", Vec3::new(2.36, -1.02, 0.1), palette.enterprise),
        (
            "eval scores",
            Vec3::new(1.98, 0.22, 0.1),
            palette.governance,
        ),
        ("reasoning trace", Vec3::new(3.55, -1.78, 0.1), PURPLE_B),
    ];

    let mut artifact_ids = Vec::new();
    let mut trace_lines = Vec::new();
    for (text, pos, accent) in artifacts {
        artifact_ids.extend(card(&mut scene, text, pos, 1.78, accent));
        trace_lines.push(line(
            &mut scene,
            Vec3::new(3.55, 0.35, 0.0),
            Vec3::new(pos.x, pos.y, 0.0),
            0.025,
            rgba(accent, 0.58),
        ));
    }
    ids.extend(artifact_ids.iter().copied());
    ids.extend(trace_lines.iter().copied());

    let log_claim = label(
        &mut scene,
        "logs are the system",
        0.38,
        palette.warning,
        Vec3::new(0.0, -2.46, 0.1),
    );
    let log_claim_rule = line(
        &mut scene,
        Vec3::new(-1.86, -2.78, 0.0),
        Vec3::new(1.86, -2.78, 0.0),
        0.04,
        rgba(palette.warning, 0.76),
    );
    ids.extend([log_claim, log_claim_rule]);

    let loop_title = label(
        &mut scene,
        "Every run becomes a feedback loop",
        0.22,
        rgba(WHITE, 0.74),
        Vec3::new(0.0, -3.25, 0.1),
    );
    let debug = card(
        &mut scene,
        "debug trace",
        Vec3::new(-2.8, -3.82, 0.08),
        1.78,
        BLUE_B,
    );
    let eval = card(
        &mut scene,
        "evaluation",
        Vec3::new(0.0, -3.82, 0.08),
        1.78,
        palette.learning,
    );
    let train = card(
        &mut scene,
        "training data",
        Vec3::new(2.8, -3.82, 0.08),
        1.78,
        palette.enterprise,
    );
    let loop_a = arrow(
        &mut scene,
        Vec2::new(-1.86, -3.82),
        Vec2::new(-0.94, -3.82),
        0.045,
        palette.muted,
    );
    let loop_b = arrow(
        &mut scene,
        Vec2::new(0.94, -3.82),
        Vec2::new(1.86, -3.82),
        0.045,
        palette.muted,
    );
    let governance_line = label(
        &mut scene,
        "capture, retain, govern, learn",
        0.19,
        rgba(palette.governance, 0.86),
        Vec3::new(0.0, -4.42, 0.1),
    );
    ids.extend([loop_title, loop_a, loop_b, governance_line]);
    ids.extend(debug.iter().chain(eval.iter()).chain(train.iter()).copied());
    let footer_ids = footer(&mut scene, &palette, &mut ids);

    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.15, 0.6);
    appear(&mut timeline, &[title, subtitle], 0.15, 0.75);
    appear(&mut timeline, &[left_panel, left_title], 1.05, 0.55);
    appear(&mut timeline, &input, 1.35, 0.45);
    draw(&mut timeline, &[deterministic_a], 1.65, 0.35);
    appear(&mut timeline, &service, 1.82, 0.45);
    draw(&mut timeline, &[deterministic_b], 2.1, 0.35);
    appear(&mut timeline, &output, 2.25, 0.45);
    appear(&mut timeline, &[same_io], 2.58, 0.45);
    appear(&mut timeline, &optional_logs, 2.86, 0.45);
    appear(&mut timeline, &[right_panel, right_title], 3.36, 0.55);
    appear(
        &mut timeline,
        &[agent_halo, agent_core, agent_label],
        3.72,
        0.5,
    );
    for (index, &line_id) in trace_lines.iter().enumerate() {
        draw(&mut timeline, &[line_id], 4.02 + index as f32 * 0.12, 0.32);
    }
    for (index, chunk) in artifact_ids.chunks(2).enumerate() {
        appear(&mut timeline, chunk, 4.16 + index as f32 * 0.12, 0.36);
    }
    appear(&mut timeline, &[log_claim, log_claim_rule], 5.68, 0.55);
    pulse(&mut timeline, log_claim, 6.18);
    appear(&mut timeline, &[loop_title], 6.64, 0.42);
    appear(&mut timeline, &debug, 6.9, 0.38);
    draw(&mut timeline, &[loop_a], 7.12, 0.28);
    appear(&mut timeline, &eval, 7.28, 0.38);
    draw(&mut timeline, &[loop_b], 7.5, 0.28);
    appear(&mut timeline, &train, 7.66, 0.38);
    appear(&mut timeline, &[governance_line], 8.05, 0.5);

    timeline.wait_until(DURATION);
    run_scene(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/main-explainer",
        [
            (5.7, Some("logs_are_system.png")),
            (8.65, Some("feedback_loop.png")),
        ],
        Some(("main_explainer_loop", GIF_STOPS)),
    )
}
