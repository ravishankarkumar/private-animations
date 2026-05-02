use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;

use super::common::*;

const DURATION: f32 = 5.4;
const GIF_STOPS: &[f32] = &[0.45, 1.2, 2.0, 2.8, 3.6, 4.7];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.2);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "Every interaction becomes a loop",
        0.42,
        palette.ink,
        Vec3::new(0.0, 3.06, 0.1),
    );
    ids.push(title);

    let run = large_card(
        &mut scene,
        "AI interaction",
        Vec3::new(-4.25, 0.65, 0.1),
        2.35,
        palette.kavriq,
    );
    let debug = large_card(
        &mut scene,
        "debug trace",
        Vec3::new(-1.45, 0.65, 0.1),
        2.0,
        BLUE_B,
    );
    let eval = large_card(
        &mut scene,
        "evaluation",
        Vec3::new(1.25, 0.65, 0.1),
        2.0,
        palette.learning,
    );
    let train = large_card(
        &mut scene,
        "training data",
        Vec3::new(4.15, 0.65, 0.1),
        2.35,
        palette.enterprise,
    );
    ids.extend(
        run.iter()
            .chain(debug.iter())
            .chain(eval.iter())
            .chain(train.iter())
            .copied(),
    );

    let arrows = [
        arrow(
            &mut scene,
            Vec2::new(-3.02, 0.65),
            Vec2::new(-2.48, 0.65),
            0.05,
            rgba(palette.kavriq, 0.75),
        ),
        arrow(
            &mut scene,
            Vec2::new(-0.38, 0.65),
            Vec2::new(0.18, 0.65),
            0.05,
            rgba(palette.learning, 0.75),
        ),
        arrow(
            &mut scene,
            Vec2::new(2.33, 0.65),
            Vec2::new(2.95, 0.65),
            0.05,
            rgba(palette.enterprise, 0.75),
        ),
    ];
    ids.extend(arrows);

    let feedback = line(
        &mut scene,
        Vec3::new(4.15, -0.28, 0.0),
        Vec3::new(-4.25, -0.28, 0.0),
        0.04,
        rgba(palette.warning, 0.72),
    );
    let feedback_label = label(
        &mut scene,
        "better feedback -> better evaluation -> better tuning",
        0.22,
        palette.warning,
        Vec3::new(0.0, -1.0, 0.1),
    );
    let compound = label(
        &mut scene,
        "it compounds",
        0.36,
        palette.ink,
        Vec3::new(0.0, -2.42, 0.1),
    );
    ids.extend([feedback, feedback_label, compound]);
    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    appear(&mut timeline, &[title], 0.1, 0.5);
    appear(&mut timeline, &run, 0.78, 0.42);
    draw(&mut timeline, &[arrows[0]], 1.12, 0.28);
    appear(&mut timeline, &debug, 1.32, 0.42);
    draw(&mut timeline, &[arrows[1]], 1.78, 0.28);
    appear(&mut timeline, &eval, 1.98, 0.42);
    draw(&mut timeline, &[arrows[2]], 2.44, 0.28);
    appear(&mut timeline, &train, 2.64, 0.42);
    draw(&mut timeline, &[feedback], 3.28, 0.5);
    appear(&mut timeline, &[feedback_label], 3.62, 0.45);
    appear(&mut timeline, &[compound], 4.35, 0.42);
    pulse(&mut timeline, compound, 4.75);

    timeline.wait_until(DURATION);
    run_scene(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/feedback-loop",
        [(4.85, Some("feedback_loop_final.png"))],
        Some(("feedback_loop", GIF_STOPS)),
    )
}
