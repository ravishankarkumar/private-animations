import { render } from "murali-js";
import { Canvas3DTattva, type Canvas3DContext } from "murali-js/adapters";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, timeline, type TattvaState } from "murali-js/core";
import { Label } from "murali-js/text";

const BG = "#040812";
const INK = "#F4FBFF";
const MUTED = "#8BA8B7";

// Power 8 is the Mandelbulb. The camera shows the whole bulb, then goes in
// close on a side, the crown, and the underside before pulling back.
const PLATE_W = 9;
const PLATE_H = 16;
const ITERS0 = 7;
const ITERS1 = 10;
const FAR = 3.62;
const WIDE = 3.48;
const SIDE = 1.76;
const SIDE_IN = 1.62;
const CROWN = 1.84;
const BELLY = 1.74;
const BRIDGE = 2.48;
const P_WIDE = 0.22;
const P_SIDE = 0.06;
const P_SIDE_OUT = 0.2;
const P_CROWN = 0.9;
const P_BELLY = -0.48;
const P_HOME = 0.24;
const ESTABLISH = 4.4;
const DIVE_A = 2.5;
const SCAN_A = 3.1;
const RISE = 1.8;
const DIVE_B = 2.4;
const SCAN_B = 2.9;
const FALL = 1.7;
const DIVE_C = 2.4;
const SCAN_C = 3.0;
const PULL = 5.8;
const SPIN = ESTABLISH + DIVE_A + SCAN_A + RISE + DIVE_B + SCAN_B + FALL + DIVE_C + SCAN_C + PULL;
const UNTYPE = 0.5;
const PARK = 0.85;
const YAW0 = 0.4;
const YAW_RATE = 0.36;
// Full-frame plate is 1080×1920. A lower bitmap keeps the ray march viable.
const RENDER_SCALE = 0.64;

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

uniform float uIters;
uniform float uYaw;
uniform float uPitch;
uniform float uDist;
uniform vec2 uRes;

const vec3 FIELD = vec3(4.0, 8.0, 18.0) / 255.0;
const float BAILOUT = 4.0;
const float BOUND = 1.72;
const float POWER = 8.0;
const float FOCAL = 1.5;
const int ITERS = 10;
const int STEPS = 120;

struct Escape {
  float de;
  float trap;
  float band;
};

Escape marchPoint(vec3 pos, float iters) {
  vec3 z = pos;
  float dr = 1.0;
  float r = 0.0;
  float trap = 8.0;
  float band = 8.0;
  for (int i = 0; i < ITERS; i++) {
    if (float(i) >= iters) break;
    r = length(z);
    if (r > BAILOUT) break;
    trap = min(trap, r);
    band = min(band, abs(z.y));
    // Polar axis is Y so the crown stands upright in the portrait frame.
    float theta = atan(length(z.xz), z.y);
    float phi = atan(z.z, z.x);
    dr = pow(max(r, 1e-4), POWER - 1.0) * POWER * dr + 1.0;
    float zr = pow(r, POWER);
    theta *= POWER;
    phi *= POWER;
    float st = sin(theta);
    z = zr * vec3(st * cos(phi), cos(theta), st * sin(phi)) + pos;
  }
  r = max(r, 1e-4);
  dr = max(abs(dr), 1e-4);
  Escape hit;
  hit.de = 0.5 * log(r) * r / dr;
  hit.trap = trap;
  hit.band = band;
  return hit;
}

float distanceOnly(vec3 pos, float iters) {
  return marchPoint(pos, iters).de;
}

vec3 normalAt(vec3 pos, float iters, float scale) {
  float e = max(scale, 0.0004);
  vec2 k = vec2(1.0, -1.0);
  vec3 n = k.xyy * distanceOnly(pos + k.xyy * e, iters)
    + k.yyx * distanceOnly(pos + k.yyx * e, iters)
    + k.yxy * distanceOnly(pos + k.yxy * e, iters)
    + k.xxx * distanceOnly(pos + k.xxx * e, iters);
  float length2 = dot(n, n);
  return length2 > 1e-8 ? normalize(n) : vec3(0.0, 1.0, 0.0);
}

vec2 boundHit(vec3 ro, vec3 rd) {
  float b = dot(ro, rd);
  float c = dot(ro, ro) - BOUND * BOUND;
  float h = b * b - c;
  if (h < 0.0) return vec2(-1.0);
  h = sqrt(h);
  return vec2(-b - h, -b + h);
}

