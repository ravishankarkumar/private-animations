pub mod agent_run_trace;
pub mod common;
pub mod feedback_loop;
pub mod governance;
pub mod hook;
pub mod logs_are_system;
pub mod main_explainer;

use anyhow::{Result, bail};

pub const ANIMATIONS: &[(&str, &str)] = &[
    ("main-explainer", "Full script overview animation"),
    ("hook", "Opening claim: AI creates a data problem"),
    (
        "agent-run-trace",
        "One agent run fans out into generated traces",
    ),
    ("logs-are-system", "Central thesis beat"),
    (
        "feedback-loop",
        "Debug trace -> evaluation -> training data",
    ),
    (
        "governance",
        "Capture, retention, access, privacy, evaluation",
    ),
];

pub fn run(name: &str) -> Result<()> {
    match name {
        "main-explainer" => main_explainer::run(),
        "hook" => hook::run(),
        "agent-run-trace" => agent_run_trace::run(),
        "logs-are-system" => logs_are_system::run(),
        "feedback-loop" => feedback_loop::run(),
        "governance" => governance::run(),
        other => bail!("unknown Kavriq hidden data animation: {other}"),
    }
}
