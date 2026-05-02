# Kavriq Blog Animation Plan: The Hidden Data Problem

Source script: "The Hidden Data Problem in Agentic AI Systems"

## Animation Folder

Source folder:

```text
src/animations/kavriq/hidden_data_problem
```

## Run Commands

List all hidden data problem animations:

```bash
cargo run -- list
```

Run through the main dispatcher:

```bash
cargo run -- run main-explainer
cargo run -- run hook
cargo run -- run agent-run-trace
cargo run -- run logs-are-system
cargo run -- run feedback-loop
cargo run -- run governance
```

Run directly through Cargo bins:

```bash
cargo run --bin kavriq-hidden-data-main-explainer
cargo run --bin kavriq-hidden-data-hook
cargo run --bin kavriq-hidden-data-agent-run-trace
cargo run --bin kavriq-hidden-data-logs-are-system
cargo run --bin kavriq-hidden-data-feedback-loop
cargo run --bin kavriq-hidden-data-governance
```

## Output Directories

```text
rendered_output/kavriq/hidden-data-problem/main-explainer
rendered_output/kavriq/hidden-data-problem/hook
rendered_output/kavriq/hidden-data-problem/agent-run-trace
rendered_output/kavriq/hidden-data-problem/logs-are-system
rendered_output/kavriq/hidden-data-problem/feedback-loop
rendered_output/kavriq/hidden-data-problem/governance
```

## Planned Assets

- `main-explainer`: full blog/video overview with the original combined visual.
- `hook`: opening claim, "AI creates a data problem." Exports video, final screenshot, and teaser GIF.
- `agent-run-trace`: one agent run fanning out into prompt, context, tools, output, feedback, and eval.
- `logs-are-system`: central thesis beat.
- `feedback-loop`: debug trace -> evaluation -> training data.
- `governance`: capture, retention, access control, evaluation, and privacy boundaries.

## Visual Beats

1. Traditional deterministic software appears as a narrow input -> service -> output path.
2. The "optional logs" idea appears below it as a small support artifact.
3. Agentic AI appears as a central run that fans out into generated data artifacts.
4. The generated artifacts are prompt, retrieved chunks, tool calls, model output, user feedback, evaluation scores, and reasoning trace.
5. The key line "logs are the system" lands as the central visual claim.
6. The lower band converts interaction data into a feedback loop: debug trace -> evaluation -> training data.
7. The final governance line anchors the practical architecture message: capture, retain, govern, learn.

## Script Mapping

- Hook: agent run generates massive new data.
- Traditional vs AI systems: deterministic path contrasted with agent fan-out.
- What to capture: generated data artifacts around the agent.
- Every interaction creates new data: feedback loop band.
- What teams should do: governance/retention/evaluation line.

## Notes

The animation uses the existing private animation style: dark panel background, Kavriq cyan accent, restrained labels, and Murali-native primitives. It is meant for blog hero clips, embedded article visuals, and the first Kavriq YouTube support graphics.
