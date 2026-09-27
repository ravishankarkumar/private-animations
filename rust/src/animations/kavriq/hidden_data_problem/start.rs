use anyhow::Result;
use glam::{Vec3, Vec4};
use murali::colors::*;
use murali::engine::export::ExportSettings;
use murali::frontend::animation::Ease;
use murali::frontend::collection::text::label::Label;
use murali::register_font_path;
use std::path::PathBuf;
use murali::App;
use murali::engine::timeline::Timeline;
use murali::engine::scene::Scene;

// const DURATION: f32 = 5.0;
// const GIF_STOPS: &[f32] = &[0.7, 1.4, 2.2, 3.1, 4.0, 4.7];

pub fn run() -> Result<()> {
    register_font_path("Satoshi", satoshi_bold_path())?;

    let mut scene = Scene::new();
    scene.camera_mut().position = Vec3::new(0.0, 0.0, 10.8);

    let mut kavriq_label = Label::new("KAVRIQ", 0.84)
        .with_font("Satoshi")
        .with_color(WHITE);
    // kavriq_label.char_reveal = 0.0;
    // kavriq_label.typewriter_mode = true;
    let kavriq = scene.add_tattva(kavriq_label, Vec3::new(0.0, 0.2, 0.1));

    let mut title_label = Label::new("The Hidden Data Problem in Agentic AI Systems", 0.29)
        .with_color(with_alpha(WHITE, 0.94));
    // title_label.char_reveal = 0.0;
    // title_label.typewriter_mode = true;
    let title = scene.add_tattva(title_label, Vec3::new(0.0, 0.15, 0.1));

    let mut timeline = Timeline::new();

    timeline
        .animate(kavriq)
        .at(0.20)
        .for_duration(0.8)
        .ease(Ease::OutCubic)
        .typewrite_text()
        .spawn();
    timeline
        .animate(kavriq)
        .at(2.0)
        .for_duration(0.5)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();

    timeline
        .animate(title)
        .at(2.5)
        .for_duration(0.5)
        .ease(Ease::OutCubic)
        .typewrite_text()
        .spawn();
    timeline
        .animate(title)
        .at(4.5)
        .for_duration(0.5)
        .ease(Ease::InOutQuad)
        .untypewrite_text()
        .spawn();

    scene.play(timeline);
    // scene.capture_screenshots_named([(4.55, Some("start_final.png"))]);
    // scene.capture_gif("start_loop", GIF_STOPS.iter().copied());

    // let settings = ExportSettings {
    //     duration_seconds: DURATION,
    //     artifact_dir: PathBuf::from("rendered_output/kavriq/hidden-data-problem/start"),
    //     video_enabled: true,
    //     preserve_frame_exports: false,
    //     ..ExportSettings::from_scene(&scene)
    // };

    App::new()?
        .with_scene(scene)
        // .with_export_settings(settings)
        .run_app()
}

fn satoshi_bold_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("Satoshi_Complete")
        .join("Fonts")
        .join("OTF")
        .join("Satoshi-Bold.otf")
}

fn with_alpha(color: Vec4, alpha: f32) -> Vec4 {
    Vec4::new(color.x, color.y, color.z, alpha)
}
