use anyhow::Result;
use glam::{Vec3, Vec4};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 15.0;
const GIF_STOPS: &[f32] = &[0.8, 3.4, 6.4, 9.4, 12.8, 14.4];

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

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.5)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

fn alpha(color: Vec4, a: f32) -> Vec4 {
    Vec4::new(color.x, color.y, color.z, a)
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let input = add_box(&mut scene, "Sample Input", Vec3::new(-4.85, 0.0, 0.1), 1.95, 0.62, palette.enterprise);
    let system = add_box(&mut scene, "Code Path", Vec3::new(-0.65, 0.0, 0.1), 2.1, 0.72, BLUE_B);
    let output = add_box(&mut scene, "Output", Vec3::new(2.85, 0.0, 0.1), 1.6, 0.62, palette.kavriq);
    ids.extend(input.iter().chain(system.iter()).chain(output.iter()).copied());

    let flow_arrows = [
        arrow(
            &mut scene,
            glam::Vec2::new(-3.9, 0.0),
            glam::Vec2::new(-1.75, 0.0),
            0.048,
            rgba(WHITE, 0.88),
        ),
        arrow(
            &mut scene,
            glam::Vec2::new(0.42, 0.0),
            glam::Vec2::new(2.02, 0.0),
            0.048,
            rgba(WHITE, 0.88),
        ),
    ];
    ids.extend(flow_arrows);

    let result_one = add_box(&mut scene, "Output Y", Vec3::new(5.35, 1.65, 0.1), 1.8, 0.54, palette.kavriq);
    let result_two = add_box(&mut scene, "Output Y", Vec3::new(5.35, 0.72, 0.1), 1.8, 0.54, palette.kavriq);
    let result_three = add_box(&mut scene, "Output Y", Vec3::new(5.35, -0.21, 0.1), 1.8, 0.54, palette.kavriq);
    ids.extend(
        result_one
            .iter()
            .chain(result_two.iter())
            .chain(result_three.iter())
            .copied(),
    );

    let identical = label(
        &mut scene,
        "identical outputs",
        0.24,
        alpha(palette.learning, 0.94),
        Vec3::new(5.35, -1.55, 0.1),
    );
    let identical_line = line(
        &mut scene,
        Vec3::new(4.2, -1.18, 0.0),
        Vec3::new(6.5, -1.18, 0.0),
        0.028,
        alpha(palette.learning, 0.7),
    );
    ids.extend([identical, identical_line]);

    let signal_one = circle(
        &mut scene,
        0.11,
        Vec3::new(-4.85, 0.0, 0.22),
        alpha(palette.warning, 0.96),
        alpha(WHITE, 0.88),
    );
    let signal_two = circle(
        &mut scene,
        0.11,
        Vec3::new(-4.85, 0.0, 0.22),
        alpha(palette.warning, 0.96),
        alpha(WHITE, 0.88),
    );
    let signal_three = circle(
        &mut scene,
        0.11,
        Vec3::new(-4.85, 0.0, 0.22),
        alpha(palette.warning, 0.96),
        alpha(WHITE, 0.88),
    );
    ids.extend([signal_one, signal_two, signal_three]);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.5);
    appear(&mut timeline, &input, 0.55, 0.35);
    appear(&mut timeline, &system, 0.85, 0.35);
    appear(&mut timeline, &output, 1.15, 0.35);
    draw(&mut timeline, &flow_arrows, 1.45, 0.4);

    let passes = [
        (signal_one, 2.2f32, &result_one, 1.65f32),
        (signal_two, 5.1f32, &result_two, 0.72f32),
        (signal_three, 8.0f32, &result_three, -0.21f32),
    ];

    for (signal, start, result_ids, result_y) in passes {
        appear(&mut timeline, &[signal], start, 0.18);
        indicate_id(&mut timeline, input[1], start);
        move_ids(
            &mut timeline,
            &[signal],
            Vec3::new(-0.65, 0.0, 0.22),
            start + 0.18,
            0.58,
        );
        indicate_id(&mut timeline, system[1], start + 0.55);
        move_ids(
            &mut timeline,
            &[signal],
            Vec3::new(2.85, 0.0, 0.22),
            start + 0.84,
            0.58,
        );
        indicate_id(&mut timeline, output[1], start + 1.18);
        move_ids(
            &mut timeline,
            &[signal],
            Vec3::new(4.45, result_y, 0.22),
            start + 1.5,
            0.1,
        );
        appear(&mut timeline, result_ids, start + 1.58, 0.28);
        fade_ids(&mut timeline, &[signal], 0.0, start + 1.82, 0.22);
    }

    appear(&mut timeline, &[identical_line], 11.35, 0.28);
    write_text(&mut timeline, &[identical], 11.55, 0.42);
    indicate_id(&mut timeline, result_one[1], 12.15);
    indicate_id(&mut timeline, result_two[1], 12.4);
    indicate_id(&mut timeline, result_three[1], 12.65);
    indicate_id(&mut timeline, identical, 12.9);

    fade_ids(&mut timeline, &ids, 0.0, 13.95, 0.8);
    fade_ids(&mut timeline, &footer_ids, 0.0, 14.15, 0.6);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/walkthrough-certainty",
        [(14.2, Some("walkthrough_certainty_final.png"))],
        Some(("walkthrough_certainty_loop", GIF_STOPS)),
        true
    )
}

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
