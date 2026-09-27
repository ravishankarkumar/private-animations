import {
  Arrow,
  Circle,
  Label,
  Rectangle,
  Scene,
  timeline,
  render,
  type LabelTattva,
} from "murali-js";

const BG = "#070A16";
const PANEL = "#141C32";
const INK = "#F8FAFC";
const MUTED = "#9AA7C1";
const CYAN = "#31D7FF";
const VIOLET = "#9B6DFF";
const ORANGE = "#FF9F43";
const GREEN = "#57E3A1";

// Murali resolves plain audio/output strings from process.cwd(). Deriving them
// from this source file keeps rendering reliable from either the repo or js/.
const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

type Route = {
  label: string;
  from: readonly [number, number];
  to: readonly [number, number];
  color: string;
  focus: LabelTattva;
};

/** A 9:16, interface-safe explainer for YouTube Shorts. */
class AgenticAIShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const eyebrow = this.add(
      Label("AGENTIC AI • VISUALIZED")
        .height(0.23)
        .color(CYAN)
        .css({ fontWeight: 800, letterSpacing: "0.16em" }),
      { at: [0, 7.18] },
    );
    const title = this.add(
      Label("HOW AN AI AGENT WORKS")
        .height(0.58)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "-0.035em" }),
      { at: [0, 6.53] },
    );
    const subtitle = this.add(
      Label("Watch the loop run three times")
        .height(0.23)
        .color(MUTED)
        .css({ fontWeight: 650 }),
      { at: [0, 6.03] },
    );

    const counterPlate = this.add(
      Rectangle()
        .size([5.9, 0.64])
        .cornerRadius(0.22)
        .fill("rgba(49,215,255,0.08)")
        .stroke({ color: "#263758", width: 0.025 })
        .css({ borderStyle: "none" }),
      { at: [0, 5.35] },
    );

    const llmCard = this.add(
      Rectangle()
        .size([4.8, 1.45])
        .cornerRadius(0.24)
        .fill("rgba(155,109,255,0.16)")
        .stroke({ color: VIOLET, width: 0.055 })
        .css({ borderStyle: "none" }),
      { at: [0, 4.12] },
    );
    const llm = this.add(
      Label("LLM")
        .height(0.47)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.08em" }),
      { at: [0, 4.32] },
    );
    const llmCaption = this.add(
      Label("REASONS OVER CONTEXT")
        .height(0.18)
        .color("#C4B5FD")
        .css({ fontWeight: 750, letterSpacing: "0.12em" }),
      { at: [0, 3.88] },
    );

    const agentCard = this.add(
      Rectangle()
        .size([5.65, 1.6])
        .cornerRadius(0.25)
        .fill(PANEL)
        .stroke({ color: "#6D86BD", width: 0.05 })
        .css({ borderStyle: "none" }),
      { at: [0, 2.2] },
    );
    const agent = this.add(
      Label("AGENT CONTROLLER")
        .height(0.43)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.025em" }),
      { at: [0, 2.42] },
    );
    const agentCaption = this.add(
      Label("PLANS • CALLS • COORDINATES")
        .height(0.17)
        .color(MUTED)
        .css({ fontWeight: 750, letterSpacing: "0.1em" }),
      { at: [0, 1.95] },
    );

    const sensorsCard = this.add(
      Rectangle()
        .size([2.75, 1.45])
        .cornerRadius(0.22)
        .fill(PANEL)
        .stroke({ color: CYAN, width: 0.045 })
        .css({ borderStyle: "none" }),
      { at: [-1.65, 0.2] },
    );
    const sensors = this.add(
      Label("SENSORS")
        .height(0.36)
        .color(CYAN)
        .css({ fontWeight: 900, letterSpacing: "0.04em" }),
      { at: [-1.65, 0.38] },
    );
    const sensorsCaption = this.add(
      Label("OBSERVE").height(0.17).color(MUTED).css({ fontWeight: 750, letterSpacing: "0.13em" }),
      { at: [-1.65, -0.06] },
    );

    const toolsCard = this.add(
      Rectangle()
        .size([2.75, 1.45])
        .cornerRadius(0.22)
        .fill(PANEL)
        .stroke({ color: ORANGE, width: 0.045 })
        .css({ borderStyle: "none" }),
      { at: [1.65, 0.2] },
    );
    const tools = this.add(
      Label("TOOLS")
        .height(0.36)
        .color(ORANGE)
        .css({ fontWeight: 900, letterSpacing: "0.04em" }),
      { at: [1.65, 0.38] },
    );
    const toolsCaption = this.add(
      Label("TAKE ACTION").height(0.17).color(MUTED).css({ fontWeight: 750, letterSpacing: "0.1em" }),
      { at: [1.65, -0.06] },
    );

    const environmentCard = this.add(
      Rectangle()
        .size([6.75, 1.55])
        .cornerRadius(0.25)
        .fill("rgba(87,227,161,0.10)")
        .stroke({ color: GREEN, width: 0.05 })
        .css({ borderStyle: "none" }),
      { at: [0, -2.25] },
    );
    const environment = this.add(
      Label("ENVIRONMENT")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.04em" }),
      { at: [0, -2.05] },
    );
    const environmentCaption = this.add(
      Label("APPS • DATA • PEOPLE")
        .height(0.18)
        .color("#A7F3D0")
        .css({ fontWeight: 750, letterSpacing: "0.1em" }),
      { at: [0, -2.5] },
    );

    const environmentToSensors = this.add(
      Arrow().from([-1.65, -1.47]).to([-1.65, -0.55]).stroke({ color: CYAN, width: 0.055 }),
    );
    const sensorsToAgent = this.add(
      Arrow().from([-1.65, 0.94]).to([-0.85, 1.4]).stroke({ color: CYAN, width: 0.055 }),
    );
    const promptArrow = this.add(
      Arrow().from([-0.55, 3.0]).to([-0.55, 3.38]).stroke({ color: VIOLET, width: 0.05 }),
    );
    const responseArrow = this.add(
      Arrow().from([0.55, 3.38]).to([0.55, 3.0]).stroke({ color: VIOLET, width: 0.05 }),
    );
    const agentToTools = this.add(
      Arrow().from([0.85, 1.4]).to([1.65, 0.94]).stroke({ color: ORANGE, width: 0.055 }),
    );
    const toolsToEnvironment = this.add(
      Arrow().from([1.65, -0.55]).to([1.65, -1.47]).stroke({ color: ORANGE, width: 0.055 }),
    );
    const promptLabel = this.add(
      Label("PROMPT").height(0.14).color(VIOLET).css({ fontWeight: 800, letterSpacing: "0.08em" }),
      { at: [-1.25, 3.19] },
    );
    const responseLabel = this.add(
      Label("RESPONSE").height(0.14).color(VIOLET).css({ fontWeight: 800, letterSpacing: "0.08em" }),
      { at: [1.4, 3.19] },
    );

    const outro = this.add(
      Label("OBSERVE  →  REASON  →  ACT  →  REPEAT")
        .height(0.24)
        .color(MUTED)
        .css({ fontWeight: 800, letterSpacing: "0.045em" }),
      { at: [0, -3.65] },
    );
    const closer = this.add(
      Label("THAT'S AGENTIC AI")
        .height(0.42)
        .color(CYAN)
        .css({ fontWeight: 900, letterSpacing: "0.04em" }),
      { at: [0, -4.28] },
    );

    const routes: Route[] = [
      { label: "OBSERVE", from: [-1.65, -1.38], to: [-1.65, -0.64], color: CYAN, focus: sensors },
      { label: "SEND CONTEXT", from: [-1.65, 0.82], to: [-0.82, 1.3], color: CYAN, focus: agent },
      { label: "PROMPT LLM", from: [-0.55, 2.94], to: [-0.55, 3.32], color: VIOLET, focus: llm },
      { label: "GET RESPONSE", from: [0.55, 3.32], to: [0.55, 2.94], color: VIOLET, focus: agent },
      { label: "CALL TOOL", from: [0.82, 1.3], to: [1.65, 0.82], color: ORANGE, focus: tools },
      { label: "CHANGE WORLD", from: [1.65, -0.64], to: [1.65, -1.38], color: ORANGE, focus: environment },
    ];
    const stepDuration = 0.7;
    const loopStart = 6;
    const counterLabels: LabelTattva[] = [];
    const pulses: ReturnType<typeof Circle>[] = [];
    for (let loopIndex = 0; loopIndex < 3; loopIndex += 1) {
      for (let routeIndex = 0; routeIndex < routes.length; routeIndex += 1) {
        const route = routes[routeIndex];
        const step = loopIndex * routes.length + routeIndex + 1;
        const counter = this.add(
          Label(`LOOP ${loopIndex + 1}/3   •   STEP ${String(step).padStart(2, "0")}   •   ${route.label}`)
            .height(0.18)
            .color(route.color)
            .css({ fontWeight: 850, letterSpacing: "0.075em" }),
          { at: [0, 5.35] },
        );
        counterLabels.push(counter);
        pulses.push(this.add(Circle().radius(0.1).fill("#FFFFFF").opacity(0), { at: route.from }));
      }
    }

    this.play(timeline((local) => {
      local.animate(eyebrow).duration(0.42).appear();
      local.animate(title).at(0.18).duration(0.65).typewrite();
      local.animate(subtitle).at(0.75).duration(0.45).appear();
      local.animate(counterPlate).at(1.18).duration(0.4).appear();

      local.animate(llmCard).at(1.55).duration(0.45).appear();
      local.animate([llm, llmCaption]).at(1.78).stagger(0.18).duration(0.38).appear();
      local.animate(agentCard).at(2.35).duration(0.45).appear();
      local.animate([agent, agentCaption]).at(2.58).stagger(0.18).duration(0.38).appear();
      local.animate([promptArrow, responseArrow]).at(3.05).stagger(0.16).duration(0.45).draw();
      local.animate([promptLabel, responseLabel]).at(3.4).stagger(0.14).duration(0.35).appear();

      local.animate([sensorsCard, toolsCard]).at(3.72).stagger(0.2).duration(0.45).appear();
      local.animate([sensors, sensorsCaption, tools, toolsCaption])
        .at(4.0).stagger(0.12).duration(0.35).appear();
      local.animate([sensorsToAgent, agentToTools]).at(4.5).stagger(0.15).duration(0.42).draw();

      local.animate(environmentCard).at(4.85).duration(0.45).appear();
      local.animate([environment, environmentCaption]).at(5.05).stagger(0.18).duration(0.38).appear();
      local.animate([environmentToSensors, toolsToEnvironment])
        .at(5.35).stagger(0.15).duration(0.45).draw();

      for (let loopIndex = 0; loopIndex < 3; loopIndex += 1) {
        for (let routeIndex = 0; routeIndex < routes.length; routeIndex += 1) {
          const index = loopIndex * routes.length + routeIndex;
          const route = routes[routeIndex];
          const start = loopStart + index * stepDuration;
          const pulse = pulses[index];
          const counter = counterLabels[index];

          local.animate(counter).at(start).duration(0.12).appear();
          local.animate(counter).at(start + 0.58).duration(0.1).disappear();
          local.animate(pulse).at(start).duration(0.08).appear();
          local.animate(pulse).at(start + 0.05).duration(0.5).ease("inOutCubic").moveTo(route.to);
          local.animate(pulse).at(start + 0.56).duration(0.08).disappear();
          local.animate(route.focus).at(start + 0.35).duration(0.28).indicate();
        }
      }

      local.animate(counterPlate).at(18.72).duration(0.28).disappear();
      local.animate(outro).at(18.95).duration(0.65).typewrite();
      local.animate(closer).at(19.7).duration(0.6).appear();
      local.animate(closer).at(20.45).duration(0.65).indicate();
    }));
    this.wait(2);
  }
}

render(import.meta.url, AgenticAIShort, {
  output: sourcePath("../output/agentic-ai-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.18,
  },
});
