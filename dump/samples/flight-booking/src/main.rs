use glam::Vec3;
use murali::App;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;
use murali::frontend::collection::storytelling::stepwise::{
    Stepwise, StepwiseLayout,
    model::Direction,
    script::stepwise,
};
use murali::frontend::collection::prelude::label::Label;

use glam::Vec4;

fn main() -> anyhow::Result<()> {
    let mut scene = Scene::new();

    let label1 = Label::new("Book a flight", 1.0)
        .with_color(Vec4::new(0.92, 0.26, 0.21, 1.0));
    let label1_id = scene.add_tattva(label1, Vec3::new(0.0, 3.0, 0.0));

    let label2 = Label::new("Flight Booked!", 1.0)
        .with_color(Vec4::new(0.19, 0.64, 0.33, 1.0));
    let label2_id = scene.add_tattva(label2, Vec3::new(0.0, 3.0, 0.0));

    // Define a 3-node model with a back-path from C -> A
    let model = stepwise(|s| {
        let a = s.step("Need Ticket");
        let b = s.step("Search");
        let c = s.step("Compare");
        let d = s.step("Analyse");
        let e = s.step("Booked");
        
        // Forward path
        s.connect(a, b);
        s.connect(b, c);
        s.connect(c, d);
        s.connect(d, e);
        
        // Back path: D(3) -> A(0): 3 hops left.
        // Up exits top of D. Three Lefts step D->C->B->A by node center.
        // Spatial anchor enters A from the top.
        s.connect(d, b).route(vec![
            Direction::Up,
            Direction::Left,
            // Direction::Left,
            // Direction::Left,
        ]);

        // Explicit journey: A -> B -> C -> D -> C -> D -> E
        s.with_sequence(vec![a, b, c, d, b, c, d, b, c, d, b, c, d, e]);
    });

    let sw = Stepwise::new(model)
        .with_layout(StepwiseLayout::horizontal(2.0));
        // .with_debug(true);

    let sw_id = scene.add_tattva(sw, Vec3::new(-9.0, -3.0, 0.0));

    let mut timeline = Timeline::new();
    let mut timeline2 = Timeline::new();

    timeline2.animate(label1_id)
        .at(0.5)
        .for_duration(1.0)
        .ease(Ease::Linear)
        .write_text()
        .spawn();

    timeline2.animate(label1_id)
        .at(17.1)
        .for_duration(0.5)
        .ease(Ease::Linear)
        .unwrite_text()
        .spawn();

    timeline2.animate(label2_id)
        .at(17.6)
        .for_duration(1.0)
        .ease(Ease::Linear)
        .write_text()
        .spawn();

    
    // 1. Reveal nodes & connections (0.0 to 1.0)
    timeline.animate(sw_id)
        .at(0.5)
        .for_duration(5.5)
        .ease(Ease::InOutQuad)
        .propagate_to(1.0)
        .spawn();

    // 2. Journey signal (A -> B -> C -> A)
    timeline.animate(sw_id)
        .at(7.0)
        .for_duration(10.0)
        .ease(Ease::Linear)
        .signal_to(1.0)
        .spawn();


    timeline2.wait_until(22.0);


    scene.timelines.insert("main".to_string(), timeline);
    scene.timelines.insert("text_timeline".to_string(), timeline2);

    scene.camera_mut().position = Vec3::new(0.0, -1.0, 10.0);

    let current_width = scene.camera_mut().view_width();
    scene.camera_mut().set_view_width(current_width * 1.5);

    App::new()?
        .with_scene(scene)
        .run_app()
}
