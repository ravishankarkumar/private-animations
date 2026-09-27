use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 18.0;
const GIF_STOPS: &[f32] = &[0.8, 2.8, 5.2, 7.8, 10.6, 13.4, 16.8];

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

fn left_align_label(scene: &mut murali::engine::scene::Scene, id: TattvaId, left_x: f32, y: f32) {
    if let Some(bounds) = scene.local_bounds(id) {
        let half_width = bounds.size().x * 0.5;
        scene.set_position_2d(id, Vec2::new(left_x + half_width, y));
    }
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.6);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "People are building AI systems incorrectly",
        0.34,
        palette.ink,
        Vec3::new(0.0, 3.08, 0.1),
    );
    ids.push(title);

    let bullet_y = [1.85f32, 1.0, 0.15, -0.7, -1.55];
    let bullet_text = [
        "Treating this as a technical shift instead of a design shift",
        "Adding observability only after things break",
        "Underestimating how much data AI systems generate",
        "Discovering retention needs after the data is already gone",
        "Trying to evaluate systems they never instrumented",
    ];

    let mut bullet_markers = Vec::new();
    let mut bullet_labels = Vec::new();

    let marker_x = -5.2f32;
    let text_left_x = -4.78f32;

    for (index, text) in bullet_text.iter().enumerate() {
        let marker = label(
            &mut scene,
            "•",
            0.34,
            palette.kavriq,
            Vec3::new(marker_x, bullet_y[index], 0.1),
        );
        let line = label(
            &mut scene,
            text,
            0.24,
            palette.ink,
            Vec3::new(0.0, bullet_y[index], 0.1),
        );
        left_align_label(&mut scene, line, text_left_x, bullet_y[index]);
        ids.extend([marker, line]);
        bullet_markers.push(marker);
        bullet_labels.push(line);
    }

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    write_text(&mut timeline, &[title], 0.2, 0.72);

    let starts = [2.1f32, 4.7, 7.3, 9.9, 12.5];
    for (index, at) in starts.iter().enumerate() {
        appear(&mut timeline, &[bullet_markers[index]], *at, 0.18);
        write_text(&mut timeline, &[bullet_labels[index]], *at + 0.12, 0.7);
    }

    fade_ids(&mut timeline, &ids, 0.0, 17.15, 0.55);
    fade_ids(&mut timeline, &footer_ids, 0.0, 17.25, 0.45);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/design-shift-bullets",
        [(16.9, Some("design_shift_bullets_final.png"))],
        Some(("design_shift_bullets_loop", GIF_STOPS)),
        true,
    )
}