vec3 shade(vec3 rd, vec3 n, vec3 keyDir, vec3 fillDir, float band, float occ) {
  // Cyan and gold stay vivid and under the clip, so a bump can still shade.
  // The orbit trap sits near 1 on the whole surface, so the grooves come from
  // occlusion: open skin stays bright, a pocket drops into deep blue.
  float ridge = clamp(band / 0.55, 0.0, 1.0);
  vec3 deep = vec3(0.012, 0.07, 0.22);
  vec3 body = vec3(0.03, 0.78, 0.97);
  vec3 gold = vec3(1.0, 0.84, 0.14);
  vec3 albedo = mix(body, gold, smoothstep(0.2, 0.78, ridge));

  float key = clamp(dot(n, keyDir) * 0.38 + 0.62, 0.0, 1.0);
  float fill = clamp(dot(n, fillDir) * 0.22 + 0.78, 0.0, 1.0);
  float light = 0.72 + key * 0.20 + fill * 0.06;
  // A pocket stays darker than the skin around it, and keeps some of its own color.
  float crevice = smoothstep(0.08, 0.52, occ);
  vec3 color = mix(deep, albedo, mix(0.34, 1.0, crevice)) * light;

  float spec = pow(clamp(dot(reflect(-keyDir, n), -rd), 0.0, 1.0), 80.0);
  float rim = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.8);
  color += vec3(1.0, 0.95, 0.8) * spec * crevice * 0.09;
  color += vec3(0.28, 0.68, 0.9) * rim * 0.05;
  return clamp(color, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uRes.x / uRes.y;
  uv.y += 0.1;
  float iters = clamp(uIters, 1.0, float(ITERS));
  float yaw = uYaw;
  float pitch = uPitch + 0.03 * sin(yaw * 1.6);
  vec3 ro = vec3(
    uDist * cos(pitch) * sin(yaw),
    uDist * sin(pitch),
    uDist * cos(pitch) * cos(yaw)
  );
  vec3 target = vec3(0.0, -0.04, 0.0);
  vec3 forward = normalize(target - ro);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  vec3 rd = normalize(right * uv.x + up * uv.y + forward * FOCAL);

  vec3 color = FIELD;
  vec2 span = boundHit(ro, rd);
  if (span.y > 0.0) {
    float t = max(span.x, 0.0);
    float glow = 0.0;
    bool hit = false;
    float band = 1.0;
    for (int i = 0; i < STEPS; i++) {
      Escape probe = marchPoint(ro + rd * t, iters);
      float eps = 0.0011 * max(t, 0.4);
      // A tight halo only. A wide one paints the whole plate and shows its square edge.
      glow += exp(-42.0 * max(probe.de, 0.0));
      if (probe.de < eps) {
        float lo = max(t - max(probe.de, eps), span.x);
        float hi = t;
        for (int refine = 0; refine < 3; refine++) {
          float mid = 0.5 * (lo + hi);
          if (distanceOnly(ro + rd * mid, iters) < eps) hi = mid;
          else lo = mid;
        }
        t = hi;
        Escape settled = marchPoint(ro + rd * t, iters);
        band = settled.band;
        hit = true;
        break;
      }
      t += max(probe.de, eps) * 0.72;
      if (t > span.y) break;
    }
    if (hit) {
      vec3 pos = ro + rd * t;
      vec3 n = normalAt(pos, iters, 0.0024 * t);
      float occ = clamp(distanceOnly(pos + n * 0.028, iters) / 0.028, 0.0, 1.0);
      // Key sits with the camera and a little above, so each close pass is lit
      // and the mouths of holes, which face away, fall into shade.
      vec3 keyDir = normalize(forward * 0.7 + up * 0.52 + right * 0.26);
      vec3 fillDir = normalize(forward * 0.42 - right * 0.58 - up * 0.2);
      color = shade(rd, n, keyDir, fillDir, band, occ);
    } else {
      color += vec3(0.12, 0.42, 0.72) * clamp(glow * 0.0022, 0.0, 0.09);
    }
  }

  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += (dither - 0.5) / 255.0;
  fragColor = vec4(color, 1.0);
}
`;

interface MandelbulbState extends TattvaState {
  iters: number;
  yaw: number;
  pitch: number;
  dist: number;
}

interface PlateProgram {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  iters: WebGLUniformLocation;
  yaw: WebGLUniformLocation;
  pitch: WebGLUniformLocation;
  dist: WebGLUniformLocation;
  resolution: WebGLUniformLocation;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create the Mandelbulb shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Mandelbulb shader failed to compile.");
  }
  return shader;
}

function mountPlate(gl: WebGL2RenderingContext): PlateProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create the Mandelbulb program.");
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Mandelbulb program failed to link.");
  }
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  if (!vao || !buffer) throw new Error("Could not create the Mandelbulb mesh.");
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);
  const iters = gl.getUniformLocation(program, "uIters");
  const yaw = gl.getUniformLocation(program, "uYaw");
  const pitch = gl.getUniformLocation(program, "uPitch");
  const dist = gl.getUniformLocation(program, "uDist");
  const resolution = gl.getUniformLocation(program, "uRes");
  if (!iters || !yaw || !pitch || !dist || !resolution) throw new Error("Mandelbulb uniforms are missing.");
  return { program, vao, iters, yaw, pitch, dist, resolution };
}

function fitBuffer(canvas: HTMLCanvasElement): void {
  const width = canvas.style.width;
  const height = canvas.style.height;
  canvas.width = Math.max(2, Math.round(canvas.width * RENDER_SCALE));
  canvas.height = Math.max(2, Math.round(canvas.height * RENDER_SCALE));
  canvas.style.width = width;
  canvas.style.height = height;
}

class MandelbulbShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    let plateGl: PlateProgram | undefined;
    const plate = this.add(new Canvas3DTattva<MandelbulbState>({
      setup({ canvas, gl }: Canvas3DContext) {
        fitBuffer(canvas);
        plateGl = mountPlate(gl);
      },
      draw({ canvas, gl }: Canvas3DContext, state) {
        const runtime = plateGl;
        if (!runtime) return;
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.useProgram(runtime.program);
        gl.bindVertexArray(runtime.vao);
        gl.uniform1f(runtime.iters, state.iters);
        gl.uniform1f(runtime.yaw, state.yaw);
        gl.uniform1f(runtime.pitch, state.pitch);
        gl.uniform1f(runtime.dist, state.dist);
        gl.uniform2f(runtime.resolution, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.finish();
      },
    }, {
      size: [PLATE_W, PLATE_H],
      state: { iters: ITERS0, yaw: YAW0, pitch: P_WIDE, dist: FAR },
      contextAttributes: {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      },
    }), { at: [0, 0] });

    const title = this.add(
      Label("Mandelbulb")
        .height(0.42)
        .color(INK)
        .depthMode("overlay")
        .layer(40)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("z becomes z⁸ + c")
        .height(0.24)
        .color(MUTED)
        .depthMode("overlay")
        .layer(40)
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

    this.addUpdater(plate, ({ time, state }) => {
      state.yaw = YAW0 + YAW_RATE * time;
    });

    this.play(timeline((t) => {
      t.animate(title).duration(0.01).revealText(1, 1);
      t.animate(rule).duration(0.01).revealText(1, 1);
      t.animate(title).at(0.05).duration(0.4).appear();
      t.animate(rule).at(0.18).duration(0.35).appear();
      t.animate(plate).duration(ESTABLISH).ease("outCubic").to({ iters: ITERS1 });
      t.animate(title).at(ESTABLISH).duration(DIVE_A).ease("inOutCubic").fadeTo(0);
      t.animate(rule).at(ESTABLISH).duration(DIVE_A * 0.75).ease("inOutCubic").fadeTo(0);
      t.animate(title).at(SPIN - PULL).duration(PULL * 0.45).ease("outCubic").fadeTo(1);
      t.animate(rule).at(SPIN - PULL + 0.2).duration(PULL * 0.4).ease("outCubic").fadeTo(1);
      let at = ESTABLISH;
      const leg = (
        seconds: number,
        dist: number,
        pitch: number,
        ease: "inOutCubic" | "inOutSine" | "outCubic",
      ) => {
        t.animate(plate).at(at).duration(seconds).ease(ease).to({ dist, pitch });
        at += seconds;
      };
      leg(DIVE_A, SIDE, P_SIDE, "inOutCubic");
      leg(SCAN_A, SIDE_IN, P_SIDE_OUT, "inOutSine");
      leg(RISE, BRIDGE, P_CROWN * 0.72, "inOutCubic");
      leg(DIVE_B, CROWN, P_CROWN, "inOutCubic");
      leg(SCAN_B, CROWN - 0.08, P_CROWN - 0.08, "inOutSine");
      leg(FALL, BRIDGE, 0.05, "inOutCubic");
      leg(DIVE_C, BELLY, P_BELLY, "inOutCubic");
      leg(SCAN_C, BELLY - 0.08, P_BELLY + 0.1, "inOutSine");
      leg(PULL, WIDE, P_HOME, "inOutCubic");
      t.wait(SPIN);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(UNTYPE).ease("outCubic").untypewrite();
      t.animate(rule).duration(UNTYPE * 0.84).ease("outCubic").untypewrite();
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(PARK).ease("inOutCubic").scaleTo(0.34);
      t.animate(plate).duration(PARK).ease("inOutCubic").moveTo([0, 4.75]);
    }));
    this.play(YouTubeSubscribeSequence(subscribe, {
      entranceDuration: 0.6,
      subscribeAt: 0.95,
      bellAt: 1.6,
      actionDuration: 0.45,
    }));
    this.wait(2.6);
  }
}

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

render(import.meta.url, MandelbulbShort, {
  output: sourcePath("../output/fractal-mandelbulb-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
