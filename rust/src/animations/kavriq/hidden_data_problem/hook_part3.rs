use anyhow::Result;
use glam::Vec3;
use murali::colors::*;
use murali::frontend::animation::Ease;

use super::common::*;

const DURATION: f32 = 15.0;
const GIF_STOPS: &[f32] = &[1.2, 4.2, 7.4, 10.6, 13.8];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.0);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "Then add everything else the run creates",
        0.3,
        palette.ink,
        Vec3::new(0.0, 2.95, 0.1),
    );
    let subtitle = label(
        &mut scene,
        "prompt, tool calls, reasoning, output, feedback, evaluation",
        0.22,
        palette.muted,
        Vec3::new(0.0, 2.4, 0.1),
    );
    ids.extend([title, subtitle]);

    let stack_cards = [
        ("prompt", Vec3::new(-3.95, 1.1, 0.1), palette.kavriq),
        ("tool calls", Vec3::new(-1.9, 1.1, 0.1), palette.warning),
        ("reasoning", Vec3::new(0.0, 1.1, 0.1), PURPLE_B),
        ("model output", Vec3::new(2.15, 1.1, 0.1), palette.kavriq),
        ("feedback", Vec3::new(-1.45, -0.1, 0.1), palette.enterprise),
        ("evaluation score", Vec3::new(1.35, -0.1, 0.1), palette.governance),
    ];
    let mut stack_ids = Vec::new();
    for (text, pos, accent) in stack_cards {
        stack_ids.extend(card(&mut scene, text, pos, 2.0, accent));
    }
    ids.extend(stack_ids.iter().copied());

    let claim = label(
        &mut scene,
        "That is not a side effect. That's the job.",
        0.36,
        palette.warning,
        Vec3::new(0.0, -1.65, 0.1),
    );
    ids.push(claim);

    let final_line = label(
        &mut scene,
        "This changes how we build AI systems.",
        0.4,
        palette.ink,
        Vec3::new(0.0, 0.22, 0.1),
    );
    let final_sub = label(
        &mut scene,
        "Pause here and think about that if you are serious about building AI systems.",
        0.22,
        palette.muted,
        Vec3::new(0.0, -0.38, 0.1),
    );
    let final_rule = line(
        &mut scene,
        Vec3::new(-2.65, -1.12, 0.0),
        Vec3::new(2.65, -1.12, 0.0),
        0.05,
        rgba(palette.warning, 0.72),
    );
    ids.extend([final_line, final_sub, final_rule]);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    write_text(&mut timeline, &[title], 0.45, 1.4);
    write_text(&mut timeline, &[subtitle], 1.45, 1.1);
    for (index, chunk) in stack_ids.chunks(2).enumerate() {
        let at = 2.8 + index as f32 * 0.65;
        draw(&mut timeline, &[chunk[0]], at, 0.32);
        write_text(&mut timeline, &[chunk[1]], at + 0.12, 0.3);
    }
    write_text(&mut timeline, &[claim], 7.25, 1.05);
    pulse(&mut timeline, claim, 8.75);
    timeline
        .animate(claim)
        .at(10.0)
        .for_duration(0.75)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();
    write_text(&mut timeline, &[final_line], 10.95, 1.2);
    write_text(&mut timeline, &[final_sub], 12.35, 1.15);
    draw(&mut timeline, &[final_rule], 13.15, 0.45);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/hook-part-3",
        [(14.2, Some("hook_part_3_final.png"))],
        Some(("hook_part_3_loop", GIF_STOPS)),
        true,
    )
}
