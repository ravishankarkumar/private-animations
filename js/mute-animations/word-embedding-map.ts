import { render } from "veena";
import { Scene, timeline, type Tattva } from "veena/core";
import { Circle, Ellipse, Line, Rectangle } from "veena/primitives";
import { Label, type LabelTattva } from "veena/text";

const BG = "#050816";
const INK = "#F8FAFC";
const MUTED = "#9AA7C1";
const CYAN = "#36D9FF";
const VIOLET = "#A67BFF";
const GREEN = "#54E6A5";
const GOLD = "#FFCC66";

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

type WordNode = {
  word: string;
  color: string;
  point: ReturnType<typeof Circle>;
  label: LabelTattva;
  mapAt: readonly [number, number];
  constellationAt: readonly [number, number];
};

const words = [
  { word: "cat", color: CYAN, mapAt: [-1.05, 1.55], constellationAt: [-0.72, 1.08] },
  { word: "kitten", color: CYAN, mapAt: [-2.25, 0.62], constellationAt: [-1.38, 0.5] },
  { word: "dog", color: CYAN, mapAt: [-0.2, 0.25], constellationAt: [-0.18, 0.3] },
  { word: "tiger", color: CYAN, mapAt: [-1.0, -1.0], constellationAt: [-0.68, -0.42] },
  { word: "apple", color: GREEN, mapAt: [2.05, 1.7], constellationAt: [1.13, 1.12] },
  { word: "banana", color: GREEN, mapAt: [2.6, 0.55], constellationAt: [1.56, 0.45] },
  { word: "car", color: GOLD, mapAt: [1.2, -2.05], constellationAt: [0.78, -1.05] },
  { word: "bus", color: GOLD, mapAt: [2.55, -2.62], constellationAt: [1.52, -1.38] },
] as const;

const starPositions: readonly (readonly [number, number])[] = [
  [-3.15, 2.85], [-2.35, 2.35], [-0.15, 2.72], [1.15, 2.6], [2.75, 2.55],
  [-3.2, 1.2], [-2.62, -0.2], [2.95, 1.35], [3.15, -0.25], [-2.85, -1.65],
  [-2.0, -2.5], [-0.65, -2.75], [0.55, -2.45], [2.72, -2.42], [3.25, -3.15],
  [-3.25, -3.05], [-1.2, 3.2], [2.1, 3.15], [0.05, -3.35], [3.35, 0.55],
];

const constellationEdges: readonly (readonly [number, number])[] = [
  [0, 1], [0, 2], [0, 4], [1, 3], [2, 3], [2, 6], [4, 5], [4, 2], [5, 7], [6, 7],
];

class WordEmbeddingMapShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    // 0–3s: the question and the object that will survive the whole loop.
    const question = this.add(
      Label("WHAT DOES AI SEE WHEN IT READS")
        .height(0.32)
        .color(INK)
        .css({ fontWeight: 850, letterSpacing: "0.055em" }),
      { at: [0, 1.2] },
    );
    const hookCat = this.add(
      Label("CAT")
        .height(1.48)
        .color(CYAN)
        .css({
          fontWeight: 950,
          letterSpacing: "0.11em",
          filter: "drop-shadow(0 0 26px rgb(54 217 255 / 42%))",
        }),
      { at: [0, -0.15] },
    );
    const questionMark = this.add(
      Label("?").height(0.62).color(VIOLET).css({ fontWeight: 900 }),
      { at: [2.08, -0.08] },
    );

    // 3–7s: a compact vector expression that stays legible on mobile.
    const transformArrow = this.add(
      Label("→").height(0.58).color(VIOLET).css({ fontWeight: 800 }),
      { at: [-0.95, 1.05] },
    );
    const vector = this.add(
      Label("[ 0.82, −0.14, 0.47, … ]")
        .height(0.36)
        .color(INK)
        .css({ fontWeight: 750, letterSpacing: "0.015em", fontFamily: "ui-monospace, monospace" }),
      { at: [1.05, 1.05] },
    );
    const vectorCaption = this.add(
      Label("AI TURNS WORDS INTO\nLISTS OF NUMBERS")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.025em", lineHeight: "1.18" }),
      { at: [0, -2.25] },
    );
    const vectorSub = this.add(
      Label("Each list becomes a position.")
        .height(0.23)
        .color(MUTED)
        .css({ fontWeight: 650 }),
      { at: [0, -3.35] },
    );

    // 7–21s: the meaning map. Every word begins at the vector's point and
    // travels to its semantic neighbourhood.
    const originGlow = this.add(
      Circle()
        .radius(0.32)
        .fill("rgba(54,217,255,0.16)")
        .css({ filter: "blur(8px)" }),
      { at: [0, 1.0] },
    );
    const originPoint = this.add(
      Circle()
        .radius(0.13)
        .fill(CYAN)
        .css({ filter: "drop-shadow(0 0 16px rgb(54 217 255 / 80%))" }),
      { at: [0, 1.0] },
    );

    const nodes: WordNode[] = words.map(({ word, color, mapAt, constellationAt }) => ({
      word,
      color,
      mapAt,
      constellationAt,
      point: this.add(
        Circle()
          .radius(0.13)
          .fill(color)
          .css({ filter: `drop-shadow(0 0 14px ${color})` }),
        { at: [0, 1.0] },
      ),
      label: this.add(
        Label(word).height(0.27).color(INK).css({ fontWeight: 800 }),
        { at: [0.45, 1.0] },
      ),
    }));

    const animalHalo = this.add(
      Ellipse()
        .radii([1.58, 1.65])
        .fill("rgba(54,217,255,0.045)")
        .stroke({ color: "rgba(54,217,255,0.28)", width: 0.035 })
        .css({ filter: "drop-shadow(0 0 24px rgb(54 217 255 / 14%))" }),
      { at: [-1.08, 0.34] },
    );
    const fruitHalo = this.add(
      Ellipse()
        .radii([1.02, 1.18])
        .fill("rgba(84,230,165,0.045)")
        .stroke({ color: "rgba(84,230,165,0.28)", width: 0.035 }),
      { at: [2.28, 1.12] },
    );
    const vehicleHalo = this.add(
      Ellipse()
        .radii([1.2, 0.78])
        .fill("rgba(255,204,102,0.045)")
        .stroke({ color: "rgba(255,204,102,0.3)", width: 0.035 }),
      { at: [1.9, -2.3] },
    );
    const clusterCaption = this.add(
      Label("SIMILAR MEANINGS\nMOVE CLOSER TOGETHER")
        .height(0.38)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.035em", lineHeight: "1.18" }),
      { at: [0, -5.15] },
    );

    // 14–21s: visual nearest-neighbour search.
    const searchPlate = this.add(
      Rectangle()
        .size([5.55, 0.92])
        .cornerRadius(0.28)
        .fill("rgba(166,123,255,0.12)")
        .stroke({ color: VIOLET, width: 0.045 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 0 22px rgb(166 123 255 / 18%))" }),
      { at: [0, 5.48] },
    );
    const searchLabel = this.add(
      Label("SEARCH   “kitten”")
        .height(0.3)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.045em" }),
      { at: [0, 5.48] },
    );
    const ripples = [0.42, 0.72, 1.05].map((radius) => this.add(
      Circle()
        .radius(radius)
        .fill("rgba(0,0,0,0)")
        .stroke({ color: VIOLET, width: 0.045 })
        .opacity(0),
      { at: words[1].mapAt },
    ));
    const searchOrder = [0, 2, 3];
    const resultRings = searchOrder.map((nodeIndex) => this.add(
      Circle()
        .radius(0.29)
        .fill("rgba(0,0,0,0)")
        .stroke({ color: INK, width: 0.055 })
        .css({ filter: "drop-shadow(0 0 14px rgb(248 250 252 / 65%))" }),
      { at: words[nodeIndex].mapAt },
    ));
    const resultRanks = searchOrder.map((nodeIndex, rank) => this.add(
      Label(String(rank + 1))
        .height(0.18)
        .color(BG)
        .css({
          fontWeight: 950,
          background: INK,
          borderRadius: "999px",
          padding: "0.08em 0.34em",
        }),
      { at: [words[nodeIndex].mapAt[0] - 0.3, words[nodeIndex].mapAt[1] + 0.3] },
    ));
    const searchCaption = this.add(
      Label("AI SEARCHES BY DISTANCE,\nNOT SPELLING")
        .height(0.4)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.03em", lineHeight: "1.18" }),
      { at: [0, -5.15] },
    );

    // 21–27s: expand the small map into a much larger embedding space.
    const extraStars = starPositions.map((at, index) => this.add(
      Circle()
        .radius(index % 4 === 0 ? 0.075 : 0.045)
        .fill(index % 3 === 0 ? VIOLET : index % 3 === 1 ? CYAN : GREEN)
        .opacity(0)
        .css({ filter: "drop-shadow(0 0 9px currentColor)" }),
      { at },
    ));
    const constellationLines = constellationEdges.map(([from, to]) => this.add(
      Line()
        .from(words[from].constellationAt)
        .to(words[to].constellationAt)
        .stroke({ color: "rgba(154,167,193,0.32)", width: 0.025 }),
    ));
    const revealKicker = this.add(
      Label("THIS MAP IS CALLED")
        .height(0.21)
        .color(MUTED)
        .css({ fontWeight: 850, letterSpacing: "0.16em" }),
      { at: [0, -4.25] },
    );
    const revealTitle = this.add(
      Label("AN EMBEDDING")
        .height(0.62)
        .color(CYAN)
        .css({
          fontWeight: 950,
          letterSpacing: "0.045em",
          filter: "drop-shadow(0 0 22px rgb(54 217 255 / 36%))",
        }),
      { at: [0, -4.85] },
    );
    const revealLine = this.add(
      Label("MEANING, TURNED INTO MATHEMATICS.")
        .height(0.23)
        .color(INK)
        .css({ fontWeight: 750, letterSpacing: "0.065em" }),
      { at: [0, -5.65] },
    );

    // Final copies restore the exact opening composition for a seamless loop.
    const closingQuestion = this.add(
      Label("WHAT DOES AI SEE WHEN IT READS")
        .height(0.32)
        .color(INK)
        .css({ fontWeight: 850, letterSpacing: "0.055em" }),
      { at: [0, 1.2] },
    );
    const closingCat = this.add(
      Label("CAT")
        .height(1.48)
        .color(CYAN)
        .css({
          fontWeight: 950,
          letterSpacing: "0.11em",
          filter: "drop-shadow(0 0 26px rgb(54 217 255 / 42%))",
        }),
      { at: [0, -0.15] },
    );
    const closingQuestionMark = this.add(
      Label("?").height(0.62).color(VIOLET).css({ fontWeight: 900 }),
      { at: [2.08, -0.08] },
    );

    const mapVisuals: Tattva[] = [
      animalHalo,
      fruitHalo,
      vehicleHalo,
      ...nodes.flatMap(({ point, label }) => [point, label]),
    ];

    this.play(timeline((t) => {
      // Hook.
      t.animate(hookCat).at(0.3).duration(0.52).indicate();
      t.animate(hookCat).at(1.15).duration(0.52).indicate();
      t.animate(hookCat).at(2.18).duration(0.52).indicate();

      // Word → vector.
      t.animate([question, questionMark]).at(2.86).duration(0.24).disappear();
      t.animate(hookCat).at(2.9).duration(0.52).ease("inOutCubic").moveTo([-2.45, 1.05]);
      t.animate(hookCat).at(2.9).duration(0.52).ease("inOutCubic").scaleTo(0.42);
      t.animate(transformArrow).at(3.25).duration(0.34).appear();
      t.animate(vector).at(3.5).duration(0.95).typewrite();
      t.animate(vectorCaption).at(4.58).duration(0.55).appear();
      t.animate(vectorSub).at(5.15).duration(0.4).appear();
      t.animate([hookCat, transformArrow, vector, vectorCaption, vectorSub])
        .at(6.72).stagger(0.025).duration(0.3).disappear();

      // The vector condenses into a point, then words spread into clusters.
      t.animate([originGlow, originPoint]).at(6.9).stagger(0.08).duration(0.3).appear();
      t.animate(originPoint).at(7.16).duration(0.2).ease("outCubic").scaleTo(1.75);
      t.animate(originPoint).at(7.36).duration(0.22).ease("inOutCubic").scaleTo(1);
      nodes.forEach(({ point, label, mapAt }, index) => {
        const start = 7.38 + index * 0.27;
        t.animate([point, label]).at(start).stagger(0.04).duration(0.18).appear();
        t.animate(point).at(start + 0.12).duration(0.85).ease("inOutCubic").moveTo(mapAt);
        t.animate(label).at(start + 0.12).duration(0.85).ease("inOutCubic").moveTo([mapAt[0] + 0.46, mapAt[1]]);
      });
      t.animate([originPoint, originGlow]).at(9.75).duration(0.3).disappear();
      t.animate([animalHalo, fruitHalo, vehicleHalo]).at(10.05).stagger(0.25).duration(0.55).appear();
      t.animate(clusterCaption).at(11.15).duration(0.6).appear();
      t.animate([animalHalo, fruitHalo, vehicleHalo]).at(12.35).stagger(0.15).duration(0.28).scaleTo(1.06);
      t.animate([animalHalo, fruitHalo, vehicleHalo]).at(12.68).stagger(0.15).duration(0.24).scaleTo(1);

      // Semantic search.
      t.animate(clusterCaption).at(13.75).duration(0.28).disappear();
      t.animate(searchPlate).at(13.95).duration(0.42).appear();
      t.animate(searchLabel).at(14.16).duration(0.55).typewrite();
      ripples.forEach((ripple, index) => {
        t.animate(ripple).at(14.8 + index * 0.3).duration(0.12).appear();
        t.animate(ripple).at(14.9 + index * 0.3).duration(0.82).ease("outCubic").scaleTo(1.7);
        t.animate(ripple).at(15.45 + index * 0.3).duration(0.28).disappear();
      });
      resultRings.forEach((ring, index) => {
        const start = 16.15 + index * 0.72;
        t.animate(ring).at(start).duration(0.35).draw();
        t.animate(resultRanks[index]).at(start + 0.16).duration(0.28).appear();
        t.animate(nodes[searchOrder[index]].point).at(start + 0.12).duration(0.22).ease("outCubic").scaleTo(1.7);
        t.animate(nodes[searchOrder[index]].point).at(start + 0.34).duration(0.25).ease("inOutCubic").scaleTo(1);
      });
      t.animate(searchCaption).at(18.35).duration(0.58).appear();

      // Zoom out to the full constellation.
      t.animate([searchPlate, searchLabel, searchCaption, ...resultRings, ...resultRanks])
        .at(20.68).stagger(0.012).duration(0.3).disappear();
      t.animate([animalHalo, fruitHalo, vehicleHalo]).at(20.72).duration(0.34).disappear();
      nodes.forEach(({ point, label, constellationAt }, index) => {
        t.animate(point).at(20.98).duration(0.86).ease("inOutCubic").moveTo(constellationAt);
        t.animate(label).at(20.98).duration(0.86).ease("inOutCubic").moveTo([constellationAt[0] + 0.34, constellationAt[1]]);
        t.animate(label).at(20.98).duration(0.86).scaleTo(0.76);
        t.animate(point).at(20.98).duration(0.86).scaleTo(0.8);
        t.animate(extraStars[index]).at(21.08 + index * 0.035).duration(0.28).appear();
      });
      t.animate(extraStars.slice(nodes.length)).at(21.25).stagger(0.055).duration(0.32).appear();
      t.animate(constellationLines).at(21.38).stagger(0.08).duration(0.5).draw();
      t.animate(revealKicker).at(22.3).duration(0.42).appear();
      t.animate(revealTitle).at(22.65).duration(0.62).ease("outCubic").appear();
      t.animate(revealTitle).at(23.45).duration(0.62).indicate();
      t.animate(revealLine).at(24.05).duration(0.7).typewrite();

      // Collapse all meaning back into the original token.
      t.animate([revealKicker, revealTitle, revealLine]).at(26.62).stagger(0.035).duration(0.28).disappear();
      t.animate(nodes.map(({ label }) => label)).at(26.72).stagger(0.018).duration(0.22).disappear();
      t.animate(constellationLines).at(26.76).stagger(0.015).duration(0.28).disappear();
      t.animate(extraStars).at(26.78).stagger(0.012).duration(0.3).disappear();
      nodes.forEach(({ point }) => {
        t.animate(point).at(26.78).duration(0.82).ease("inOutCubic").moveTo([0, -0.15]);
        t.animate(point).at(26.78).duration(0.82).scaleTo(0.18);
        t.animate(point).at(27.48).duration(0.18).disappear();
      });
      t.animate(closingCat).at(27.42).duration(0.5).ease("outCubic").appear();
      t.animate(closingQuestion).at(28.02).duration(0.5).appear();
      t.animate(closingQuestionMark).at(28.38).duration(0.3).appear();
      t.animate(closingCat).at(28.82).duration(0.52).indicate();
      t.animate(closingCat).at(29.48).duration(0.52).indicate();
      t.wait(30);
    }));
  }
}

render(import.meta.url, WordEmbeddingMapShort, {
  output: sourcePath("../output/word-embedding-map-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.18,
  },
});
