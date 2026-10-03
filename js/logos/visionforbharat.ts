import { render } from "murali-js";
import { Scene } from "murali-js/core";
import { Group } from "murali-js/layout";
import { Ellipse, Rectangle, VectorShape } from "murali-js/primitives";
import { Label } from "murali-js/text";

const IVORY = "#FFF8EC";
const NAVY = "#142A46";
const NAVY_LIGHT = "#244362";
const SAFFRON = "#F36B2B";
const GOLD = "#FFC247";
const GREEN = "#16806A";

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

/**
 * Static identity study for Vision for Bharat.
 *
 * Every visual part is intentionally kept as a separate Tattva so the flame,
 * glow, wick, wax and wordmark can receive their own motion in the next pass.
 */
class VisionForBharatLogo extends Scene {
  constructor() {
    super({
      frame: "square",
      width: 1200,
      height: 1200,
      background: IVORY,
    });
  }

  override construct(): void {
    const glow = Ellipse()
      .radii([1.38, 1.58])
      .fill("rgba(255,194,71,0.15)")
      .css({ filter: "blur(18px)" })
      .at([0, 1.74]);

    const flame = VectorShape(
      "M 0 -1.48 C .68 -.91 .88 -.26 .68 .31 C .51 .80 .13 1.08 0 1.18 C -.18 1.04 -.71 .66 -.77 .03 C -.85 -.68 -.35 -1.15 0 -1.48 Z",
      { viewBox: { x: -0.9, y: -1.62, width: 1.8, height: 2.9 } },
    )
      .fill(SAFFRON)
      .css({ filter: "drop-shadow(0 10px 14px rgb(243 107 43 / 22%))" })
      .at([0, 1.82]);

    const innerFlame = VectorShape(
      "M .03 -.66 C .34 -.25 .38 .16 .21 .48 C .08 .72 -.14 .79 -.31 .58 C -.51 .32 -.31 -.18 .03 -.66 Z",
      { viewBox: { x: -0.58, y: -0.78, width: 1.16, height: 1.64 } },
    )
      .fill(GOLD)
      .at([0.08, 1.88]);

    const wick = Rectangle()
      .size([0.11, 0.5])
      .cornerRadius(0.055)
      .fill(NAVY)
      .rotate(-4)
      .at([0.03, 0.83]);

    const candle = Rectangle()
      .size([1.72, 2.42])
      .cornerRadius(0.3)
      .fill(NAVY)
      .at([0, -0.43]);

    const waxTop = Ellipse()
      .radii([0.86, 0.2])
      .fill(NAVY_LIGHT)
      .at([0, 0.74]);

    const visionCut = VectorShape(
      "M -.42 -.28 L -.21 -.47 L 0 -.24 L .21 -.47 L .42 -.28 L 0 .19 Z",
      { viewBox: { x: -0.5, y: -0.56, width: 1, height: 0.86 } },
    )
      .fill(GREEN)
      .at([0, -0.5]);

    const mark = Group([glow, candle, waxTop, visionCut, flame, wick, innerFlame])
      .scale(1.08)
      .at([0, 1.15]);

    const vision = Label("VISION")
      .height(0.88)
      .font("Avenir Next", "Inter", "ui-sans-serif", "sans-serif")
      .color(NAVY)
      .css({ fontWeight: 800, letterSpacing: "0.14em" })
      .at([0.08, -1.92]);

    const forBharat = Label("FOR BHARAT")
      .height(0.34)
      .font("Avenir Next", "Inter", "ui-sans-serif", "sans-serif")
      .color(GREEN)
      .css({ fontWeight: 700, letterSpacing: "0.34em" })
      .at([0.08, -2.72]);

    const accent = Rectangle()
      .size([0.7, 0.055])
      .cornerRadius(0.028)
      .fill(SAFFRON)
      .at([0, -3.24]);

    this.add(Group([mark, vision, forBharat, accent]));
    this.wait(0.1);
  }
}

await render(import.meta.url, VisionForBharatLogo, {
  output: sourcePath("../output/vision-for-bharat-logo.png"),
  format: "png",
  at: 0,
});

await render(import.meta.url, VisionForBharatLogo, {
  output: sourcePath("../output/vision-for-bharat-logo-transparent.png"),
  format: "png",
  transparent: true,
  at: 0,
});
