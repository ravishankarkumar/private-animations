use anyhow::Result;
use glam::Vec3;
use murali::colors::*;
use murali::frontend::animation::Ease;
use murali::frontend::collection::ai::MuraliAiIndicator;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 24.0;
const GIF_STOPS: &[f32] = &[0.8, 3.0, 6.2, 9.4, 12.8, 16.6, 20.4, 23.1];

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

pub fn run() -> Result<()> {
    let (mut scene, mut timeline, palette) = new_scene(11.0);
    let mut ids = Vec::new();

    let center = Vec3::new(0.0, 0.15, 0.0);
    let indicator = MuraliAiIndicator::new()
        .with_title("")
        .with_subtitle("")
        .with_lower_claim("")
        .with_built_with("")
        .add_to_scene(&mut scene, center);
    let indicator_ids = indicator.all();
    ids.extend(indicator_ids.iter().copied());

    let title = label(
        &mut scene,
        "Every run leaves behind more data than teams can ignore",
        0.28,
        palette.ink,
        Vec3::new(0.0, 3.25, 0.1),
    );
    let closing = label(
        &mut scene,
        "data management is no longer niche",
        0.34,
        palette.warning,
        Vec3::new(0.0, -3.15, 0.1),
    );
    let subclosing = label(
        &mut scene,
        "everyone is about to face this",
        0.22,
        rgba(WHITE, 0.78),
        Vec3::new(0.0, -3.62, 0.1),
    );
    ids.extend([title, closing, subclosing]);

    let artifacts = [
        ("prompt", Vec3::new(-4.85, 2.2, 0.1), 1.35, palette.kavriq, 2.2f32),
        ("model output", Vec3::new(-3.1, 2.5, 0.1), 1.95, palette.learning, 2.85),
        ("tool call", Vec3::new(-1.05, 2.28, 0.1), 1.6, palette.governance, 3.5),
        ("tool output", Vec3::new(1.0, 2.58, 0.1), 1.78, palette.warning, 4.15),
        ("trace", Vec3::new(3.08, 2.22, 0.1), 1.25, palette.kavriq, 4.8),
        ("retention", Vec3::new(4.88, 2.5, 0.1), 1.72, palette.enterprise, 5.45),
        ("evaluation", Vec3::new(-5.15, 0.95, 0.1), 1.82, palette.learning, 6.1),
        ("access", Vec3::new(-3.48, 1.0, 0.1), 1.25, palette.warning, 6.75),
        ("storage", Vec3::new(-1.42, 1.15, 0.1), 1.46, palette.enterprise, 7.4),
        ("metadata", Vec3::new(0.55, 1.0, 0.1), 1.62, BLUE_B, 8.05),
        ("replay", Vec3::new(2.45, 0.95, 0.1), 1.35, palette.kavriq, 8.7),
        ("audit", Vec3::new(4.48, 1.05, 0.1), 1.2, palette.governance, 9.35),
        ("prompt", Vec3::new(-4.8, -0.58, 0.1), 1.35, palette.kavriq, 10.1),
        ("tool call", Vec3::new(-2.9, -0.78, 0.1), 1.6, palette.governance, 10.75),
        ("tool output", Vec3::new(-0.95, -0.58, 0.1), 1.78, palette.warning, 11.4),
        ("output", Vec3::new(1.08, -0.82, 0.1), 1.4, palette.learning, 12.05),
        ("feedback", Vec3::new(3.08, -0.58, 0.1), 1.58, palette.enterprise, 12.7),
        ("eval score", Vec3::new(5.0, -0.78, 0.1), 1.72, palette.governance, 13.35),
        ("trace", Vec3::new(-4.65, -2.0, 0.1), 1.25, palette.kavriq, 14.2),
        ("search", Vec3::new(-2.8, -2.25, 0.1), 1.38, BLUE_B, 14.85),
        ("retention", Vec3::new(-0.95, -2.0, 0.1), 1.72, palette.enterprise, 15.5),
        ("access", Vec3::new(1.05, -2.28, 0.1), 1.25, palette.warning, 16.15),
        ("storage", Vec3::new(2.95, -2.05, 0.1), 1.46, palette.enterprise, 16.8),
        ("evaluation", Vec3::new(4.92, -2.25, 0.1), 1.82, palette.learning, 17.45),
    ];

    let mut artifact_ids: Vec<Vec<TattvaId>> = Vec::new();
    for (text, pos, width, accent, _) in artifacts {
        let group = card(&mut scene, text, pos, width, accent);
        ids.extend(group.iter().copied());
        artifact_ids.push(group);
    }

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    // Only keep the center indicator visible; its own title/subtitle/claims stay empty.
    for &id in &indicator_ids {
        scene.hide_tattva(id);
    }

    appear(&mut timeline, &footer_ids, 0.1, 0.5);
    appear(&mut timeline, &[title], 0.15, 0.35);
    appear(
        &mut timeline,
        &[
            indicator.outer,
            indicator.mid,
            indicator.inner,
            indicator.core_glow,
            indicator.core,
            indicator.core_label,
            indicator.signal,
        ],
        0.45,
        0.35,
    );
    appear(&mut timeline, &indicator.spokes, 0.7, 0.3);
    appear(&mut timeline, &indicator.nodes, 0.86, 0.3);
    indicator.loop_active(&mut timeline, DURATION - 0.8);

    for ((_, pos, _, _, at), group) in artifacts.iter().zip(artifact_ids.iter()) {
        appear(&mut timeline, group, *at, 0.18);
        for &id in group {
            timeline
                .animate(id)
                .at(*at)
                .for_duration(0.58)
                .ease(Ease::OutCubic)
                .move_to(*pos)
                .from_vec3(center + Vec3::new(0.0, 0.25, 0.12))
                .spawn();
        }
    }

    fade_ids(
        &mut timeline,
        &[
            indicator.outer,
            indicator.mid,
            indicator.inner,
            indicator.core_glow,
            indicator.core,
            indicator.core_label,
            indicator.signal,
        ],
        0.18,
        18.8,
        1.0,
    );
    fade_ids(&mut timeline, &indicator.spokes, 0.12, 18.8, 1.0);
    fade_ids(&mut timeline, &indicator.nodes, 0.25, 18.8, 1.0);

    write_text(&mut timeline, &[closing], 20.0, 0.55);
    write_text(&mut timeline, &[subclosing], 20.65, 0.45);

    fade_ids(&mut timeline, &ids, 0.0, 23.0, 0.7);
    fade_ids(&mut timeline, &footer_ids, 0.0, 23.15, 0.5);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/data-management-surface",
        [(23.1, Some("data_management_surface_final.png"))],
        Some(("data_management_surface_loop", GIF_STOPS)),
        true
    )
}
