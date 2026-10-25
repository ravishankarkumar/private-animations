/**
 * Stable semantic palette for the concepts used throughout the film.
 *
 * `fill` owns large surfaces such as regions, circles, and cards.
 * `accent` owns small high-energy details such as arrows, pulses, and highlights.
 * Text placed on a category fill should normally use `COLOR.ink`.
 */
export const CATEGORY = {
  ai: { fill: "#17647D", accent: "#31D7FF" },
  ml: { fill: "#1E7A55", accent: "#57E3A1" },
  dl: { fill: "#53368A", accent: "#9B6DFF" },
  genai: { fill: "#C4485C", accent: "#FF5FA2" },
  foundation: { fill: "#9A5A20", accent: "#FF9F43" },
  dataScience: { fill: "#956B22", accent: "#FFE08A" },
} as const;

export const COLOR = {
  background: "#070A16",
  panel: "#141C32",
  panelSoft: "#10172A",
  ink: "#F8FAFC",
  muted: "#9AA7C1",
  grid: "#263758",
  ai: CATEGORY.ai.accent,
  ml: CATEGORY.ml.accent,
  dl: CATEGORY.dl.accent,
  foundation: CATEGORY.foundation.accent,
  genai: CATEGORY.genai.accent,
  warning: "#FF6B5F",
  gold: "#FFC247"
} as const;

export const ALPHA = {
  ai: "rgba(49,215,255,0.12)",
  ml: "rgba(87,227,161,0.12)",
  dl: "rgba(155,109,255,0.14)",
  foundation: "rgba(255,159,67,0.14)",
  genai: "rgba(255,95,162,0.14)",
  warning: "rgba(255,107,95,0.14)",
  muted: "rgba(154,167,193,0.10)"
} as const;

export const FRAME = {
  width: 1920,
  height: 1080,
  fps: 30
} as const;
