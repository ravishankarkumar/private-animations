import { render } from "murali-js";
import { ThreeTattva } from "murali-js/adapters";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, timeline, type TattvaState } from "murali-js/core";
import { Rectangle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import * as THREE from "three";

const BG = "#030711";
const INK = "#F4FBFF";
const CYAN = "#70E7FF";
const GOLD = "#FFD37A";
const MUTED = "#89A6B6";
const PLATE = 7.25;

const DEPTHS = [1, 2, 4, 8, 16, 32, 64, 128, 256] as const;
const BUILD_STEP = 0.78;

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;
uniform float uIterations;
uniform float uReveal;
uniform float uZoom;

const vec2 FULL_CENTER = vec2(-0.70, 0.0);
const float FULL_WIDTH = 3.15;
const vec2 DEEP_CENTER = vec2(-0.743643887, 0.131825904);
const float DEEP_WIDTH = 0.018;
const vec3 FIELD = vec3(3.0, 7.0, 17.0) / 255.0;
const vec3 INTERIOR = vec3(1.5, 3.0, 9.0) / 255.0;

vec3 palette(float value) {
  float t = clamp(value, 0.0, 1.0);
  vec3 blue = vec3(17.0, 88.0, 166.0) / 255.0;
  vec3 cyan = vec3(65.0, 220.0, 235.0) / 255.0;
  vec3 cream = vec3(255.0, 224.0, 157.0) / 255.0;
  if (t < 0.58) return mix(blue, cyan, t / 0.58);
  return mix(cyan, cream, (t - 0.58) / 0.42);
}

void main() {
  float revealRadius = uReveal * 0.78;
  float revealMask = 1.0 - smoothstep(revealRadius - 0.045, revealRadius + 0.045, length(vUv - 0.5));
  if (revealMask <= 0.001) {
    gl_FragColor = vec4(FIELD, 0.0);
    return;
  }

  float zoom = clamp(uZoom, 0.0, 1.0);
  float easedZoom = zoom * zoom * (3.0 - 2.0 * zoom);
  float width = exp(mix(log(FULL_WIDTH), log(DEEP_WIDTH), easedZoom));
  float lambda = FULL_WIDTH / width;
  float lambdaMax = FULL_WIDTH / DEEP_WIDTH;
  float centerMix = (1.0 / lambda - 1.0 / lambdaMax) / (1.0 - 1.0 / lambdaMax);
  vec2 center = DEEP_CENTER + (FULL_CENTER - DEEP_CENTER) * centerMix;
  vec2 c = center + (vUv - 0.5) * width;

  float cap = mix(max(uIterations, 1.0), 420.0, easedZoom);
  float zr = 0.0;
  float zi = 0.0;
  float n = 0.0;
  for (int index = 0; index < 420; index++) {
    float zr2 = zr * zr;
    float zi2 = zi * zi;
    if (zr2 + zi2 > 4.0 || n >= cap) break;
    zi = 2.0 * zr * zi + c.y;
    zr = zr2 - zi2 + c.x;
    n += 1.0;
  }

  float mag2 = zr * zr + zi * zi;
  vec3 color = INTERIOR;
  if (mag2 > 4.0) {
    float mu = n - log(log(sqrt(mag2)) / log(2.0)) / log(2.0);
    float normalized = zoom < 0.02
      ? clamp(mu / max(cap, 8.0), 0.0, 1.0)
      : fract(mu * 0.035 + easedZoom * 0.18);
    color = palette(normalized);

    // The newest escape band is the moving construction frontier.
    float frontier = cap - mu;
    float glow = 1.0 - smoothstep(0.0, 1.35, frontier);
    color = mix(color, vec3(0.94, 0.99, 1.0), glow * (1.0 - easedZoom * 0.65));
  }

  float vignette = 1.0 - smoothstep(0.4, 0.72, length(vUv - 0.5));
  color = mix(FIELD, color, mix(1.0, vignette, easedZoom * 0.52));
  gl_FragColor = vec4(color, revealMask);
}
`;

interface MandelbrotCoreState extends TattvaState {
  iterations: number;
  reveal: number;
  zoom: number;
}

class MandelbrotCorePlate extends ThreeTattva<MandelbrotCoreState> {
  constructor() {
    let material: THREE.ShaderMaterial | undefined;
    let railMaterial: THREE.MeshBasicMaterial | undefined;
    const progressMaterials: THREE.MeshBasicMaterial[] = [];
    super({
      setup({ scene, renderer }) {
        // Murali captures immediately after rendering. Waiting for WebGL here
        // prevents the GPU layer and DOM overlays from landing in different
        // compositor frames during deterministic export.
        const renderFrame = renderer.render.bind(renderer);
        renderer.render = ((threeScene, camera) => {
          renderFrame(threeScene, camera);
          renderer.getContext().finish();
        }) as typeof renderer.render;
        material = new THREE.ShaderMaterial({
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          uniforms: {
            uIterations: { value: 1 },
            uReveal: { value: 0 },
            uZoom: { value: 0 },
          },
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PLATE, PLATE), material);
        mesh.name = "mandelbrot-core-plane";
        mesh.renderOrder = -10;
        scene.add(mesh);

        railMaterial = new THREE.MeshBasicMaterial({
          color: 0x0b1b29,
          transparent: true,
          opacity: 0,
          depthTest: false,
        });
        const rail = new THREE.Mesh(
          new THREE.PlaneGeometry(5.35, 0.5),
          railMaterial,
        );
        rail.position.set(0, -4.62, 0);
        scene.add(rail);
        DEPTHS.forEach((_depth, index) => {
          const dotMaterial = new THREE.MeshBasicMaterial({
            color: 0x19384a,
            transparent: true,
            opacity: 0,
            depthTest: false,
          });
          progressMaterials.push(dotMaterial);
          const dot = new THREE.Mesh(new THREE.CircleGeometry(0.105, 28), dotMaterial);
          dot.position.set(-2.08 + index * 0.52, -4.62, 0.02);
          scene.add(dot);
        });
      },
      update(_context, state) {
        if (!material) return;
        material.uniforms.uIterations!.value = state.iterations;
        material.uniforms.uReveal!.value = state.reveal;
        material.uniforms.uZoom!.value = state.zoom;
        if (railMaterial) railMaterial.opacity = Math.min(0.95, state.reveal * 2);
        progressMaterials.forEach((dot, index) => {
          dot.opacity = Math.min(1, state.reveal * 3);
          dot.color.set(state.iterations >= DEPTHS[index]! ? (index === DEPTHS.length - 1 ? GOLD : CYAN) : "#19384A");
        });
      },
    }, { state: { iterations: 1, reveal: 0, zoom: 0 } });
    this.worldSize = { width: PLATE, height: PLATE };
  }
}

class MandelbrotCoreShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const plate = this.add(new MandelbrotCorePlate(), { at: [0, 0.25] });
    const title = this.add(
      Label("BUILDING THE\nMANDELBROT SET")
        .height(0.58)
        .color(INK)
        .depthMode("overlay")
        .css({ fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.035em", textAlign: "center" }),
      { at: [0, 6.55] },
    );
    const rule = this.add(
      Label("Start with z = 0  •  Repeat z² + c\nNine passes reveal what never escapes")
        .height(0.23)
        .color(MUTED)
        .depthMode("overlay")
        .css({ fontWeight: 650, lineHeight: 1.4, textAlign: "center" }),
      { at: [0, 5.55] },
    );
    const endScrim = this.add(
      Rectangle().size([9, 16]).fill(BG).opacity(0).layer(50).depthMode("overlay"),
    );
    const endTitle = this.add(
      Label("KEEP EXPLORING")
        .height(0.42)
        .color(CYAN)
        .opacity(0)
        .layer(60)
        .depthMode("overlay")
        .css({ fontWeight: 900, letterSpacing: "0.09em" }),
      { at: [0, 3.05] },
    );
    const subscribe = this.add(
      YouTubeSubscribe("Kavriq", {
        handle: "@kavriq",
        message: "Subscribe for more visual stories",
        layout: "compact",
        size: [5.4, 3.8],
      }).opacity(0).layer(60),
      { at: [0, 0] },
    );

    this.play(timeline((t) => {
      t.animate(title).duration(0.65).typewrite();
      t.animate(rule).at(0.35).duration(0.55).appear();
      t.animate([title, rule]).at(1.45).stagger(0.06).duration(0.38).disappear();
    }));

    this.play(timeline((t) => {
      t.animate(plate).duration(1.25).ease("outCubic").to({ reveal: 1 });

      DEPTHS.forEach((depth, index) => {
        const start = index * BUILD_STEP;
        t.animate(plate)
          .at(start)
          .duration(index === 0 ? 0.2 : BUILD_STEP * 0.72)
          .ease("linear")
          .to({ iterations: depth });
      });
      t.wait(DEPTHS.length * BUILD_STEP + 0.55);
    }));

    this.play(timeline((t) => {
      t.animate(plate).duration(6.2).ease("inOutCubic").to({ zoom: 1 });
    }));

    this.play(timeline((t) => {
      t.animate(endScrim).duration(0.5).appear();
      t.animate(endTitle).at(0.28).duration(0.5).appear();
    }));
    this.play(YouTubeSubscribeSequence(subscribe, {
      entranceDuration: 0.55,
      subscribeAt: 0.85,
      bellAt: 1.45,
      actionDuration: 0.45,
    }));
    this.wait(1.2);
  }
}

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

render(import.meta.url, MandelbrotCoreShort, {
  output: sourcePath("../output/fractal-mandelbrot-core-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
