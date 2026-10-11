import { Tattva, type Scene, type Vec2 } from "murali-js/core";
import { Circle, Polygon, Rectangle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import { COLOR } from "./theme.ts";

export interface OpenEmailView {
  all: Tattva[];
  sender: Tattva[];
  subject: Tattva[];
  body: Tattva[];
  confirmationLink: Tattva[];
  attachment: Tattva[];
  reply: Tattva[];
  errorChip: Tattva[];
  anchors: {
    sender: Vec2;
    subject: Vec2;
    body: Vec2;
    confirmationLink: Vec2;
    attachment: Vec2;
    reply: Vec2;
  };
}

interface OpenEmailOptions {
  at?: Vec2;
  scale?: number;
}

const EMAIL_BORDER = "#334260";
const EMAIL_SURFACE = "#18223A";
const EMAIL_INSET = "#10182B";
const LINK_BLUE = "#70B7FF";
const AVATAR_FILL = "#243654";
const DOG_FUR = "#D59A62";
const DOG_MUZZLE = "#F0CAA0";

export function addOpenEmailView(
  scene: Scene,
  options: OpenEmailOptions = {},
): OpenEmailView {
  const [cx, cy] = options.at ?? [0, 0];
  const scale = options.scale ?? 1;
  const sx = (value: number) => cx + value * scale;
  const sy = (value: number) => cy + value * scale;
  const items: Tattva[] = [];

  const add = <T extends Tattva>(item: T, at: readonly [number, number, number]): T => {
    items.push(scene.add(item, { at }));
    return items.at(-1) as T;
  };

  // One quiet surface and one reading column. The mail chrome provides context;
  // the content, attachment, and draft provide the hierarchy.
  add(
    Rectangle().size([11.42 * scale, 6.72 * scale]).cornerRadius(0.25 * scale)
      .fill("#02040B").opacity(0.48).css({ filter: "blur(9px)" }),
    [sx(0.10), sy(-0.12), -0.08],
  );
  add(
    Rectangle().size([11.42 * scale, 6.72 * scale]).cornerRadius(0.25 * scale)
      .fill(EMAIL_SURFACE).stroke({ color: EMAIL_BORDER, width: 0.025 * scale })
      .css({ borderStyle: "none" }),
    [cx, cy, 0],
  );
  add(
    Rectangle().size([11.37 * scale, 0.58 * scale]).cornerRadius(0.22 * scale)
      .fill(EMAIL_INSET).css({ borderStyle: "none" }),
    [cx, sy(3.04), 0.01],
  );
  addLeftLabel(scene, items, "‹", sx(-5.22), sy(3.04), 0.31 * scale, COLOR.muted, 850);
  addLeftLabel(scene, items, "Inbox", sx(-4.72), sy(3.04), 0.17 * scale, COLOR.muted, 750);

  const subject: Tattva[] = [];
  subject.push(addLeftLabel(
    scene, items, "URGENT:", sx(-5.02), sy(2.36),
    0.31 * scale, COLOR.warning, 900,
  ));
  subject.push(addLeftLabel(
    scene, items, "Meeting moved", sx(-3.48), sy(2.36),
    0.31 * scale, COLOR.ink, 850,
  ));

  const sender: Tattva[] = [];
  sender.push(add(
    Circle().radius(0.30 * scale).fill(AVATAR_FILL),
    [sx(-4.72), sy(1.66), 0.03],
  ));
  sender.push(add(
    Label("?").height(0.23 * scale).color(COLOR.ai).css({ fontWeight: 900 }),
    [sx(-4.72), sy(1.66), 0.04],
  ));
  sender.push(addHtmlLeftLabel(
    scene, items, "unknown.sender@fast-confirm.net", sx(-4.22), sy(1.78),
    4.80 * scale, 0.19 * scale, COLOR.ink, 760,
  ));
  sender.push(addSenderMetadata(
    scene, items, sx(-4.22), sy(1.48), 4.80 * scale, 0.14 * scale,
  ));
  sender.push(addRightLabel(
    scene, items, "10:42 AM", sx(5.00), sy(1.78),
    0.14 * scale, COLOR.muted, 650,
  ));

  add(
    Rectangle().size([10.10 * scale, 0.014 * scale]).fill(EMAIL_BORDER)
      .css({ borderStyle: "none" }),
    [cx, sy(1.15), 0.02],
  );

  const contentLeft = sx(-4.72);
  const contentWidth = 8.90 * scale;
  const messageLeft = contentLeft + 0.38 * scale;
  const messageWidth = contentWidth - 0.38 * scale;
  const body: Tattva[] = [];
  body.push(addHtmlLeftLabel(
    scene, items, "Hi,", contentLeft, sy(0.78),
    contentWidth, 0.16 * scale, COLOR.muted, 600,
  ));
  body.push(addHtmlLeftLabel(
    scene, items, "The meeting is Tuesday at 10:00.", messageLeft, sy(0.36),
    messageWidth, 0.24 * scale, COLOR.ink, 740,
  ));
  body.push(addHtmlLeftLabel(
    scene, items, "Please confirm your attendance using the link below.", messageLeft, sy(-0.02),
    messageWidth, 0.16 * scale, COLOR.muted, 560,
  ));

  const confirmationLink: Tattva[] = [];
  confirmationLink.push(addHtmlLeftLabel(
    scene, items, "Confirm meeting  ↗", messageLeft, sy(-0.43),
    messageWidth, 0.18 * scale, LINK_BLUE, 750,
  ));

  const attachmentLeft = messageLeft;
  const attachment: Tattva[] = [];
  attachment.push(add(
    Rectangle().size([3.02 * scale, 0.76 * scale]).cornerRadius(0.13 * scale)
      .fill(EMAIL_INSET).css({ borderStyle: "none" }),
    [attachmentLeft + 1.51 * scale, sy(-1.03), 0.03],
  ));
  attachment.push(...addDogThumbnail(
    scene, items, [attachmentLeft + 0.39 * scale, sy(-1.03)], 0.72 * scale,
  ));
  attachment.push(addHtmlLeftLabel(
    scene, items, "dog-photo.jpg", attachmentLeft + 0.90 * scale, sy(-0.93),
    1.92 * scale, 0.16 * scale, COLOR.ink, 720,
  ));
  attachment.push(addHtmlLeftLabel(
    scene, items, "Image attachment", attachmentLeft + 0.90 * scale, sy(-1.17),
    1.92 * scale, 0.12 * scale, COLOR.muted, 550,
  ));

  const reply: Tattva[] = [];
  reply.push(add(
    Rectangle().size([10.10 * scale, 1.36 * scale]).cornerRadius(0.15 * scale)
      .fill("#211A2B").css({ borderStyle: "none" }),
    [cx, sy(-2.39), 0.03],
  ));
  reply.push(addHtmlLeftLabel(
    scene, items, "AI DRAFT", contentLeft, sy(-1.98),
    contentWidth, 0.14 * scale, COLOR.genai, 850,
  ));
  reply.push(addHtmlLeftLabel(
    scene, items, "See you Wednesday at 10:00.", contentLeft, sy(-2.49),
    contentWidth, 0.25 * scale, COLOR.ink, 720,
  ));

  const errorChip = addPill(
    scene, items, "TUE  →  WED", [sx(4.02), sy(-1.98)], [1.76 * scale, 0.36 * scale],
    "#3B2026", COLOR.warning,
  );

  return {
    all: items,
    sender,
    subject,
    body,
    confirmationLink,
    attachment,
    reply,
    errorChip,
    anchors: {
      sender: [sx(-4.72), sy(1.66)],
      subject: [sx(-3.10), sy(2.36)],
      body: [messageLeft + 2.42 * scale, sy(0.36)],
      confirmationLink: [messageLeft + 0.87 * scale, sy(-0.43)],
      attachment: [attachmentLeft + 1.51 * scale, sy(-1.03)],
      reply: [cx, sy(-2.39)],
    },
  };
}

function addDogThumbnail(
  scene: Scene,
  items: Tattva[],
  at: Vec2,
  scale: number,
): Tattva[] {
  const [x, y] = at;
  const result: Tattva[] = [];
  const push = <T extends Tattva>(item: T, px: number, py: number, z: number): T => {
    const added = scene.add(item, { at: [px, py, z] });
    items.push(added);
    result.push(added);
    return added;
  };
  push(
    Rectangle().size([0.92 * scale, 0.80 * scale]).cornerRadius(0.12 * scale)
      .fill("#29445D").css({ borderStyle: "none" }),
    x, y, 0.04,
  );
  push(Polygon.regular(3).radius(0.23 * scale).fill(DOG_FUR).rotate(-18), x - 0.23 * scale, y + 0.17 * scale, 0.05);
  push(Polygon.regular(3).radius(0.23 * scale).fill(DOG_FUR).rotate(18), x + 0.23 * scale, y + 0.17 * scale, 0.05);
  push(Circle().radius(0.29 * scale).fill(DOG_FUR), x, y, 0.06);
  push(Circle().radius(0.13 * scale).fill(DOG_MUZZLE), x, y - 0.10 * scale, 0.07);
  push(Circle().radius(0.032 * scale).fill("#10131C"), x - 0.10 * scale, y + 0.05 * scale, 0.08);
  push(Circle().radius(0.032 * scale).fill("#10131C"), x + 0.10 * scale, y + 0.05 * scale, 0.08);
  push(Circle().radius(0.045 * scale).fill("#10131C"), x, y - 0.08 * scale, 0.08);
  return result;
}

function addPill(
  scene: Scene,
  items: Tattva[],
  text: string,
  at: Vec2,
  size: Vec2,
  fill: string,
  ink: string,
): Tattva[] {
  const background = scene.add(
    Rectangle().size(size).cornerRadius(size[1] / 2).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.07] },
  );
  const label = scene.add(
    Label(text).height(size[1] * 0.35).color(ink).css({ fontWeight: 900, letterSpacing: "0.055em" }),
    { at: [at[0], at[1], 0.08] },
  );
  items.push(background, label);
  return [background, label];
}

