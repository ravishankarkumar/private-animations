import { render } from "murali-js";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, Tattva, timeline, type TattvaState } from "murali-js/core";
import { Label } from "murali-js/text";

const BG = "#040812";
const INK = "#F4FBFF";
const MUTED = "#8BA8B7";

// The blob carves in quickly. The long look is the dive into the boundary,
// not a hold on the finished picture.
const HOLDS = [0.35, 0.6, 1, 1.8, 3.2, 6, 1.2];
const LEAD = 0;
const DRAW = 0.5;
const FADE = 0.22;
const OPENING_DEPTH = 4;
const DEPTHS = [8, 14, 24, 40, 64, 96, 140];

const PLATE = 7.1;
const PIXELS = 1080;

// Full set, then the upper seahorse valley: the crack between the cardioid
// and the round head. Width shrinks exponentially toward FOCUS_W.
const DIVE = 6.4;
const CREEP = 5.4;
const PULL = 3.4;
const UNTYPE = 0.5;
const SHRINK = 0.45;
const LIFT = 0.55;

const VERTEX = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform float uIteration;
uniform float uZoom;

const vec2 FULL_C = vec2(-0.7, 0.0);
const float FULL_W = 3.0;
const vec2 FOCUS = vec2(-0.7478, 0.1142);
const float FOCUS_W = 0.07;
const float DEEP_ITER = 460.0;
const vec3 FIELD = vec3(4.0, 8.0, 18.0) / 255.0;
const vec3 INTERIOR = vec3(3.0, 5.0, 12.0) / 255.0;

vec3 stopColor(float mu) {
  if (mu <= 8.0) return vec3(16.0, 84.0, 148.0) / 255.0;
  if (mu <= 14.0) return mix(vec3(16.0, 84.0, 148.0), vec3(36.0, 176.0, 214.0), (mu - 8.0) / 6.0) / 255.0;
  if (mu <= 24.0) return mix(vec3(36.0, 176.0, 214.0), vec3(96.0, 224.0, 230.0), (mu - 14.0) / 10.0) / 255.0;
  if (mu <= 40.0) return mix(vec3(96.0, 224.0, 230.0), vec3(186.0, 236.0, 186.0), (mu - 24.0) / 16.0) / 255.0;
  if (mu <= 70.0) return mix(vec3(186.0, 236.0, 186.0), vec3(246.0, 214.0, 132.0), (mu - 40.0) / 30.0) / 255.0;
  if (mu <= 110.0) return mix(vec3(246.0, 214.0, 132.0), vec3(255.0, 246.0, 226.0), (mu - 70.0) / 40.0) / 255.0;
  if (mu <= 140.0) return mix(vec3(255.0, 246.0, 226.0), vec3(255.0, 252.0, 248.0), (mu - 110.0) / 30.0) / 255.0;
  return vec3(255.0, 252.0, 248.0) / 255.0;
}

vec3 exterior(float shown) {
  if (shown <= 2.6) return FIELD;
  vec3 ink = stopColor(shown);
  if (shown < 8.0) {
    float fade = (shown - 2.6) / (8.0 - 2.6);
    float smoothFade = fade * fade * (3.0 - 2.0 * fade);
    return mix(FIELD, ink, smoothFade);
  }
  return ink;
}

