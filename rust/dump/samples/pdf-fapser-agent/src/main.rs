use glam::{Vec3, Vec4, vec2};
use murali::App;
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;
use murali::frontend::collection::prelude::label::Label;
use murali::frontend::collection::primitives::circle::Circle;
use murali::frontend::collection::primitives::path::Path;
use murali::frontend::collection::storytelling::stepwise::{
    Stepwise, StepwiseLayout,
    model::Direction,
    script::stepwise,
};

fn main() -> anyhow::Result<()> {
    let mut scene = Scene::new();

    let eyebrow = Label::new("AGENTIC LOOP", 0.4)
        .with_color(Vec4::new(0.62, 0.84, 0.74, 1.0));
    let eyebrow_id = scene.add_tattva(eyebrow, Vec3::new(3.0, 1.6, 0.0));

    let headline1 = Label::new("Parse, Judge, Retry", 0.66)
        .with_color(Vec4::new(0.96, 0.98, 1.0, 1.0));
    let headline1_id = scene.add_tattva(headline1, Vec3::new(3.0, 0.0, 0.0));

    // let headline2 = Label::new("retry.", 0.66)
    //     .with_color(Vec4::new(0.96, 0.98, 1.0, 1.0));
    // let headline2_id = scene.add_tattva(headline2, Vec3::new(2.8, 1.2, 0.0));

    // let subtitle1 = Label::new("Keeps improving the parse", 0.34)
    //     .with_color(Vec4::new(0.80, 0.86, 0.92, 1.0));
    // let subtitle1_id = scene.add_tattva(subtitle1, Vec3::new(2.8, 0.2, 0.0));

    // let subtitle2 = Label::new("until the quality check passes", 0.34)
    //     .with_color(Vec4::new(0.80, 0.86, 0.92, 1.0));
    // let subtitle2_id = scene.add_tattva(subtitle2, Vec3::new(2.8, -0.35, 0.0));

    let done_ring = Circle::new(0.68, 48, Vec4::new(0.19, 0.64, 0.33, 0.16))
        .with_stroke(0.05, Vec4::new(0.56, 0.91, 0.69, 0.95));
    let done_ring_id = scene.add_tattva(done_ring, Vec3::new(3.0, 0.55, 0.0));

    let check = Path::new()
        .with_thickness(0.12)
        .with_color(Vec4::new(0.56, 0.91, 0.69, 1.0))
        .move_to(vec2(-0.40, -0.02))
        .line_to(vec2(-0.08, -0.34))
        .line_to(vec2(0.46, 0.26));
    let check_id = scene.add_tattva(check, Vec3::new(3.0, 0.56, 0.0));

    let done = Label::new("Accepted", 0.44)
        .with_color(Vec4::new(0.87, 0.97, 0.91, 1.0));
    let done_id = scene.add_tattva(done, Vec3::new(3.0, 1.75, 0.0));

    scene.hide(done_ring_id);
    scene.hide(check_id);
    scene.hide(done_id);

    let model = stepwise(|s| {
        let pdf = s.step("Receive PDF");
        let parse = s.step("Parse\nPDF");
        let extract = s.step("Extract Structured\nOutput");
        let quality = s.step("Check\nQuality");
        let complete = s.step("Output\nAccepted");

        s.connect(pdf, parse);
        s.connect(parse, extract);
        s.connect(extract, quality);
        s.connect(quality, complete);

        // Loop back upward path can now come from the side
        s.connect(quality, parse).route(vec![
            Direction::Right,
            Direction::Up,
            Direction::Up,
        ]);

        s.with_sequence(vec![
            pdf,
            parse, extract, quality,
            parse, extract, quality,
            parse, extract, quality,
            complete,
        ]);
    });

    let sw = Stepwise::new(model)
        .with_layout(StepwiseLayout::vertical(0.65));

    let sw_id = scene.add_tattva(sw, Vec3::new(-5.5, 4.3, 0.0));

    let mut flow_timeline = Timeline::new();
    let mut text_timeline = Timeline::new();

    text_timeline
        .animate(eyebrow_id)
        .at(0.4)
        .for_duration(0.6)
        .ease(Ease::Linear)
        .typewrite_text()
        .spawn();

    text_timeline
        .animate(headline1_id)
        .at(0.9)
        .for_duration(0.8)
        .ease(Ease::Linear)
        .typewrite_text()
        .spawn();

    // text_timeline
    //     .animate(headline2_id)
    //     .at(1.5)
    //     .for_duration(0.8)
    //     .ease(Ease::Linear)
    //     .write_text()
    //     .spawn();

    // text_timeline
    //     .animate(subtitle1_id)
    //     .at(2.1)
    //     .for_duration(0.7)
    //     .ease(Ease::Linear)
    //     .write_text()
    //     .spawn();

    // text_timeline
    //     .animate(subtitle2_id)
    //     .at(2.5)
    //     .for_duration(0.7)
    //     .ease(Ease::Linear)
    //     .write_text()
    //     .spawn();

    text_timeline
        .animate(eyebrow_id)
        .at(17.2)
        .for_duration(0.45)
        .ease(Ease::Linear)
        .unwrite_text()
        .spawn();

    text_timeline
        .animate(headline1_id)
        .at(17.35)
        .for_duration(0.5)
        .ease(Ease::Linear)
        .unwrite_text()
        .spawn();

    // text_timeline
    //     .animate(headline2_id)
    //     .at(17.55)
    //     .for_duration(0.45)
    //     .ease(Ease::Linear)
    //     .unwrite_text()
    //     .spawn();

    // text_timeline
    //     .animate(subtitle1_id)
    //     .at(17.7)
    //     .for_duration(0.4)
    //     .ease(Ease::Linear)
    //     .unwrite_text()
    //     .spawn();

    // text_timeline
    //     .animate(subtitle2_id)
    //     .at(17.85)
    //     .for_duration(0.4)
    //     .ease(Ease::Linear)
    //     .unwrite_text()
    //     .spawn();

    text_timeline.call_at(17.9, move |scene| {
        scene.show(done_ring_id);
    });

    text_timeline.call_at(18.2, move |scene| {
        scene.show(check_id);
    });

    text_timeline.call_at(18.45, move |scene| {
        scene.show(done_id);
    });

    text_timeline
        .animate(done_ring_id)
        .at(17.9)
        .for_duration(0.9)
        .ease(Ease::OutCubic)
        .write()
        .spawn();

    text_timeline
        .animate(check_id)
        .at(18.15)
        .for_duration(0.7)
        .ease(Ease::OutCubic)
        .write()
        .spawn();

    text_timeline
        .animate(done_id)
        .at(18.45)
        .for_duration(1.0)
        .ease(Ease::Linear)
        .typewrite_text()
        .spawn();

    flow_timeline
        .animate(sw_id)
        .at(0.8)
        .for_duration(5.5)
        .ease(Ease::InOutQuad)
        .propagate_to(1.0)
        .spawn();

    flow_timeline
        .animate(sw_id)
        .at(7.0)
        .for_duration(10.0)
        .ease(Ease::Linear)
        .signal_to(1.0)
        .spawn();

    text_timeline.wait_until(22.0);

    scene.timelines.insert("main".to_string(), flow_timeline);
    scene.timelines.insert("text".to_string(), text_timeline);

    scene.camera_mut().position = Vec3::new(0.0, 0.0, 10.0);
    let current_width = scene.camera_mut().view_width();
    scene.camera_mut().set_view_width(current_width * 1.4);

    App::new()?
        .with_scene(scene)
        .run_app()
}
