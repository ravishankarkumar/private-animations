use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 15.0;
const GIF_STOPS: &[f32] = &[0.8, 3.0, 6.2, 9.6, 12.4, 14.2];

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.56)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "One run leaves behind more than a transcript",
        0.3,
        palette.ink,
        Vec3::new(0.0, 3.12, 0.1),
    );
    ids.push(title);

    let nodes = [
        ("user prompt", Vec3::new(-4.6, 0.35, 0.1), 1.85, palette.enterprise),
        ("agent", Vec3::new(-1.7, 0.35, 0.1), 1.35, palette.kavriq),
        ("tool", Vec3::new(1.0, 0.35, 0.1), 1.2, palette.governance),
        ("answer", Vec3::new(3.8, 0.35, 0.1), 1.55, palette.learning),
        ("user feedback", Vec3::new(3.8, -1.28, 0.1), 1.95, palette.warning),
    ];

    let mut groups = Vec::new();
    for (text, pos, width, accent) in nodes {
        let g = card(&mut scene, text, pos, width, accent);
        ids.extend(g.iter().copied());
        groups.push(g);
    }

    let arrows = [
        arrow(&mut scene, Vec2::new(-3.55, 0.35), Vec2::new(-2.38, 0.35), 0.044, rgba(WHITE, 0.88)),
        arrow(&mut scene, Vec2::new(-1.03, 0.35), Vec2::new(0.35, 0.35), 0.044, rgba(WHITE, 0.88)),
        arrow(&mut scene, Vec2::new(1.65, 0.35), Vec2::new(2.95, 0.35), 0.044, rgba(WHITE, 0.88)),
        arrow(&mut scene, Vec2::new(3.8, 0.0), Vec2::new(3.8, -0.76), 0.038, rgba(palette.warning, 0.76)),
    ];
    ids.extend(arrows);

    let captures = [
        ("prompt", Vec3::new(-4.6, 1.72, 0.1), 1.2, palette.kavriq),
        ("tool call", Vec3::new(1.0, 1.72, 0.1), 1.45, palette.governance),
        ("context", Vec3::new(1.0, -1.15, 0.1), 1.25, palette.learning),
        ("output", Vec3::new(3.8, 1.72, 0.1), 1.2, palette.kavriq),
        ("feedback", Vec3::new(-0.6, -2.1, 0.1), 1.45, palette.warning),
    ];
    let mut capture_groups = Vec::new();
    let mut capture_lines = Vec::new();
    for (text, pos, width, accent) in captures {
        let g = card(&mut scene, text, pos, width, accent);
        ids.extend(g.iter().copied());
        capture_groups.push(g);
    }
    capture_lines.push(line(&mut scene, Vec3::new(-4.6, 0.73, 0.0), Vec3::new(-4.6, 1.45, 0.0), 0.02, rgba(palette.kavriq, 0.62)));
    capture_lines.push(line(&mut scene, Vec3::new(1.0, 0.73, 0.0), Vec3::new(1.0, 1.45, 0.0), 0.02, rgba(palette.governance, 0.62)));
    capture_lines.push(line(&mut scene, Vec3::new(1.0, -0.02, 0.0), Vec3::new(1.0, -0.86, 0.0), 0.02, rgba(palette.learning, 0.62)));
    capture_lines.push(line(&mut scene, Vec3::new(3.8, 0.73, 0.0), Vec3::new(3.8, 1.45, 0.0), 0.02, rgba(palette.kavriq, 0.62)));
    capture_lines.push(line(&mut scene, Vec3::new(3.0, -1.28, 0.0), Vec3::new(0.22, -2.1, 0.0), 0.02, rgba(palette.warning, 0.62)));
    ids.extend(capture_lines.iter().copied());

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    appear(&mut timeline, &[title], 0.12, 0.34);
    for (i, g) in groups.iter().enumerate() {
        appear(&mut timeline, g, 0.7 + i as f32 * 0.45, 0.24);
    }
    for (i, a) in arrows.iter().enumerate() {
        draw(&mut timeline, &[*a], 1.0 + i as f32 * 0.45, 0.22);
    }
    for (i, g) in capture_groups.iter().enumerate() {
        draw(&mut timeline, &[capture_lines[i]], 4.0 + i as f32 * 0.48, 0.18);
        appear(&mut timeline, g, 4.14 + i as f32 * 0.48, 0.22);
    }

    let beats = [groups[0][1], groups[1][1], capture_groups[0][1], groups[2][1], capture_groups[1][1], capture_groups[2][1], groups[3][1], capture_groups[3][1], groups[4][1], capture_groups[4][1]];
    for (i, id) in beats.iter().enumerate() {
        indicate_id(&mut timeline, *id, 7.0 + i as f32 * 0.48);
    }

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/single-run-capture",
        [(14.1, Some("single_run_capture_final.png"))],
        Some(("single_run_capture_loop", GIF_STOPS)),
        true
    )
}