void main() {
  float zoom = clamp(uZoom, 0.0, 1.0);
  float width = exp(mix(log(FULL_W), log(FOCUS_W), zoom));
  float lambda = FULL_W / width;
  float lambdaMax = FULL_W / FOCUS_W;
  float k = (1.0 / lambda - 1.0 / lambdaMax) / (1.0 - 1.0 / lambdaMax);
  vec2 center = FOCUS + (FULL_C - FOCUS) * k;
  vec2 c = vec2(
    center.x + (vUv.x - 0.5) * width,
    center.y + (vUv.y - 0.5) * width
  );

  float cap = mix(max(uIteration, 1.0), DEEP_ITER, zoom);
  float zr = 0.0;
  float zi = 0.0;
  float n = 0.0;
  for (int i = 0; i < 460; i++) {
    float zr2 = zr * zr;
    float zi2 = zi * zi;
    if (zr2 + zi2 > 256.0 || n >= cap) break;
    zi = 2.0 * zr * zi + c.y;
    zr = zr2 - zi2 + c.x;
    n += 1.0;
  }

  vec3 color = INTERIOR;
  float mag2 = zr * zr + zi * zi;
  if (mag2 > 256.0) {
    float mu = n - log(log(sqrt(mag2)) / log(2.0)) / log(2.0);
    // While the picture is still the whole set, color by the raw escape
    // time. Deeper windows stretch that same palette so the rim stays bright.
    float shown = zoom <= 0.0 ? mu : mu / cap * 140.0;
    color = exterior(shown);
    float frontier = cap - mu;
    if (frontier < 0.8) color = mix(INTERIOR, color, frontier / 0.8);
    if (zoom <= 0.0 && uIteration < 24.0) {
      float edge = uIteration - mu;
      if (edge < 1.4) {
        float hot = 1.0 - edge / 1.4;
        float gain = hot * hot * (1.0 - uIteration / 24.0);
        color += (vec3(190.0, 246.0, 255.0) / 255.0 - color) * gain;
      }
    }
  }

  if (zoom > 0.04) {
    float radius = length(vUv - 0.5);
    float vig = 1.0 - smoothstep(0.32, 0.58, radius);
    color = mix(FIELD, color, vig);
  }
  fragColor = vec4(color, 1.0);
}
`;

interface MandelbrotState extends TattvaState {
  /** Escape-time depth. Raising it carves the black set out of the blob. */
  iteration: number;
  /** 0 is the whole set. 1 is the seahorse valley. */
  zoom: number;
}

interface PlateGl {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  iteration: WebGLUniformLocation;
  zoom: WebGLUniformLocation;
}

function stageClock(holds: readonly number[]): { at: number[]; end: number } {
  const at: number[] = [];
  let time = LEAD;
  for (let index = 0; index < holds.length; index += 1) {
    at.push(time);
    time += (index === 0 ? DRAW : FADE) + holds[index]!;
  }
  return { at, end: time };
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create the Mandelbrot shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Mandelbrot shader failed to compile.");
  }
  return shader;
}

function mountGl(canvas: HTMLCanvasElement): PlateGl {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) throw new Error("WebGL2 is required to draw the Mandelbrot set.");
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create the Mandelbrot program.");
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Mandelbrot program failed to link.");
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);
  gl.viewport(0, 0, PIXELS, PIXELS);
  const iteration = gl.getUniformLocation(program, "uIteration");
  const zoom = gl.getUniformLocation(program, "uZoom");
  if (!iteration || !zoom) throw new Error("Mandelbrot uniforms are missing.");
  return { gl, program, iteration, zoom };
}

class MandelbrotPlate extends Tattva<MandelbrotState> {
  private plate: PlateGl | null = null;

  constructor() {
    super({ state: { iteration: OPENING_DEPTH, zoom: 0 } });
    this.dynamicGeometry = true;
    this.worldSize = { width: PLATE, height: PLATE };
  }

  override contentHTML(_time: number, state: Readonly<MandelbrotState> = this.initialState): string | undefined {
    const canvas = document.getElementById("mandelbrot-plate");
    if (!(canvas instanceof HTMLCanvasElement)) {
      return `<canvas id="mandelbrot-plate" width="${PIXELS}" height="${PIXELS}" style="width:100%;height:100%;display:block"></canvas>`;
    }
    const plate = this.plate ?? mountGl(canvas);
    this.plate = plate;
    plate.gl.useProgram(plate.program);
    plate.gl.uniform1f(plate.iteration, state.iteration);
    plate.gl.uniform1f(plate.zoom, state.zoom);
    plate.gl.drawArrays(plate.gl.TRIANGLES, 0, 3);
    return undefined;
  }
}

class MandelbrotShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const clock = stageClock(HOLDS);
    const plate = this.add(new MandelbrotPlate(), { at: [0, 0.3] });
    const title = this.add(
      Label("Mandelbrot set")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("z becomes z² + c")
        .height(0.24)
        .color(MUTED)
        .css({ fontWeight: 500 }),
      { at: [0, 6.28] },
    );
    const subscribe = this.add(
      YouTubeSubscribe("Kavriq", {
        handle: "@kavriq",
        message: "Subscribe for more visual stories",
        layout: "compact",
        size: [5.2, 3.5],
      }).opacity(0).layer(60),
      { at: [0, -0.7] },
    );

    const last = HOLDS.length - 1;

    this.play(timeline((t) => {
      t.animate(title).duration(0.01).revealText(1, 1);
      t.animate(rule).duration(0.01).revealText(1, 1);
      t.animate(title).at(0.05).duration(0.4).appear();
      t.animate(rule).at(0.18).duration(0.35).appear();
      t.animate(plate).at(clock.at[0]!).duration(DRAW).ease("outCubic").to({ iteration: DEPTHS[0]! });
      for (let index = 1; index <= last; index += 1) {
        t.animate(plate)
          .at(clock.at[index]!)
          .duration(FADE)
          .ease("linear")
          .to({ iteration: DEPTHS[index]! });
      }
      t.wait(clock.end);
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(DIVE).ease("outCubic").to({ zoom: 0.72 });
      t.animate(plate).at(DIVE).duration(CREEP).ease("inOutSine").to({ zoom: 1 });
      t.animate(plate).at(DIVE + CREEP).duration(PULL).ease("inOutCubic").to({ zoom: 0 });
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(UNTYPE).ease("outCubic").untypewrite();
      t.animate(rule).duration(UNTYPE * 0.84).ease("outCubic").untypewrite();
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(SHRINK).ease("inOutCubic").scaleTo(0.7);
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(LIFT).ease("inOutCubic").moveTo([0, 4.5]);
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

render(import.meta.url, MandelbrotShort, {
  output: sourcePath("../output/fractal-mandelbrot-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
