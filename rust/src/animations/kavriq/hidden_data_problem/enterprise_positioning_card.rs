use anyhow::Result;
use glam::Vec3;
use murali::colors::*;
use murali::frontend::TattvaId;
use murali::frontend::animation::Ease;
use super::common::*;

const DURATION: f32 = 70.0;
const GIF_STOPS: &[f32] = &[1.0, 8.0, 20.0, 33.0, 46.0, 58.0, 68.0];

fn unwrite_at(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32, duration: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(duration)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(10.8);
    let mut ids = Vec::new();

    let eyebrow = label(
        &mut scene,
        "Production AI Reality",
        0.34,
        palette.ink,
        Vec3::new(0.0, 2.05, 0.1),
    );
    ids.push(eyebrow);

    let lines = [
        label(
            &mut scene,
            "Startups usually move faster than enterprises.",
            0.34,
            palette.ink,
            Vec3::new(0.0, 0.75, 0.1),
        ),
        label(
            &mut scene,
            "In production AI, enterprises are moving faster than people think.",
            0.34,
            palette.ink,
            Vec3::new(0.0, 0.75, 0.1),
        ),
        label(
            &mut scene,
            "They already have what AI suddenly needs:",
            0.34,
            palette.ink,
            Vec3::new(0.0, 0.95, 0.1),
        ),
        label(
            &mut scene,
            "data warehouses, observability, retention, compliance, access control",
            0.25,
            rgba(WHITE, 0.78),
            Vec3::new(0.0, 0.12, 0.1),
        ),
        label(
            &mut scene,
            "Without that foundation, scaling breaks in ways that are hard to debug.",
            0.34,
            palette.warning,
            Vec3::new(0.0, 0.75, 0.1),
        ),
        label(
            &mut scene,
            "At ten thousand agent runs a day, observability becomes a line item.",
            0.34,
            palette.warning,
            Vec3::new(0.0, 0.75, 0.1),
        ),
    ];
    ids.extend(lines);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    write_text(&mut timeline, &[eyebrow], 0.45, 0.35);

    let timings = [
        (1.2f32, 10.8f32),
        (12.5f32, 24.0f32),
        (25.8f32, 35.0f32),
        (29.2f32, 39.0f32),
        (41.2f32, 53.4f32),
        (55.4f32, 67.6f32),
    ];

    for (line, (write_at, unwrite_at_time)) in lines.iter().zip(timings.iter()) {
        write_text(&mut timeline, &[*line], *write_at, 0.95);
        unwrite_at(&mut timeline, *line, *unwrite_at_time, 0.65);
    }

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/enterprise-positioning-card",
        [(69.0, Some("enterprise_positioning_card_final.png"))],
        Some(("enterprise_positioning_card_loop", GIF_STOPS)),
        true
    )
}
