use anyhow::Result;
use glam::{Vec2, Vec3, Vec4};
use std::path::PathBuf;

use murali::App;
use murali::colors::*;
use murali::engine::export::ExportSettings;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::TattvaId;
use murali::frontend::animation::Ease;
use murali::frontend::collection::composite::Card;
use murali::frontend::collection::primitives::arrow::Arrow;
use murali::frontend::collection::primitives::circle::Circle;
use murali::frontend::collection::primitives::line::Line;
use murali::frontend::collection::primitives::rounded_rectangle::RoundedRectangle;
use murali::frontend::collection::text::label::Label;

pub struct Palette {
    pub ink: Vec4,
    pub muted: Vec4,
    pub panel: Vec4,
    pub kavriq: Vec4,
    pub warning: Vec4,
    pub learning: Vec4,
    pub enterprise: Vec4,
    pub governance: Vec4,
}

impl Palette {
    pub fn new() -> Self {
        Self {
            ink: rgba(WHITE, 0.94),
            muted: rgba(BLUE_A, 0.55),
            panel: Vec4::new(0.06, 0.08, 0.11, 0.58),
            kavriq: Vec4::new(0.20, 0.84, 0.96, 1.0),
            warning: GOLD_B,
            learning: TEAL_B,
            enterprise: GREEN_B,
            governance: RED_B,
        }
    }
}

pub fn rgba(color: Vec4, alpha: f32) -> Vec4 {
    Vec4::new(color.x, color.y, color.z, alpha)
}

pub fn new_scene(camera_z: f32) -> (Scene, Timeline, Palette) {
    let mut scene = Scene::new();
    scene.camera_mut().position = Vec3::new(0.0, 0.0, camera_z);
    (scene, Timeline::new(), Palette::new())
}

pub fn run_scene(
    scene: Scene,
    timeline: Timeline,
    duration: f32,
    artifact_dir: &str,
    screenshots: impl IntoIterator<Item = (f32, Option<&'static str>)>,
    gif: Option<(&str, &'static [f32])>,
) -> Result<()> {
    run_scene_with_video(
        scene,
        timeline,
        duration,
        artifact_dir,
        screenshots,
        gif,
        false,
    )
}

pub fn run_scene_with_video(
    mut scene: Scene,
    timeline: Timeline,
    duration: f32,
    artifact_dir: &str,
    screenshots: impl IntoIterator<Item = (f32, Option<&'static str>)>,
    gif: Option<(&str, &'static [f32])>,
    video_enabled: bool,
) -> Result<()> {
    scene.play(timeline);
    scene.capture_screenshots_named(screenshots);
    if let Some((name, stops)) = gif {
        scene.capture_gif(name, stops.iter().copied());
    }

    let settings = ExportSettings {
        duration_seconds: duration,
        artifact_dir: PathBuf::from(artifact_dir),
        video_enabled,
        preserve_frame_exports: false,
        ..ExportSettings::from_scene(&scene)
    };

    App::new()?
        .with_scene(scene)
        .with_export_settings(settings)
        .run_app()
}

pub fn label(scene: &mut Scene, text: &str, size: f32, color: Vec4, pos: Vec3) -> TattvaId {
    scene.add_tattva(Label::new(text, size).with_color(color), pos)
}

pub fn card(scene: &mut Scene, text: &str, pos: Vec3, width: f32, accent: Vec4) -> Vec<TattvaId> {
    Card::new(text, width, 0.48)
        .with_radius(0.12)
        .with_fill(rgba(accent, 0.16))
        .with_stroke(0.025, rgba(accent, 0.82))
        .with_text_style(0.17, rgba(WHITE, 0.92))
        .add_to_scene(scene, pos)
        .all()
        .to_vec()
}

pub fn large_card(
    scene: &mut Scene,
    text: &str,
    pos: Vec3,
    width: f32,
    accent: Vec4,
) -> Vec<TattvaId> {
    Card::new(text, width, 0.72)
        .with_radius(0.14)
        .with_fill(rgba(accent, 0.22))
        .with_stroke(0.04, rgba(accent, 0.88))
        .with_text_style(0.22, WHITE)
        .add_to_scene(scene, pos)
        .all()
        .to_vec()
}

pub fn panel(scene: &mut Scene, pos: Vec3, width: f32, height: f32, accent: Vec4) -> TattvaId {
    scene.add_tattva(
        RoundedRectangle::new(width, height, 0.18, Palette::new().panel)
            .with_stroke(0.035, rgba(accent, 0.42)),
        pos,
    )
}

pub fn line(scene: &mut Scene, from: Vec3, to: Vec3, thickness: f32, color: Vec4) -> TattvaId {
    scene.add_tattva(Line::new(from, to, thickness, color), Vec3::ZERO)
}

pub fn arrow(scene: &mut Scene, from: Vec2, to: Vec2, thickness: f32, color: Vec4) -> TattvaId {
    scene.add_tattva(
        Arrow::with_default_tip(from, to, thickness, color),
        Vec3::ZERO,
    )
}

pub fn circle(scene: &mut Scene, radius: f32, pos: Vec3, fill: Vec4, stroke: Vec4) -> TattvaId {
    scene.add_tattva(Circle::new(radius, 64, fill).with_stroke(0.03, stroke), pos)
}

pub fn hide_all(scene: &mut Scene, ids: &[TattvaId]) {
    for &id in ids {
        scene.hide_tattva(id);
    }
}

pub fn appear(timeline: &mut Timeline, ids: &[TattvaId], at: f32, duration: f32) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::OutCubic)
            .appear()
            .spawn();
    }
}

pub fn draw(timeline: &mut Timeline, ids: &[TattvaId], at: f32, duration: f32) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::OutCubic)
            .draw()
            .spawn();
    }
}

pub fn write_text(timeline: &mut Timeline, ids: &[TattvaId], at: f32, duration: f32) {
    for &id in ids {
        timeline
            .animate(id)
            .at(at)
            .for_duration(duration)
            .ease(Ease::OutCubic)
            .typewrite_text()
            .spawn();
    }
}

pub fn pulse(timeline: &mut Timeline, id: TattvaId, at: f32) {
    timeline
        .animate(id)
        .at(at)
        .for_duration(0.52)
        .ease(Ease::InOutQuad)
        .scale_to(Vec3::splat(1.08))
        .spawn();
}

pub fn footer(scene: &mut Scene, palette: &Palette, ids: &mut Vec<TattvaId>) -> [TattvaId; 2] {
    let kavriq = label(
        scene,
        "kavriq.com",
        0.18,
        rgba(palette.kavriq, 0.42),
        Vec3::new(-5.15, -3.82, 0.1),
    );
    let murali = label(
        scene,
        "Built with Murali Engine",
        0.16,
        rgba(WHITE, 0.46),
        Vec3::new(4.25, -3.82, 0.1),
    );
    ids.extend([kavriq, murali]);
    [kavriq, murali]
}
