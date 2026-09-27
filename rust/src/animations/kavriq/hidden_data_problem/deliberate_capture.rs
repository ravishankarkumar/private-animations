use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 12.0;
const GIF_STOPS: &[f32] = &[0.8, 2.8, 5.0, 7.6, 10.0, 11.2];

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline.animate(id).at(at).for_duration(0.56).ease(Ease::InOutQuad).indicate().spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.6);
    let mut ids = Vec::new();
    let title = label(&mut scene, "None of this exists unless you deliberately capture it", 0.3, palette.ink, Vec3::new(0.0, 3.0, 0.1));
    ids.push(title);

    let run = large_card(&mut scene, "run chain", Vec3::new(0.0, 0.55, 0.1), 2.15, palette.kavriq);
    ids.extend(run.iter().copied());

    let sockets = [
        ("prompt", Vec3::new(-4.4, 1.95, 0.1), 1.25, palette.kavriq),
        ("tool input", Vec3::new(-1.72, 2.05, 0.1), 1.6, palette.governance),
        ("tool output", Vec3::new(1.2, 2.0, 0.1), 1.72, palette.warning),
        ("context", Vec3::new(4.0, 1.92, 0.1), 1.25, palette.learning),
        ("intermediate", Vec3::new(-4.2, -1.18, 0.1), 1.85, BLUE_B),
        ("feedback", Vec3::new(-1.2, -1.85, 0.1), 1.4, palette.enterprise),
        ("eval signal", Vec3::new(2.0, -1.85, 0.1), 1.72, palette.governance),
        ("run id", Vec3::new(4.35, -1.18, 0.1), 1.15, palette.kavriq),
    ];
    let mut groups = Vec::new();
    let mut links = Vec::new();
    for (text, pos, width, accent) in sockets {
        let g = card(&mut scene, text, pos, width, accent);
        groups.push(g);
        ids.extend(groups.last().unwrap().iter().copied());
        links.push(line(&mut scene, Vec3::new(0.0, 0.55, 0.0), Vec3::new(pos.x * 0.78, pos.y * 0.78, 0.0), 0.018, rgba(accent, 0.58)));
    }
    ids.extend(links.iter().copied());

    let store = large_card(&mut scene, "capture infrastructure", Vec3::new(0.0, -2.75, 0.1), 3.3, palette.learning);
    let down = arrow(&mut scene, Vec2::new(0.0, -0.05), Vec2::new(0.0, -2.1), 0.05, rgba(palette.learning, 0.76));
    ids.extend(store.iter().copied());
    ids.push(down);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);
    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    appear(&mut timeline, &[title], 0.15, 0.34);
    appear(&mut timeline, &run, 0.7, 0.26);
    for i in 0..groups.len() {
        draw(&mut timeline, &[links[i]], 1.3 + i as f32 * 0.38, 0.18);
        appear(&mut timeline, &groups[i], 1.42 + i as f32 * 0.38, 0.22);
    }
    for (i, g) in groups.iter().enumerate() {
        indicate_id(&mut timeline, g[1], 4.9 + i as f32 * 0.42);
    }
    draw(&mut timeline, &[down], 8.2, 0.32);
    appear(&mut timeline, &store, 8.45, 0.28);
    indicate_id(&mut timeline, store[1], 9.2);
    indicate_id(&mut timeline, run[1], 9.75);

    timeline.wait_until(DURATION);
    run_scene_with_video(scene, timeline, DURATION, "rendered_output/kavriq/hidden-data-problem/deliberate-capture", [(11.2, Some("deliberate_capture_final.png"))], Some(("deliberate_capture_loop", GIF_STOPS)), true)
}
