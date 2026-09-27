use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::rounded_rectangle::RoundedRectangle;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 35.0;
const GIF_STOPS: &[f32] = &[1.2, 4.8, 8.8, 12.8, 16.8, 20.8, 24.8, 28.8, 33.8];

struct NodeSpec {
    text: &'static str,
    pos: Vec3,
    accent: glam::Vec4,
    width: f32,
}

fn indicate_label(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.6)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

fn card_entry(
    scene: &mut murali::engine::scene::Scene,
    spec: &NodeSpec,
) -> (Vec<TattvaId>, Vec2) {
    let ids = card(scene, spec.text, spec.pos, spec.width, spec.accent);
    let half_w = spec.width * 0.5;
    let half_h = 0.24;
    let left = Vec2::new(spec.pos.x - half_w, spec.pos.y);
    let right = Vec2::new(spec.pos.x + half_w, spec.pos.y);
    let top = Vec2::new(spec.pos.x, spec.pos.y + half_h);
    let bottom = Vec2::new(spec.pos.x, spec.pos.y - half_h);

    let anchor = if spec.pos.x > -0.9 && spec.pos.y.abs() < 0.8 {
        left
    } else if spec.pos.x < -0.9 && spec.pos.y.abs() < 0.8 {
        right
    } else if spec.pos.y > 0.8 {
        bottom
    } else {
        top
    };

    (ids, anchor)
}

fn center_anchor_for(target: Vec3) -> Vec2 {
    let center = Vec2::new(-1.35, 0.0);
    let half_w = 1.08;
    let half_h = 0.32;
    let dir = Vec2::new(target.x - center.x, target.y - center.y);

    if dir.length_squared() < 1e-6 {
        return center;
    }

    let tx = if dir.x.abs() > 1e-6 {
        half_w / dir.x.abs()
    } else {
        f32::INFINITY
    };
    let ty = if dir.y.abs() > 1e-6 {
        half_h / dir.y.abs()
    } else {
        f32::INFINITY
    };

    let t = tx.min(ty) * 1.02;
    center + dir * t
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.0);
    let mut ids = Vec::new();

    let chart_panel = panel(
        &mut scene,
        Vec3::new(4.55, -0.05, 0.0),
        2.45,
        4.6,
        palette.learning,
    );
    let chart_axis_x = line(
        &mut scene,
        Vec3::new(3.78, -1.92, 0.0),
        Vec3::new(5.2, -1.92, 0.0),
        0.04,
        rgba(palette.learning, 0.76),
    );
    let chart_label = label(
        &mut scene,
        "Data Size",
        0.22,
        rgba(WHITE, 0.88),
        Vec3::new(4.56, -3.0, 0.1),
    );
    ids.extend([chart_panel, chart_axis_x, chart_label]);

    let segment_colors = [
        rgba(palette.kavriq, 0.92),
        rgba(palette.kavriq, 0.82),
        rgba(palette.learning, 0.9),
        rgba(palette.warning, 0.92),
        rgba(palette.warning, 0.82),
        rgba(palette.enterprise, 0.9),
        rgba(palette.governance, 0.92),
    ];

    let mut chart_segments = Vec::new();
    for (index, &color) in segment_colors.iter().enumerate() {
        let y = -1.62 + index as f32 * 0.46;
        let segment = scene.add_tattva(
            RoundedRectangle::new(0.86, 0.28, 0.06, color).with_stroke(0.016, rgba(WHITE, 0.12)),
            Vec3::new(4.50, y, 0.08),
        );
        chart_segments.push(segment);
        ids.push(segment);
    }

    let center = large_card(
        &mut scene,
        "agent run",
        Vec3::new(-1.35, 0.0, 0.1),
        2.28,
        palette.kavriq,
    );
    ids.extend(center.iter().copied());

    let nodes = [
        NodeSpec {
            text: "prompt",
            pos: Vec3::new(-4.5, 1.75, 0.1),
            accent: palette.kavriq,
            width: 1.45,
        },
        NodeSpec {
            text: "context",
            pos: Vec3::new(-1.35, 2.35, 0.1),
            accent: palette.learning,
            width: 1.55,
        },
        NodeSpec {
            text: "tool call",
            pos: Vec3::new(1.45, 1.38, 0.1),
            accent: palette.warning,
            width: 1.6,
        },
        NodeSpec {
            text: "tool result",
            pos: Vec3::new(1.75, 0.12, 0.1),
            accent: palette.warning,
            width: 1.7,
        },
        NodeSpec {
            text: "reasoning",
            pos: Vec3::new(1.32, -1.42, 0.1),
            accent: palette.learning,
            width: 1.6,
        },
        NodeSpec {
            text: "output",
            pos: Vec3::new(-1.42, -2.28, 0.1),
            accent: palette.enterprise,
            width: 1.45,
        },
        NodeSpec {
            text: "feedback",
            pos: Vec3::new(-4.08, -1.45, 0.1),
            accent: palette.governance,
            width: 1.62,
        },
    ];

    let mut arrows = Vec::new();
    let mut cards = Vec::new();
    for spec in &nodes {
        let (card_ids, target_anchor) = card_entry(&mut scene, spec);
        let from = center_anchor_for(spec.pos);
        arrows.push(arrow(
            &mut scene,
            from,
            target_anchor,
            0.028,
            rgba(spec.accent, 0.72),
        ));
        cards.push(card_ids);
    }
    ids.extend(arrows.iter().copied());
    for card_ids in &cards {
        ids.extend(card_ids.iter().copied());
    }

    hide_all(&mut scene, &ids);

    appear(&mut timeline, &[chart_panel], 0.15, 0.55);
    draw(&mut timeline, &[chart_axis_x], 0.42, 0.55);
    appear(&mut timeline, &[chart_label], 0.78, 0.4);
    draw(&mut timeline, &[center[0]], 0.72, 0.5);
    write_text(&mut timeline, &[center[1]], 1.02, 0.42);
    pulse(&mut timeline, center[0], 1.72);
    indicate_label(&mut timeline, center[1], 1.82);

    for (index, ((spec, arrow_id), card_ids)) in nodes
        .iter()
        .zip(arrows.iter())
        .zip(cards.iter())
        .enumerate()
    {
        let at = 3.0 + index as f32 * 4.0;
        pulse(&mut timeline, center[0], at - 0.35);
        indicate_label(&mut timeline, center[1], at - 0.25);
        draw(&mut timeline, &[*arrow_id], at, 0.42);
        draw(&mut timeline, &[card_ids[0]], at + 0.46, 0.42);
        write_text(&mut timeline, &[card_ids[1]], at + 0.76, 0.32);
        appear(&mut timeline, &[chart_segments[index]], at + 1.0, 0.36);
        pulse(&mut timeline, chart_segments[index], at + 1.18);
        let _ = spec;
    }

    pulse(&mut timeline, center[0], 31.8);
    indicate_label(&mut timeline, center[1], 31.92);
    pulse(&mut timeline, chart_panel, 32.4);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/ai-data-example",
        [(34.2, Some("ai_data_example_final.png"))],
        Some(("ai_data_example_loop", GIF_STOPS)),
        true,
    )
}
