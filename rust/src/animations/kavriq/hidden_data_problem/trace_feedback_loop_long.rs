use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 15.0;
const GIF_STOPS: &[f32] = &[0.8, 2.8, 5.2, 7.8, 10.6, 13.2, 14.2];

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline.animate(id).at(at).for_duration(0.56).ease(Ease::InOutQuad).indicate().spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.4);
    let mut ids = Vec::new();
    let title = label(&mut scene, "The same trace becomes debugging, evaluation, and training data", 0.28, palette.ink, Vec3::new(0.0, 3.08, 0.1));
    ids.push(title);

    let trace = large_card(&mut scene, "captured trace", Vec3::new(-4.35, 0.8, 0.1), 2.35, palette.kavriq);
    let debug = large_card(&mut scene, "debugging", Vec3::new(-1.5, 0.8, 0.1), 1.95, BLUE_B);
    let eval = large_card(&mut scene, "evaluation signal", Vec3::new(1.55, 0.8, 0.1), 2.5, palette.learning);
    let train = large_card(&mut scene, "fine-tuning dataset", Vec3::new(4.55, 0.8, 0.1), 2.8, palette.enterprise);
    ids.extend(trace.iter().chain(debug.iter()).chain(eval.iter()).chain(train.iter()).copied());

    let arrows = [
        arrow(&mut scene, Vec2::new(-3.12, 0.8), Vec2::new(-2.58, 0.8), 0.05, rgba(palette.kavriq, 0.75)),
        arrow(&mut scene, Vec2::new(-0.34, 0.8), Vec2::new(0.28, 0.8), 0.05, rgba(palette.learning, 0.75)),
        arrow(&mut scene, Vec2::new(2.88, 0.8), Vec2::new(3.22, 0.8), 0.05, rgba(palette.enterprise, 0.75)),
    ];
    ids.extend(arrows);

    let loop_line = line(&mut scene, Vec3::new(4.55, -0.15, 0.0), Vec3::new(-4.35, -0.15, 0.0), 0.04, rgba(palette.warning, 0.7));
    let loop_arrow = arrow(&mut scene, Vec2::new(-4.3, -0.15), Vec2::new(-4.31, 0.42), 0.04, rgba(palette.warning, 0.7));
    let final_label = label(&mut scene, "You are building a feedback loop", 0.4, palette.warning, Vec3::new(0.0, -1.18, 0.1));
    ids.extend([loop_line, loop_arrow, final_label]);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);
    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    appear(&mut timeline, &[title], 0.14, 0.34);
    appear(&mut timeline, &trace, 0.7, 0.26);
    draw(&mut timeline, &[arrows[0]], 1.08, 0.24);
    appear(&mut timeline, &debug, 1.28, 0.26);
    indicate_id(&mut timeline, debug[1], 2.0);
    draw(&mut timeline, &[arrows[1]], 2.55, 0.24);
    appear(&mut timeline, &eval, 2.76, 0.26);
    indicate_id(&mut timeline, eval[1], 3.42);
    draw(&mut timeline, &[arrows[2]], 4.1, 0.24);
    appear(&mut timeline, &train, 4.3, 0.26);
    indicate_id(&mut timeline, train[1], 4.96);
    indicate_id(&mut timeline, trace[1], 5.65);
    indicate_id(&mut timeline, debug[1], 6.1);
    indicate_id(&mut timeline, eval[1], 6.55);
    indicate_id(&mut timeline, train[1], 7.0);
    draw(&mut timeline, &[loop_line], 8.0, 0.5);
    draw(&mut timeline, &[loop_arrow], 8.38, 0.24);
    write_text(&mut timeline, &[final_label], 9.05, 0.52);
    pulse(&mut timeline, final_label, 10.0);
    indicate_id(&mut timeline, trace[1], 10.65);
    indicate_id(&mut timeline, final_label, 11.4);

    timeline.wait_until(DURATION);
    run_scene_with_video(scene, timeline, DURATION, "rendered_output/kavriq/hidden-data-problem/trace-feedback-loop-long", [(14.1, Some("trace_feedback_loop_long_final.png"))], Some(("trace_feedback_loop_long_loop", GIF_STOPS)), true)
}
