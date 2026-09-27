use anyhow::Result;
use glam::{Vec3, Vec4};
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::rounded_rectangle::RoundedRectangle;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 70.0;
const GIF_STOPS: &[f32] = &[1.0, 8.0, 18.0, 30.0, 42.0, 54.0, 64.0, 69.0];

fn add_box(
    scene: &mut murali::engine::scene::Scene,
    text: &str,
    pos: Vec3,
    width: f32,
    height: f32,
    accent: Vec4,
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
            .ease(Ease::InOutCubic)
            .move_to(to)
            .spawn();
    }
}

fn scale_ids(
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
            .ease(Ease::InOutCubic)
            .scale_to(to)
            .spawn();
    }
}

fn indicate_id(timeline: &mut murali::engine::timeline::Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.58)
        .ease(Ease::InOutQuad)
        .indicate()
        .spawn();
}

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.1);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "Production AI rewards infrastructure more than people expect",
        0.3,
        palette.ink,
        Vec3::new(0.0, 3.25, 0.1),
    );
    ids.push(title);

    let startup_label = label(
        &mut scene,
        "Startup",
        0.28,
        rgba(WHITE, 0.88),
        Vec3::new(-3.0, 2.52, 0.1),
    );
    let enterprise_label = label(
        &mut scene,
        "Enterprise",
        0.28,
        rgba(WHITE, 0.88),
        Vec3::new(3.0, 2.52, 0.1),
    );
    ids.extend([startup_label, enterprise_label]);

    let startup_lane = scene.add_tattva(
        RoundedRectangle::new(4.9, 5.4, 0.18, rgba(BLUE_A, 0.05))
            .with_stroke(0.028, rgba(palette.kavriq, 0.24)),
        Vec3::new(-3.0, -0.25, 0.01),
    );
    let enterprise_lane = scene.add_tattva(
        RoundedRectangle::new(4.9, 5.4, 0.18, rgba(BLUE_A, 0.05))
            .with_stroke(0.028, rgba(palette.learning, 0.24)),
        Vec3::new(3.0, -0.25, 0.01),
    );
    ids.extend([startup_lane, enterprise_lane]);

    let startup_ship = add_box(
        &mut scene,
        "ship feature",
        Vec3::new(-3.8, 1.72, 0.1),
        1.75,
        0.5,
        palette.kavriq,
    );
    let startup_iterate = add_box(
        &mut scene,
        "iterate",
        Vec3::new(-2.15, 1.15, 0.1),
        1.35,
        0.5,
        palette.warning,
    );
    let startup_launch = add_box(
        &mut scene,
        "launch",
        Vec3::new(-3.55, 0.48, 0.1),
        1.35,
        0.5,
        palette.enterprise,
    );
    ids.extend(
        startup_ship
            .iter()
            .chain(startup_iterate.iter())
            .chain(startup_launch.iter())
            .copied(),
    );

    let enterprise_surface = add_box(
        &mut scene,
        "agent platform",
        Vec3::new(3.0, 1.2, 0.1),
        2.2,
        0.66,
        palette.learning,
    );
    ids.extend(enterprise_surface.iter().copied());

    let foundation_specs = [
        ("data warehouse", Vec3::new(1.6, -0.15, 0.1), 1.95, palette.learning),
        ("observability", Vec3::new(3.0, -0.15, 0.1), 1.88, BLUE_B),
        ("retention", Vec3::new(4.4, -0.15, 0.1), 1.55, palette.enterprise),
        ("compliance", Vec3::new(2.1, -1.02, 0.1), 1.7, palette.governance),
        ("access control", Vec3::new(3.9, -1.02, 0.1), 1.9, palette.warning),
    ];
    let mut foundation_groups = Vec::new();
    for (text, pos, width, accent) in foundation_specs {
        let g = add_box(&mut scene, text, pos, width, 0.52, accent);
        ids.extend(g.iter().copied());
        foundation_groups.push(g);
    }

    let startup_fragile = add_box(
        &mut scene,
        "thin foundation",
        Vec3::new(-3.0, -1.18, 0.1),
        2.0,
        0.5,
        rgba(RED_B, 1.0),
    );
    ids.extend(startup_fragile.iter().copied());

    let startup_scale_specs = [
        ("trace", Vec3::new(-4.25, -0.15, 0.1), 1.0, palette.kavriq),
        ("tool output", Vec3::new(-2.55, -0.2, 0.1), 1.7, palette.warning),
        ("eval score", Vec3::new(-3.75, -0.92, 0.1), 1.55, palette.governance),
        ("embedding", Vec3::new(-2.05, -0.94, 0.1), 1.5, palette.learning),
        ("retrieved chunks", Vec3::new(-3.05, -1.72, 0.1), 2.05, BLUE_B),
    ];
    let enterprise_scale_specs = [
        ("trace", Vec3::new(1.7, 1.82, 0.1), 1.0, palette.kavriq),
        ("tool output", Vec3::new(3.05, 1.82, 0.1), 1.7, palette.warning),
        ("eval score", Vec3::new(4.3, 1.82, 0.1), 1.55, palette.governance),
        ("embedding", Vec3::new(2.2, 2.42, 0.1), 1.5, palette.learning),
        ("retrieved chunks", Vec3::new(4.0, 2.42, 0.1), 2.05, BLUE_B),
    ];
    let mut startup_scale = Vec::new();
    let mut enterprise_scale = Vec::new();
    for (text, pos, width, accent) in startup_scale_specs {
        let g = card(&mut scene, text, pos, width, accent);
        ids.extend(g.iter().copied());
        startup_scale.push(g);
    }
    for (text, pos, width, accent) in enterprise_scale_specs {
        let g = card(&mut scene, text, pos, width, accent);
        ids.extend(g.iter().copied());
        enterprise_scale.push(g);
    }

    let startup_break = label(
        &mut scene,
        "hard to debug",
        0.24,
        palette.governance,
        Vec3::new(-3.0, -2.5, 0.1),
    );
    ids.push(startup_break);

    let line_item_title = label(
        &mut scene,
        "observability becomes a line item",
        0.32,
        palette.warning,
        Vec3::new(0.0, -2.72, 0.1),
    );
    ids.push(line_item_title);

    let startup_meter_bar = scene.add_tattva(
        RoundedRectangle::new(0.58, 0.2, 0.08, rgba(palette.governance, 0.88))
            .with_stroke(0.0, rgba(WHITE, 0.0)),
        Vec3::new(-1.15, -2.0, 0.08),
    );
    let enterprise_meter_bar = scene.add_tattva(
        RoundedRectangle::new(0.58, 0.2, 0.08, rgba(palette.learning, 0.88))
            .with_stroke(0.0, rgba(WHITE, 0.0)),
        Vec3::new(1.15, -2.0, 0.08),
    );
    let startup_meter_frame = scene.add_tattva(
        RoundedRectangle::new(1.0, 2.2, 0.1, rgba(WHITE, 0.02))
            .with_stroke(0.025, rgba(WHITE, 0.26)),
        Vec3::new(-1.15, -1.0, 0.04),
    );
    let enterprise_meter_frame = scene.add_tattva(
        RoundedRectangle::new(1.0, 2.2, 0.1, rgba(WHITE, 0.02))
            .with_stroke(0.025, rgba(WHITE, 0.26)),
        Vec3::new(1.15, -1.0, 0.04),
    );
    let startup_meter_label = label(
        &mut scene,
        "startup cost",
        0.18,
        rgba(WHITE, 0.72),
        Vec3::new(-1.15, -2.45, 0.1),
    );
    let enterprise_meter_label = label(
        &mut scene,
        "enterprise cost",
        0.18,
        rgba(WHITE, 0.72),
        Vec3::new(1.15, -2.45, 0.1),
    );
    ids.extend([
        startup_meter_bar,
        enterprise_meter_bar,
        startup_meter_frame,
        enterprise_meter_frame,
        startup_meter_label,
        enterprise_meter_label,
    ]);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.1, 0.5);
    appear(&mut timeline, &[title, startup_label, enterprise_label], 0.12, 0.35);
    appear(&mut timeline, &[startup_lane, enterprise_lane], 0.42, 0.35);

    appear(&mut timeline, &startup_ship, 1.1, 0.24);
    appear(&mut timeline, &startup_iterate, 2.0, 0.24);
    appear(&mut timeline, &startup_launch, 2.9, 0.24);
    indicate_id(&mut timeline, startup_ship[1], 3.8);
    indicate_id(&mut timeline, startup_iterate[1], 4.3);
    indicate_id(&mut timeline, startup_launch[1], 4.8);

    appear(&mut timeline, &enterprise_surface, 5.6, 0.28);
    for (i, g) in foundation_groups.iter().enumerate() {
        appear(&mut timeline, g, 8.2 + i as f32 * 0.75, 0.24);
        indicate_id(&mut timeline, g[1], 8.55 + i as f32 * 0.75);
    }
    indicate_id(&mut timeline, enterprise_surface[1], 12.4);

    appear(&mut timeline, &startup_fragile, 14.0, 0.28);
    for (i, g) in startup_scale.iter().enumerate() {
        appear(&mut timeline, g, 15.4 + i as f32 * 0.45, 0.22);
        indicate_id(&mut timeline, g[1], 17.8 + i as f32 * 0.32);
    }
    for (i, g) in enterprise_scale.iter().enumerate() {
        appear(&mut timeline, g, 18.2 + i as f32 * 0.4, 0.2);
    }

    // Startup wobbles under scale.
    let startup_wobble_targets = [
        (Vec3::new(-4.45, -0.28, 0.1), Vec3::new(-4.1, -0.52, 0.1)),
        (Vec3::new(-2.72, -0.36, 0.1), Vec3::new(-2.28, -0.68, 0.1)),
        (Vec3::new(-3.92, -1.08, 0.1), Vec3::new(-3.48, -1.42, 0.1)),
        (Vec3::new(-2.18, -1.18, 0.1), Vec3::new(-1.72, -1.52, 0.1)),
        (Vec3::new(-3.18, -1.98, 0.1), Vec3::new(-2.72, -2.28, 0.1)),
    ];
    for (group, (first, second)) in startup_scale.iter().zip(startup_wobble_targets.iter()) {
        move_ids(&mut timeline, group, *first, 21.8, 0.4);
        move_ids(&mut timeline, group, *second, 22.25, 0.38);
    }
    indicate_id(&mut timeline, startup_fragile[1], 22.9);
    write_text(&mut timeline, &[startup_break], 23.5, 0.42);

    // Cost phase.
    appear(
        &mut timeline,
        &[
            startup_meter_frame,
            enterprise_meter_frame,
            startup_meter_label,
            enterprise_meter_label,
        ],
        30.0,
        0.3,
    );
    write_text(&mut timeline, &[line_item_title], 30.2, 0.55);

    // Move representative artifacts into meters.
    let startup_cost_targets = [
        Vec3::new(-1.15, -1.72, 0.1),
        Vec3::new(-1.15, -1.35, 0.1),
        Vec3::new(-1.15, -0.98, 0.1),
        Vec3::new(-1.15, -0.61, 0.1),
        Vec3::new(-1.15, -0.24, 0.1),
    ];
    let enterprise_cost_targets = [
        Vec3::new(1.15, -1.72, 0.1),
        Vec3::new(1.15, -1.35, 0.1),
        Vec3::new(1.15, -0.98, 0.1),
        Vec3::new(1.15, -0.61, 0.1),
        Vec3::new(1.15, -0.24, 0.1),
    ];
    for (i, g) in startup_scale.iter().enumerate() {
        move_ids(&mut timeline, g, startup_cost_targets[i], 32.0 + i as f32 * 0.32, 0.42);
        scale_ids(&mut timeline, g, Vec3::splat(0.64), 32.0 + i as f32 * 0.32, 0.42);
    }
    for (i, g) in enterprise_scale.iter().enumerate() {
        move_ids(
            &mut timeline,
            g,
            enterprise_cost_targets[i],
            33.2 + i as f32 * 0.28,
            0.42,
        );
        scale_ids(
            &mut timeline,
            g,
            Vec3::splat(0.64),
            33.2 + i as f32 * 0.28,
            0.42,
        );
    }
    scale_ids(
        &mut timeline,
        &[startup_meter_bar],
        Vec3::new(1.0, 8.5, 1.0),
        35.6,
        1.2,
    );
    scale_ids(
        &mut timeline,
        &[enterprise_meter_bar],
        Vec3::new(1.0, 6.2, 1.0),
        35.9,
        1.0,
    );
    indicate_id(&mut timeline, line_item_title, 38.0);

    fade_ids(&mut timeline, &ids, 0.0, 68.5, 1.0);
    fade_ids(&mut timeline, &footer_ids, 0.0, 68.8, 0.6);

    timeline.wait_until(DURATION);
    run_scene(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/enterprise-vs-startup",
        [(69.0, Some("enterprise_vs_startup_final.png"))],
        Some(("enterprise_vs_startup_loop", GIF_STOPS)),
    )
}
