pub mod ai_data_example;
pub mod agent_run_trace;
pub mod common;
pub mod data_management_surface;
pub mod design_shift_bullets;
pub mod deliberate_capture;
pub mod domino_chain;
pub mod enterprise_vs_startup;
pub mod enterprise_positioning_card;
pub mod feedback_loop;
pub mod governance;
pub mod gravity_well;
pub mod hook;
pub mod hook_part1;
pub mod hook_part2;
pub mod hook_part3;
pub mod intelligence_itself;
pub mod logs_are_system;
pub mod main_explainer;
pub mod shattered_premise;
pub mod security_tension;
pub mod subscribe_pitch;
pub mod start;
pub mod successful_teams_preplan;
pub mod single_run_capture;
pub mod system_shift;
pub mod trace_feedback_loop_long;
pub mod traditional_software_foundations;
pub mod welcome_positioning;
pub mod walkthrough_certainty;
pub mod multi_agent_causality;

use anyhow::{Result, bail};

pub const ANIMATIONS: &[(&str, &str)] = &[
    ("main-explainer", "Full script overview animation"),
    ("start", "5-second branded opening title card"),
    (
        "traditional-software-foundations",
        "60-second traditional software worldview and architecture beat",
    ),
    (
        "welcome-positioning",
        "30-second Kavriq intro and channel positioning beat",
    ),
    ("hook", "Opening claim: AI creates a data problem"),
    ("hook-part-1", "Hook opener: AI needs data -> AI generates data"),
    ("hook-part-2", "Hook middle: 5k to 30k retrieved context tokens"),
    ("hook-part-3", "Hook close: prompt/tools/output/feedback/evals"),
    (
        "intelligence-itself",
        "Closing synthesis: AI systems surrounded by the data systems becoming part of intelligence",
    ),
    (
        "gravity-well",
        "Concepts orbit an AI system, collapse inward, then dissolve",
    ),
    (
        "domino-chain",
        "Tiny output variance cascades into replay, evaluation, storage, governance, and cost",
    ),
    (
        "enterprise-vs-startup",
        "Startups vs enterprises in production AI: speed, foundation, breakage, and cost",
    ),
    (
        "enterprise-positioning-card",
        "Editorial framing card: enterprises are ahead in production AI because the foundation already exists",
    ),
    (
        "data-management-surface",
        "Murali AI indicator emits accumulating artifacts until data management fills the screen",
    ),
    (
        "design-shift-bullets",
        "Editorial bullet list: the ways teams are building AI systems incorrectly",
    ),
    (
        "successful-teams-preplan",
        "Day-one planning pills for teams that handle AI data well",
    ),
    (
        "security-tension",
        "Overlapping noisy security core with floating privacy, retention, and access risks",
    ),
    (
        "subscribe-pitch",
        "KAVRIQ heart AI outro with floating Subscribe, Like, and Share pills",
    ),
    (
        "single-run-capture",
        "A single run leaves behind prompt, tool, output, and feedback traces",
    ),
    (
        "multi-agent-causality",
        "One run triggers another and causality has to be traced across the chain",
    ),
    (
        "deliberate-capture",
        "Captured data exists only because teams build the infrastructure to collect it",
    ),
    (
        "trace-feedback-loop-long",
        "The same trace becomes debugging, evaluation, and fine-tuning data",
    ),
    (
        "system-shift",
        "Pipeline consumes data, then generates artifacts and bends into a feedback loop",
    ),
    (
        "ai-data-example",
        "Diagram-only data generation sequence with live chart growth",
    ),
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
    (
        "shattered-premise",
        "Same prompt enters twice and produces different responses",
    ),
    (
        "walkthrough-certainty",
        "Deterministic code path with repeated identical outputs",
    ),
];

pub fn run(name: &str) -> Result<()> {
    match name {
        "main-explainer" => main_explainer::run(),
        "start" => start::run(),
        "traditional-software-foundations" => traditional_software_foundations::run(),
        "welcome-positioning" => welcome_positioning::run(),
        "hook" => hook::run(),
        "hook-part-1" => hook_part1::run(),
        "hook-part-2" => hook_part2::run(),
        "hook-part-3" => hook_part3::run(),
        "intelligence-itself" => intelligence_itself::run(),
        "gravity-well" => gravity_well::run(),
        "domino-chain" => domino_chain::run(),
        "enterprise-vs-startup" => enterprise_vs_startup::run(),
        "enterprise-positioning-card" => enterprise_positioning_card::run(),
        "data-management-surface" => data_management_surface::run(),
        "design-shift-bullets" => design_shift_bullets::run(),
        "successful-teams-preplan" => successful_teams_preplan::run(),
        "security-tension" => security_tension::run(),
        "subscribe-pitch" => subscribe_pitch::run(),
        "single-run-capture" => single_run_capture::run(),
        "multi-agent-causality" => multi_agent_causality::run(),
        "deliberate-capture" => deliberate_capture::run(),
        "trace-feedback-loop-long" => trace_feedback_loop_long::run(),
        "system-shift" => system_shift::run(),
        "ai-data-example" => ai_data_example::run(),
        "agent-run-trace" => agent_run_trace::run(),
        "logs-are-system" => logs_are_system::run(),
        "feedback-loop" => feedback_loop::run(),
        "governance" => governance::run(),
        "shattered-premise" => shattered_premise::run(),
        "walkthrough-certainty" => walkthrough_certainty::run(),
        other => bail!("unknown Kavriq hidden data animation: {other}"),
    }
}
