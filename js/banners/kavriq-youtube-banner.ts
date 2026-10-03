import { render } from "murali-js";
import { MuraliLogoMark } from "murali-js/composite";
import { Scene } from "murali-js/core";
import { fontFile } from "murali-js/style";
import { Ellipse, Rectangle, worldPath } from "murali-js/primitives";
import { Label } from "murali-js/text";

const BLACK = "#030305";
const PAPER = "#F7F7F2";
const MUTED = "#B3B4BE";
const BLUE = "#2563EB";
const VIOLET = "#7C3AED";
const CORAL = "#FF6B5F";

// The file lives in murali-js, but this banner source and its output stay in
// private-animations. The font path is embedded by Murali's scene bundler.
const SATOSHI = fontFile(
  "Satoshi",
  "../../../murali-js/assets/fonts/private/Satoshi-Bold.ttf",
  { weight: 700 },
);

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

/**
 * A static YouTube channel banner.
 *
 * Essential identity and copy fit inside YouTube's centered 1546 x 423 safe
 * area. The wide-field ribbons and oval echoes are intentionally expendable
 * on phones and desktop crops, while remaining visible on televisions.
 */
class KavriqYouTubeBanner extends Scene {
  constructor() {
    super({ width: 2560, height: 1440, background: BLACK });
  }

  override construct(): void {
    this.registerFont(SATOSHI);

    // Low-frequency color in the television-only edges keeps the black field
    // dimensional without weakening the wordmark's contrast.
    this.add(
      Ellipse()
        .radii([4.9, 3.1])
        .fill("radial-gradient(circle at 50% 50%, rgb(37 99 235 / 18%) 0%, rgb(37 99 235 / 5%) 45%, transparent 72%)")
        .css({ filter: "blur(24px)" }),
      { at: [-6.35, 3.0, -2] },
    );
    this.add(
      Ellipse()
        .radii([5.4, 3.3])
        .fill("radial-gradient(circle at 50% 50%, rgb(255 107 95 / 15%) 0%, rgb(124 58 237 / 5%) 48%, transparent 74%)")
        .css({ filter: "blur(30px)" }),
      { at: [6.1, -3.25, -2] },
    );

    // Three trajectories read as animation curves or motion trails, even in a
    // still banner. Their phase offsets borrow the Murali mark's three colors.
    this.add(
      worldPath()
        .moveTo(-7.4, -2.72)
        .cubicTo(-4.5, -3.15, -3.15, 2.45, 0.1, 1.88)
        .cubicTo(2.8, 1.42, 4.1, -1.7, 7.45, -0.92)
        .stroke({ color: "rgba(37, 99, 235, 0.22)", width: 0.038 }),
    );
    this.add(
      worldPath()
        .moveTo(-7.4, -2.45)
        .cubicTo(-4.2, -2.88, -2.95, 2.73, 0.25, 2.08)
        .cubicTo(2.88, 1.55, 4.38, -1.42, 7.45, -0.63)
        .stroke({ color: "rgba(124, 58, 237, 0.20)", width: 0.034 }),
    );
    this.add(
      worldPath()
        .moveTo(-7.4, -2.18)
        .cubicTo(-3.95, -2.6, -2.7, 2.95, 0.42, 2.28)
        .cubicTo(3.0, 1.72, 4.65, -1.13, 7.45, -0.34)
        .stroke({ color: "rgba(255, 107, 95, 0.18)", width: 0.03 }),
    );

    // Ghosted poses imply the mark has just swept in from the left.
    const trails = [
      { x: -5.52, opacity: 0.05, width: 1.22, blur: 12 },
      { x: -4.87, opacity: 0.10, width: 1.38, blur: 8 },
      { x: -4.22, opacity: 0.18, width: 1.52, blur: 4 },
    ] as const;
    for (const trail of trails) {
      this.add(
        MuraliLogoMark({ width: trail.width })
          .opacity(trail.opacity)
          .css({ filter: `blur(${trail.blur}px)` }),
        { at: [trail.x, 0.08, 0] },
      );
    }

    // The canonical, settled Murali mark uses the exact blue/violet/coral
    // palette and touching-oval geometry from murali-js.
    this.add(
      MuraliLogoMark({ width: 1.62 })
        .css({ filter: "drop-shadow(0 18px 34px rgb(0 0 0 / 55%))" }),
      { at: [-3.35, 0.08, 2] },
    );

    this.add(
      Label("KAVRIQ")
        .height(0.80)
        .font(SATOSHI, "Inter", "ui-sans-serif", "sans-serif")
        .fontWeight(700)
        .color(PAPER)
        .css({ letterSpacing: "0.19em", textShadow: "0 8px 28px rgb(0 0 0 / 65%)" }),
      { at: [-0.65, 0.34, 2] },
    );

    // One restrained chromatic dash connects the wordmark to the subject line
    // and quietly repeats the three-band motion language.
    const dashY = -0.35;
    this.add(Rectangle().size([0.25, 0.045]).cornerRadius(0.023).fill(BLUE), { at: [-3.63, dashY, 2] });
    this.add(Rectangle().size([0.25, 0.045]).cornerRadius(0.023).fill(VIOLET), { at: [-3.35, dashY, 2] });
    this.add(Rectangle().size([0.25, 0.045]).cornerRadius(0.023).fill(CORAL), { at: [-3.07, dashY, 2] });

    this.add(
      Label("MATHEMATICS  ·  MACHINE LEARNING & AI  ·  SOFTWARE SYSTEMS")
        .height(0.205)
        .font(SATOSHI, "Inter", "ui-sans-serif", "sans-serif")
        .fontWeight(700)
        .color(MUTED)
        .css({ letterSpacing: "0.055em" }),
      { at: [1.28, -0.37, 2] },
    );

    // Tiny timeline ticks reinforce the motion/animation idea without turning
    // the composition into an interface screenshot.
    const tickY = -0.82;
    for (let index = 0; index < 9; index += 1) {
      const active = index === 2 || index === 5 || index === 8;
      const color = index === 2 ? BLUE : index === 5 ? VIOLET : index === 8 ? CORAL : "#3B3C44";
      const height = active ? 0.085 : 0.045;
      this.add(
        Rectangle()
          .size([active ? 0.085 : 0.05, height])
          .cornerRadius(0.045)
          .fill(color),
        { at: [0.28 + index * 0.36, tickY, 2] },
      );
    }

    this.wait(0.1);
  }
}

await render(import.meta.url, KavriqYouTubeBanner, {
  output: sourcePath("../output/kavriq-youtube-banner.png"),
  format: "png",
  at: 0,
});
