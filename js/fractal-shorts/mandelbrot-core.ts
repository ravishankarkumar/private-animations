import { render } from "murali-js";
import { ThreeTattva } from "murali-js/adapters";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, timeline, type TattvaState } from "murali-js/core";
import { Circle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import * as THREE from "three";

const BG = "#030711";
const INK = "#F4FBFF";
const CYAN = "#70E7FF";
const GOLD = "#FFD37A";
const MUTED = "#89A6B6";
const DIM = "#163244";
const PLATE = 7.25;

// One repeat of z² + c per stop. The first passes are where the disk
// dents, grows a cusp, and buds the round head, so those moves are slow.
// Later passes only add filaments, and the view tightens while they do.
const PASSES = [1, 2, 3, 4, 6, 8, 16, 40, 256] as const;
const CARVES = [0, 1.9, 1.5, 1.65, 1.15, 0.95, 0.8, 0.7, 1.85];
const HOLDS = [0.4, 0.55, 0.55, 0.6, 0.45, 0.4, 0.35, 0.35, 4.0];
const BUILD_END = HOLDS.reduce((sum, hold, index) => sum + hold + CARVES[index]!, 0);
const DIVE = 4.6;
const CREEP = 4.0;
const PULL = 2.5;
const ADMIRE = 0.6;
const UNTYPE = 0.5;
const SHRINK = 0.45;
const LIFT = 0.55;

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
uniform float uZoom;
uniform float uFrame;

const vec2 WIDE_CENTER = vec2(0.0, 0.0);
const float WIDE_WIDTH = 5.2;
const vec2 SET_CENTER = vec2(-0.70, 0.0);
const float SET_WIDTH = 3.4;
const vec2 DEEP_CENTER = vec2(-0.743644, 0.131826);
const float DEEP_WIDTH = 0.032;
const float DEEP_CAP = 480.0;
const vec3 FIELD = vec3(3.0, 7.0, 17.0) / 255.0;
const vec3 INTERIOR = vec3(0.0, 1.0, 6.0) / 255.0;

vec3 exterior(float shown) {
  if (shown <= 2.8) return FIELD;
  float t = clamp((shown - 2.8) / 96.0, 0.0, 1.0);
  vec3 blue = vec3(17.0, 88.0, 166.0) / 255.0;
  vec3 cyan = vec3(65.0, 220.0, 235.0) / 255.0;
  vec3 cream = vec3(255.0, 236.0, 196.0) / 255.0;
  vec3 ink = t < 0.45 ? mix(blue, cyan, t / 0.45) : mix(cyan, cream, (t - 0.45) / 0.55);
  if (shown < 8.0) {
    float fade = (shown - 2.8) / (8.0 - 2.8);
    float smoothFade = fade * fade * (3.0 - 2.0 * fade);
    return mix(FIELD, ink, smoothFade);
  }
  return ink;
}

void main() {
  float zoom = clamp(uZoom, 0.0, 1.0);
  float frame = clamp(uFrame, 0.0, 1.0);
  float framedWidth = exp(mix(log(WIDE_WIDTH), log(SET_WIDTH), frame));
  vec2 framedCenter = mix(WIDE_CENTER, SET_CENTER, frame);
  float zoomWidth = exp(mix(log(SET_WIDTH), log(DEEP_WIDTH), zoom));
  float lambda = SET_WIDTH / zoomWidth;
  float lambdaMax = SET_WIDTH / DEEP_WIDTH;
  float centerMix = (1.0 / lambda - 1.0 / lambdaMax) / (1.0 - 1.0 / lambdaMax);
  vec2 zoomCenter = DEEP_CENTER + (SET_CENTER - DEEP_CENTER) * centerMix;
  float width = zoom <= 0.0008 ? framedWidth : zoomWidth;
  vec2 center = zoom <= 0.0008 ? framedCenter : zoomCenter;
  vec2 c = center + (vUv - 0.5) * width;

  // Always integrate far enough to know the real escape time. The build
  // then reveals that time with a moving threshold, so the disk shrinks
  // into the next contour instead of popping.
  float shownLevel = max(uIterations, 1.0);
  float limit = mix(256.0, DEEP_CAP, zoom);
  float zr = 0.0;
  float zi = 0.0;
  float n = 0.0;
  for (int index = 0; index < 480; index++) {
    float zr2 = zr * zr;
    float zi2 = zi * zi;
    if (zr2 + zi2 > 4.0 || n >= limit) break;
    zi = 2.0 * zr * zi + c.y;
    zr = zr2 - zi2 + c.x;
    n += 1.0;
  }

  float mag2 = zr * zr + zi * zi;
  bool escaped = mag2 > 4.0;
  float mu = escaped
    ? n - log(log(max(sqrt(mag2), 2.0001)) / log(2.0)) / log(2.0)
    : limit + 4.0;
  // Integer pass decides membership. Smooth mu can dip below the pass it
  // belongs to, and using it alone draws a second curve on the disk.
  bool building = zoom <= 0.001;
  bool outside = escaped;
  if (building) {
    float base = floor(shownLevel);
    float frac = shownLevel - base;
    if (!escaped || n > base + 1.0) outside = false;
    else if (n <= base) outside = true;
    else outside = frac > 0.0001 && mu < shownLevel;
  }
  vec3 color = INTERIOR;
  if (outside) {
    float shown = building ? mu : mu / limit * 110.0;
    color = exterior(shown);
    float dist = shownLevel - mu;
    float rim = building ? 1.0 - smoothstep(8.0, 22.0, shownLevel) : 0.0;
    bool newest = n > shownLevel - 1.5;
    if (building && newest && dist > 0.0 && rim > 0.01) {
      float glow = 1.0 - smoothstep(3.0, 9.0, shownLevel);
      float halo = 1.0 - smoothstep(0.1, 0.42, dist);
      float core = 1.0 - smoothstep(0.0, 0.14, dist);
      color = mix(color, vec3(0.32, 0.72, 0.9), halo * halo * 0.55 * glow);
      color = mix(color, vec3(0.92, 0.98, 1.0), core * core * rim);
    }
  }

  if (zoom > 0.04) {
    float vig = 1.0 - smoothstep(0.30, 0.56, length(vUv - 0.5));
    color = mix(FIELD, color, vig);
  }
  gl_FragColor = vec4(color, 1.0);
}
`;

interface MandelbrotCoreState extends TattvaState {
  iterations: number;
  zoom: number;
  frame: number;
}

class MandelbrotCorePlate extends ThreeTattva<MandelbrotCoreState> {
  constructor() {
    let material: THREE.ShaderMaterial | undefined;
    super({
      setup({ scene, renderer }) {
        // Murali captures immediately after rendering. Waiting for WebGL here
        // keeps the GPU picture and the DOM labels in the same export frame.
        const renderFrame = renderer.render.bind(renderer);
        renderer.render = ((threeScene, camera) => {
          renderFrame(threeScene, camera);
          renderer.getContext().finish();
        }) as typeof renderer.render;
        renderer.setClearColor(0x000000, 0);
        material = new THREE.ShaderMaterial({
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          uniforms: {
            uIterations: { value: 1 },
            uZoom: { value: 0 },
            uFrame: { value: 0 },
          },
          depthTest: false,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PLATE, PLATE), material);
        mesh.name = "mandelbrot-core-plane";
        mesh.renderOrder = -10;
        scene.add(mesh);
      },
      update(_context, state) {
        if (!material) return;
        material.uniforms.uIterations!.value = state.iterations;
        material.uniforms.uZoom!.value = state.zoom;
        material.uniforms.uFrame!.value = state.frame;
      },
    }, { state: { iterations: 1, zoom: 0, frame: 0 } });
    this.worldSize = { width: PLATE, height: PLATE };
  }
}

class MandelbrotCoreShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const plate = this.add(new MandelbrotCorePlate(), { at: [0, 0.2] });
    const title = this.add(
      Label("Mandelbrot set")
        .height(0.42)
        .color(INK)
        .depthMode("overlay")
        .css({ fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("Points are colored by how fast they escape")
        .height(0.24)
        .color(MUTED)
        .depthMode("overlay")
        .css({ fontWeight: 500, textAlign: "center" }),
      { at: [0, 6.28] },
    );
    const dots = PASSES.flatMap((_, index) => {
      const x = (index - (PASSES.length - 1) / 2) * 0.46;
      const dim = this.add(
        Circle().radius(0.075).fill(DIM).depthMode("overlay").layer(40),
        { at: [x, -3.85] },
      );
      const lit = this.add(
        Circle().radius(0.075).fill(index === PASSES.length - 1 ? GOLD : CYAN).opacity(index === 0 ? 1 : 0).depthMode("overlay").layer(41),
        { at: [x, -3.85] },
      );
      return [dim, lit];
    });
    const marks = dots.filter((_, index) => index % 2 === 1);
    const subscribe = this.add(
      YouTubeSubscribe("Kavriq", {
        handle: "@kavriq",
        message: "Subscribe for more visual stories",
        layout: "compact",
        size: [5.2, 3.5],
      }).opacity(0).layer(60).depthMode("overlay"),
      { at: [0, -0.7] },
    );

    this.play(timeline((t) => {
      t.animate(title).duration(0.01).revealText(1, 1);
      t.animate(rule).duration(0.01).revealText(1, 1);
      t.animate(title).at(0.05).duration(0.4).appear();
      t.animate(rule).at(0.16).duration(0.35).appear();
      let cursor = HOLDS[0]!;
      let frameStart = cursor;
      for (let index = 1; index < PASSES.length; index += 1) {
        if (PASSES[index] === 16) frameStart = cursor;
        t.animate(plate).at(cursor).duration(CARVES[index]!).ease("inOutSine").to({ iterations: PASSES[index]! });
        t.animate(marks[index]!).at(cursor).duration(CARVES[index]!).ease("inOutSine").fadeTo(1);
        cursor += CARVES[index]! + HOLDS[index]!;
      }
      const frameDuration = cursor - HOLDS[HOLDS.length - 1]! - frameStart;
      t.animate(plate).at(frameStart).duration(frameDuration).ease("inOutCubic").to({ frame: 1 });
      t.wait(cursor);
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(DIVE).ease("outCubic").to({ zoom: 0.7 });
      t.animate(plate).at(DIVE).duration(CREEP).ease("inOutSine").to({ zoom: 1 });
      t.animate(plate).at(DIVE + CREEP).duration(PULL).ease("inOutCubic").to({ zoom: 0 });
      t.wait(DIVE + CREEP + PULL + ADMIRE);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(UNTYPE).ease("outCubic").untypewrite();
      t.animate(rule).duration(UNTYPE * 0.84).ease("outCubic").untypewrite();
      for (const dot of dots) t.animate(dot).duration(UNTYPE).fadeTo(0);
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(SHRINK).ease("inOutCubic").scaleTo(0.66);
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(LIFT).ease("inOutCubic").moveTo([0, 4.35]);
    }));
    this.play(YouTubeSubscribeSequence(subscribe, {
      entranceDuration: 0.6,
      subscribeAt: 0.95,
      bellAt: 1.6,
      actionDuration: 0.45,
    }));
    this.wait(2.5);
  }
}

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

render(import.meta.url, MandelbrotCoreShort, {
  output: sourcePath("../output/mandelbrot-core.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
