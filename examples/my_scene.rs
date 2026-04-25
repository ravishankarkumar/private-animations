use murali::colors::GREEN_E;
use murali::prelude::{ORIGIN, CAMERA_DEFAULT_POS};
use murali::{App};
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::circle::Circle;

fn main() -> anyhow::Result<()> {
    // 1. Create a scene
    let mut scene = Scene::new();
    
    // 2. Add a circle tattva
    let circle_id = scene.add_tattva(
        Circle::new(1.5, 48, GREEN_E),
        ORIGIN,
    );
    
    // 3. Position the camera
    scene.camera_mut().position = CAMERA_DEFAULT_POS;

    // 4. Create a timeline with animations
    let mut timeline = Timeline::new();
    timeline
        .animate(circle_id)
        .at(1.0)
        .for_duration(1.5)
        .ease(Ease::OutCubic)
        .draw()
        .spawn();
    
    timeline
        .animate(circle_id)
        .at(4.0)
        .for_duration(1.0)
        .ease(Ease::InCubic)
        .undraw()
        .spawn();

    timeline.wait_until(5.5);

    // 5. Play the timeline
    scene.play(timeline);

    // 6. Run the app
    App::new()?.with_scene(scene).run_app()
}