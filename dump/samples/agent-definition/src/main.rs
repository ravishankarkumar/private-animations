use murali::frontend::collection::prelude::label::Label;
use glam::{Vec4,Vec3};
use murali::App;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;

fn main() -> anyhow::Result<()> {
    let mut scene = Scene::new();

    let label1 = Label::new("AI Agent uses LLM & takes autonomous decisions", 0.45).with_color(Vec4::new(0.19, 0.64, 0.33, 1.0));
    let label1_id = scene.add_tattva(label1, Vec3::new(0.0, 0.0, 0.0));

    let mut timeline = Timeline::new();

    timeline    
        .animate(label1_id)
        .at(0.5)
        .for_duration(2.5)
        .ease(Ease::Linear)
        .write_text()
        .spawn();
    
    // timeline.animate(label1_id)
    //     .at(11.0)
    //     .for_duration(0.5)
    //     .ease(Ease::Linear)
    //     .unwrite_text()
    //     .spawn();
    timeline
        .animate(label1_id)
        .at(11.0)
        .for_duration(2.0)
        .ease(Ease::InOutCubic)
        .move_to(Vec3::new(0.0, 2.5, 0.0))
        .spawn();

    timeline
        .animate(label1_id)
        .at(11.0)
        .for_duration(2.0)
        .ease(Ease::InOutCubic)
        .scale_to(Vec3::splat(0.8))
        .spawn();


    let label2 = Label::new("Workflow: Executes Instructions", 0.45).with_color(Vec4::new(0.92, 0.26, 0.21, 1.0));
    let label2_id = scene.add_tattva(label2, Vec3::new(0.0, 0.0, 0.0));

    timeline    
        .animate(label2_id)
        .at(13.0)
        .for_duration(2.0)
        .ease(Ease::Linear)
        .write_text()
        .spawn();


    // Final adjustments
    timeline
        .animate(label1_id)
        .at(17.0)
        .for_duration(2.0)
        .ease(Ease::InOutCubic)
        .move_to(Vec3::new(0.0, 1.0, 0.0))
        .spawn();

    timeline
        .animate(label1_id)
        .at(17.0)
        .for_duration(2.0)
        .ease(Ease::InOutCubic)
        .scale_to(Vec3::splat(1.0))
        .spawn();

    timeline
        .animate(label2_id)
        .at(17.0)
        .for_duration(2.0)
        .ease(Ease::InOutCubic)
        .move_to(Vec3::new(0.0, -1.0, 0.0))
        .spawn();


    timeline.wait_until(30.0);

    scene
        .timelines
        .insert("text_timeline".to_string(), timeline);

    scene.camera_mut().position = Vec3::new(0.0, 0.0, 10.0);

    App::new()?.with_scene(scene).run_app()
}
