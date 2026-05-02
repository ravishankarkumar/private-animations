use anyhow::Result;
use glam::Vec3;
use murali::colors::*;

use super::common::*;

const DURATION: f32 = 5.6;
const GIF_STOPS: &[f32] = &[0.5, 1.4, 2.2, 3.0, 3.8, 4.8];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "One agent run creates a trace",
        0.43,
        palette.ink,
        Vec3::new(0.0, 3.3, 0.1),
    );
    let subtitle = label(
        &mut scene,
        "prompt, context, tools, output, feedback, eval",
        0.22,
        palette.muted,
        Vec3::new(0.0, 2.86, 0.1),
    );
    ids.extend([title, subtitle]);

    let center = Vec3::new(0.0, 0.34, 0.1);
    let halo = circle(
        &mut scene,
        0.95,
        center,
        rgba(palette.kavriq, 0.11),
        rgba(palette.kavriq, 0.64),
    );
    let core = circle(
        &mut scene,
        0.42,
        Vec3::new(center.x, center.y, 0.18),
        rgba(palette.kavriq, 0.9),
        WHITE,
    );
    let run_label = label(
        &mut scene,
        "run",
        0.2,
        Vec3::new(0.02, 0.05, 0.07).extend(1.0),
        Vec3::new(center.x, center.y, 0.26),
    );
    ids.extend([halo, core, run_label]);

    let trace = [
        ("prompt", Vec3::new(-3.6, 1.85, 0.1), palette.kavriq),
        (
            "retrieved chunks",
            Vec3::new(0.0, 2.14, 0.1),
            palette.learning,
        ),
        ("tool calls", Vec3::new(3.6, 1.85, 0.1), palette.warning),
        ("tool result", Vec3::new(4.1, 0.32, 0.1), palette.warning),
        ("model output", Vec3::new(2.42, -1.24, 0.1), palette.kavriq),
        (
            "user feedback",
            Vec3::new(-2.42, -1.24, 0.1),
            palette.enterprise,
        ),
        ("eval score", Vec3::new(-4.1, 0.32, 0.1), palette.governance),
    ];

    let mut cards = Vec::new();
    let mut spokes = Vec::new();
    for (text, pos, accent) in trace {
        cards.extend(card(&mut scene, text, pos, 1.82, accent));
        spokes.push(line(
            &mut scene,
            Vec3::new(center.x, center.y, 0.0),
            Vec3::new(pos.x, pos.y, 0.0),
            0.026,
            rgba(accent, 0.62),
        ));
    }
    ids.extend(cards.iter().chain(spokes.iter()).copied());

    let store = large_card(
        &mut scene,
        "trace store",
        Vec3::new(0.0, -3.12, 0.1),
        2.25,
        palette.learning,
    );
    let down = line(
        &mut scene,
        Vec3::new(0.0, -0.65, 0.0),
        Vec3::new(0.0, -2.62, 0.0),
        0.04,
        rgba(palette.learning, 0.78),
    );
    ids.extend(store.iter().copied());
    ids.push(down);
    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    appear(&mut timeline, &[title, subtitle], 0.1, 0.6);
    appear(&mut timeline, &[halo, core, run_label], 0.85, 0.5);
    for (index, &spoke) in spokes.iter().enumerate() {
        draw(&mut timeline, &[spoke], 1.28 + index as f32 * 0.18, 0.28);
    }
    for (index, chunk) in cards.chunks(2).enumerate() {
        appear(&mut timeline, chunk, 1.38 + index as f32 * 0.18, 0.32);
    }
    draw(&mut timeline, &[down], 4.0, 0.35);
    appear(&mut timeline, &store, 4.25, 0.45);

    timeline.wait_until(DURATION);
    run_scene(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/agent-run-trace",
        [(5.05, Some("agent_run_trace_final.png"))],
        Some(("agent_run_trace_loop", GIF_STOPS)),
    )
}
