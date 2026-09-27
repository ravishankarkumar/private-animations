use anyhow::Result;
use glam::{Vec3, Vec4, vec2};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::circle::Circle;
use murali::frontend::collection::primitives::polygon::Polygon;
use murali::frontend::collection::text::label::Label;
use murali::frontend::TattvaId;
use murali::register_font_path;
use std::path::PathBuf;

use super::common::*;

const DURATION: f32 = 13.0;
const GIF_STOPS: &[f32] = &[0.8, 2.2, 4.6, 7.2, 10.0, 12.2];

struct FloatingGroup {
    ids: Vec<TattvaId>,
    start: Vec3,
    drift_a: Vec3,
    drift_b: Vec3,
}

fn satoshi_bold_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("Satoshi_Complete")
        .join("Fonts")
        .join("OTF")
        .join("Satoshi-Bold.otf")
}

fn alpha(color: Vec4, a: f32) -> Vec4 {
    Vec4::new(color.x, color.y, color.z, a)
}

fn heart_red() -> Vec4 {
    Vec4::new(0.96, 0.16, 0.22, 1.0)
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
            .ease(Ease::InOutQuad)
            .move_to(to)
            .spawn();
    }
}

pub fn run() -> Result<()> {
    register_font_path("Satoshi", satoshi_bold_path())?;

    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let kavriq = scene.add_tattva(
        Label::new("KAVRIQ", 0.82)
            .with_font("Satoshi")
            .with_color(WHITE),
        Vec3::new(-1.62, 0.28, 0.1),
    );
    let heart_left = scene.add_tattva(
        Circle::new(0.18, 48, heart_red()),
        Vec3::new(1.32, 0.42, 0.11),
    );
    let heart_right = scene.add_tattva(
        Circle::new(0.18, 48, heart_red()),
        Vec3::new(1.56, 0.42, 0.11),
    );
    let heart_bottom = scene.add_tattva(
        Polygon::new(
            vec![
                vec2(-0.28, 0.10),
                vec2(0.36, 0.10),
                vec2(0.04, -0.34),
            ],
            heart_red(),
        ),
        Vec3::new(1.4, 0.28, 0.11),
    );
    let ai = scene.add_tattva(
        Label::new("AI", 0.72)
            .with_font("Satoshi")
            .with_color(alpha(WHITE, 0.96)),
        Vec3::new(2.6, 0.28, 0.1),
    );
    let heart_ids = [heart_left, heart_right, heart_bottom];
    ids.extend([kavriq, heart_left, heart_right, heart_bottom, ai]);

    let pills = [
        (
            "Subscribe",
            Vec3::new(-2.4, -1.28, 0.1),
            Vec3::new(-2.18, -1.08, 0.1),
            Vec3::new(-2.64, -1.46, 0.1),
            1.82,
            palette.kavriq,
        ),
        (
            "Like",
            Vec3::new(0.0, -0.98, 0.1),
            Vec3::new(0.16, -0.78, 0.1),
            Vec3::new(-0.14, -1.16, 0.1),
            1.28,
            palette.warning,
        ),
        (
            "Share",
            Vec3::new(2.38, -1.28, 0.1),
            Vec3::new(2.6, -1.06, 0.1),
            Vec3::new(2.14, -1.48, 0.1),
            1.42,
            palette.enterprise,
        ),
    ];

    let mut floating = Vec::new();
    for (text, start, drift_a, drift_b, width, accent) in pills {
        let group = card(&mut scene, text, start, width, accent);
        ids.extend(group.iter().copied());
        floating.push(FloatingGroup {
            ids: group,
            start,
            drift_a,
            drift_b,
        });
    }

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    timeline
        .animate(kavriq)
        .at(0.45)
        .for_duration(1.2)
        .ease(Ease::OutCubic)
        .typewrite_text()
        .spawn();
    timeline
        .animate(heart_left)
        .at(1.55)
        .for_duration(0.28)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(heart_right)
        .at(1.65)
        .for_duration(0.28)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(heart_bottom)
        .at(1.78)
        .for_duration(0.32)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(ai)
        .at(2.0)
        .for_duration(0.7)
        .ease(Ease::OutCubic)
        .typewrite_text()
        .spawn();

    let starts = [3.8f32, 4.65, 5.5];
    for (index, group) in floating.iter().enumerate() {
        let at = starts[index];
        appear(&mut timeline, &group.ids, at, 0.22);
        move_ids(&mut timeline, &group.ids, group.drift_a, at + 0.35, 2.8);
        move_ids(&mut timeline, &group.ids, group.drift_b, at + 3.3, 2.8);
        move_ids(&mut timeline, &group.ids, group.start, at + 6.25, 2.2);
    }

    for &id in &heart_ids {
        pulse(&mut timeline, id, 6.25);
        pulse(&mut timeline, id, 8.55);
    }
    pulse(&mut timeline, ai, 9.2);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/subscribe-pitch",
        [(11.9, Some("subscribe_pitch_final.png"))],
        Some(("subscribe_pitch_loop", GIF_STOPS)),
        true,
    )
}
