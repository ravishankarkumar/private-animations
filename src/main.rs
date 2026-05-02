use anyhow::{Result, bail};
use private_animations::animations::kavriq::hidden_data_problem;

fn main() -> Result<()> {
    let mut args = std::env::args().skip(1);
    let Some(command) = args.next() else {
        print_usage();
        return Ok(());
    };

    match command.as_str() {
        "list" => {
            print_animations();
            Ok(())
        }
        "run" => {
            let Some(name) = args.next() else {
                bail!("missing animation name. Run `cargo run -- list` to see options.");
            };
            hidden_data_problem::run(&name)
        }
        "run-all" => {
            for (name, _) in hidden_data_problem::ANIMATIONS {
                hidden_data_problem::run(name)?;
            }
            Ok(())
        }
        _ => {
            print_usage();
            bail!("unknown command: {command}");
        }
    }
}

fn print_usage() {
    println!("Kavriq private animations");
    println!();
    println!("Usage:");
    println!("  cargo run -- list");
    println!("  cargo run -- run <animation-name>");
    println!("  cargo run -- run-all");
    println!();
    print_animations();
}

fn print_animations() {
    println!("Hidden Data Problem animations:");
    for (name, description) in hidden_data_problem::ANIMATIONS {
        println!("  {name:<18} {description}");
    }
}
