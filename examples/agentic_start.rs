use anyhow::Result;
use glam::{Quat, Vec3, Vec4};
use std::path::PathBuf;

use murali::App;
use murali::engine::export::ExportSettings;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::circle::Circle;
use murali::frontend::collection::primitives::line::Line;
use murali::frontend::collection::primitives::rectangle::Rectangle;
use murali::frontend::collection::text::label::Label;

const EXPORT_DURATION: f32 = 3.1;
const CAPTURE_TIME: f32 = 2.34;
const HIGHLIGHT_GIF_STOPS: [f32; 7] = [1.70, 2.02, 2.08, 2.34, 2.66, 2.98, 3.06];

fn main() -> Result<()> {
    let mut scene = Scene::new();
    let mut timeline = Timeline::new();

    scene.camera_mut().position = Vec3::new(0.0, 0.0, 10.0);

    let node_fill = Vec4::new(0.10, 0.16, 0.22, 1.0);
    let node_stroke = Vec4::new(0.55, 0.72, 0.90, 1.0);
    let env_fill = Vec4::new(0.10, 0.12, 0.15, 1.0);
    let env_stroke = Vec4::new(0.60, 0.65, 0.72, 1.0);
    let text = Vec4::new(0.94, 0.97, 1.0, 1.0);
    let edge = Vec4::new(0.48, 0.62, 0.78, 1.0);
    let signal = Vec4::new(0.20, 0.84, 0.96, 1.0);
    let glow = Vec4::new(0.20, 0.84, 0.96, 0.18);
    let faint = Vec4::new(0.72, 0.84, 0.96, 0.28);
    let muted = Vec4::new(0.72, 0.84, 0.96, 0.38);

    let observe_pos = Vec3::new(-3.5, 2.2, 0.0);
    let reason_pos = Vec3::new(0.0, 1.3, 0.0);
    let plan_pos = Vec3::new(0.0, -0.15, 0.0);
    let act_pos = Vec3::new(0.0, -1.60, 0.0);
    let reflect_pos = Vec3::new(-3.5, -1.6, 0.0);
    let env_pos = Vec3::new(4.95, 0.15, 0.0);

    let node_w = 2.2;
    let node_h = 0.9;
    let env_w = 2.6;
    let env_h = 5.2;

    let add_node = |scene: &mut Scene, label: &str, pos: Vec3| {
        let rect_id = scene.add_tattva(
            Rectangle::new(node_w, node_h, node_fill).with_stroke(0.04, node_stroke),
            pos,
        );

        let text_id = scene.add_tattva(
            Label::new(label, 0.22).with_color(text),
            Vec3::new(pos.x, pos.y, pos.z + 0.1),
        );

        (rect_id, text_id)
    };

    let add_edge = |scene: &mut Scene, from: Vec3, to: Vec3| {
        scene.add_tattva(Line::new(from, to, 0.05, edge), Vec3::ZERO)
    };

    let (observe_rect, observe_text) = add_node(&mut scene, "Observe", observe_pos);
    let (reason_rect, reason_text) = add_node(&mut scene, "Reason", reason_pos);
    let (plan_rect, plan_text) = add_node(&mut scene, "Plan", plan_pos);
    let (act_rect, act_text) = add_node(&mut scene, "Act", act_pos);
    let (reflect_rect, reflect_text) = add_node(&mut scene, "Reflect", reflect_pos);

    let env_rect = scene.add_tattva(
        Rectangle::new(env_w, env_h, env_fill).with_stroke(0.04, env_stroke),
        env_pos,
    );

    let env_text = scene.add_tattva(
        Label::new("Environment", 0.24).with_color(text),
        Vec3::new(env_pos.x, env_pos.y, env_pos.z + 0.1),
    );
    scene.set_rotation(env_text, Quat::from_rotation_z(90.0f32.to_radians()));

    let memory_text = scene.add_tattva(
        Label::new("Memory", 0.15).with_color(faint),
        Vec3::new(observe_pos.x - 0.6, observe_pos.y - 0.8, 0.1),
    );

    let llm_text = scene.add_tattva(
        Label::new("LLM", 0.15).with_color(faint),
        Vec3::new(reason_pos.x + 0.45, reason_pos.y - 0.75, 0.1),
    );

    let tools_text = scene.add_tattva(
        Label::new("Tools", 0.15).with_color(faint),
        Vec3::new(act_pos.x + 2.0, act_pos.y - 0.22, 0.1),
    );

    let brand_test = scene.add_tattva(
        Label::new("kavriq.com", 0.20).with_color(glow),
        Vec3::new(act_pos.x, -3.0, 0.1),
    );

    let built_with_text = scene.add_tattva(
        Label::new("Built with Murali", 0.16).with_color(muted),
        Vec3::new(6.35, -3.75, 0.1),
    );

    let e1 = add_edge(
        &mut scene,
        Vec3::new(observe_pos.x + 1.15, observe_pos.y - 0.2, 0.0),
        Vec3::new(reason_pos.x - 1.15, reason_pos.y, 0.0),
    );

    let e2 = add_edge(
        &mut scene,
        Vec3::new(reason_pos.x, reason_pos.y - 0.52, 0.0),
        Vec3::new(plan_pos.x, plan_pos.y + 0.52, 0.0),
    );

    let e3 = add_edge(
        &mut scene,
        Vec3::new(plan_pos.x, plan_pos.y - 0.52, 0.0),
        Vec3::new(act_pos.x, act_pos.y + 0.52, 0.0),
    );

    let e4 = add_edge(
        &mut scene,
        Vec3::new(act_pos.x - 1.15, act_pos.y, 0.0),
        Vec3::new(reflect_pos.x + 1.15, reflect_pos.y, 0.0),
    );

    let e5 = add_edge(
        &mut scene,
        Vec3::new(reflect_pos.x, reflect_pos.y + 0.52, 0.0),
        Vec3::new(observe_pos.x, observe_pos.y - 0.52, 0.0),
    );

    let e6 = add_edge(
        &mut scene,
        Vec3::new(act_pos.x + 1.15, act_pos.y, 0.0),
        Vec3::new(env_pos.x - 1.2, act_pos.y, 0.0),
    );

    let e7 = add_edge(
        &mut scene,
        Vec3::new(env_pos.x - env_w * 0.5, observe_pos.y, 0.0),
        Vec3::new(observe_pos.x + 1.15, observe_pos.y, 0.0),
    );

    let glow_id = scene.add_tattva(
        Circle::new(0.28, 32, glow),
        Vec3::new(observe_pos.x, observe_pos.y, 0.15),
    );

    let signal_id = scene.add_tattva(
        Circle::new(0.12, 32, signal),
        Vec3::new(observe_pos.x, observe_pos.y, 0.2),
    );

    for id in [
        observe_rect,
        reason_rect,
        plan_rect,
        act_rect,
        reflect_rect,
        env_rect,
        e1,
        e2,
        e3,
        e4,
        e5,
        e6,
        e7,
        glow_id,
        signal_id,
    ] {
        scene.hide_tattva(id);
    }

    for id in [
        observe_rect,
        reason_rect,
        plan_rect,
        act_rect,
        reflect_rect,
        env_rect,
    ] {
        timeline
            .animate(id)
            .at(0.0)
            .for_duration(0.75)
            .ease(Ease::OutCubic)
            .appear()
            .spawn();
    }

    for (i, id) in [e1, e2, e3, e4, e5, e6, e7].into_iter().enumerate() {
        timeline
            .animate(id)
            .at(0.40 + i as f32 * 0.12)
            .for_duration(0.5)
            .ease(Ease::OutCubic)
            .draw()
            .spawn();
    }

    timeline
        .animate(glow_id)
        .at(1.35)
        .for_duration(0.35)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();

    timeline
        .animate(signal_id)
        .at(1.45)
        .for_duration(0.25)
        .ease(Ease::OutCubic)
        .appear()
        .spawn();

    let signal_points = [
        Vec3::new(observe_pos.x, observe_pos.y, 0.2),
        Vec3::new(reason_pos.x, reason_pos.y, 0.2),
        Vec3::new(plan_pos.x, plan_pos.y, 0.2),
        Vec3::new(act_pos.x, act_pos.y, 0.2),
        Vec3::new(reflect_pos.x, reflect_pos.y, 0.2),
    ];

    let mut t = 1.78;
    for window in signal_points.windows(2) {
        let from = window[0];
        let to = window[1];

        timeline
            .animate(signal_id)
            .at(t)
            .for_duration(0.18)
            .ease(Ease::InOutCubic)
            .move_to(to)
            .from_vec3(from)
            .spawn();

        timeline
            .animate(glow_id)
            .at(t)
            .for_duration(0.18)
            .ease(Ease::InOutCubic)
            .move_to(Vec3::new(to.x, to.y, 0.15))
            .from_vec3(Vec3::new(from.x, from.y, 0.15))
            .spawn();

        t += 0.32;
    }

    timeline.wait_until(EXPORT_DURATION);
    scene.play(timeline);
    scene.capture_screenshots_named([(CAPTURE_TIME, Some("agentic_ai_index_hero.png"))]);
    scene.capture_gif("agentic_ai_highlight_loop", HIGHLIGHT_GIF_STOPS);

    let settings = ExportSettings {
        duration_seconds: EXPORT_DURATION,
        artifact_dir: PathBuf::from("rendered_output/agentic_ai_index_hero"),
        video_enabled: false,
        preserve_frame_exports: false,
        ..ExportSettings::from_scene(&scene)
    };

    App::new()?
        .with_scene(scene)
        .with_export_settings(settings)
        .run_app()
}
