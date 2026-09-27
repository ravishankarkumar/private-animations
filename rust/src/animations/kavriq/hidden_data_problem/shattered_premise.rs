use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 10.0;
const GIF_STOPS: &[f32] = &[0.5, 1.0, 3.6, 6.1, 8.7, 9.45];

fn add_box(
    scene: &mut murali::engine::scene::Scene,
    text: &str,
    pos: Vec3,
    width: f32,
    height: f32,
    accent: glam::Vec4,
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

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.54)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let premise = label(
        &mut scene,
        "The old premise breaks here",
        0.28,
        palette.muted,
        Vec3::new(0.0, 3.05, 0.1),
    );
    ids.push(premise);

    let prompt = add_box(
        &mut scene,
        "Prompt: Summarize X",
        Vec3::new(-4.2, 0.0, 0.1),
        3.2,
        0.62,
        palette.enterprise,
    );
    let llm = add_box(
        &mut scene,
        "LLM / Agent",
        Vec3::new(0.0, 0.0, 0.1),
        2.15,
        0.72,
        palette.kavriq,
    );
    ids.extend(prompt.iter().chain(llm.iter()).copied());

    let left_arrow = arrow(
        &mut scene,
        Vec2::new(-3.05, 0.0),
        Vec2::new(-1.28, 0.0),
        0.05,
        rgba(WHITE, 0.9),
    );
    let top_arrow = arrow(
        &mut scene,
        Vec2::new(1.18, 0.12),
        Vec2::new(3.08, 1.18),
        0.046,
        rgba(palette.kavriq, 0.78),
    );
    let bottom_arrow = arrow(
        &mut scene,
        Vec2::new(1.18, -0.12),
        Vec2::new(3.08, -1.18),
        0.046,
        rgba(palette.governance, 0.82),
    );
    ids.extend([left_arrow, top_arrow, bottom_arrow]);

    let response_one = add_box(
        &mut scene,
        "A concise summary of X.",
        Vec3::new(4.8, 1.48, 0.1),
        3.9,
        0.9,
        palette.kavriq,
    );
    let response_two = add_box(
        &mut scene,
        "A broader explanation of X.",
        Vec3::new(4.8, -1.48, 0.1),
        4.1,
        0.9,
        palette.governance,
    );
    let response_one_label = label(
        &mut scene,
        "Response 1",
        0.2,
        palette.kavriq,
        Vec3::new(4.8, 0.76, 0.1),
    );
    let response_two_label = label(
        &mut scene,
        "Response 2",
        0.2,
        palette.governance,
        Vec3::new(4.8, -2.2, 0.1),
    );
    ids.extend(response_one.iter().chain(response_two.iter()).copied());
    ids.extend([response_one_label, response_two_label]);

    let signal_one = circle(
        &mut scene,
        0.11,
        Vec3::new(-4.2, 0.0, 0.24),
        rgba(palette.warning, 0.96),
        rgba(WHITE, 0.9),
    );
    let signal_two = circle(
        &mut scene,
        0.11,
        Vec3::new(-4.2, 0.0, 0.24),
        rgba(palette.warning, 0.96),
        rgba(WHITE, 0.9),
    );
    ids.extend([signal_one, signal_two]);

    let split = label(
        &mut scene,
        "same prompt, different responses",
        0.24,
        palette.warning,
        Vec3::new(0.95, -2.7, 0.1),
    );
    ids.push(split);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.42);
    appear(&mut timeline, &[premise], 0.1, 0.28);
    appear(&mut timeline, &[split], 0.16, 0.28);
    appear(&mut timeline, &prompt, 0.24, 0.26);
    appear(&mut timeline, &llm, 0.42, 0.26);
    draw(&mut timeline, &[left_arrow], 0.62, 0.26);

    appear(&mut timeline, &[signal_one], 1.0, 0.14);
    indicate_id(&mut timeline, prompt[1], 1.0);
    move_ids(&mut timeline, &[signal_one], Vec3::new(0.0, 0.0, 0.24), 1.14, 0.52);
    indicate_id(&mut timeline, llm[1], 1.42);
    draw(&mut timeline, &[top_arrow], 1.92, 0.28);
    move_ids(&mut timeline, &[signal_one], Vec3::new(3.48, 0.9, 0.24), 2.0, 0.34);
    appear(&mut timeline, &response_one, 2.28, 0.28);
    write_text(&mut timeline, &[response_one_label], 2.34, 0.22);
    fade_ids(&mut timeline, &[signal_one], 0.0, 2.62, 0.16);

    appear(&mut timeline, &[signal_two], 4.15, 0.14);
    indicate_id(&mut timeline, prompt[1], 4.15);
    move_ids(&mut timeline, &[signal_two], Vec3::new(0.0, 0.0, 0.24), 4.29, 0.52);
    indicate_id(&mut timeline, llm[1], 4.58);
    pulse(&mut timeline, llm[0], 4.94);
    pulse(&mut timeline, llm[1], 5.02);
    draw(&mut timeline, &[bottom_arrow], 5.26, 0.28);
    move_ids(&mut timeline, &[signal_two], Vec3::new(3.48, -0.9, 0.24), 5.34, 0.34);
    appear(&mut timeline, &response_two, 5.62, 0.28);
    write_text(&mut timeline, &[response_two_label], 5.68, 0.22);
    fade_ids(&mut timeline, &[signal_two], 0.0, 5.96, 0.16);

    indicate_id(&mut timeline, response_one[1], 7.65);
    indicate_id(&mut timeline, response_two[1], 8.0);
    indicate_id(&mut timeline, split, 8.32);

    for id in [
        premise,
        prompt[1],
        llm[1],
        response_one[1],
        response_two[1],
        response_one_label,
        response_two_label,
        split,
    ] {
        timeline
            .animate(id)
            .at(9.5)
            .for_duration(0.32)
            .ease(Ease::InOutQuad)
            .untypewrite_text()
            .spawn();
    }

    fade_ids(&mut timeline, &ids, 0.0, 9.5, 0.5);
    fade_ids(&mut timeline, &footer_ids, 0.0, 9.58, 0.42);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/shattered-premise",
        [(9.35, Some("shattered_premise_final.png"))],
        Some(("shattered_premise_loop", GIF_STOPS)),
        true,
    )
}
