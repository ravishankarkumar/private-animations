use anyhow::Result;
use glam::Vec3;
use murali::frontend::animation::Ease;
use murali::frontend::TattvaId;

use super::common::*;

const DURATION: f32 = 16.0;
const GIF_STOPS: &[f32] = &[0.8, 2.6, 4.8, 7.2, 9.6, 12.0, 14.8];

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
    let (mut scene, mut timeline, palette) = new_scene(10.7);
    let mut ids = Vec::new();

    let title = label(
        &mut scene,
        "Successful teams preplan",
        0.4,
        palette.ink,
        Vec3::new(0.0, 3.16, 0.1),
    );
    let kicker = label(
        &mut scene,
        "decide it on day one",
        0.22,
        palette.warning,
        Vec3::new(0.0, 2.42, 0.1),
    );
    ids.extend([title, kicker]);

    let pills = [
        ("what to capture", Vec3::new(-3.2, 1.15, 0.1), 2.4, palette.kavriq),
        ("retention policy", Vec3::new(0.0, 1.15, 0.1), 2.48, palette.warning),
        ("access control", Vec3::new(3.2, 1.15, 0.1), 2.15, palette.enterprise),
        ("evaluation signal", Vec3::new(-3.2, -0.35, 0.1), 2.35, palette.learning),
        ("feedback to collect", Vec3::new(0.0, -0.35, 0.1), 2.55, palette.kavriq),
        ("what not to store", Vec3::new(3.2, -0.35, 0.1), 2.35, palette.governance),
    ];

    let mut pill_groups = Vec::new();
    for (text, pos, width, accent) in pills {
        let group = card(&mut scene, text, pos, width, accent);
        ids.extend(group.iter().copied());
        pill_groups.push(group);
    }

    let closer = label(
        &mut scene,
        "capture, secure, retain, evaluate, learn",
        0.24,
        rgba(palette.ink, 0.84),
        Vec3::new(0.0, -2.35, 0.1),
    );
    ids.push(closer);

    let footer_ids = footer(&mut scene, &palette, &mut ids);
    hide_all(&mut scene, &ids);

    appear(&mut timeline, &footer_ids, 0.08, 0.45);
    write_text(&mut timeline, &[title], 0.2, 0.75);
    write_text(&mut timeline, &[kicker], 0.9, 0.42);

    let starts = [2.0f32, 3.45, 4.9, 6.35, 7.8, 9.25];
    for (index, at) in starts.iter().enumerate() {
        appear(&mut timeline, &pill_groups[index], *at, 0.26);
        pulse(&mut timeline, pill_groups[index][0], *at + 0.3);
    }

    write_text(&mut timeline, &[closer], 11.8, 0.55);
    pulse(&mut timeline, closer, 12.7);

    fade_ids(&mut timeline, &ids, 0.0, 15.2, 0.55);
    fade_ids(&mut timeline, &footer_ids, 0.0, 15.3, 0.45);

    timeline.wait_until(DURATION);
    run_scene_with_video(
        scene,
        timeline,
        DURATION,
        "rendered_output/kavriq/hidden-data-problem/successful-teams-preplan",
        [(14.9, Some("successful_teams_preplan_final.png"))],
        Some(("successful_teams_preplan_loop", GIF_STOPS)),
        true,
    )
}
