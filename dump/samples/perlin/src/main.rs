use glam::{Vec3, Vec4};
use murali::engine::scene::Scene;
use murali::engine::timeline::Timeline;
use murali::frontend::animation::Ease;
use murali::frontend::collection::primitives::noisy_circle::{
    PerlinNoiseCircle, PerlinNoiseCircleGradient,
};
use murali::frontend::Tattva;
use murali::App;

fn main() -> anyhow::Result<()> {
    let mut scene = Scene::new();

    let circle_id = scene.add_tattva(
        PerlinNoiseCircle::new(1.8, Vec4::new(0.98, 0.74, 0.28, 1.0))
            .with_samples(220)
            .with_noise_frequency(1.6)
            .with_noise_amplitude(0.28)
            .with_noise_seed(1.37)
            .with_phase(0.0)
            .with_morph_speed(1.1)
            .with_gradient(
                PerlinNoiseCircleGradient::new(vec![
                    Vec4::new(0.20, 0.92, 1.00, 1.0),
                    Vec4::new(0.49, 0.58, 1.00, 1.0),
                    Vec4::new(0.98, 0.42, 0.86, 1.0),
                    Vec4::new(0.98, 0.78, 0.30, 1.0),
                ])
                .with_cycles(2.3)
                .with_motion_rate(0.42),
            )
            .with_stroke(0.055, Vec4::new(0.98, 0.74, 0.28, 1.0)),
        Vec3::ZERO,
    );

    let circle_id2 = scene.add_tattva(
        PerlinNoiseCircle::new(1.8, Vec4::new(0.20, 0.92, 1.00, 1.0))
            .with_samples(220)
            .with_noise_frequency(1.6)
            .with_noise_amplitude(0.28)
            .with_noise_seed(2.45)
            .with_phase(0.0)
            .with_morph_speed(0.9)
            .with_gradient(
                // PerlinNoiseCircleGradient::new(vec![
                //     Vec4::new(0.20, 0.92, 1.00, 1.0),
                //     Vec4::new(0.49, 0.58, 1.00, 1.0),
                //     Vec4::new(0.98, 0.42, 0.86, 1.0),
                //     Vec4::new(0.98, 0.78, 0.30, 1.0),
                // ])
                PerlinNoiseCircleGradient::new(vec![
                    Vec4::new(1.00, 0.20, 0.20, 1.0), // red
                    Vec4::new(1.00, 0.60, 0.20, 1.0), // orange
                    Vec4::new(1.00, 0.85, 0.30, 1.0), // gold
                    Vec4::new(0.80, 0.40, 0.60, 1.0), // rose
                ])
                .with_cycles(2.3)
                .with_motion_rate(0.42),
            )
            .with_stroke(0.055, Vec4::new(0.98, 0.74, 0.28, 1.0)),
        Vec3::ZERO,
    );

    let circle_id3 = scene.add_tattva(
        PerlinNoiseCircle::new(1.8, Vec4::new(0.98, 0.42, 0.86, 1.0))
            .with_samples(220)
            .with_noise_frequency(1.6)
            .with_noise_amplitude(0.28)
            .with_noise_seed(3.89)
            .with_phase(0.0)
            .with_morph_speed(1.4)
            .with_gradient(
                // PerlinNoiseCircleGradient::new(vec![
                //     Vec4::new(0.20, 0.92, 1.00, 1.0),
                //     Vec4::new(0.49, 0.58, 1.00, 1.0),
                //     Vec4::new(0.98, 0.42, 0.86, 1.0),
                //     Vec4::new(0.98, 0.78, 0.30, 1.0),
                // ])
                PerlinNoiseCircleGradient::new(vec![
                    Vec4::new(0.50, 0.20, 0.80, 1.0), // purple
                    Vec4::new(0.80, 0.30, 0.70, 1.0), // pink
                    Vec4::new(0.30, 0.60, 0.90, 1.0), // light blue
                    Vec4::new(0.90, 0.50, 0.80, 1.0), // light magenta
                ])
                .with_cycles(2.3)
                .with_motion_rate(0.42),
            )
            .with_stroke(0.055, Vec4::new(0.98, 0.74, 0.28, 1.0)),
        Vec3::ZERO,
    );

    let mut timeline = Timeline::new();

    timeline
        .animate(circle_id)
        .at(0.0)
        .for_duration(8.0)
        .ease(Ease::Linear)
        .noise_evolve()
        .spawn();

    timeline
        .animate(circle_id2)
        .at(0.0)
        .for_duration(8.0)
        .ease(Ease::Linear)
        .noise_evolve()
        .spawn();

    timeline
        .animate(circle_id3)
        .at(0.0)
        .for_duration(8.0)
        .ease(Ease::Linear)
        .noise_evolve()
        .spawn();

    scene.timelines.insert("main".to_string(), timeline);
    scene.camera_mut().position = Vec3::new(0.0, 0.0, 8.0);

    App::new()?.with_scene(scene).run_app()
}
