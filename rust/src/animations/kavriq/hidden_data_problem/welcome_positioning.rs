use anyhow::Result;
use glam::{Vec3, Vec4};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::collection::text::label::Label;
use murali::register_font_path;
use std::path::PathBuf;

use super::common::*;

const DURATION: f32 = 30.0;
const GIF_STOPS: &[f32] = &[1.0, 4.2, 8.8, 13.2, 18.6, 23.8, 28.8];
const LANE_Y: f32 = -0.22;
const CONVEYOR_START: f32 = 3.08;
const CONVEYOR_VELOCITY: f32 = 2.0;
const CONVEYOR_EXIT_X: f32 = 10.2;

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

fn move_ids(
    timeline: &mut murali::engine::timeline::Timeline,
    ids: &[murali::frontend::TattvaId],
    to: Vec3,
    at: f32,
    duration: f32,
) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::Linear)
            .move_to(to)
            .spawn();
    }
}

pub fn run() -> Result<()> {
    register_font_path("Satoshi", satoshi_bold_path())?;

    let (mut scene, mut timeline, palette) = new_scene(10.9);
    let mut ids = Vec::new();

    let kavriq = scene.add_tattva(
        Label::new("KAVRIQ", 0.92)
            .with_font("Satoshi")
            .with_color(WHITE),
        Vec3::new(0.0, 1.25, 0.1),
    );
    ids.push(kavriq);

    let terms = [
        ("traces", palette.kavriq, 1.42f32, -7.70f32),
        ("throughput", BLUE_B, 1.82, -9.48),
        ("memory", palette.learning, 1.52, -11.42),
        ("agents", palette.warning, 1.46, -13.06),
        ("evals", palette.enterprise, 1.34, -14.64),
        ("risk", palette.governance, 1.5, -16.34),
        ("infrastructure", palette.kavriq, 2.5, -18.92),
        ("system design", BLUE_B, 2.18, -21.68),
        ("evaluation", palette.learning, 1.86, -24.10),
        ("governance", palette.warning, 1.98, -26.58),
        ("memory", palette.enterprise, 1.52, -28.72),
        ("agents", palette.governance, 1.46, -30.36),
        ("tooling", palette.kavriq, 1.5, -32.04),
    ];

    let mut term_ids = Vec::new();
    for (index, (text, accent, width, x_start)) in terms.iter().enumerate() {
        let card_ids = card(
            &mut scene,
            text,
            Vec3::new(*x_start, LANE_Y, 0.1),
            *width,
            *accent,
        );
        term_ids.push((card_ids, index as f32 * 0.5, *x_start));
        ids.extend(term_ids.last().unwrap().0.iter().copied());
    }

    let title = scene.add_tattva(
        Label::new("Data Management in Agentic AI", 0.46).with_color(alpha(WHITE, 0.96)),
        Vec3::new(0.0, -0.05, 0.1),
    );
    ids.push(title);

    hide_all(&mut scene, &ids);

    timeline
        .animate(kavriq)
        .at(0.55)
        .for_duration(2.15)
        .ease(Ease::OutCubic)
        .typewrite_text()
        .spawn();

    for (card_ids, start_offset, x_start) in &term_ids {
        let start_at = 2.8 + *start_offset;
        draw(&mut timeline, &[card_ids[0]], start_at, 0.28);
        write_text(&mut timeline, &[card_ids[1]], start_at + 0.2, 0.26);
        let distance = CONVEYOR_EXIT_X - *x_start;
        let duration = distance / CONVEYOR_VELOCITY;
        move_ids(
            &mut timeline,
            card_ids,
            Vec3::new(CONVEYOR_EXIT_X, LANE_Y, 0.1),
            CONVEYOR_START,
            duration,
        );
    }

    timeline
        .animate(kavriq)
        .at(19.0)
        .for_duration(0.55)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();

    timeline
        .animate(title)
        .at(20.0)
        .for_duration(2.7)
        .ease(Ease::OutCubic)
        .typewrite_text()
        .spawn();

    timeline
        .animate(title)
        .at(29.45)
        .for_duration(0.3)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/welcome-positioning",
        [(28.9, Some("welcome_positioning_final.png"))],
        Some(("welcome_positioning_loop", GIF_STOPS)),
        true,
    )
}
