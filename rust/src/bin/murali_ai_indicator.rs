fn main() -> anyhow::Result<()> {
    let loop_until = parse_loop_until()?;
    private_animations::animations::murali_ai_indicator::run_until(loop_until)
}

fn parse_loop_until() -> anyhow::Result<f32> {
    let mut args = std::env::args().skip(1);
    let mut loop_until = murali::frontend::collection::ai::MURALI_AI_INDICATOR_DURATION;

    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--loop-until" => {
                let Some(value) = args.next() else {
                    anyhow::bail!("--loop-until requires a value in seconds");
                };
                loop_until = value.parse::<f32>()?;
            }
            "--help" | "-h" => {
                println!("Usage: cargo run --bin murali-ai-indicator -- [--loop-until <seconds>]");
                std::process::exit(0);
            }
            _ => anyhow::bail!("unknown argument: {arg}"),
        }
    }

    Ok(loop_until)
}
