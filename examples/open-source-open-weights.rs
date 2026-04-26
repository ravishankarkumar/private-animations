use anyhow::Result;
use glam::{Vec3, Vec4};
use std::path::PathBuf;

use murali::App;
use murali::colors::semantic::*;
use murali::engine::export::ExportSettings;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::rounded_rectangle::RoundedRectangle;
use murali::frontend::collection::text::label::Label;

const EXPORT_DURATION: f32 = 6.0;

fn main() -> Result<()> {
    let mut scene = Scene::new();
    let mut timeline = Timeline::new();

    // Zoom out to fit both boxes naturally
    scene.camera_mut().position = Vec3::new(0.0, 0.2, 11.0);

    // Layout Constants
    let box_w = 4.8;
    let box_h = 4.2;
    let panel_radius = 0.24;
    let layer_w = 3.6;
    let layer_h = 0.36;
    let layer_radius = 0.12;
    let label_h = 0.22;
    let brand = Vec4::new(0.20, 0.84, 0.96, 0.18);
    let muted = Vec4::new(0.72, 0.84, 0.96, 0.38);

    let left_x = -3.8;
    let right_x = 3.8;

    // --- LEFT SIDE: Open Weights ---
    let open_weights_title = scene.add_tattva(
        Label::new("Open Weights", 0.48).with_color(accent()),
        Vec3::new(left_x, 3.6, 0.1),
    );
    let open_weights_sub = scene.add_tattva(
        Label::new("Runnable artifact", 0.26).with_color(text_muted()),
        Vec3::new(left_x, 3.1, 0.1),
    );

    let box_1 = scene.add_tattva(
        RoundedRectangle::new(box_w, box_h, panel_radius, Vec4::new(0.1, 0.12, 0.15, 0.2))
            .with_stroke(0.05, accent()),
        Vec3::new(left_x, 0.4, 0.0),
    );

    let w1_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.11, 0.15, 0.20, 0.45),
        )
        .with_stroke(0.025, accent()),
        Vec3::new(left_x, 1.8, 0.05),
    );
    let w1 = scene.add_tattva(
        Label::new("Neural Weights", label_h).with_color(accent()),
        Vec3::new(left_x, 1.8, 0.1),
    );
    let c1_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.11, 0.15, 0.20, 0.45),
        )
        .with_stroke(0.025, accent()),
        Vec3::new(left_x, 1.2, 0.05),
    );
    let c1 = scene.add_tattva(
        Label::new("Tokenizer & Config", label_h).with_color(accent()),
        Vec3::new(left_x, 1.2, 0.1),
    );

    // --- RIGHT SIDE: Open Source AI ---
    let open_source_title = scene.add_tattva(
        Label::new("Open Source AI", 0.48).with_color(positive()),
        Vec3::new(right_x, 3.6, 0.1),
    );

    let open_source_sub = scene.add_tattva(
        Label::new("Modifiable artifact", 0.26).with_color(text_muted()),
        Vec3::new(right_x, 3.1, 0.1),
    );

    let box_2 = scene.add_tattva(
        RoundedRectangle::new(box_w, box_h, panel_radius, Vec4::new(0.1, 0.15, 0.12, 0.2))
            .with_stroke(0.05, positive()),
        Vec3::new(right_x, 0.4, 0.0),
    );

    let w2_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.10, 0.18, 0.13, 0.45),
        )
        .with_stroke(0.025, positive()),
        Vec3::new(right_x, 1.9, 0.05),
    );
    let w2 = scene.add_tattva(
        Label::new("Neural Weights", label_h).with_color(positive()),
        Vec3::new(right_x, 1.9, 0.1),
    );
    let d2_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.10, 0.18, 0.13, 0.45),
        )
        .with_stroke(0.025, positive()),
        Vec3::new(right_x, 1.34, 0.05),
    );
    let d2 = scene.add_tattva(
        Label::new("Training Data Info", label_h).with_color(positive()),
        Vec3::new(right_x, 1.34, 0.1),
    );
    let cd2_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.10, 0.18, 0.13, 0.45),
        )
        .with_stroke(0.025, positive()),
        Vec3::new(right_x, 0.78, 0.05),
    );
    let cd2 = scene.add_tattva(
        Label::new("Training Code", label_h).with_color(positive()),
        Vec3::new(right_x, 0.78, 0.1),
    );
    let r2_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.10, 0.18, 0.13, 0.45),
        )
        .with_stroke(0.025, positive()),
        Vec3::new(right_x, 0.22, 0.05),
    );
    let r2 = scene.add_tattva(
        Label::new("Training Recipe", label_h).with_color(positive()),
        Vec3::new(right_x, 0.22, 0.1),
    );
    let rt2_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.10, 0.18, 0.13, 0.45),
        )
        .with_stroke(0.025, positive()),
        Vec3::new(right_x, -0.34, 0.05),
    );
    let rt2 = scene.add_tattva(
        Label::new("Rights to Modify", label_h).with_color(positive()),
        Vec3::new(right_x, -0.34, 0.1),
    );
    let ev2_card = scene.add_tattva(
        RoundedRectangle::new(
            layer_w,
            layer_h,
            layer_radius,
            Vec4::new(0.10, 0.18, 0.13, 0.45),
        )
        .with_stroke(0.025, positive()),
        Vec3::new(right_x, -0.9, 0.05),
    );
    let ev2 = scene.add_tattva(
        Label::new("Evaluation Setup", label_h).with_color(positive()),
        Vec3::new(right_x, -0.9, 0.1),
    );

    let brand_text = scene.add_tattva(
        Label::new("kavriq.com", 0.20).with_color(brand),
        Vec3::new(0.0, -3.0, 0.1),
    );

    let built_with_text = scene.add_tattva(
        Label::new("Built with Murali", 0.16).with_color(muted),
        Vec3::new(6.35, -3.75, 0.1),
    );

    // Hide all elements initially
    let all_ids = [
        open_weights_title,
        open_weights_sub,
        box_1,
        w1_card,
        w1,
        c1_card,
        c1,
        open_source_title,
        open_source_sub,
        box_2,
        w2_card,
        w2,
        d2_card,
        d2,
        cd2_card,
        cd2,
        r2_card,
        r2,
        rt2_card,
        rt2,
        ev2_card,
        ev2,
        brand_text,
        built_with_text,
    ];
    for &id in &all_ids {
        scene.hide_tattva(id);
    }

    // --- Animation Sequence ---

    // Phase 1: Reveal Open Weights (The limited artifact)
    timeline
        .animate(open_weights_title)
        .at(0.2)
        .for_duration(0.6)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(open_weights_sub)
        .at(0.4)
        .for_duration(0.6)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(box_1)
        .at(0.9)
        .for_duration(0.8)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    for &id in &[w1_card, w1] {
        timeline
            .animate(id)
            .at(1.3)
            .for_duration(0.5)
            .ease(Ease::OutCubic)
            .appear()
            .spawn();
    }
    for &id in &[c1_card, c1] {
        timeline
            .animate(id)
            .at(1.6)
            .for_duration(0.5)
            .ease(Ease::OutCubic)
            .appear()
            .spawn();
    }

    // Phase 2: Reveal Open Source AI (The complete system)
    timeline
        .animate(open_source_title)
        .at(2.4)
        .for_duration(0.6)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(open_source_sub)
        .at(2.6)
        .for_duration(0.6)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(box_2)
        .at(3.1)
        .for_duration(0.8)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();

    let mut t = 3.6;
    for &(card_id, label_id) in &[
        (w2_card, w2),
        (d2_card, d2),
        (cd2_card, cd2),
        (r2_card, r2),
        (rt2_card, rt2),
        (ev2_card, ev2),
    ] {
        for &id in &[card_id, label_id] {
            timeline
                .animate(id)
                .at(t)
                .for_duration(0.4)
                .ease(Ease::OutCubic)
                .appear()
                .spawn();
        }
        t += 0.25;
    }

    timeline
        .animate(brand_text)
        .at(4.8)
        .for_duration(0.6)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();
    timeline
        .animate(built_with_text)
        .at(5.0)
        .for_duration(0.6)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();

    // Phase 3: Final Emphasis
    timeline
        .animate(open_source_title)
        .at(5.2)
        .for_duration(0.6)
        .ease(Ease::InOutQuad)
        .scale_to(Vec3::splat(1.08))
        .spawn();
    timeline
        .animate(open_weights_title)
        .at(5.2)
        .for_duration(0.6)
        .ease(Ease::InOutQuad)
        .scale_to(Vec3::splat(1.08))
        .spawn();

    scene.play(timeline);

    // Capture outputs
    scene.capture_screenshots_named([(EXPORT_DURATION - 0.2, Some("comparison_final.png"))]);

    let settings = ExportSettings {
        duration_seconds: EXPORT_DURATION,
        artifact_dir: PathBuf::from("rendered_output/open-source-open-weights-v2"),
        video_enabled: false,
        ..ExportSettings::from_scene(&scene)
    };

    App::new()?
        .with_scene(scene)
        .with_export_settings(settings)
        .run_app()
}
