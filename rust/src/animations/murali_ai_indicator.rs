use anyhow::Result;
use glam::Vec3;
use murali::App;
use murali::engine::export::ExportSettings;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::collection::ai::{MURALI_AI_INDICATOR_DURATION, MuraliAiIndicator};
use std::path::PathBuf;

const GIF_STOPS: &[f32] = &[0.45, 1.1, 1.85, 2.65, 3.45, 4.35, 5.15];

pub fn run() -> Result<()> {
    run_until(MURALI_AI_INDICATOR_DURATION)
}

pub fn run_until(loop_until: f32) -> Result<()> {
    let loop_until = loop_until.max(MURALI_AI_INDICATOR_DURATION);
    let mut scene = Scene::new();
    let mut timeline = Timeline::new();
    scene.camera_mut().position = Vec3::new(0.0, 0.0, 8.8);

    let indicator = MuraliAiIndicator::new().add_to_scene(&mut scene, Vec3::ZERO);
    indicator.hide_all(&mut scene);
    indicator.animate(&mut timeline, loop_until);

    timeline.wait_until(loop_until);
    scene.play(timeline);
    scene.capture_screenshots_named([(loop_until - 0.45, Some("murali_ai_indicator_final.png"))]);
    scene.capture_gif(
        "murali_ai_indicator_loop",
        GIF_STOPS.iter().copied().filter(|time| *time <= loop_until),
    );

    let settings = ExportSettings {
        duration_seconds: loop_until,
        artifact_dir: PathBuf::from("rendered_output/murali-ai-indicator"),
        video_enabled: true,
        preserve_frame_exports: false,
        ..ExportSettings::from_scene(&scene)
    };

    App::new()?
        .with_scene(scene)
        .with_export_settings(settings)
        .run_app()
}
