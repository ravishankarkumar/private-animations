use anyhow::Result;
use glam::Vec3;
use murali::colors::*;

use super::common::*;

const DURATION: f32 = 6.0;
const GIF_STOPS: &[f32] = &[0.5, 1.3, 2.1, 2.9, 3.7, 4.6, 5.4];

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.7);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "These are architectural decisions",
        0.42,
        palette.ink,
        Vec3::new(0.0, 3.28, 0.1),
    );
    let subtitle = label(
        &mut scene,
        "make them early",
        0.24,
        palette.warning,
        Vec3::new(0.0, 2.82, 0.1),
    );
    ids.extend([title, subtitle]);

    let platform = panel(
        &mut scene,
        Vec3::new(0.0, -0.12, 0.0),
        8.5,
        4.4,
        palette.kavriq,
    );
    ids.push(platform);

    let decisions = [
        ("capture", Vec3::new(-2.85, 1.45, 0.1), palette.kavriq),
        (
            "do not capture",
            Vec3::new(0.0, 1.45, 0.1),
            palette.governance,
        ),
        ("retention", Vec3::new(2.85, 1.45, 0.1), palette.warning),
        ("access control", Vec3::new(-2.85, -0.06, 0.1), BLUE_B),
        (
            "evaluation feed",
            Vec3::new(0.0, -0.06, 0.1),
            palette.learning,
        ),
        ("privacy boundary", Vec3::new(2.85, -0.06, 0.1), RED_B),
    ];

    let mut decision_ids = Vec::new();
    for (text, pos, accent) in decisions {
        decision_ids.extend(large_card(&mut scene, text, pos, 2.25, accent));
    }
    ids.extend(decision_ids.iter().copied());

    let foundation = label(
        &mut scene,
        "the foundation your AI system runs on",
        0.27,
        rgba(WHITE, 0.8),
        Vec3::new(0.0, -2.12, 0.1),
    );
    let final_line = label(
        &mut scene,
        "capture, structure, evaluate, govern, learn",
        0.25,
        palette.kavriq,
        Vec3::new(0.0, -3.22, 0.1),
    );
    ids.extend([foundation, final_line]);
    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    appear(&mut timeline, &[title, subtitle], 0.1, 0.55);
    appear(&mut timeline, &[platform], 0.78, 0.45);
    for (index, chunk) in decision_ids.chunks(2).enumerate() {
        appear(&mut timeline, chunk, 1.15 + index as f32 * 0.32, 0.36);
    }
    appear(&mut timeline, &[foundation], 3.6, 0.45);
    appear(&mut timeline, &[final_line], 4.55, 0.45);
    pulse(&mut timeline, final_line, 5.05);

    timeline.wait_until(DURATION);
    run_scene(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/governance",
        [(5.45, Some("governance_final.png"))],
        Some(("governance_loop", GIF_STOPS)),
    )
}
