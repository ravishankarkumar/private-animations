use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 18.0;
const GIF_STOPS: &[f32] = &[0.8, 3.0, 6.0, 9.4, 12.6, 15.8, 17.1];

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline.animate(id).at(at).for_duration(0.56).ease(Ease::InOutQuad).indicate().spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let title = label(&mut scene, "Multi-agent runs turn debugging into causality tracing", 0.28, palette.ink, Vec3::new(0.0, 3.14, 0.1));
    ids.push(title);

    let a = large_card(&mut scene, "Agent A", Vec3::new(-3.8, 0.7, 0.1), 1.9, palette.kavriq);
    let b = large_card(&mut scene, "Agent B", Vec3::new(-0.9, 1.45, 0.1), 1.9, BLUE_B);
    let tool = large_card(&mut scene, "Tool", Vec3::new(2.0, 1.45, 0.1), 1.55, palette.governance);
    let context = large_card(&mut scene, "Context", Vec3::new(2.1, -0.15, 0.1), 1.75, palette.learning);
    let answer = large_card(&mut scene, "Final answer", Vec3::new(-0.5, -1.55, 0.1), 2.2, palette.warning);
    ids.extend(a.iter().chain(b.iter()).chain(tool.iter()).chain(context.iter()).chain(answer.iter()).copied());

    let flow = [
        arrow(&mut scene, Vec2::new(-2.72, 0.95), Vec2::new(-1.98, 1.24), 0.046, rgba(palette.kavriq, 0.82)),
        arrow(&mut scene, Vec2::new(0.18, 1.45), Vec2::new(1.18, 1.45), 0.046, rgba(BLUE_B, 0.82)),
        arrow(&mut scene, Vec2::new(2.0, 1.03), Vec2::new(2.0, 0.34), 0.04, rgba(palette.governance, 0.78)),
        arrow(&mut scene, Vec2::new(1.24, -0.48), Vec2::new(0.28, -1.16), 0.04, rgba(palette.learning, 0.78)),
        arrow(&mut scene, Vec2::new(-2.7, 0.35), Vec2::new(-1.5, -1.12), 0.036, rgba(palette.kavriq, 0.45)),
    ];
    ids.extend(flow);

    let causal = [
        ("run id", Vec3::new(-4.9, 2.25, 0.1), 1.1, palette.kavriq),
        ("tool input", Vec3::new(2.0, 2.45, 0.1), 1.45, palette.governance),
        ("retrieved chunk", Vec3::new(4.35, -0.15, 0.1), 1.98, palette.learning),
        ("intermediate output", Vec3::new(-1.0, 2.45, 0.1), 2.4, BLUE_B),
        ("final answer trace", Vec3::new(-0.4, -2.65, 0.1), 2.25, palette.warning),
    ];
    let mut trace_cards = Vec::new();
    let mut trace_lines = Vec::new();
    for (text, pos, width, accent) in causal {
        let g = card(&mut scene, text, pos, width, accent);
        ids.extend(g.iter().copied());
        trace_cards.push(g);
    }
    trace_lines.push(line(&mut scene, Vec3::new(-3.8, 1.38, 0.0), Vec3::new(-4.45, 2.0, 0.0), 0.018, rgba(palette.kavriq, 0.6)));
    trace_lines.push(line(&mut scene, Vec3::new(2.0, 1.84, 0.0), Vec3::new(2.0, 2.12, 0.0), 0.018, rgba(palette.governance, 0.6)));
    trace_lines.push(line(&mut scene, Vec3::new(2.95, -0.15, 0.0), Vec3::new(3.48, -0.15, 0.0), 0.018, rgba(palette.learning, 0.6)));
    trace_lines.push(line(&mut scene, Vec3::new(-0.9, 1.84, 0.0), Vec3::new(-0.98, 2.12, 0.0), 0.018, rgba(BLUE_B, 0.6)));
    trace_lines.push(line(&mut scene, Vec3::new(-0.5, -1.98, 0.0), Vec3::new(-0.45, -2.25, 0.0), 0.018, rgba(palette.warning, 0.6)));
    ids.extend(trace_lines.iter().copied());

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);
    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    appear(&mut timeline, &[title], 0.15, 0.34);
    appear(&mut timeline, &a, 0.7, 0.24);
    draw(&mut timeline, &[flow[0]], 1.0, 0.22);
    appear(&mut timeline, &b, 1.18, 0.24);
    draw(&mut timeline, &[flow[1]], 1.55, 0.22);
    appear(&mut timeline, &tool, 1.75, 0.24);
    draw(&mut timeline, &[flow[2]], 2.15, 0.2);
    appear(&mut timeline, &context, 2.34, 0.24);
    draw(&mut timeline, &[flow[3]], 2.7, 0.22);
    appear(&mut timeline, &answer, 2.92, 0.24);
    draw(&mut timeline, &[flow[4]], 3.25, 0.2);

    let order = [a[1], b[1], tool[1], context[1], answer[1], b[1], tool[1], context[1], answer[1]];
    for (i, id) in order.iter().enumerate() {
        indicate_id(&mut timeline, *id, 4.2 + i as f32 * 0.62);
    }
    for i in 0..trace_cards.len() {
        draw(&mut timeline, &[trace_lines[i]], 10.0 + i as f32 * 0.52, 0.18);
        appear(&mut timeline, &trace_cards[i], 10.12 + i as f32 * 0.52, 0.22);
    }
    for (i, g) in trace_cards.iter().enumerate() {
        indicate_id(&mut timeline, g[1], 13.0 + i as f32 * 0.48);
    }

    timeline.wait_until(DURATION);
    run_scene_with_video(scene, timeline, DURATION, "rendered_output/kavriq/hidden-data-problem/multi-agent-causality", [(17.1, Some("multi_agent_causality_final.png"))], Some(("multi_agent_causality_loop", GIF_STOPS)), true)
}
