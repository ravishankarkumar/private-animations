use anyhow::Result;
use glam::{Quat, Vec2, Vec3, Vec4};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 24.0;
const GIF_STOPS: &[f32] = &[0.8, 3.0, 6.2, 9.8, 13.2, 17.2, 20.8, 23.2];

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

fn add_domino(
    scene: &mut murali::engine::scene::Scene,
    text: &str,
    pos: Vec3,
    width: f32,
    height: f32,
    accent: Vec4,
) -> Vec<TattvaId> {
    murali::frontend::collection::composite::Card::new(text, width, height)
        .with_radius(0.08)
        .with_fill(rgba(accent, 0.16))
        .with_stroke(0.026, rgba(accent, 0.84))
        .with_text_style(0.17, rgba(WHITE, 0.94))
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

fn move_ids(
    timeline: &mut murali::engine::timeline::Timeline,
    ids: &[TattvaId],
    to: Vec3,
    at: f32,
    duration: f32,
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

fn rotate_ids(
    timeline: &mut murali::engine::timeline::Timeline,
    ids: &[TattvaId],
    to: Quat,
    at: f32,
    duration: f32,
) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::InOutCubic)
            .rotate_to(to)
            .spawn();
    }
}

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.55)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.9);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "A small change can create a very large systems burden",
        0.28,
        palette.ink,
        Vec3::new(0.0, 3.1, 0.1),
    );
    ids.push(title);

    let prompt = add_box(
        &mut scene,
        "same prompt",
        Vec3::new(-4.55, 0.95, 0.1),
        1.95,
        0.56,
        palette.enterprise,
    );
    let model = add_box(
        &mut scene,
        "model",
        Vec3::new(-2.1, 0.95, 0.1),
        1.4,
        0.62,
        palette.kavriq,
    );
    let response_a = add_box(
        &mut scene,
        "shorter reply",
        Vec3::new(0.5, 1.52, 0.1),
        1.9,
        0.5,
        palette.kavriq,
    );
    let response_b = add_box(
        &mut scene,
        "broader reply",
        Vec3::new(0.5, 0.38, 0.1),
        1.95,
        0.5,
        palette.governance,
    );
    ids.extend(
        prompt
            .iter()
            .chain(model.iter())
            .chain(response_a.iter())
            .chain(response_b.iter())
            .copied(),
    );

    let left_arrow = arrow(
        &mut scene,
        Vec2::new(-3.55, 0.95),
        Vec2::new(-2.8, 0.95),
        0.044,
        rgba(WHITE, 0.88),
    );
    let top_arrow = arrow(
        &mut scene,
        Vec2::new(-1.35, 1.05),
        Vec2::new(-0.42, 1.38),
        0.038,
        rgba(palette.kavriq, 0.78),
    );
    let bottom_arrow = arrow(
        &mut scene,
        Vec2::new(-1.35, 0.85),
        Vec2::new(-0.42, 0.56),
        0.038,
        rgba(palette.governance, 0.8),
    );
    ids.extend([left_arrow, top_arrow, bottom_arrow]);

    let tiny_change = label(
        &mut scene,
        "tiny output difference",
        0.22,
        palette.warning,
        Vec3::new(0.34, -0.34, 0.1),
    );
    ids.push(tiny_change);

    let variance_signal = circle(
        &mut scene,
        0.11,
        Vec3::new(-4.55, 0.95, 0.24),
        rgba(palette.warning, 0.96),
        rgba(WHITE, 0.9),
    );
    ids.push(variance_signal);

    let domino_specs = [
        ("replay", Vec3::new(-0.4, -1.55, 0.1), 1.45, 0.78, BLUE_B),
        ("evaluation", Vec3::new(1.08, -1.55, 0.1), 1.82, 0.78, palette.learning),
        ("storage", Vec3::new(2.8, -1.55, 0.1), 1.55, 0.78, palette.enterprise),
        ("observability", Vec3::new(4.72, -1.55, 0.1), 2.05, 0.78, palette.kavriq),
        ("governance", Vec3::new(6.86, -1.55, 0.1), 1.92, 0.78, palette.governance),
        ("cost", Vec3::new(9.0, -1.55, 0.1), 1.55, 0.92, palette.warning),
    ];

    let mut dominoes: Vec<(Vec<TattvaId>, Vec3)> = Vec::new();
    for (text, pos, width, height, accent) in domino_specs {
        let ids_chunk = add_domino(&mut scene, text, pos, width, height, accent);
        ids.extend(ids_chunk.iter().copied());
        dominoes.push((ids_chunk, pos));
    }

    let note_one = label(
        &mut scene,
        "not necessarily bad",
        0.22,
        rgba(WHITE, 0.82),
        Vec3::new(-1.5, 2.2, 0.1),
    );
    let note_two = label(
        &mut scene,
        "could be a feature",
        0.22,
        palette.muted,
        Vec3::new(1.3, 2.2, 0.1),
    );
    ids.extend([note_one, note_two]);

    let concern = label(
        &mut scene,
        "What matters here: we have to log a lot more data",
        0.28,
        palette.warning,
        Vec3::new(0.0, -3.05, 0.1),
    );
    ids.push(concern);

    let log_stack = [
        ("prompt", Vec3::new(-2.5, -2.35, 0.1), palette.kavriq),
        ("output", Vec3::new(-0.9, -2.35, 0.1), palette.learning),
        ("tool calls", Vec3::new(0.9, -2.35, 0.1), palette.governance),
        ("trace", Vec3::new(2.55, -2.35, 0.1), palette.warning),
    ];
    let mut stack_ids = Vec::new();
    for (text, pos, accent) in log_stack {
        stack_ids.extend(card(&mut scene, text, pos, 1.5, accent));
    }
    ids.extend(stack_ids.iter().copied());

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    appear(&mut timeline, &[title], 0.18, 0.38);
    appear(&mut timeline, &prompt, 0.6, 0.28);
    appear(&mut timeline, &model, 0.82, 0.26);
    draw(&mut timeline, &[left_arrow], 1.0, 0.24);
    draw(&mut timeline, &[top_arrow, bottom_arrow], 1.3, 0.26);
    appear(&mut timeline, &response_a, 1.58, 0.24);
    appear(&mut timeline, &response_b, 1.84, 0.24);
    write_text(&mut timeline, &[tiny_change], 2.25, 0.36);

    appear(&mut timeline, &dominoes[0].0, 3.6, 0.28);
    for (index, (domino, _)) in dominoes.iter().enumerate().skip(1) {
        appear(&mut timeline, domino, 3.78 + index as f32 * 0.2, 0.24);
    }

    appear(&mut timeline, &[variance_signal], 4.7, 0.14);
    move_ids(
        &mut timeline,
        &[variance_signal],
        Vec3::new(-2.1, 0.95, 0.24),
        4.84,
        0.45,
    );
    move_ids(
        &mut timeline,
        &[variance_signal],
        Vec3::new(0.42, 0.38, 0.24),
        5.3,
        0.45,
    );
    move_ids(
        &mut timeline,
        &[variance_signal],
        Vec3::new(-0.9, -1.2, 0.24),
        5.86,
        0.4,
    );
    fade_ids(&mut timeline, &[variance_signal], 0.0, 6.18, 0.18);

    let fallen_rotation = Quat::from_axis_angle(Vec3::Z, -1.18);
    let domino_times = [6.25f32, 7.55, 8.85, 10.15, 11.45, 12.85];
    let highlight_times = [6.0f32, 7.3, 8.6, 9.9, 11.2, 12.55];

    for (((domino_ids, pos), fall_at), highlight_at) in dominoes
        .iter()
        .zip(domino_times.iter())
        .zip(highlight_times.iter())
    {
        indicate_id(&mut timeline, domino_ids[1], *highlight_at);
        rotate_ids(&mut timeline, domino_ids, fallen_rotation, *fall_at, 0.42);
        move_ids(
            &mut timeline,
            domino_ids,
            Vec3::new(pos.x + 0.34, pos.y - 0.42, pos.z),
            *fall_at,
            0.42,
        );
    }

    let all_domino_ids: Vec<TattvaId> = dominoes
        .iter()
        .flat_map(|(ids, _)| ids.iter().copied())
        .collect();
    fade_ids(&mut timeline, &all_domino_ids, 0.0, 16.7, 0.45);

    appear(&mut timeline, &[note_one, note_two], 14.35, 0.34);
    indicate_id(&mut timeline, note_one, 15.05);
    indicate_id(&mut timeline, note_two, 15.45);
    fade_ids(&mut timeline, &[note_one, note_two], 0.0, 16.6, 0.55);

    write_text(&mut timeline, &[concern], 18.0, 0.55);
    for (index, chunk) in stack_ids.chunks(2).enumerate() {
        appear(&mut timeline, chunk, 18.7 + index as f32 * 0.24, 0.24);
    }
    indicate_id(&mut timeline, concern, 20.1);

    fade_ids(&mut timeline, &ids, 0.0, 23.0, 0.7);
    fade_ids(&mut timeline, &footer_ids, 0.0, 23.2, 0.5);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/domino-chain",
        [(23.1, Some("domino_chain_final.png"))],
        Some(("domino_chain_loop", GIF_STOPS)),
        true,
    )
}