function addLeftLabel(
  scene: Scene,
  items: Tattva[],
  text: string,
  left: number,
  y: number,
  height: number,
  color: string,
  weight: number,
  letterSpacing = "0",
): Tattva {
  const width = estimatedLabelWidth(text, height, letterSpacing);
  const label = scene.add(
    Label(text).height(height).color(color).css({ fontWeight: weight, letterSpacing, textAlign: "left" }),
    { at: [left + width / 2, y, 0.06] },
  );
  items.push(label);
  return label;
}

function addHtmlLeftLabel(
  scene: Scene,
  items: Tattva[],
  text: string,
  left: number,
  y: number,
  boxWidth: number,
  height: number,
  color: string,
  weight: number,
): Tattva {
  const label = new Tattva({
    html: escapeHtml(text),
    css: {
      alignItems: "center",
      color,
      display: "flex",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontWeight: weight,
      justifyContent: "flex-start",
      letterSpacing: "0",
      lineHeight: "1",
      whiteSpace: "nowrap",
    },
  });
  label.worldSize = { width: boxWidth, height };
  label.worldFontSize = height;
  const added = scene.add(label, { at: [left + boxWidth / 2, y, 0.06] });
  items.push(added);
  return added;
}

function addSenderMetadata(
  scene: Scene,
  items: Tattva[],
  left: number,
  y: number,
  boxWidth: number,
  height: number,
): Tattva {
  const metadata = new Tattva({
    html: `<span style="color:${COLOR.muted};font-weight:600">to me</span><span style="color:${COLOR.ai};font-size:.86em;font-weight:800;letter-spacing:.045em">•&nbsp;&nbsp;UNKNOWN SENDER</span>`,
    css: {
      alignItems: "center",
      display: "flex",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      gap: "0.72em",
      justifyContent: "flex-start",
      lineHeight: "1",
      whiteSpace: "nowrap",
    },
  });
  metadata.worldSize = { width: boxWidth, height };
  metadata.worldFontSize = height;
  const added = scene.add(metadata, { at: [left + boxWidth / 2, y, 0.06] });
  items.push(added);
  return added;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function addRightLabel(
  scene: Scene,
  items: Tattva[],
  text: string,
  right: number,
  y: number,
  height: number,
  color: string,
  weight: number,
): Tattva {
  const width = estimatedLabelWidth(text, height);
  const label = scene.add(
    Label(text).height(height).color(color).css({ fontWeight: weight, textAlign: "right" }),
    { at: [right - width / 2, y, 0.06] },
  );
  items.push(label);
  return label;
}

function estimatedLabelWidth(text: string, height: number, letterSpacing = "0"): number {
  const tracking = Number.parseFloat(letterSpacing) || 0;
  return text.length * height * (0.58 + tracking * 0.45);
}
