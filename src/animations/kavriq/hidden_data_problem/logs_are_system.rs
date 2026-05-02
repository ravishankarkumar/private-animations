use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;

use super::common::*;

const DURATION: f32 = 4.9;
const GIF_STOPS: &[f32] = &[0.4, 1.15, 2.0, 3.0, 4.35];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.0);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "In AI systems",
        0.34,
        palette.muted,
        Vec3::new(0.0, 2.85, 0.1),
    );
    let claim = label(
        &mut scene,
        "logs are the system",
        0.64,
        palette.warning,
        Vec3::new(0.0, 1.92, 0.1),
    );
    let rule = line(
        &mut scene,
        Vec3::new(-3.06, 1.42, 0.0),
        Vec3::new(3.06, 1.42, 0.0),
        0.055,
        rgba(palette.warning, 0.82),
    );
    ids.extend([title, claim, rule]);

    let left = large_card(
        &mut scene,
        "error log",
        Vec3::new(-3.4, -0.1, 0.1),
        1.9,
        BLUE_B,
    );
    let right = large_card(
        &mut scene,
        "system memory",
        Vec3::new(3.4, -0.1, 0.1),
        2.3,
        palette.learning,
    );
    let arrow_id = arrow(
        &mut scene,
        Vec2::new(-2.2, -0.1),
        Vec2::new(2.15, -0.1),
        0.06,
        rgba(palette.kavriq, 0.78),
    );
    ids.extend(left.iter().chain(right.iter()).copied());
    ids.push(arrow_id);

    let support = [
        ("replay", Vec3::new(-2.6, -1.78, 0.1), palette.kavriq),
        ("debug", Vec3::new(-0.85, -1.78, 0.1), BLUE_B),
        ("evaluate", Vec3::new(0.95, -1.78, 0.1), palette.learning),
        ("learn", Vec3::new(2.7, -1.78, 0.1), palette.enterprise),
    ];
    let mut support_ids = Vec::new();
    for (text, pos, accent) in support {
        support_ids.extend(card(&mut scene, text, pos, 1.5, accent));
    }
    ids.extend(support_ids.iter().copied());
    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    appear(&mut timeline, &[title], 0.1, 0.45);
    appear(&mut timeline, &[claim, rule], 0.72, 0.55);
    pulse(&mut timeline, claim, 1.35);
    appear(&mut timeline, &left, 1.95, 0.42);
    draw(&mut timeline, &[arrow_id], 2.32, 0.42);
    appear(&mut timeline, &right, 2.62, 0.42);
    for (index, chunk) in support_ids.chunks(2).enumerate() {
        appear(&mut timeline, chunk, 3.28 + index as f32 * 0.16, 0.28);
    }

    timeline.wait_until(DURATION);
    run_scene(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/logs-are-system",
        [(4.35, Some("logs_are_system_final.png"))],
        Some(("logs_are_system_loop", GIF_STOPS)),
    )
}
