use anyhow::Result;
use glam::{Vec2, Vec3};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::rounded_rectangle::RoundedRectangle;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 60.0;
const GIF_STOPS: &[f32] = &[1.0, 6.0, 12.0, 20.0, 30.0, 40.0, 50.0, 58.5];

fn add_box(
    scene: &mut murali::engine::scene::Scene,
    text: &str,
    pos: Vec3,
    width: f32,
    height: f32,
    accent: glam::Vec4,
) -> Vec<TattvaId> {
    murali::frontend::collection::composite::Card::new(text, width, height)
        .with_radius(0.12)
        .with_fill(rgba(accent, 0.16))
        .with_stroke(0.028, rgba(accent, 0.82))
        .with_text_style(0.18, rgba(WHITE, 0.94))
        .add_to_scene(scene, pos)
        .all()
        .to_vec()
}

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

fn indicate_label(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.62)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.0);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "Traditional software systems",
        0.34,
        palette.ink,
        Vec3::new(0.0, 4.05, 0.1),
    );
    let subtitle = label(
        &mut scene,
        "",
        0.2,
        palette.muted,
        Vec3::new(0.0, 3.4, 0.1),
    );
    ids.extend([title, subtitle]);

    let service_container = scene.add_tattva(
        RoundedRectangle::new(3.75, 2.3, 0.18, rgba(BLUE_A, 0.1))
            .with_stroke(0.04, rgba(BLUE_A, 0.82)),
        Vec3::new(0.0, 0.45, 0.02),
    );
    ids.push(service_container);

    let service_1 = add_box(&mut scene, "Service 1", Vec3::new(0.0, 0.82, 0.1), 2.05, 0.52, BLUE_B);
    let service_2 = add_box(&mut scene, "Service 2", Vec3::new(0.0, 0.08, 0.1), 2.05, 0.52, BLUE_B);
    ids.extend(service_1.iter().chain(service_2.iter()).copied());

    let user_input = add_box(&mut scene, "User Input", Vec3::new(-4.9, 0.45, 0.1), 1.8, 0.58, palette.enterprise);
    let user_output = add_box(&mut scene, "User Output", Vec3::new(4.9, 0.45, 0.1), 1.9, 0.58, palette.enterprise);
    ids.extend(user_input.iter().chain(user_output.iter()).copied());

    let database = add_box(&mut scene, "Database", Vec3::new(-1.35, 2.95, 0.1), 1.75, 0.56, palette.learning);
    let cache = add_box(&mut scene, "Cache", Vec3::new(1.35, 2.95, 0.1), 1.5, 0.56, palette.learning);
    let queue = add_box(&mut scene, "Queue", Vec3::new(-1.2, -2.05, 0.1), 1.4, 0.56, palette.learning);
    let logs = add_box(
        &mut scene,
        "Logs",
        Vec3::new(1.2, -2.05, 0.1),
        1.45,
        0.56,
        palette.governance,
    );
    ids.extend(
        database
            .iter()
            .chain(cache.iter())
            .chain(queue.iter())
            .chain(logs.iter())
            .copied(),
    );

    let arrows = [
        arrow(&mut scene, Vec2::new(-4.0, 0.45), Vec2::new(-1.92, 0.45), 0.046, rgba(WHITE, 0.9)),
        arrow(&mut scene, Vec2::new(-0.72, 1.58), Vec2::new(-1.13, 2.64), 0.038, rgba(palette.kavriq, 0.9)),
        arrow(&mut scene, Vec2::new(0.72, 1.58), Vec2::new(1.13, 2.64), 0.038, rgba(palette.kavriq, 0.9)),
        arrow(&mut scene, Vec2::new(-0.38, -0.7), Vec2::new(-1.0, -1.68), 0.038, rgba(palette.kavriq, 0.9)),
        arrow(&mut scene, Vec2::new(0.38, -0.7), Vec2::new(1.0, -1.68), 0.038, rgba(palette.governance, 0.9)),
        arrow(&mut scene, Vec2::new(1.92, 0.45), Vec2::new(3.98, 0.45), 0.046, rgba(WHITE, 0.9)),
    ];
    ids.extend(arrows);

    let attributes = [
        label(&mut scene, "deterministic", 0.4, palette.ink, Vec3::new(0.0, -3.8, 0.1)),
        label(&mut scene, "idempotent", 0.4, palette.ink, Vec3::new(0.0, -3.8, 0.1)),
        label(&mut scene, "predictable", 0.4, palette.ink, Vec3::new(0.0, -3.8, 0.1)),
        label(&mut scene, "debuggable", 0.4, palette.ink, Vec3::new(0.0, -3.8, 0.1)),
        label(&mut scene, "near certainty", 0.4, palette.ink, Vec3::new(0.0, -3.8, 0.1)),
    ];
    ids.extend(attributes);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.6);
    write_text(&mut timeline, &[title], 0.2, 0.8);
    write_text(&mut timeline, &[subtitle], 0.9, 0.7);

    draw(&mut timeline, &[service_container], 1.8, 0.55);
    appear(&mut timeline, &service_1, 2.55, 0.32);
    appear(&mut timeline, &service_2, 2.72, 0.32);

    appear(&mut timeline, &user_input, 3.5, 0.36);
    appear(&mut timeline, &user_output, 3.72, 0.36);
    appear(&mut timeline, &database, 4.05, 0.34);
    appear(&mut timeline, &cache, 4.22, 0.34);
    appear(&mut timeline, &queue, 4.39, 0.34);
    appear(&mut timeline, &logs, 4.56, 0.34);

    for (index, arrow_id) in arrows.iter().enumerate() {
        draw(&mut timeline, &[*arrow_id], 4.95 + index as f32 * 0.22, 0.28);
    }

    let highlight_times = [
        (user_input[1], 7.0),
        (service_1[1], 8.6),
        (service_2[1], 10.2),
        (database[1], 11.8),
        (cache[1], 13.4),
        (queue[1], 15.0),
        (logs[1], 16.6),
        (user_output[1], 18.2),
    ];
    for (id, at) in highlight_times {
        indicate_label(&mut timeline, id, at);
    }

    let rhythmic_flow = [
        (user_input[1], 19.8f32),
        (service_container, 20.25),
        (user_output[1], 20.7),
        (user_input[1], 22.1),
        (service_container, 22.55),
        (user_output[1], 23.0),
        (user_input[1], 24.4),
        (service_container, 24.85),
        (user_output[1], 25.3),
        (user_input[1], 33.2),
        (service_container, 33.65),
        (user_output[1], 34.1),
        (user_input[1], 39.4),
        (service_container, 39.85),
        (user_output[1], 40.3),
    ];
    for (id, at) in rhythmic_flow {
        indicate_label(&mut timeline, id, at);
    }

    let attribute_starts = [20.5f32, 26.2, 31.9, 37.6, 43.3];
    for (id, start) in attributes.iter().zip(attribute_starts.iter()) {
        write_text(&mut timeline, &[*id], *start, 0.9);
        indicate_label(&mut timeline, *id, *start + 1.35);
        timeline
            .animate(*id)
            .at(*start + 4.35)
            .for_duration(0.42)
            .ease(Ease::InOutQuad)
            .untypewrite_text()
            .spawn();
    }

    for id in [
        user_input[1],
        service_1[1],
        service_2[1],
        database[1],
        cache[1],
        queue[1],
        logs[1],
        user_output[1],
    ] {
        timeline
            .animate(id)
            .at(55.0)
            .for_duration(0.4)
            .ease(Ease::InOutQuad)
            .untypewrite_text()
            .spawn();
    }

    fade_ids(&mut timeline, &ids, 0.0, 55.15, 1.25);
    fade_ids(&mut timeline, &footer_ids, 0.0, 55.35, 0.9);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/traditional-software-foundations",
        [(58.8, Some("traditional_software_foundations_final.png"))],
        Some(("traditional_software_foundations_loop", GIF_STOPS)),
        true,
    )
}
