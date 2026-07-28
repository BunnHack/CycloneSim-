// Auto-generated unified bundle for Cyclone Simulator
// Combines all modules into a single compilation context.



// --- START OF FILE: p5-shim.ts ---

// Lightweight p5.js emulation layer for HTML5 Canvas 2D
// Exposes the p5 API globally on the window object.

let db: any;
let mainMenu: any;
let basinCreationMenu: any;
let basinCreationMenuAdvanced: any;
let loadMenu: any;
let settingsMenu: any;
let primaryWrapper: any;
let areYouSure: any;
let sideMenu: any;
let saveBasinAsPanel: any;
let seedBox: any;
let helpBox: any;
let stormInfoPanel: any;
let timeline: any;
let dateNavigator: any;

const PI = Math.PI;
const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;

const PORTRAIT = 'portrait';
const LANDSCAPE = 'landscape';

const RGB = 'rgb';
const HSB = 'hsb';

type ColorModeName = 'RGB' | 'HSB';

function normalizeColorMode(mode: string): ColorModeName {
  return String(mode).toUpperCase() === 'HSB' ? 'HSB' : 'RGB';
}

function isHSBMode(mode: string): boolean {
  return normalizeColorMode(mode) === 'HSB';
}
const CENTER = 'center';
const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';
const NORMAL = 'normal';
const ITALIC = 'italic';

const ESCAPE = 27;
const ENTER = 13;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const BACKSPACE = 8;
const DELETE = 46;
const SHIFT = 16;
const CONTROL = 17;

let mouseX = 0;
let mouseY = 0;
let pmouseX = 0;
let pmouseY = 0;
let mouseIsPressed = false;
let keyIsPressed = false;
let key = '';
let keyCode = 0;
let deviceOrientation = 'landscape';

let mapZoom = 1;
let mapPanX = 0;
let mapPanY = 0;
let isPanningMap = false;
let panStartX = 0;
let panStartY = 0;
let initialPanX = 0;
let initialPanY = 0;
let hasDraggedMap = false;

function constrainPan() {
  if (mapZoom <= 1) {
    mapZoom = 1;
    mapPanX = 0;
    mapPanY = 0;
    return;
  }
  const minPanX = 1440 * (1 - mapZoom);
  const maxPanX = 0;
  const minPanY = 720 * (1 - mapZoom);
  const maxPanY = 0;

  mapPanX = Math.min(Math.max(mapPanX, minPanX), maxPanX);
  mapPanY = Math.min(Math.max(mapPanY, minPanY), maxPanY);
}

function zoomMapAt(factor: number, screenX?: number, screenY?: number) {
  if (screenX === undefined) screenX = 1440 / 2;
  if (screenY === undefined) screenY = 720 / 2;

  const oldZoom = mapZoom;
  let newZoom = mapZoom * factor;
  newZoom = Math.min(Math.max(newZoom, 1), 10);
  if (Math.abs(newZoom - 1) < 0.01) {
    newZoom = 1;
  }

  if (newZoom === 1) {
    mapZoom = 1;
    mapPanX = 0;
    mapPanY = 0;
    return;
  }

  const mapX = (screenX - mapPanX) / oldZoom;
  const mapY = (screenY - mapPanY) / oldZoom;

  mapZoom = newZoom;
  mapPanX = screenX - mapX * newZoom;
  mapPanY = screenY - mapY * newZoom;

  constrainPan();
}

function resetMapZoom() {
  mapZoom = 1;
  mapPanX = 0;
  mapPanY = 0;
  hasDraggedMap = false;
}

// Math wrappers
const floor = Math.floor;
const ceil = Math.ceil;
const round = Math.round;
const abs = Math.abs;
const min = Math.min;
const max = Math.max;
const sqrt = Math.sqrt;
const pow = Math.pow;
const cos = Math.cos;
const sin = Math.sin;
const atan2 = Math.atan2;
const log = Math.log;
const atan = Math.atan;

function constrain(n: number, low: number, high: number): number {
  return Math.max(Math.min(n, high), low);
}

function dist(x1: number, y1: number, x2: number, y2: number, z1 = 0, z2 = 0): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}

function map(n: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds?: boolean): number {
  let val = start2 + (stop2 - start2) * ((n - start1) / (stop1 - start1));
  if (withinBounds) {
    if (start2 < stop2) {
      val = Math.max(Math.min(val, stop2), start2);
    } else {
      val = Math.max(Math.min(val, start2), stop2);
    }
  }
  return val;
}

function lerp(start: number, stop: number, amt: number): number {
  return start + (stop - start) * amt;
}

function sq(n: number): number {
  return n * n;
}

function radians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function degrees(radians: number): number {
  return radians * (180 / Math.PI);
}

function random(minOrMax?: number, maxVal?: number): number {
  if (minOrMax === undefined) {
    return Math.random();
  }
  if (maxVal === undefined) {
    return Math.random() * minOrMax;
  }
  return minOrMax + Math.random() * (maxVal - minOrMax);
}

// Perlin Noise (Improved Noise algorithm)
class ImprovedNoise {
  private p: Int32Array;

  constructor(seed = Math.random()) {
    this.p = new Int32Array(512);
    const permutation = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      permutation[i] = i;
    }
    let s = seed;
    const lcgRandom = () => {
      const x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(lcgRandom() * (i + 1));
      const tmp = permutation[i];
      permutation[i] = permutation[j];
      permutation[j] = tmp;
    }
    for (let i = 0; i < 256; i++) {
      this.p[i] = permutation[i];
      this.p[256 + i] = permutation[i];
    }
  }

  private fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number) {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number, z: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;

    return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z),
                                                  this.grad(this.p[BA], x - 1, y, z)),
                                      this.lerp(u, this.grad(this.p[AB], x, y - 1, z),
                                                  this.grad(this.p[BB], x - 1, y - 1, z))),
                        this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1),
                                                  this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                                      this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1),
                                                  this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
  }
}

let noiseLod = 4;
let noiseFalloff = 0.5;
let activeNoiseGenerator = new ImprovedNoise();

function noise(x: number, y = 0, z = 0): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;
  for (let i = 0; i < noiseLod; i++) {
    const raw = activeNoiseGenerator.noise(x * frequency, y * frequency, z * frequency);
    const val = raw * 0.5 + 0.5; // map standard noise [-1, 1] to [0, 1]
    total += val * amplitude;
    maxValue += amplitude;
    amplitude *= noiseFalloff;
    frequency *= 2;
  }
  return total / maxValue;
}

function noiseDetail(lod: number, falloff: number) {
  noiseLod = lod;
  if (falloff !== undefined) noiseFalloff = falloff;
}

function noiseSeed(seed: number) {
  activeNoiseGenerator = new ImprovedNoise(seed);
}

// Color representation
let tempColorCanvasCtx: CanvasRenderingContext2D | null = null;
function parseCSSColor(str: string): [number, number, number, number] {
  if (!tempColorCanvasCtx) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    tempColorCanvasCtx = canvas.getContext('2d');
  }
  if (tempColorCanvasCtx) {
    tempColorCanvasCtx.clearRect(0, 0, 1, 1);
    tempColorCanvasCtx.fillStyle = str;
    tempColorCanvasCtx.fillRect(0, 0, 1, 1);
    const imgData = tempColorCanvasCtx.getImageData(0, 0, 1, 1);
    return [imgData.data[0], imgData.data[1], imgData.data[2], imgData.data[3] / 255];
  }
  return [255, 255, 255, 1];
}

class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  mode: string;

  constructor(r = 0, g = 0, b = 0, a = 1, mode = 'RGB') {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.mode = normalizeColorMode(mode);
  }

  toString() {
    if (isHSBMode(this.mode)) {
      const rgb = hsbToRgb(this.r, this.g, this.b);
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${this.a})`;
    }
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  h = (h % 360 + 360) % 360;
  s = constrain(s, 0, 100) / 100;
  b = constrain(b, 0, 100) / 100;

  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [
    Math.round(f(5) * 255),
    Math.round(f(3) * 255),
    Math.round(f(1) * 255)
  ];
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else if (max === b) {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [
    Math.round(h * 360),
    Math.round(max === 0 ? 0 : (d / max) * 100),
    Math.round(max * 100)
  ];
}

type ColorInput = Color | string | number;

function resolveColorInput(value: ColorInput): Color {
  if (value instanceof Color) {
    return value;
  }
  if (typeof value === 'string') {
    const [cr, cg, cb, ca] = parseCSSColor(value);
    return new Color(cr, cg, cb, ca, 'RGB');
  }
  return new Color(value, value, value, 1, 'RGB');
}

function brightness(c: ColorInput): number {
  if (typeof c === 'number') return c;

  const parsed = resolveColorInput(c);

  if (isHSBMode(parsed.mode)) {
    return parsed.b;
  }

  return rgbToHsb(parsed.r, parsed.g, parsed.b)[2];
}

function red(c: ColorInput): number {
  if (typeof c === 'number') return c;

  const parsed = resolveColorInput(c);

  if (isHSBMode(parsed.mode)) {
    return hsbToRgb(parsed.r, parsed.g, parsed.b)[0];
  }

  return parsed.r;
}

function green(c: ColorInput): number {
  if (typeof c === 'number') return c;

  const parsed = resolveColorInput(c);

  if (isHSBMode(parsed.mode)) {
    return hsbToRgb(parsed.r, parsed.g, parsed.b)[1];
  }

  return parsed.g;
}

function blue(c: ColorInput): number {
  if (typeof c === 'number') return c;

  const parsed = resolveColorInput(c);

  if (isHSBMode(parsed.mode)) {
    return hsbToRgb(parsed.r, parsed.g, parsed.b)[2];
  }

  return parsed.b;
}

function alpha(c: ColorInput): number {
  if (typeof c === 'number') return 255;

  return Math.round(resolveColorInput(c).a * 255);
}

function parseColor(r: any, g?: number, b?: number, a?: number, mode = 'RGB'): Color {
  if (r instanceof Color) return r;
  if (typeof r === 'string') {
    const value = r.trim();
    const [cr, cg, cb, ca] = parseCSSColor(value);
    return new Color(cr, cg, cb, ca, 'RGB');
  }
  if (g === undefined) {
    return new Color(r, r, r, 1, mode);
  }
  if (b === undefined) {
    return new Color(r, r, r, g / 255, mode);
  }
  return new Color(r, g, b, a !== undefined ? a / 255 : 1, mode);
}

// Image pixel manipulation
class PImage {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pixels: Uint8ClampedArray;
  _pixelDensity = 1;
  private imageData: ImageData | null = null;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.pixels = new Uint8ClampedArray(width * height * 4);
  }

  loadPixels() {
    if (this.width > 0 && this.height > 0) {
      this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      this.pixels = this.imageData.data;
    }
  }

  updatePixels() {
    if (!this.imageData && this.width > 0 && this.height > 0) {
      this.imageData = this.ctx.createImageData(this.width, this.height);
      this.imageData.data.set(this.pixels);
    }
    if (this.imageData) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }
  }

  get(x: number, y: number, w?: number, h?: number): any {
    if (w !== undefined && h !== undefined) {
      const subImg = new PImage(w, h);
      subImg.ctx.drawImage(this.canvas, x, y, w, h, 0, 0, w, h);
      subImg.loadPixels();
      return subImg;
    }
    const index = (Math.floor(x) + Math.floor(y) * this.width) * 4;
    if (index >= 0 && index < this.pixels.length) {
      return new Color(this.pixels[index], this.pixels[index + 1], this.pixels[index + 2], this.pixels[index + 3] / 255);
    }
    return new Color(0, 0, 0, 0);
  }

  set(x: number, y: number, color: Color | number | number[]) {
    const index = (Math.floor(x) + Math.floor(y) * this.width) * 4;
    if (index >= 0 && index < this.pixels.length) {
      if (color instanceof Color) {
        if (isHSBMode(color.mode)) {
          const rgb = hsbToRgb(color.r, color.g, color.b);
          this.pixels[index] = rgb[0];
          this.pixels[index + 1] = rgb[1];
          this.pixels[index + 2] = rgb[2];
          this.pixels[index + 3] = Math.round(color.a * 255);
        } else {
          this.pixels[index] = color.r;
          this.pixels[index + 1] = color.g;
          this.pixels[index + 2] = color.b;
          this.pixels[index + 3] = Math.round(color.a * 255);
        }
      } else if (Array.isArray(color)) {
        this.pixels[index] = color[0];
        this.pixels[index + 1] = color[1];
        this.pixels[index + 2] = color[2];
        this.pixels[index + 3] = color[3] !== undefined ? color[3] : 255;
      } else {
        this.pixels[index] = color;
        this.pixels[index + 1] = color;
        this.pixels[index + 2] = color;
        this.pixels[index + 3] = 255;
      }
    }
  }

  copy(src: PImage | CanvasBuffer | HTMLImageElement | HTMLCanvasElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
    let srcElement: HTMLCanvasElement | HTMLImageElement;
    if (src instanceof PImage) {
      srcElement = src.canvas;
    } else {
      srcElement = src as any;
    }
    this.ctx.drawImage(srcElement, sx, sy, sw, sh, dx, dy, dw, dh);
    this.loadPixels();
  }
}

// Drawing context buffer
class CanvasBuffer extends PImage {
  private drawingStateStack: any[] = [];
  private currentDrawingState = {
    fillColor: 'rgba(255, 255, 255, 1)' as string | null,
    strokeColor: 'rgba(0, 0, 0, 1)' as string | null,
    strokeWeightVal: 1,
    colorModeVal: 'RGB',
    textSizeVal: 12,
    textLeadingVal: 15,
    textAlignH: 'left' as CanvasTextAlign,
    textAlignV: 'alphabetic' as CanvasTextBaseline,
    textFontVal: 'sans-serif'
  };

  constructor(width: number, height: number) {
    super(width, height);
  }

  strokeWeight(w: number) {
    this.currentDrawingState.strokeWeightVal = w;
    this.ctx.lineWidth = w;
  }

  stroke(r: any, g?: number, b?: number, a?: number) {
    const color = parseColor(r, g, b, a, this.currentDrawingState.colorModeVal);
    this.currentDrawingState.strokeColor = color.toString();
    this.ctx.strokeStyle = this.currentDrawingState.strokeColor;
  }

  noStroke() {
    this.currentDrawingState.strokeColor = null;
  }

  fill(r: any, g?: number, b?: number, a?: number) {
    const color = parseColor(r, g, b, a, this.currentDrawingState.colorModeVal);
    this.currentDrawingState.fillColor = color.toString();
    this.ctx.fillStyle = this.currentDrawingState.fillColor;
  }

  noFill() {
    this.currentDrawingState.fillColor = null;
  }

  colorMode(mode: string) {
    this.currentDrawingState.colorModeVal = normalizeColorMode(mode);
  }

  textSize(s?: number) {
    if (s !== undefined) {
      this.currentDrawingState.textSizeVal = s;
      this.ctx.font = `${s}px ${this.currentDrawingState.textFontVal}`;
    }
    return this.currentDrawingState.textSizeVal;
  }

  textLeading(leading?: number) {
    if (leading !== undefined) {
      this.currentDrawingState.textLeadingVal = leading;
    }
    return this.currentDrawingState.textLeadingVal;
  }

  textAlign(h: string, v?: string) {
    if (h === 'center') {
      this.ctx.textAlign = 'center';
      this.currentDrawingState.textAlignH = 'center';
    } else if (h === 'right') {
      this.ctx.textAlign = 'right';
      this.currentDrawingState.textAlignH = 'right';
    } else if (h === 'left') {
      this.ctx.textAlign = 'left';
      this.currentDrawingState.textAlignH = 'left';
    }

    if (v !== undefined) {
      if (v === 'center' || v === 'middle') {
        this.ctx.textBaseline = 'middle';
        this.currentDrawingState.textAlignV = 'middle';
      } else if (v === 'bottom') {
        this.ctx.textBaseline = 'bottom';
        this.currentDrawingState.textAlignV = 'bottom';
      } else if (v === 'top') {
        this.ctx.textBaseline = 'top';
        this.currentDrawingState.textAlignV = 'top';
      } else if (v === 'alphabetic' || v === 'baseline') {
        this.ctx.textBaseline = 'alphabetic';
        this.currentDrawingState.textAlignV = 'alphabetic';
      }
    }
  }

  textFont(f?: string) {
    if (f !== undefined) {
      this.currentDrawingState.textFontVal = f;
      this.ctx.font = `${this.currentDrawingState.textSizeVal}px ${f}`;
    }
    return this.currentDrawingState.textFontVal;
  }

  textWidth(str: any): number {
    return this.ctx.measureText(String(str)).width;
  }

  push() {
    this.ctx.save();
    this.drawingStateStack.push(JSON.parse(JSON.stringify(this.currentDrawingState)));
  }

  pop() {
    this.ctx.restore();
    const state = this.drawingStateStack.pop();
    if (state) {
      this.currentDrawingState = state;
      this.ctx.lineWidth = state.strokeWeightVal;
      if (state.strokeColor) this.ctx.strokeStyle = state.strokeColor;
      if (state.fillColor) this.ctx.fillStyle = state.fillColor;
      this.ctx.font = `${state.textSizeVal}px ${state.textFontVal}`;
      this.ctx.textAlign = state.textAlignH;
      this.ctx.textBaseline = state.textAlignV;
    }
  }

  translate(x: number, y: number) {
    this.ctx.translate(x, y);
  }

  rotate(angle: number) {
    this.ctx.rotate(angle);
  }

  scale(s: number, y?: number) {
    if (y !== undefined) {
      this.ctx.scale(s, y);
    } else {
      this.ctx.scale(s, s);
    }
  }

  resetMatrix() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  clear() {
    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  rect(x: number, y: number, w: number, h: number, r?: number) {
    this.ctx.beginPath();
    if (r !== undefined) {
      this.ctx.roundRect(x, y, w, h, r);
    } else {
      this.ctx.rect(x, y, w, h);
    }
    if (this.currentDrawingState.fillColor) this.ctx.fill();
    if (this.currentDrawingState.strokeColor) this.ctx.stroke();
  }

  ellipse(x: number, y: number, w: number, h?: number) {
    h = h !== undefined ? h : w;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
    if (this.currentDrawingState.fillColor) this.ctx.fill();
    if (this.currentDrawingState.strokeColor) this.ctx.stroke();
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    if (!this.currentDrawingState.strokeColor) return;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();
    if (this.currentDrawingState.fillColor) this.ctx.fill();
    if (this.currentDrawingState.strokeColor) this.ctx.stroke();
  }

  quad(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.lineTo(x4, y4);
    this.ctx.closePath();
    if (this.currentDrawingState.fillColor) this.ctx.fill();
    if (this.currentDrawingState.strokeColor) this.ctx.stroke();
  }

  point(x: number, y: number) {
    if (!this.currentDrawingState.strokeColor) return;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.currentDrawingState.strokeWeightVal / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.currentDrawingState.strokeColor;
    this.ctx.fill();
  }

  text(str: any, x: number, y: number) {
    const s = String(str);
    const lines = s.split('\n');
    const leading = this.currentDrawingState.textLeadingVal || (this.currentDrawingState.textSizeVal * 1.25);
    const blockOffsetY = this.currentDrawingState.textAlignV === 'middle' ? -((lines.length - 1) * leading) / 2 : 0;
    lines.forEach((lineStr, index) => {
      const lineY = y + blockOffsetY + index * leading;
      if (this.currentDrawingState.fillColor) {
        this.ctx.fillStyle = this.currentDrawingState.fillColor;
        this.ctx.fillText(lineStr, x, lineY);
      }
      if (this.currentDrawingState.strokeColor) {
        this.ctx.strokeStyle = this.currentDrawingState.strokeColor;
        this.ctx.strokeText(lineStr, x, lineY);
      }
    });
  }

  image(img: PImage | CanvasBuffer | HTMLImageElement | HTMLCanvasElement, x: number, y: number, w?: number, h?: number) {
    if (!img) return;
    let element: HTMLCanvasElement | HTMLImageElement;
    if (img instanceof PImage) {
      element = img.canvas;
    } else {
      element = img as any;
    }
    const imgWidth = w !== undefined ? w : ((img as any).width || element.width || 0);
    const imgHeight = h !== undefined ? h : ((img as any).height || element.height || 0);
    if (element && imgWidth > 0 && imgHeight > 0) {
      this.ctx.drawImage(element, x, y, imgWidth, imgHeight);
    }
  }

  resizeCanvas(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.lineWidth = this.currentDrawingState.strokeWeightVal;
    if (this.currentDrawingState.strokeColor) this.ctx.strokeStyle = this.currentDrawingState.strokeColor;
    if (this.currentDrawingState.fillColor) this.ctx.fillStyle = this.currentDrawingState.fillColor;
    this.ctx.font = `${this.currentDrawingState.textSizeVal}px ${this.currentDrawingState.textFontVal}`;
  }

  circle(x: number, y: number, d: number) {
    this.ellipse(x, y, d, d);
  }

  erase(strengthFill?: number, strengthStroke?: number) {
    this.ctx.globalCompositeOperation = 'destination-out';
    if (strengthFill !== undefined) {
      this.ctx.globalAlpha = strengthFill / 255;
    }
  }

  noErase() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1.0;
  }

  remove() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  textStyle(style: string) {
    if (style === 'italic') {
      this.currentDrawingState.textFontVal = 'italic ' + this.currentDrawingState.textFontVal.replace('italic ', '').replace('bold ', '');
    } else if (style === 'bold') {
      this.currentDrawingState.textFontVal = 'bold ' + this.currentDrawingState.textFontVal.replace('italic ', '').replace('bold ', '');
    } else {
      this.currentDrawingState.textFontVal = this.currentDrawingState.textFontVal.replace('italic ', '').replace('bold ', '');
    }
    this.ctx.font = `${this.currentDrawingState.textSizeVal}px ${this.currentDrawingState.textFontVal}`;
  }

  private shapePoints: { type: string, args: number[] }[] = [];

  beginShape() {
    this.shapePoints = [];
  }

  vertex(x: number, y: number) {
    this.shapePoints.push({ type: 'vertex', args: [x, y] });
  }

  bezierVertex(x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    this.shapePoints.push({ type: 'bezierVertex', args: [x2, y2, x3, y3, x4, y4] });
  }

  endShape(mode?: string) {
    if (this.shapePoints.length === 0) return;
    this.ctx.beginPath();
    const first = this.shapePoints[0];
    this.ctx.moveTo(first.args[0], first.args[1]);
    for (let i = 1; i < this.shapePoints.length; i++) {
      const p = this.shapePoints[i];
      if (p.type === 'vertex') {
        this.ctx.lineTo(p.args[0], p.args[1]);
      } else if (p.type === 'bezierVertex') {
        this.ctx.bezierCurveTo(p.args[0], p.args[1], p.args[2], p.args[3], p.args[4], p.args[5]);
      }
    }
    if (mode === 'close' || mode === 'CLOSE') {
      this.ctx.closePath();
    }
    if (this.currentDrawingState.fillColor) this.ctx.fill();
    if (this.currentDrawingState.strokeColor) this.ctx.stroke();
  }
}

// Global drawing hooks
let mainCanvasBuffer: CanvasBuffer;

function createCanvas(w: number, h: number) {
  mainCanvasBuffer = new CanvasBuffer(w, h);
  mainCanvasBuffer.canvas.id = 'defaultCanvas0';
  document.body.appendChild(mainCanvasBuffer.canvas);
  setupInputListeners(mainCanvasBuffer.canvas);
}

const background = (r: any, g?: number, b?: number, a?: number) => {
  if (r instanceof Color) {
    mainCanvasBuffer.ctx.fillStyle = r.toString();
  } else {
    const c = parseColor(r, g, b, a, mainCanvasBuffer['currentDrawingState'].colorModeVal);
    mainCanvasBuffer.ctx.fillStyle = c.toString();
  }
  mainCanvasBuffer.ctx.fillRect(0, 0, mainCanvasBuffer.width, mainCanvasBuffer.height);
};

const fill = (r: any, g?: number, b?: number, a?: number) => mainCanvasBuffer.fill(r, g, b, a);
const noFill = () => mainCanvasBuffer.noFill();
const stroke = (r: any, g?: number, b?: number, a?: number) => mainCanvasBuffer.stroke(r, g, b, a);
const noStroke = () => mainCanvasBuffer.noStroke();
const strokeWeight = (w: number) => mainCanvasBuffer.strokeWeight(w);
const colorMode = (mode: string) => mainCanvasBuffer.colorMode(mode);
const push = () => mainCanvasBuffer.push();
const pop = () => mainCanvasBuffer.pop();
const translate = (x: number, y: number) => mainCanvasBuffer.translate(x, y);
const rotate = (angle: number) => mainCanvasBuffer.rotate(angle);
const scale = (s: number, y?: number) => mainCanvasBuffer.scale(s, y);
const resetMatrix = () => mainCanvasBuffer.resetMatrix();
const clear = () => mainCanvasBuffer.clear();
const rect = (x: number, y: number, w: number, h: number, r?: number) => mainCanvasBuffer.rect(x, y, w, h, r);
const ellipse = (x: number, y: number, w: number, h?: number) => mainCanvasBuffer.ellipse(x, y, w, h);
const line = (x1: number, y1: number, x2: number, y2: number) => mainCanvasBuffer.line(x1, y1, x2, y2);
const triangle = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => mainCanvasBuffer.triangle(x1, y1, x2, y2, x3, y3);
const quad = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) => mainCanvasBuffer.quad(x1, y1, x2, y2, x3, y3, x4, y4);
const point = (x: number, y: number) => mainCanvasBuffer.point(x, y);
const text = (str: any, x: number, y: number) => mainCanvasBuffer.text(str, x, y);
const textSize = (s?: number) => mainCanvasBuffer.textSize(s);
const textAlign = (h: string, v?: string) => mainCanvasBuffer.textAlign(h, v);
const textFont = (f?: string) => mainCanvasBuffer.textFont(f);
const image = (img: any, x: number, y: number, w?: number, h?: number) => mainCanvasBuffer.image(img, x, y, w, h);
const resizeCanvas = (w: number, h: number) => mainCanvasBuffer.resizeCanvas(w, h);
const createGraphics = (w: number, h: number) => new CanvasBuffer(w, h);
const createImage = (w: number, h: number) => new PImage(w, h);
const color = (r: any, g?: number, b?: number, a?: number) => parseColor(r, g, b, a);

function loadImage(path: string, successCallback?: (img: PImage) => void, failureCallback?: (err: any) => void): PImage {
  const pimg = new PImage(1, 1);
  const candidates: string[] = [];
  if (path) candidates.push(path);

  if (!path.startsWith('http://') && !path.startsWith('https://') && !path.startsWith('data:')) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const filename = cleanPath.includes('/') ? cleanPath.substring(cleanPath.lastIndexOf('/') + 1) : cleanPath;

    candidates.push('/' + cleanPath);
    candidates.push('public/' + cleanPath);
    candidates.push('/public/' + cleanPath);
    candidates.push('resources/' + filename);
    candidates.push('/resources/' + filename);
    candidates.push('public/resources/' + filename);
    candidates.push('/public/resources/' + filename);
    candidates.push(filename);
    candidates.push('/' + filename);
  }

  const uniqueCandidates = Array.from(new Set(candidates));
  let candidateIdx = 0;

  const tryNext = () => {
    if (candidateIdx >= uniqueCandidates.length) {
      console.warn(`Failed to load image at ${path}, using fallback canvas`);
      const W = 1440;
      const H = 720;
      pimg.width = W;
      pimg.height = H;
      pimg.canvas.width = W;
      pimg.canvas.height = H;
      pimg.loadPixels();
      if (failureCallback) failureCallback(new Error(`Failed to load image at ${path}`));
      return;
    }

    const srcPath = uniqueCandidates[candidateIdx++];
    const img = new Image();
    if (!srcPath.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      try {
        pimg.width = img.width || 1440;
        pimg.height = img.height || 720;
        pimg.canvas.width = pimg.width;
        pimg.canvas.height = pimg.height;
        pimg.ctx.drawImage(img, 0, 0);
        pimg.loadPixels();
      } catch (err) {
        console.warn(`loadPixels warning for ${srcPath}:`, err);
      }
      if (successCallback) successCallback(pimg);
    };
    img.onerror = () => {
      // If crossOrigin anonymous failed on relative url, try without crossOrigin
      if (img.crossOrigin) {
        const imgRetry = new Image();
        imgRetry.onload = () => {
          try {
            pimg.width = imgRetry.width || 1440;
            pimg.height = imgRetry.height || 720;
            pimg.canvas.width = pimg.width;
            pimg.canvas.height = pimg.height;
            pimg.ctx.drawImage(imgRetry, 0, 0);
            pimg.loadPixels();
          } catch (e) {
            console.warn(`loadPixels warning for retry ${srcPath}:`, e);
          }
          if (successCallback) successCallback(pimg);
        };
        imgRetry.onerror = () => {
          tryNext();
        };
        imgRetry.src = srcPath;
      } else {
        tryNext();
      }
    };
    img.src = srcPath;
  };

  tryNext();
  return pimg;
}

// 2D Vector representation matching p5.Vector
class p5_Vector {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x?: number | p5_Vector, y?: number, z?: number) {
    if (x instanceof p5_Vector) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x ?? 0;
      this.y = y ?? 0;
      this.z = z ?? 0;
    }
    return this;
  }

  copy() {
    return new p5_Vector(this.x, this.y, this.z);
  }

  add(x: number | p5_Vector, y?: number, z?: number) {
    if (x instanceof p5_Vector) {
      this.x += x.x;
      this.y += x.y;
      this.z += x.z;
    } else {
      this.x += x;
      this.y += y ?? 0;
      this.z += z ?? 0;
    }
    return this;
  }

  sub(x: number | p5_Vector, y?: number, z?: number) {
    if (x instanceof p5_Vector) {
      this.x -= x.x;
      this.y -= x.y;
      this.z -= x.z;
    } else {
      this.x -= x;
      this.y -= y ?? 0;
      this.z -= z ?? 0;
    }
    return this;
  }

  mult(n: number) {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }

  div(n: number) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  magSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  setMag(len: number) {
    return this.normalize().mult(len);
  }

  heading() {
    return Math.atan2(this.y, this.x);
  }

  rotate(angle: number) {
    const newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const newY = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = newX;
    this.y = newY;
    return this;
  }

  dist(v: p5_Vector) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2 + (this.z - v.z) ** 2);
  }

  limit(max: number) {
    const mSq = this.magSq();
    if (mSq > max * max) {
      this.div(Math.sqrt(mSq)).mult(max);
    }
    return this;
  }

  normalize() {
    const len = this.mag();
    if (len !== 0) this.div(len);
    return this;
  }

  static random2D() {
    const angle = Math.random() * Math.PI * 2;
    return new p5_Vector(Math.cos(angle), Math.sin(angle));
  }
}

const createVector = (x?: number, y?: number, z?: number) => new p5_Vector(x, y, z);

const p5 = {
  Vector: p5_Vector
};

function setupInputListeners(canvas: HTMLCanvasElement) {
  const getMousePos = (e: MouseEvent | Touch) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const updateMouse = (clientX: number, clientY: number) => {
    pmouseX = mouseX;
    pmouseY = mouseY;
    const pos = getMousePos({ clientX, clientY } as any);
    mouseX = pos.x;
    mouseY = pos.y;
  };

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const sx = (window as any).getScreenMouseX ? (window as any).getScreenMouseX() : Math.floor(mouseX / ((window as any).scaler || 1));
    const sy = (window as any).getScreenMouseY ? (window as any).getScreenMouseY() : Math.floor(mouseY / ((window as any).scaler || 1));
    zoomMapAt(zoomFactor, sx, sy);
  }, { passive: false });

  canvas.addEventListener('mousemove', (e) => {
    updateMouse(e.clientX, e.clientY);
    const sx = (window as any).getScreenMouseX ? (window as any).getScreenMouseX() : Math.floor(mouseX / ((window as any).scaler || 1));
    const sy = (window as any).getScreenMouseY ? (window as any).getScreenMouseY() : Math.floor(mouseY / ((window as any).scaler || 1));

    if (mouseIsPressed && isPanningMap) {
      const dx = sx - panStartX;
      const dy = sy - panStartY;
      if (Math.hypot(dx, dy) > 3) {
        hasDraggedMap = true;
      }
      if (mapZoom > 1 || hasDraggedMap) {
        mapPanX = initialPanX + dx;
        mapPanY = initialPanY + dy;
        constrainPan();
      }
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    mouseIsPressed = true;
    updateMouse(e.clientX, e.clientY);
    const sx = (window as any).getScreenMouseX ? (window as any).getScreenMouseX() : Math.floor(mouseX / ((window as any).scaler || 1));
    const sy = (window as any).getScreenMouseY ? (window as any).getScreenMouseY() : Math.floor(mouseY / ((window as any).scaler || 1));

    const targetUI = typeof (window as any).UI !== 'undefined' ? (window as any).UI.mouseOver : null;
    const isPrimaryWrapper = targetUI && targetUI === (window as any).primaryWrapper;
    if (!targetUI || isPrimaryWrapper) {
      isPanningMap = true;
      panStartX = sx;
      panStartY = sy;
      initialPanX = mapPanX;
      initialPanY = mapPanY;
      hasDraggedMap = false;
    } else {
      isPanningMap = false;
    }

    if (typeof (window as any).mousePressed === 'function') {
      (window as any).mousePressed(e);
    }
  });

  window.addEventListener('mouseup', (e) => {
    mouseIsPressed = false;
    isPanningMap = false;
    if (typeof (window as any).mouseReleased === 'function') {
      (window as any).mouseReleased(e);
    }
  });

  canvas.addEventListener('click', (e) => {
    if (typeof (window as any).mouseClicked === 'function') {
      (window as any).mouseClicked(e);
    }
  });

  // Touch support
  let touchStartDist = 0;

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartDist > 0) {
        const factor = currentDist / touchStartDist;
        touchStartDist = currentDist;
        const rect = canvas.getBoundingClientRect();
        const midX = (((e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left) / rect.width) * (canvas.width / ((window as any).scaler || 1));
        const midY = (((e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top) / rect.height) * (canvas.height / ((window as any).scaler || 1));
        zoomMapAt(factor, midX, midY);
      }
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      updateMouse(touch.clientX, touch.clientY);
      const sx = (window as any).getScreenMouseX ? (window as any).getScreenMouseX() : Math.floor(mouseX / ((window as any).scaler || 1));
      const sy = (window as any).getScreenMouseY ? (window as any).getScreenMouseY() : Math.floor(mouseY / ((window as any).scaler || 1));

      if (isPanningMap) {
        const dx = sx - panStartX;
        const dy = sy - panStartY;
        if (Math.hypot(dx, dy) > 3) {
          hasDraggedMap = true;
        }
        if (mapZoom > 1 || hasDraggedMap) {
          mapPanX = initialPanX + dx;
          mapPanY = initialPanY + dy;
          constrainPan();
        }
      }

      if (typeof (window as any).touchMoved === 'function') {
        const res = (window as any).touchMoved(e);
        if (res === false) e.preventDefault();
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      mouseIsPressed = true;
      updateMouse(touch.clientX, touch.clientY);
      const sx = (window as any).getScreenMouseX ? (window as any).getScreenMouseX() : Math.floor(mouseX / ((window as any).scaler || 1));
      const sy = (window as any).getScreenMouseY ? (window as any).getScreenMouseY() : Math.floor(mouseY / ((window as any).scaler || 1));

      const targetUI = typeof (window as any).UI !== 'undefined' ? (window as any).UI.mouseOver : null;
      const isPrimaryWrapper = targetUI && targetUI === (window as any).primaryWrapper;
      if (!targetUI || isPrimaryWrapper) {
        isPanningMap = true;
        panStartX = sx;
        panStartY = sy;
        initialPanX = mapPanX;
        initialPanY = mapPanY;
        hasDraggedMap = false;
      } else {
        isPanningMap = false;
      }

      if (typeof (window as any).touchStarted === 'function') {
        const res = (window as any).touchStarted(e);
        if (res === false) e.preventDefault();
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      touchStartDist = 0;
    }
    if (e.touches.length === 0) {
      mouseIsPressed = false;
      isPanningMap = false;
    }
    if (typeof (window as any).touchEnded === 'function') {
      const res = (window as any).touchEnded(e);
      if (res === false) e.preventDefault();
    }
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    keyIsPressed = true;
    key = e.key;
    keyCode = e.keyCode;
    if (typeof (window as any).keyPressed === 'function') {
      (window as any).keyPressed(e);
    }
  });

  window.addEventListener('keyup', (e) => {
    keyIsPressed = false;
    if (typeof (window as any).keyReleased === 'function') {
      (window as any).keyReleased(e);
    }
  });

  window.addEventListener('keypress', (e) => {
    if (typeof (window as any).keyTyped === 'function') {
      (window as any).keyTyped(e);
    }
  });
}

const startTime = performance.now();
const millis = () => performance.now() - startTime;

let isLooping = true;
const noLoop = () => { isLooping = false; };
const loop = () => { isLooping = true; };

function randomGaussian(mean = 0, sd = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * sd + mean;
}

function lerpColor(c1: Color, c2: Color, amt: number): Color {
  if (!c1 || !c2) return c1 || c2 || new Color(0, 0, 0);
  const mode = mainCanvasBuffer ? mainCanvasBuffer['currentDrawingState'].colorModeVal : 'RGB';
  if (isHSBMode(mode) || (c1 && isHSBMode(c1.mode)) || (c2 && isHSBMode(c2.mode))) {
    const hsb1 = isHSBMode(c1.mode) ? [c1.r, c1.g, c1.b] : rgbToHsb(c1.r, c1.g, c1.b);
    const hsb2 = isHSBMode(c2.mode) ? [c2.r, c2.g, c2.b] : rgbToHsb(c2.r, c2.g, c2.b);
    const a1 = c1.a !== undefined ? c1.a : 1;
    const a2 = c2.a !== undefined ? c2.a : 1;

    let h1 = hsb1[0];
    let h2 = hsb2[0];
    let h = lerp(h1, h2, amt);
    let s = lerp(hsb1[1], hsb2[1], amt);
    let b = lerp(hsb1[2], hsb2[2], amt);
    let a = lerp(a1, a2, amt);

    return new Color(h, s, b, a, 'HSB');
  }

  const r1 = red(c1);
  const g1 = green(c1);
  const b1 = blue(c1);
  const a1 = alpha(c1) / 255;

  const r2 = red(c2);
  const g2 = green(c2);
  const b2 = blue(c2);
  const a2 = alpha(c2) / 255;

  return new Color(
    lerp(r1, r2, amt),
    lerp(g1, g2, amt),
    lerp(b1, b2, amt),
    lerp(a1, a2, amt),
    'RGB'
  );
}

function textWidth(str: string): number {
  return mainCanvasBuffer.textWidth(str);
}

const beginShape = () => mainCanvasBuffer.beginShape();
const vertex = (x: number, y: number) => mainCanvasBuffer.vertex(x, y);
const bezierVertex = (x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) => mainCanvasBuffer.bezierVertex(x2, y2, x3, y3, x4, y4);
const endShape = (mode?: string) => mainCanvasBuffer.endShape(mode);
const circle = (x: number, y: number, d: number) => mainCanvasBuffer.circle(x, y, d);
const textStyle = (style: string) => mainCanvasBuffer.textStyle(style);
const textLeading = (leading?: number) => mainCanvasBuffer.textLeading(leading);
const erase = (strengthFill?: number, strengthStroke?: number) => mainCanvasBuffer.erase(strengthFill, strengthStroke);
const noErase = () => mainCanvasBuffer.noErase();

function runP5() {
  if (typeof (window as any).setup === 'function') {
    (window as any).setup();
  }

  const loopFn = () => {
    if (isLooping) {
      if (typeof (window as any).draw === 'function') {
        (window as any).draw();
      }
    }
    requestAnimationFrame(loopFn);
  };
  requestAnimationFrame(loopFn);
}

window.addEventListener('load', () => {
  runP5();
});

// Expose all properties globally
Object.assign(window, {
  PI, TAU, HALF_PI, QUARTER_PI,
  PORTRAIT, LANDSCAPE,
  RGB, HSB, CENTER, LEFT, RIGHT, TOP, BOTTOM, NORMAL, ITALIC,
  ESCAPE, ENTER, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, BACKSPACE, DELETE, SHIFT, CONTROL,
  floor, ceil, round, abs, min, max, sqrt, pow, cos, sin, atan2, log, atan,
  constrain, dist, map, lerp, sq, radians, degrees, random,
  noise, noiseDetail, noiseSeed,
  Color, hsbToRgb, rgbToHsb, brightness, red, green, blue, alpha, parseColor,
  PImage, CanvasBuffer, createCanvas, background, fill, noFill, stroke, noStroke, strokeWeight, colorMode,
  push, pop, translate, rotate, scale, resetMatrix, clear, rect, ellipse, line, triangle, quad, point, text, textSize, textAlign, textFont, image, resizeCanvas, createGraphics, createImage, color, loadImage,
  p5_Vector, createVector, p5,
  millis, noLoop, loop, randomGaussian, lerpColor, textWidth,
  beginShape, vertex, bezierVertex, endShape, circle, textStyle, textLeading, erase, noErase
});

// Dynamic getters/setters on window to keep mouse and keyboard state synced
const globalsToBind = {
  get mouseX() { return mouseX; },
  set mouseX(v) { mouseX = v; },
  get mouseY() { return mouseY; },
  set mouseY(v) { mouseY = v; },
  get pmouseX() { return pmouseX; },
  set pmouseX(v) { pmouseX = v; },
  get pmouseY() { return pmouseY; },
  set pmouseY(v) { pmouseY = v; },
  get mouseIsPressed() { return mouseIsPressed; },
  set mouseIsPressed(v) { mouseIsPressed = v; },
  get keyIsPressed() { return keyIsPressed; },
  set keyIsPressed(v) { keyIsPressed = v; },
  get key() { return key; },
  set key(v) { key = v; },
  get keyCode() { return keyCode; },
  set keyCode(v) { keyCode = v; },
  get deviceOrientation() { return deviceOrientation; },
  set deviceOrientation(v) { deviceOrientation = v; },
  get displayWidth() { return window.innerWidth; },
  get displayHeight() { return window.innerHeight; },
  get width() { return mainCanvasBuffer ? mainCanvasBuffer.width : window.innerWidth; },
  get height() { return mainCanvasBuffer ? mainCanvasBuffer.height : window.innerHeight; },
  get canvas() { return mainCanvasBuffer ? mainCanvasBuffer.canvas : null; },
  get db() { return db; },
  set db(v) { db = v; },
  get mainMenu() { return mainMenu; },
  set mainMenu(v) { mainMenu = v; },
  get basinCreationMenu() { return basinCreationMenu; },
  set basinCreationMenu(v) { basinCreationMenu = v; },
  get basinCreationMenuAdvanced() { return basinCreationMenuAdvanced; },
  set basinCreationMenuAdvanced(v) { basinCreationMenuAdvanced = v; },
  get loadMenu() { return loadMenu; },
  set loadMenu(v) { loadMenu = v; },
  get settingsMenu() { return settingsMenu; },
  set settingsMenu(v) { settingsMenu = v; },
  get primaryWrapper() { return primaryWrapper; },
  set primaryWrapper(v) { primaryWrapper = v; },
  get areYouSure() { return areYouSure; },
  set areYouSure(v) { areYouSure = v; },
  get sideMenu() { return sideMenu; },
  set sideMenu(v) { sideMenu = v; },
  get saveBasinAsPanel() { return saveBasinAsPanel; },
  set saveBasinAsPanel(v) { saveBasinAsPanel = v; },
  get seedBox() { return seedBox; },
  set seedBox(v) { seedBox = v; },
  get helpBox() { return helpBox; },
  set helpBox(v) { helpBox = v; },
  get stormInfoPanel() { return stormInfoPanel; },
  set stormInfoPanel(v) { stormInfoPanel = v; },
  get timeline() { return timeline; },
  set timeline(v) { timeline = v; },
  get dateNavigator() { return dateNavigator; },
  set dateNavigator(v) { dateNavigator = v; }
};

for (const [propName, desc] of Object.entries(Object.getOwnPropertyDescriptors(globalsToBind))) {
  Object.defineProperty(window, propName, desc);
}


// --- START OF FILE: constants.ts ---

const TITLE = "Cyclone Simulator";
const VERSION_NUMBER = "0.4.21";

const SAVE_FORMAT = 7;  // Format #7 in use starting in v0.4
const EARLIEST_COMPATIBLE_FORMAT = 0;
const ENVDATA_COMPATIBLE_FORMAT = 0;

const WIDTH = 960; // 16:9 aspect ratio
const HEIGHT = 540;
const DIAMETER = 20;    // Storm icon diameter
const PERLIN_ZOOM = 100;    // Resolution for perlin noise
const TICK_DURATION = 3600000;  // How long in sim time does a tick last in milliseconds (1 hour)
const ADVISORY_TICKS = 6;    // Number of ticks per advisory
const YEAR_LENGTH = 365.2425*24;        // The length of a year in ticks; used for seasonal activity
const STEP = 30;            // Number of milliseconds in real time a simulation step lasts at default speed
const NHEM_DEFAULT_YEAR = moment.utc().year();
const SHEM_DEFAULT_YEAR = moment.utc().month() < 6 ? NHEM_DEFAULT_YEAR : NHEM_DEFAULT_YEAR+1;
const DEPRESSION_LETTER = "H";
const WINDSPEED_ROUNDING = 5;
// const MAP_DEFINITION = 2;   // normal scaler for the land map
const EARTH_SB_IDS = {
    world: 0,
    nhem: 1,
    atl: 2,
    atlland: 3,
    epac: 4,
    epacland: 5,
    cpac: 6,
    wpac: 7,
    pagasa: 8,
    bob: 9,
    arb: 10,
    nioland: 11,
    medi: 12,
    shem: 128,
    aus: 129,
    jakarta: 130,
    pm: 131,
    swio: 132,
    spac: 133,
    satl: 134,
    nio: 192
};
const MAP_TYPES = [     // Land generation controls and option presets for different map types
    {   
		label: "Two Continents",
        form: "linear",
        landBiasFactors: [
            5/8,        // Where the "center" should be for land/ocean bias (0-1 scale from west to east)
            0.15,       // Bias factor for the west edge (positive = land more likely, negative = sea more likely)
            -0.3,       // Bias factor for the "center" (as defined by .landBiasFactors[0])
            0.1         // Bias factor for the east edge
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "East Continent",
        form: "linear",
        landBiasFactors: [
            5/8,
            -0.3,
            -0.3,
            0.15
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "West Continent",
        form: "linear",
        landBiasFactors: [
            1/2,
            0.15,
            -0.3,
            -0.3
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Island Ocean",
        form: "linear",
        landBiasFactors: [
            1/2,
            -0.28,
            -0.28,
            -0.28
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Central Continent",
        form: "radial",
        landBiasFactors: [
            1/2,    // Where the east-west center should be (0-1 scale from west to east)
            1/2,    // Where the north-south center should be (0-1 scale from north to south)
            1/2,    // First control distance (in terms of the geometric mean of the canvas dimensions)
            1,      // Second control distance
            0.15,   // Bias factor for the center
            -0.27,   // Bias factor for the first control distance
            -0.3    // Bias factor for the second control distance and outward
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Central Inland Sea",
        form: "radial",
        landBiasFactors: [
            1/2,
            1/2,
            3/8,
            1,
            -0.3,
            0.2,
            0.3
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Atlantic",
        form: 'earth',
        west: -102.67,
        east: 3,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.atl,
        optionPresets: {
            hem: 1,
            scale: 0,
            designations: 0
        }
    },
    {   
		label: "Eastern Pacific",
        form: 'earth',
        west: -180,
        east: -74.33,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.epac,
        optionPresets: {
            hem: 1,
            scale: 0,
            designations: 1
        }
    },
    {   
		label: "Western Pacific",
        form: 'earth',
        west: 94.42,
        east: -159.91,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.wpac,
        optionPresets: {
            hem: 1,
            scale: 3,
            designations: 3
        }
    },
    {   
		label: "Northern Indian Ocean",
        form: 'earth',
        west: 25.95,
        east: 131.62,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.nio,
        optionPresets: {
            hem: 1,
            scale: 4,
            designations: 5
        }
    },
    {   
		label: "Australian Region",
        form: 'earth',
        west: 82.03,
        east: -172.29,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.aus,
        optionPresets: {
            hem: 2,
            scale: 2,
            designations: 6
        }
    },
    {   
		label: "South Pacific",
        form: 'earth',
        west: 147.2,
        east: -107.13,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.spac,
        optionPresets: {
            hem: 2,
            scale: 2,
            designations: 7
        }
    },
    {   
		label: "South-West Indian Ocean",
        form: 'earth',
        west: 17.25,
        east: 122.93,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.swio,
        optionPresets: {
            hem: 2,
            scale: 5,
            designations: 8
        }
    },
    {   
		label: "South Atlantic",
        form: 'earth',
        west: -81.48,
        east: 24.19,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.satl,
        optionPresets: {
            hem: 2,
            scale: 0,
            designations: 9
        }
    },
    {   
		label: "Mediterranean",
        form: 'earth',
        west: -10.32,
        east: 42.52,
        north: 55.38,
        south: 25.65,
        mainSubBasin: EARTH_SB_IDS.medi,
        optionPresets: {
            hem: 1,
            scale: 0,
            designations: 10
        }
    }
];
const EARTH_MAP_PATH = 'https://s6.imgcdn.dev/YH2FU8.png';
const EXTROP = 0;
const SUBTROP = 1;
const TROP = 2;
const TROPWAVE = 3;
const STORM_TYPES = 4;
const KEY_LEFT_BRACKET = 219;
const KEY_RIGHT_BRACKET = 221;
const KEY_F11 = 122;
const KEY_REPEAT_COOLDOWN = 15;
const KEY_REPEATER = 5;
const MAX_SNOW_LAYERS = 50;
const SNOW_SEASON_OFFSET = 5/6;
const ENV_LAYER_TILE_SIZE = 20;
const NC_OFFSET_RANDOM_FACTOR = 4096;
const ACE_WIND_THRESHOLD = 34;
const ACE_DIVISOR = 10000;
const DAMAGE_DIVISOR = 1000;
const ENVDATA_NOT_FOUND_ERROR = "envdata-not-found";
const LOADED_SEASON_REQUIRED_ERROR = "loaded-season-required";
const LOAD_MENU_BUTTONS_PER_PAGE = 6;
const DEFAULT_MAIN_SUBBASIN = 0;
const DEFAULT_OUTBASIN_SUBBASIN = 255;
const DESIG_CROSSMODE_ALWAYS = 0;
const DESIG_CROSSMODE_STRICT_ALWAYS = 1;
const DESIG_CROSSMODE_REGEN = 2;
const DESIG_CROSSMODE_STRICT_REGEN = 3;
const DESIG_CROSSMODE_KEEP = 4;
const SCALE_MEASURE_ONE_MIN_KNOTS = 0;
const SCALE_MEASURE_TEN_MIN_KNOTS = 1;
const SCALE_MEASURE_MILLIBARS = 2;
const SCALE_MEASURE_INHG = 3;
const SCALE_MEASURE_ONE_MIN_MPH = 4;
const SCALE_MEASURE_TEN_MIN_MPH = 5;
const SCALE_MEASURE_ONE_MIN_KMH = 6;
const SCALE_MEASURE_TEN_MIN_KMH = 7;
const MIN_SPEED = -5;
const MAX_SPEED = 5;

// Saving/loading-related constants

const AUTOSAVE_SAVE_NAME = "Autosave";
const DB_KEY_SETTINGS = "settings";
const LOADED_SEASON_EXPIRATION = 150000;    // minimum duration in miliseconds after a season was last accessed before it unloads (2.5 minutes)
const FORMAT_WITH_SAVED_SEASONS = 1;
const FORMAT_WITH_INDEXEDDB = 2;
const FORMAT_WITH_IMPROVED_ENV = 3;
const FORMAT_WITH_SUBBASIN_SEASON_STATS = 4;
const FORMAT_WITH_STORM_SUBBASIN_DATA = 5;
const FORMAT_WITH_SCALES = 6;
const FORMAT_WITH_EARTH_SUBBASINS = 7;
const FORMAT_WITH_LONG_LAT = 7;

// Legacy saving/loading-related constants (backwards-compatibility)

const LEGACY_SAVE_NAME_PREFIX = "Slot ";
const LOCALSTORAGE_KEY_PREFIX = "cyclone-sim-";
const LOCALSTORAGE_KEY_SAVEDBASIN = "savedbasin-";
const LOCALSTORAGE_KEY_BASIN = "basin";
const LOCALSTORAGE_KEY_FORMAT = "format";
const LOCALSTORAGE_KEY_NAMES = "names";
const LOCALSTORAGE_KEY_SEASON = "season-";
const LOCALSTORAGE_KEY_SETTINGS = "settings";
const SAVING_RADIX = 36;
// const ENVDATA_SAVE_FLOAT = -2;
const ENVDATA_SAVE_MULT = 10000;
// const ACTIVESYSTEM_SAVE_FLOAT = -2;

const HELP_TEXT = "Keyboard Controls:\n" +
    "\t\tSPACE - Pause/resume simulation\n" +
    "\t\tA - Step simulation one hour while paused\n" +
    "\t\tE - Cycle through map layers\n" +
    "\t\tT - Cycle through track display modes\n" +
    "\t\tW - Toggle intensity indicators below storm icons (kts / hPa)\n" +
    "\t\tM - Toggle magnifying glass for map layers\n" +
    "\t\t[ - Decrease simulation speed (half)\n" +
    "\t\t] - Increase simulation speed (double)\n" +
    "\t\tLEFT ARROW - Step backwards through analysis\n" +
    "\t\tRIGHT ARROW - Step forewards through analysis\n" +
    "\t\tCLICK + [special key] - Spawn [corresponding storm system]\n" +
    "\t\t\t\tX - Extratropical cyclone\n" +
    "\t\t\t\tL - Tropical Low/Wave\n" +
    "\t\t\t\tD - Tropical Depression\n" +
    "\t\t\t\tS - Tropical Storm\n" +
    "\t\t\t\t[number key 1-9] - Category [1-9]* Tropical Cyclone\n" +
    '\t\t\t\t0 - Category 10* Tropical Cyclone\n' +
    '\t\t\t\tY - Hyperclone*\n' +
    '\t\t\t\t\t*must use Extended Saffir-Simpson scale to see C6+ storms';

const COLORS = {};      // For storing all colors used in the graphics

function defineColors(){    // Since p5 color() function doesn't work until setup(), this is called in setup()
    COLORS.bg = color(10,55,155);
    COLORS.storm = {};
    COLORS.storm[EXTROP] = color(220,220,220);
    COLORS.storm[TROPWAVE] = color(130,130,240);
    COLORS.storm.extL = "red";
    COLORS.land = [];
    COLORS.land.push([0.85, color(190,190,190)]);
    COLORS.land.push([0.8, color(160,160,160)]);
    COLORS.land.push([0.75, color(145,115,90)]);
    COLORS.land.push([0.7, color(160,125,100)]);
    COLORS.land.push([0.65, color(35,145,35)]);
    COLORS.land.push([0.6, color(35,160,35)]);
    COLORS.land.push([0.55, color(30,175,30)]);
    COLORS.land.push([0.53, color(205,205,105)]);
    COLORS.land.push([0.5, color(230,230,105)]);
    COLORS.snow = color(240);
    COLORS.outBasin = color(45,70,120);
    COLORS.subBasinOutline = color(255,255,0);
    COLORS.UI = {};
    COLORS.UI.bar = color(200,100);
    COLORS.UI.box = color(200,170);
    COLORS.UI.buttonBox = color(200,170);
    COLORS.UI.buttonHover = color(200);
    COLORS.UI.text = color(0);
    COLORS.UI.greyText = color(130);
    COLORS.UI.redText = color(240,0,0);
    COLORS.UI.nonSelectedInput = color(70);
    COLORS.UI.input = color(255);
    COLORS.UI.loadingSymbol = color(0,40,85);
}

// --- START OF FILE: storm.ts ---

class Storm{
    constructor(basin,data){
        this.basin = basin instanceof Basin && basin;
        this.current = data instanceof ActiveSystem && data;
        this.id = undefined;
        if(this.current) basin.fetchSeason(-1,true,true).addSystem(this);

        this.TC = false;
        this.inBasinTC = false;
        this.sbData = {};

        this.rotation = random(TAU);
        this.rotationUpdateTimestamp = performance.now();

        this.designations = {};
        this.designations.primary = [];
        this.designations.secondary = [];

        this.birthTime = this.current ? basin.tick : undefined;     // tick formed as a disturbance/low
        this.formationTime = undefined;                             // tick formed as a TC
        this.enterTime = undefined;                                 // tick formed in/entered basin as a TC
        this.exitTime = undefined;                                  // tick degenerated in/left basin as a TC
        this.dissipationTime = undefined;                           // tick degenerated/dissipated as a TC
        this.deathTime = undefined;                                 // tick completely dissipated/left map

        this.record = [];
        this.peak = undefined;
        this.windPeak = undefined;
        this.ACE = 0;
        this.deaths = 0;
        this.damage = 0;
        this.landfalls = 0;
        if(!this.current && data instanceof LoadData) this.load(data);
    }

    originSeason(){
        return this.basin.getSeason(this.birthTime);
    }

    statisticalSeason(){
        if(this.inBasinTC)
            return this.basin.getSeason(this.enterTime);
        else
            return this.originSeason();
    }

    aliveAt(t){
        return t >= this.birthTime && (!!this.current || t < this.deathTime);
    }

    getStormDataByTick(t,allowCurrent){
        if(!this.aliveAt(t)) return null;
        if(t===this.basin.tick){
            if(allowCurrent) return this.current;
            return this.record.length>0 ? this.record[this.record.length-1] : null;
        }
        return this.record[floor(t/ADVISORY_TICKS)-ceil(this.birthTime/ADVISORY_TICKS)];
    }

    get_tick_from_record_index(i){
        return (ceil(this.birthTime / ADVISORY_TICKS) + i) * ADVISORY_TICKS;
    }

    getNameByTick(t){
        let D = this.designations;
        let str = '';
        if(this.aliveAt(t)){
            let p;
            let s = [];
            let snamed;
            for(let i=0;i<D.primary.length;i++){
                let d = D.primary[i];
                if(!(d instanceof Designation)) continue;
                let e = d.activeAt(t);
                if(e){
                    if(!p) p = d;
                    else if(!p.isName() && d.isName()) p = d;
                    else if(e>p.activeAt(t) && (!p.isName() || d.isName())) p = d;
                }
            }
            for(let i=0;i<D.secondary.length;i++){
                let d = D.secondary[i];
                if(!(d instanceof Designation)) continue;
                if(d.activeAt(t)){
                    if(d.isName() && !snamed){
                        s = [];
                        snamed = true;
                    }
                    if(d.isName() || !snamed) s.push(d);
                }
            }
            s.sort((a,b)=>a.effectiveTicks[0]-b.effectiveTicks[0]);
            let ii;
            for(let i=s.length-1;i>=0;i--){
                if(p && p.isName()) break;
                if(s[i].isName() || !p){
                    p = s[i];
                    ii = i;
                }
            }
            if(ii!==undefined) s.splice(ii,1);
            if(p){
                str += p.value;
                if(s.length>0 && (snamed || !p.isName())){
                    str += ' (';
                    for(let i=0;i<s.length;i++){
                        if(i>0) str += ', ';
                        str += s[i].value;
                    }
                    str += ')';
                }
            }
        }else{
            let p = [];
            let s = [];
            let pnamed;
            let snamed;
            for(let i=0;i<D.primary.length;i++){
                let d = D.primary[i];
                if(!(d instanceof Designation)) continue;
                if(d.isName() && !pnamed){
                    p = [];
                    pnamed = true;
                }
                if(d.isName() || !pnamed) p.push(d);
            }
            p.sort((a,b)=>a.effectiveTicks[0]-b.effectiveTicks[0]);
            for(let i=0;i<D.secondary.length;i++){
                let d = D.secondary[i];
                if(!(d instanceof Designation)) continue;
                if(d.isName() && !snamed){
                    s = [];
                    snamed = true;
                }
                if(d.isName() || !snamed) s.push(d);
            }
            s.sort((a,b)=>a.effectiveTicks[0]-b.effectiveTicks[0]);
            let ii;
            for(let i=s.length-1;i>=0;i--){
                if(p.length>0 && pnamed) break;
                if(s[i].isName() || p.length<1){
                    p = [];
                    p.push(s[i]);
                    if(s[i].isName()) pnamed = true;
                    ii = i;
                }
            }
            if(ii!==undefined) s.splice(ii,1);
            for(let i=0;i<p.length;i++){
                if(i>0) str += '-';
                if(t===-2) str += p[i].truncate();
                else str += p[i].value;
            }
            if(s.length>0 && (snamed || !pnamed) && t!==-2){
                str += ' (';
                for(let i=0;i<s.length;i++){
                    if(i>0) str += ', ';
                    str += s[i].value;
                }
                str += ')';
            }
        }
        return str;
    }

    getFullNameByTick(t){
        let basin = this.basin;
        let data = t==="peak" ? this.windPeak : ((t === viewTick && basin.viewingPresent()) ? this.getStormDataByTick(t, true) : this.getStormDataByTick(t));
        let name = this.getNameByTick(t==='peak' ? -1 : t);
        let ty = data ? data.type : null;
        let clsnNom = (data && land) ? basin.getScale(land.getSubBasin(data.coord())).getStormNom(data) : null;
        let hasbeenTC;
        if(t==='peak') hasbeenTC = this.TC;
        else if(t>=this.formationTime) hasbeenTC = true;
        else hasbeenTC = false;
        let str = '';
        if(!name) str += 'Unnamed ';
        switch(ty){
            case TROP:
            case SUBTROP:
                str += clsnNom;
                if(name) str += ' ' + name;
                break;
            case TROPWAVE:
                if(hasbeenTC){
                    if(name) str += 'Remnants of ' + name;
                    else str += 'Remnant Low';
                }else{
                    if(name) str += 'Invest ' + name;
                    else str += 'Tropical Wave';
                }
                break;
            case EXTROP:
                if(hasbeenTC){
                    str += 'Post-Tropical Cyclone';
                    if(name) str += ' ' + name;
                }else{
                    if(name) str += 'Invest ' + name;
                    else str += 'Extratropical Cyclone';
                }
                break;
        }
        return str;
    }

    renderIcon(){
        if(this.aliveAt(viewTick)){
            let basin = this.basin;
            let adv = this.getStormDataByTick(viewTick);
            let advC = this.getStormDataByTick(viewTick,true);
            let advX = (basin.viewingPresent() && advC) ? advC : (adv || advC);
            if(!advX)
                return;
            let pr = advX.pressure;
            let st = advX.windSpeed;
            let pos = advX.pos;
            let sb = land ? land.getSubBasin(advX.coord()) : 0;
            let scale = basin.getScale(sb);
            let scaleIconData = scale.getIcon(advX);
            let ty = advX.type;
            let name = this.getNameByTick(viewTick);
            let timestamp = performance.now();
            this.rotation -= 0.001 * (timestamp - this.rotationUpdateTimestamp) * pow(1.0115, min(270,st));
            this.rotationUpdateTimestamp = timestamp;
            let drawArms = ()=>{
                let a = scaleIconData.arms;
                if(tropOrSub(ty) && a){
                    stormIcons.push();
                    if(basin.SHem) stormIcons.scale(1,-1);
                    stormIcons.rotate(this.rotation);
                    for(let i=0;i<a;i++){
                        if(i>0) stormIcons.rotate(2*PI/a);
                        stormIcons.beginShape();
                        stormIcons.vertex(DIAMETER*5/8,-DIAMETER);
                        stormIcons.bezierVertex(DIAMETER*5/8,-DIAMETER,-DIAMETER*1/2,-DIAMETER*7/8,-DIAMETER*1/2,0);
                        stormIcons.vertex(0,0);
                        stormIcons.bezierVertex(-DIAMETER*1/4,-DIAMETER*5/8,DIAMETER*5/8,-DIAMETER,DIAMETER*5/8,-DIAMETER);
                        stormIcons.endShape();
                    }
                    stormIcons.pop();
                }
            };
            stormIcons.push();
            stormIcons.translate(pos.x,pos.y);
            stormIcons.textAlign(CENTER,CENTER);
            if(selectedStorm===this){
                stormIcons.noFill();
                stormIcons.stroke(255);
                if(ty===EXTROP){
                    stormIcons.textSize(18);
                    stormIcons.text("L",0,0);
                }else stormIcons.ellipse(0,0,DIAMETER);
                drawArms();
            }
            stormIcons.fill(scaleIconData.color);
            stormIcons.noStroke();
            if(ty!==EXTROP) stormIcons.ellipse(0,0,DIAMETER);
            drawArms();
            if(ty===EXTROP){
                stormIcons.fill(COLORS.storm.extL);
                stormIcons.textSize(18);
            }else{
                stormIcons.fill(brightness(scaleIconData.color)<75 ? 240 : 0);
                let sym = tropOrSub(ty) ? scaleIconData.symbol : "L";
                if(sym.length >= 4) stormIcons.textSize(7.5);
                else if(sym.length === 3) stormIcons.textSize(9.5);
                else stormIcons.textSize(12);
            }
            stormIcons.textStyle(NORMAL);
            stormIcons.text(tropOrSub(ty) ? scaleIconData.symbol : "L", 0, 0);
            stormIcons.fill(0);
            if(simSettings.showStrength){
                stormIcons.textSize(10);
                stormIcons.text(`${displayWindspeed(floor(st), 1)}\n${floor(pr)} hPa`, 0, DIAMETER + 5);
            }
            if(name){
                stormIcons.textAlign(LEFT,CENTER);
                stormIcons.textSize(14);
                stormIcons.text(name,DIAMETER,0);
            }
            stormIcons.pop();
        }
    }

    renderTrack(newestSegment){
        if(simSettings.trackMode!==3){
            if(this.inBasinTC || simSettings.trackMode===1){
                if(newestSegment){
                    if(this.record.length>1 && (selectedStorm===this || selectedStorm===undefined)){
                        let t = (this.record.length-2)*ADVISORY_TICKS+ceil(this.birthTime/ADVISORY_TICKS)*ADVISORY_TICKS;
                        let adv = this.record[this.record.length-2];
                        let col = this.basin.getScale(land ? land.getSubBasin(adv.coord()) : 0).getColor(adv);
                        tracks.stroke(col);
                        let pos = adv.pos;
                        let nextPos = this.record[this.record.length-1].pos;
                        if(simSettings.trackMode===1 || (t>=this.formationTime && (!this.dissipationTime || t<this.dissipationTime))) tracks.line(pos.x,pos.y,nextPos.x,nextPos.y);
                    }
                }else if(this.aliveAt(viewTick) || simSettings.trackMode===2 || selectedStorm===this){
                    for(let n=0;n<this.record.length-1;n++){
                        let t = n*ADVISORY_TICKS+ceil(this.birthTime/ADVISORY_TICKS)*ADVISORY_TICKS;
                        if(simSettings.trackMode!==1){
                            if(t<this.formationTime) continue;
                            if(t>=this.dissipationTime) break;
                        }
                        let adv = this.record[n];
                        let col = this.basin.getScale(land ? land.getSubBasin(adv.coord()) : 0).getColor(adv);
                        tracks.stroke(col);
                        let pos = adv.pos;
                        let nextPos = this.record[n+1].pos;
                        tracks.line(pos.x,pos.y,nextPos.x,nextPos.y);
                    }
                }
            }
            if(selectedStorm===this && this.basin.viewingPresent() && this.current){
                forecastTracks.clear();
                const points = this.current.trackForecast;
                let p0;
                let p1 = this.record[this.record.length - 1].pos;
                let rVec = createVector(0);
                let r0 = 0;
                let r1 = 0.01;
                for(let hour of [12, 24, 36, 48, 60, 72, 96, 120]){
                    const n = hour / ADVISORY_TICKS - 1;
                    r0 = r1;
                    r1 = hour * 0.7 / 2;
                    p0 = p1;
                    p1 = points[n];
                    forecastTracks.circle(p1.x, p1.y, r1 * 2);
                    forecastTracks.beginShape();
                    rVec.set(p1.x, p1.y);
                    rVec.sub(p0.x, p0.y);
                    rVec.rotate(PI / 2);
                    rVec.setMag(r0);
                    forecastTracks.vertex(p0.x + rVec.x, p0.y + rVec.y);
                    rVec.rotate(PI);
                    forecastTracks.vertex(p0.x + rVec.x, p0.y + rVec.y);
                    rVec.setMag(r1);
                    forecastTracks.vertex(p1.x + rVec.x, p1.y + rVec.y);
                    rVec.rotate(PI);
                    forecastTracks.vertex(p1.x + rVec.x, p1.y + rVec.y);
                    forecastTracks.endShape();
                }
                
                forecastTracks.erase(128, 0);
                forecastTracks.rect(0, 0, WIDTH, HEIGHT);
                forecastTracks.noErase();
            }
        }
    }

    updateStats(data){
        let basin = this.basin;
        let w = data.windSpeed;
        let p = data.pressure;
        let type = data.type;
        let year = basin.getSeason(-1);
        let cSeason = basin.fetchSeason(year,false,true);
        let prevAdvisory = this.record.length>0 ? this.record[this.record.length-1] : undefined;
        let sub = land ? land.getSubBasin(data.coord()) : 0;
        let prevSub = (prevAdvisory && land) ? land.getSubBasin(prevAdvisory.coord()) : sub;
        let wasTCB4Update = prevAdvisory ? tropOrSub(prevAdvisory.type) : false;
        let isTropical = tropOrSub(type);
        let inBasinTropical = isTropical && basin.subInBasin(sub);
        let prevInBasinTropical = wasTCB4Update && basin.subInBasin(prevSub);
        if(!this.TC && isTropical){
            this.TC = true;
            this.formationTime = basin.tick;
            this.peak = undefined;
            this.windPeak = undefined;
        }
        if(!this.inBasinTC && inBasinTropical){
            this.inBasinTC = true;
            this.enterTime = basin.tick;
            this.peak = undefined;
            this.windPeak = undefined;
            this.ACE = 0;
            this.damage = 0;
            this.deaths = 0;
            this.landfalls = 0;
            if(wasTCB4Update) refreshTracks(true);
        }
        let newACE = 0;
        if(w>=ACE_WIND_THRESHOLD && (inBasinTropical || (isTropical && !this.inBasinTC))){
            newACE = pow(w,2)/ACE_DIVISOR;
            this.ACE += newACE;
            this.ACE = round(this.ACE*ACE_DIVISOR)/ACE_DIVISOR;
        }
        for(let subId of basin.forSubBasinChain(sub)){
            let sb = basin.subBasins[subId];
            let classification = basin.getScale(subId).get(data);
            // update classification counters and most intense storm for sub-basin
            if(basin.subInBasin(subId)){
                let stats = cSeason.stats(subId);
                let cCounters = stats.classificationCounters;
                if(isTropical){
                    for(let i=0;i<=classification;i++){
                        if(!this.subBasinData(subId,year,i,true)) cCounters[i]++;
                    }
                    stats.update_most_intense(cSeason, this, data);
                }
                stats.addACE(newACE);
            }
            // apply secondary (PAGASA-style) designations
            if(sb instanceof SubBasin && sb.designationSystem){
                let ds = sb.designationSystem;
                let desArray = this.designations.secondary;
                let numThresh = basin.getScale(subId).numberingThreshold;
                if(ds.numbering.threshold!==undefined) numThresh = ds.numbering.threshold;
                let nameThresh = basin.getScale(subId).namingThreshold;
                if(ds.naming.threshold!==undefined) nameThresh = ds.naming.threshold;
                if(ds.secondary){
                    if(ds.numbering.enabled && isTropical && classification>=numThresh && !this.subBasinData(subId,year,'num',true)){
                        let desig = ds.getNewNum();
                        if(desig) desArray.push(desig);
                    }
                    if(ds.naming.mainLists.length>0 && isTropical && classification>=nameThresh && !this.subBasinData(subId,year,'name',true)){
                        let desig = ds.getNewName();
                        if(desig) desArray.push(desig);
                    }
                }
            }
        }
        // apply primary designations
        let primaryDesSBs = basin.relevantPrimaryDesignationSubBasins(sub);
        let numberingSB = basin.subBasins[primaryDesSBs.numbering];
        let namingSB = basin.subBasins[primaryDesSBs.naming];
        let numberingDS;
        let namingDS;
        if(numberingSB instanceof SubBasin) numberingDS = numberingSB.designationSystem;
        if(namingSB instanceof SubBasin) namingDS = namingSB.designationSystem;
        let desArray = this.designations.primary;
        let designated;
        let subId;
        let ds;
        let classification;
        let threshold;
        let flag;
        for(let isNaming=0;isNaming<=1;isNaming++){
            if(isNaming){
                subId = primaryDesSBs.naming;
                threshold = basin.getScale(subId).namingThreshold;
                if(!namingDS){
                    if(isTropical && !this.subBasinData(sub,year,'name',true)) designated = true;
                    continue;
                }
                ds = namingDS.naming;
                flag = 'name';
            }else{
                subId = primaryDesSBs.numbering;
                threshold = basin.getScale(subId).numberingThreshold;
                if(!numberingDS){
                    if(isTropical && !this.subBasinData(sub,year,'num',true)) designated = true;
                    continue;
                }
                ds = numberingDS.numbering;
                flag = 'num';
            }
            classification = basin.getScale(subId).get(data);
            if(ds.threshold!==undefined) threshold = ds.threshold;
            let altPre = primaryDesSBs.altPre;
            let altSuf = primaryDesSBs.altSuf;
            if(isTropical && classification>=threshold && !this.subBasinData(subId,year,flag,true)){
                let findold = false;
                let keep = false;
                switch(ds.crossingMode){
                    case DESIG_CROSSMODE_ALWAYS:
                        findold = true;
                        break;
                    case DESIG_CROSSMODE_REGEN:
                    case DESIG_CROSSMODE_STRICT_REGEN:
                        // let a = data;
                        // for(let i=this.record.length-1;i>=0;i--){
                        //     if(tropOrSub(this.record[i].type)) a = this.record[i];
                        //     else break;
                        // }
                        // let lastFormedSB = land.getSubBasin(a.pos.x,a.pos.y);
                        // lastFormedSB = basin.relevantPrimaryDesignationSubBasins(lastFormedSB);
                        // if(isNaming) lastFormedSB = lastFormedSB.naming;
                        // else lastFormedSB = lastFormedSB.numbering;
                        // if(lastFormedSB!==subId) keep = true;
                        // else if(ds.crossingMode===DESIG_CROSSMODE_REGEN) findold = true;
                        // break;
                    case DESIG_CROSSMODE_KEEP:
                        keep = true;
                        break;
                }
                let reused = false;
                if(findold){
                    for(let i=0;i<desArray.length;i++){
                        let d = desArray[i];
                        if(d.subBasin===subId && (isNaming ? d.isName() : !d.isName())){
                            d.show(basin.tick);
                            reused = true;
                            designated = true;
                            break;
                        }
                    }
                }else if(keep){
                    for(let i=0;i<desArray.length;i++){
                        let d = desArray[i];
                        if(d.activeAt(basin.tick) && (isNaming ? d.isName() : !d.isName())){
                            reused = true;
                            designated = true;
                            break;
                        }
                    }
                }
                if(!reused){
                    let desig;
                    if(isNaming) desig = namingDS.getNewName();
                    else desig = numberingDS.getNewNum(altPre,altSuf);
                    if(desig){
                        desArray.push(desig);
                        designated = true;
                    }
                }
            }
        }
        if(designated){
            for(let i=0;i<desArray.length;i++){
                let d = desArray[i];
                let dSubId = d.subBasin;
                subId = d.isName() ? primaryDesSBs.naming : primaryDesSBs.numbering;
                if(dSubId!==subId && d.activeAt(basin.tick)){
                    // let dsb = basin.subBasins[dSubId];
                    // if(dsb instanceof SubBasin && dsb.designationSystem){
                    //     let dds = dsb.designationSystem;
                    //     let cm;
                    //     if(d.isName()) cm = dds.naming.crossingMode;
                    //     else cm = dds.numbering.crossingMode;
                    // }
                    flag = d.isName() ? 'name' : 'num';
                    this.subBasinData(dSubId,year,flag,false);
                }
            }
        }

        if(wasTCB4Update && !isTropical) this.dissipationTime = basin.tick;
        if(!wasTCB4Update && isTropical){
            this.dissipationTime = undefined;
            if(this.formationTime!==basin.tick) refreshTracks(true);
        }
        if(prevInBasinTropical && !inBasinTropical) this.exitTime = basin.tick;
        if(!prevInBasinTropical && inBasinTropical) this.exitTime = undefined;
        if((!this.inBasinTC && (!this.TC || isTropical)) || inBasinTropical){
            if(!this.peak)
                this.peak = data;
            else if(p < this.peak.pressure)
                this.peak = data;
            
            if(!this.windPeak)
                this.windPeak = data;
            else if(w > this.windPeak.windSpeed)
                this.windPeak = data;
        }
        cSeason.modified = true;
        basin.fetchSeason(this.originSeason(),false,true).modified = true;
    }

    subBasinData(sub,season,c,set){
        if(!this.sbData[sub]) this.sbData[sub] = {};
        let l = this.sbData[sub];
        if(typeof c === 'number'){
            if(!l.classLog) l.classLog = {};
            l = l.classLog;
            if(!l[season]) l[season] = {};
            l = l[season];
            let v = l[c];
            if(set!==undefined) l[c] = set;
            return v;
        }
        if(c==='num'){
            let v = l.numFlag;
            if(set!==undefined) l.numFlag = set;
            return v;
        }
        if(c==='name'){
            let v = l.nameFlag;
            if(set!==undefined) l.nameFlag = set;
            return v;
        }
    }

    save(){
        let obj = {};
        for(let p of [
            'id',
            'birthTime',
            'deaths',
            'damage',
            'landfalls'
        ]) obj[p] = this[p];
        obj.record = StormData.saveArr(this.record);
        obj.designations = {};
        obj.designations.primary = [];
        obj.designations.secondary = [];
        let P = this.designations.primary;
        let S = this.designations.secondary;
        for(let i=0;i<P.length;i++){
            obj.designations.primary.push(P[i].save());
        }
        for(let i=0;i<S.length;i++){
            obj.designations.secondary.push(S[i].save());
        }
        if(this.current) obj.sbData = this.sbData;
        return obj;
    }

    load(loadData){
        if(loadData instanceof LoadData){
            let basin = this.basin;
            let nameNum;
            let namedTime;
            let depNum;
            let designations;
            if(loadData.format>=FORMAT_WITH_INDEXEDDB){
                let obj = loadData.value;
                this.record = StormData.loadArr(basin,loadData.sub(obj.record));
                for(let p of [
                    'id',
                    'birthTime',
                    'deaths',
                    'damage',
                    'landfalls'
                ]) this[p] = obj[p];
                if(!this.birthTime) this.birthTime = 0;
                if(!this.deaths) this.deaths = 0;
                if(!this.damage) this.damage = 0;
                if(!this.landfalls) this.landfalls = 0;
                if(obj.depressionNum!==undefined) depNum = obj.depressionNum;
                if(obj.nameNum!==undefined) nameNum = obj.nameNum;
                if(obj.designations!==undefined) designations = obj.designations;
                if(obj.sbData){
                    this.sbData = obj.sbData;
                    if(loadData.format<FORMAT_WITH_SCALES){     // convert from pre-v0.2 values
                        for(let sub in this.sbData){
                            let l = this.sbData[sub].classLog;
                            if(l){
                                for(let s in l){
                                    let l1 = l[s];
                                    let l2 = {};
                                    for(let c in l1){
                                        let n = +c;
                                        if(l1[c]!==undefined){
                                            l2[Scale.convertOldValue(n)] = l1[c];
                                            if(c==='5') l2['6'] = l1[c];
                                        }
                                    }
                                    l[s] = l2;
                                }
                            }
                        }
                    }
                }
            }else{
                let data = loadData.value;
                data = data.split(".");
                let numData = decodeB36StringArray(data[0]);
                this.record = StormData.loadArr(basin,loadData.sub(data[1]));
                this.damage = numData.pop()*DAMAGE_DIVISOR || 0;
                this.deaths = numData.pop() || 0;
                this.birthTime = numData.pop() || 0;
                nameNum = numData.pop();
                if(nameNum<0) nameNum = undefined;
                depNum = numData.pop();
                if(depNum<0) depNum = undefined;
                this.id = numData.pop() || 0;
            }
            for(let i=0;i<this.record.length;i++){
                let d = this.record[i];
                let sub = land ? land.getSubBasin(d.coord()) : 0;
                let trop = tropOrSub(d.type);
                let inBasinTrop = trop && basin.subInBasin(sub);
                let t = (i+ceil(this.birthTime/ADVISORY_TICKS))*ADVISORY_TICKS;
                let yr = basin.getSeason(t);
                if(trop && !this.formationTime) this.formationTime = t;
                if(trop && this.dissipationTime) this.dissipationTime = undefined;
                if(!trop && this.formationTime && !this.dissipationTime) this.dissipationTime = t;
                if(inBasinTrop && !this.enterTime) this.enterTime = t;
                if(inBasinTrop && this.exitTime) this.exitTime = undefined;
                if(!inBasinTrop && this.enterTime && !this.exitTime) this.exitTime = t;
                let clsn = Scale.extendedSaffirSimpson.get(d);  // hardcoded to extended Saffir-Simpson since this is only used for backwards-compatibility
                if(inBasinTrop && !namedTime && clsn>=1) namedTime = t;  // backwards-compatibility name conversion
                if(loadData.format<FORMAT_WITH_STORM_SUBBASIN_DATA && inBasinTrop){
                    for(let subId of basin.forSubBasinChain(sub)){
                        for(let j=0;j<=clsn;j++) this.subBasinData(subId,yr,j,true);
                    }
                    this.subBasinData(this.basin.mainSubBasin,yr,'num',true);
                    if(clsn>=1) this.subBasinData(this.basin.mainSubBasin,yr,'name',true);
                }
                if(trop && !this.TC){
                    this.TC = true;
                    this.peak = undefined;
                    this.windPeak = undefined;
                }
                if(inBasinTrop && !this.inBasinTC){
                    this.inBasinTC = true;
                    this.peak = undefined;
                    this.windPeak = undefined;
                    this.ACE = 0;
                }
                if((!this.inBasinTC && (!this.TC || trop)) || inBasinTrop){
                    if(!this.peak)
                        this.peak = d;
                    else if(d.pressure < this.peak.pressure)
                        this.peak = d;

                    if(!this.windPeak)
                        this.windPeak = d;
                    else if(d.windSpeed > this.windPeak.windSpeed)
                        this.windPeak = d;
                }
                if(d.windSpeed>=ACE_WIND_THRESHOLD && (inBasinTrop || (trop && !this.inBasinTC))){
                    this.ACE *= ACE_DIVISOR;
                    this.ACE += pow(d.windSpeed,2);
                    this.ACE /= ACE_DIVISOR;
                }
            }
            this.ACE = round(this.ACE*ACE_DIVISOR)/ACE_DIVISOR;
            for(let a of basin.activeSystems){
                if(a.storm instanceof StormRef){
                    if(a.storm.season === loadData.season && a.storm.refId === this.id){
                        this.current = a;
                        a.storm = this;
                    }
                }
            }
            if(!this.current) this.deathTime = (this.record.length-1+ceil(this.birthTime/ADVISORY_TICKS))*ADVISORY_TICKS+1;
            if(this.TC && !this.dissipationTime) this.dissipationTime = this.deathTime;
            if(this.inBasinTC && !this.exitTime) this.exitTime = this.dissipationTime;
            if(designations){
                let P = designations.primary;
                let S = designations.secondary;
                for(let i=0;i<P.length;i++){
                    this.designations.primary.push(new Designation(loadData.sub(P[i])));
                }
                for(let i=0;i<S.length;i++){
                    this.designations.secondary.push(new Designation(loadData.sub(S[i])));
                }
            }else{
                let sb = basin.subBasins[this.basin.mainSubBasin];
                if(sb instanceof SubBasin && sb.designationSystem){     // converts pre-v20191004a designations; needs testing
                    if(nameNum!==undefined){
                        let desig = sb.designationSystem.getName(namedTime,basin.getSeason(namedTime),nameNum);
                        if(desig) this.designations.primary.push(desig);
                    }
                    if(depNum!==undefined){
                        let desig = sb.designationSystem.getNum(this.enterTime,depNum);
                        if(desig) this.designations.primary.push(desig);
                    }
                }
            }
        }
    }
}

class StormRef{
    constructor(basin,s){
        if(basin instanceof Basin) this.basin = basin;
        if(s instanceof Storm){
            this.season = s.originSeason();
            this.refId = s.id;
            this.lastApplicableAt = s.deathTime;
            this.ref = undefined;
        }else if(s instanceof LoadData){
            this.season = undefined;
            this.refId = undefined;
            this.ref = undefined;
            this.lastApplicableAt = undefined;
            this.load(s);
        }
    }

    fetch(){
        let basin = this.basin;
        if(this.ref && basin.seasons[this.season]) return this.ref;
        let seas = basin.fetchSeason(this.season);
        if(seas) this.ref = seas.fetchSystemById(this.refId);
        else{
            basin.fetchSeason(this.season,false,false,s=>{
                this.ref = s.fetchSystemById(this.refId);
            });
            return null;
        }
        return this.ref;
    }

    save(){
        let obj = {};
        for(let p of ['refId','season','lastApplicableAt']) obj[p] = this[p];
        return obj;
    }

    load(data){
        if(data instanceof LoadData){
            if(data.format>=FORMAT_WITH_INDEXEDDB){
                for(let p of ['refId','season','lastApplicableAt']) this[p] = data.value[p];
            }else{
                let str = data.value;
                let arr = decodeB36StringArray(str);
                this.season = arr.pop();
                this.refId = arr.pop();
            }
        }
    }
}

class StormData{
    constructor(basin,x,y,p,w,t){
        if(basin instanceof Basin) this.basin = basin;
        this.pos = undefined;
        this.pressure = undefined;
        this.windSpeed = undefined; // in knots
        this.type = undefined;
        if(x instanceof LoadData){
            this.load(x,y);
        }else{
            this.pos = createVector(x,y);
            this.pressure = p;
            this.windSpeed = w;
            this.type = t<STORM_TYPES ? t : EXTROP;
        }
    }

    coord(){
        return Coordinate.convertFromXY(this.basin.mapType, this.pos);
    }

    save(){
        let obj = {};
        let {longitude, latitude} = this.coord();
        obj.pos = {longitude, latitude};
        for(let p of ['pressure','windSpeed','type']) obj[p] = this[p];
        return obj;
    }

    load(data,posInArr){
        if(data instanceof LoadData){
            if(data.format>=FORMAT_WITH_INDEXEDDB){
                let obj = data.value;
                if(data.format >= FORMAT_WITH_LONG_LAT)
                    this.pos = Coordinate.convertToXY(this.basin.mapType, obj.pos.longitude, obj.pos.latitude);
                else
                    this.pos = createVector(obj.pos.x,obj.pos.y);
                for(let p of ['pressure','windSpeed','type']) this[p] = obj[p];
            }else{
                let str = data.value;
                let arr = decodeB36StringArray(str);
                this.type = arr.pop();
                this.windSpeed = arr.pop();
                this.pressure = arr.pop();
                if(posInArr) this.pos = posInArr;
                else{
                    let opts = {
                        p5Vec: true
                    };
                    this.pos = decodePoint(arr.pop(),opts);
                }
            }
        }
    }

    static saveArr(arr){
        let longitude = [];
        let latitude = [];
        let pressure = [];
        let windSpeed = [];
        let type = [];
        for(let d of arr){
            if(d instanceof StormData){
                let coord = d.coord();
                longitude.push(coord.longitude);
                latitude.push(coord.latitude);
                pressure.push(constrain(d.pressure,0,pow(2,16)-1));
                windSpeed.push(constrain(d.windSpeed,0,pow(2,16)-1));
                type.push(d.type);
            }
        }
        let obj = {};
        obj.pos = {longitude: new Float32Array(longitude), latitude: new Float32Array(latitude)};
        obj.pressure = new Uint16Array(pressure);
        obj.windSpeed = new Uint16Array(windSpeed);
        obj.type = new Uint8ClampedArray(type);
        return obj;
    }

    static loadArr(basin,data){
        if(basin instanceof Basin && data instanceof LoadData){
            if(data.format>=FORMAT_WITH_INDEXEDDB){
                let obj = data.value;
                let arr = [];
                let x, y;
                if(data.format >= FORMAT_WITH_LONG_LAT){
                    let longitude = [...obj.pos.longitude];
                    let latitude = [...obj.pos.latitude];
                    x = [];
                    y = [];
                    for(let i = 0; i < longitude.length; i++){
                        let vec = Coordinate.convertToXY(basin.mapType, longitude[i], latitude[i]);
                        x.push(vec.x);
                        y.push(vec.y);
                    }
                }else{
                    x = [...obj.pos.x];
                    y = [...obj.pos.y];
                }
                let pressure = [...obj.pressure];
                let windSpeed = [...obj.windSpeed];
                let type = [...obj.type];
                for(let i=0;i<x.length;i++){
                    arr[i] = new StormData(basin,x[i],y[i],pressure[i],windSpeed[i],type[i]);
                }
                return arr;
            }else{
                let str = data.value;
                let arr = str.split("/");
                let opts = {
                    p5Vec: true
                };
                let positions = decodePointArray(arr.shift(),opts);
                for(let i=0;i<arr.length;i++){
                    arr[i] = new StormData(basin,data.sub(arr[i]),positions[i]);
                }
                return arr;
            }
        }
    }
}

class ActiveSystem extends StormData{
    constructor(basin,data){
        if(!(basin instanceof Basin)) return;
        // if(data instanceof LoadData){
        //     super(basin);
        //     this.organization = undefined;
        //     this.lowerWarmCore = undefined;
        //     this.upperWarmCore = undefined;
        //     this.depth = undefined;
        // }else{
        //     let sType = spawn ? spawn.sType : undefined;
        //     if(sType==="x") ext = true;
        //     let subt = false;
        //     if(sType==="sd"){
        //         sType = "d";
        //         subt = true;
        //     }
        //     if(sType==="ss"){
        //         sType = "s";
        //         subt = true;
        //     }
        //     let x, y, tooClose;
        //     if(spawn){
        //         x = spawn.x;
        //         y = spawn.y;
        //     }else{
        //         do{
        //             tooClose = false;
        //             x = random()<0.2 && !ext ?
        //                     WIDTH-1:
        //                     random(0,WIDTH-1);
        //             y = basin.hemY(ext ? basin.env.get("jetstream",x,0,basin.tick)+random(-75,75) : random(HEIGHT*0.7,HEIGHT*0.9));
        //             for(let i=0;i<basin.activeSystems.length;i++){
        //                 let p = basin.activeSystems[i].pos;
        //                 if(sqrt(sq(x-p.x)+sq(y-p.y))<50) tooClose = true;
        //             }
        //         }while(tooClose);
        //     }
        //     let p = spawn ?
        //         sType==="x" ? 1005 :
        //         sType==="l" ? 1015 :
        //         sType==="d" ? 1005 :
        //         sType==="s" ? 995 :
        //         sType==="1" ? 985 :
        //         sType==="2" ? 975 :
        //         sType==="3" ? 960 :
        //         sType==="4" ? 945 :
        //         sType==="5" ? 925 :
        //         sType==='6' ? 890 :
        //         sType==='7' ? 840 :
        //         sType==='8' ? 800 :
        //         sType==='9' ? 765 :
        //         sType==='10' ? 730 :
        //         sType==='y' ? 690 : 1000 :
        //     random(1000,1020);
        //     let w = spawn ?
        //         sType==="x" ? 15 :
        //         sType==="l" ? 15 :
        //         sType==="d" ? 25 :
        //         sType==="s" ? 45 :
        //         sType==="1" ? 70 :
        //         sType==="2" ? 90 :
        //         sType==="3" ? 105 :
        //         sType==="4" ? 125 :
        //         sType==="5" ? 145 :
        //         sType==='6' ? 170 :
        //         sType==='7' ? 210 : 
        //         sType==='8' ? 270 :
        //         sType==='9' ? 330 :
        //         sType==='10' ? 400 :
        //         sType==='y' ? 440 : 35 :
        //     random(15,35);
        //     let ty = ext ? EXTROP : spawn ?
        //         sType==="l" ? TROPWAVE :
        //         subt ? SUBTROP : TROP :
        //     TROPWAVE;
        //     super(basin,x,y,p,w,ty);
        //     this.organization = ext ? 0 : spawn ? sType==="l" ? 0.2 : 1 : random(0,0.3);
        //     this.lowerWarmCore = ext ? 0 : subt ? 0.6 : 1;
        //     this.upperWarmCore = ext ? 0 : subt ? 0.5 : 1;
        //     this.depth = ext ? 1 : 0;
        // }
        super(basin);
        this.steering = createVector(0); // A vector that updates with the environmental steering
        this.interaction = {}; // Data for interaction with other storms (e.g. Fujiwhara)
        this.resetInteraction();
        this.kill = false;
        // this.trackForecast = {}; // Simple track forecast for now
        // this.trackForecast.stVec = createVector(0);
        // this.trackForecast.pVec = createVector(0);
        this.trackForecast/* .points */ = [];
        if(data instanceof LoadData){
            this.storm = undefined;
            this.load(data);
        }else{
            let d = data || {};
            if(d.x instanceof Function || d.y instanceof Function){
                let x, y, tooClose;
                let count = 0;
                do{
                    tooClose = false;
                    if(d.x instanceof Function)
                        x = d.x(basin);
                    else
                        x = d.x || 0;
                    if(d.y instanceof Function)
                        y = d.y(basin,x);
                    else
                        y = d.y || 0;
                    for(let i=0;i<basin.activeSystems.length;i++){
                        let p = basin.activeSystems[i].pos;
                        if(sqrt(sq(x-p.x)+sq(y-p.y))<50) tooClose = true;
                    }
                    count++;
                }while(tooClose && count < 1000);
                this.pos.x = x;
                this.pos.y = y;
            }else{
                this.pos.x = d.x || 0;
                this.pos.y = d.y || 0;
            }
            this.pressure = d.pressure===undefined ? 1000 : d.pressure;
            this.windSpeed = d.windSpeed===undefined ? 30 : d.windSpeed;
            this.type = d.type===undefined ? EXTROP : d.type;
            let activeAttribs = ACTIVE_ATTRIBS[basin.actMode] || ACTIVE_ATTRIBS.defaults;
            for(let v of activeAttribs)
                this[v] = d[v] || 0;
            this.storm = new Storm(basin,this);
            if(basin.tick%ADVISORY_TICKS===0) this.advisory();
        }
    }

    update(){
        let basin = this.basin;

        let u = {};
        u.f = (field)=>basin.env.get(field,this.pos.x,this.pos.y,basin.tick);
        u.land = ()=>land ? land.get(this.coord()) : false;

        // this.getSteering();
        if(STORM_ALGORITHM[basin.actMode].steering)
            STORM_ALGORITHM[basin.actMode].steering(this,this.steering,u);
        else
            STORM_ALGORITHM.defaults.steering(this,this.steering,u);
        // this.steering.add(this.interaction.fuji);
        let prevland = u.land();
        this.pos.add(this.steering);

        if(STORM_ALGORITHM[basin.actMode].core)
            STORM_ALGORITHM[basin.actMode].core(this,u);
        else
            STORM_ALGORITHM.defaults.core(this,u);

        if(STORM_ALGORITHM[basin.actMode].typeDetermination)
            STORM_ALGORITHM[basin.actMode].typeDetermination(this,u);
        else
            STORM_ALGORITHM.defaults.typeDetermination(this,u);
        
        let x = this.pos.x;
        let y = this.pos.y;
        let z = basin.tick;

        // let SST = basin.env.get("SST",x,y,z);
        // let jet = basin.env.get("jetstream",x,y,z);
        // jet = basin.hemY(y)-jet;
        let lnd = land ? land.get(this.coord()) : false;
        // let moisture = basin.env.get("moisture",x,y,z);
        // let shear = basin.env.get("shear",x,y,z).mag()+this.interaction.shear;
        
        // let targetWarmCore = (lnd ?
        //     this.lowerWarmCore :
        //     max(pow(map(SST,10,25,0,1,true),3),this.lowerWarmCore)
        // )*map(jet,0,75,sq(1-this.depth),1,true);
        // this.lowerWarmCore = lerp(this.lowerWarmCore,targetWarmCore,this.lowerWarmCore>targetWarmCore ? map(jet,0,75,0.4,0.06,true) : 0.04);
        // this.upperWarmCore = lerp(this.upperWarmCore,this.lowerWarmCore,this.lowerWarmCore>this.upperWarmCore ? 0.05 : 0.4);
        // this.lowerWarmCore = constrain(this.lowerWarmCore,0,1);
        // this.upperWarmCore = constrain(this.upperWarmCore,0,1);
        // let tropicalness = constrain(map(this.lowerWarmCore,0.5,1,0,1),0,this.upperWarmCore);
        // let nontropicalness = constrain(map(this.lowerWarmCore,0.75,0,0,1),0,1);

        // this.organization *= 100;
        // if(!lnd) this.organization += sq(map(SST,20,29,0,1,true))*3*tropicalness;
        // if(!lnd && this.organization<40) this.organization += lerp(0,3,nontropicalness);
        // // if(lnd) this.organization -= pow(10,map(lnd,0.5,1,-3,1));
        // // if(lnd && this.organization<70 && moisture>0.3) this.organization += pow(5,map(moisture,0.3,0.5,-1,1,true))*tropicalness;
        // this.organization -= pow(2,4-((HEIGHT-basin.hemY(y))/(HEIGHT*0.01)));
        // this.organization -= (pow(map(this.depth,0,1,1.17,1.31),shear)-1)*map(this.depth,0,1,4.7,1.2);
        // this.organization -= map(moisture,0,0.65,3,0,true)*shear;
        // this.organization += sq(map(moisture,0.6,1,0,1,true))*4;
        // this.organization -= pow(1.3,20-SST)*tropicalness;
        // this.organization = constrain(this.organization,0,100);
        // this.organization /= 100;

        // let targetPressure = 1010-25*log((lnd||SST<25)?1:map(SST,25,30,1,2))/log(1.17);
        // targetPressure = lerp(1010,targetPressure,pow(this.organization,3));
        // this.pressure = lerp(this.pressure,targetPressure,(this.pressure>targetPressure?0.05:0.08)*tropicalness);
        // this.pressure -= random(-3,3.5)*nontropicalness;
        // if(this.organization<0.3) this.pressure += random(-2,2.5)*tropicalness;
        // this.pressure += random(constrain(970-this.pressure,0,40))*nontropicalness;
        // this.pressure += 0.5*this.interaction.shear/(1+map(this.lowerWarmCore,0,1,4,0));
        // this.pressure += map(jet,0,75,5*pow(1-this.depth,4),0,true);

        // let targetWind = map(this.pressure,1030,900,1,160)*map(this.lowerWarmCore,1,0,1,0.6);
        // this.windSpeed = lerp(this.windSpeed,targetWind,0.15);

        // let targetDepth = map(
        //     this.upperWarmCore,
        //     0,1,
        //     1,map(
        //         this.organization,
        //         0,1,
        //         this.depth*pow(0.95,shear),max(map(this.pressure,1010,950,0,0.7,true),this.depth)
        //     )
        // );
        // this.depth = lerp(this.depth,targetDepth,0.05);

        // switch(this.type){
        //     case TROP:
        //         this.type = this.lowerWarmCore<0.55 ? EXTROP : ((this.organization<0.4 && this.windSpeed<50) || this.windSpeed<20) ? this.upperWarmCore<0.56 ? EXTROP : TROPWAVE : this.upperWarmCore<0.56 ? SUBTROP : TROP;
        //         break;
        //     case SUBTROP:
        //         this.type = this.lowerWarmCore<0.55 ? EXTROP : ((this.organization<0.4 && this.windSpeed<50) || this.windSpeed<20) ? this.upperWarmCore<0.57 ? EXTROP : TROPWAVE : this.upperWarmCore<0.57 ? SUBTROP : TROP;
        //         break;
        //     case TROPWAVE:
        //         this.type = this.lowerWarmCore<0.55 ? EXTROP : (this.organization<0.45 || this.windSpeed<25) ? this.upperWarmCore<0.56 ? EXTROP : TROPWAVE : this.upperWarmCore<0.56 ? SUBTROP : TROP;
        //         break;
        //     default:
        //         this.type = this.lowerWarmCore<0.6 ? EXTROP : (this.organization<0.45 || this.windSpeed<25) ? this.upperWarmCore<0.57 ? EXTROP : TROPWAVE : this.upperWarmCore<0.57 ? SUBTROP : TROP;
        // }

        if(this.kill || this.pos.x >= WIDTH || this.pos.x < 0 || this.pos.y >= HEIGHT || this.pos.y < 0){
            this.fetchStorm().deathTime = basin.tick;
            if(this.fetchStorm().TC && this.fetchStorm().dissipationTime===undefined) this.fetchStorm().dissipationTime = basin.tick;
            if(this.fetchStorm().inBasinTC && this.fetchStorm().exitTime===undefined) this.fetchStorm().exitTime = basin.tick;
            this.fetchStorm().current = undefined;
            return;
        }

        let rType = this.fetchStorm().getStormDataByTick(basin.tick);
        rType = rType && rType.type;
        if(tropOrSub(rType!==null ? rType : this.type)){
            let pop = lnd ? round(250000*(1+basin.hemY(y)/HEIGHT)*pow(0.8,map(lnd,0.5,1,0,30))) : 0;
            let damPot = pow(1.062,this.windSpeed)-1;   // damage potential
            let dedPot = pow(1.045,this.windSpeed)-1;    // death potential
            let m = pow(1.5,randomGaussian());      // modifier
            damPot *= m;
            dedPot *= m;
            let dam = pop*damPot*3.3*pow(1.1,random(-1,1));
            let ded = round(pop*dedPot*0.0000017*pow(1.1,random(-1,1)));
            let lf = 0;
            if(!prevland && lnd) lf = 1;
            let sub = land ? land.getSubBasin(Coordinate.convertFromXY(basin.mapType,x,y)) : 0;
            if(!this.fetchStorm().inBasinTC || basin.subInBasin(sub)){
                this.fetchStorm().damage += dam;
                this.fetchStorm().damage = round(this.fetchStorm().damage*100)/100;
                this.fetchStorm().deaths += ded;
                this.fetchStorm().landfalls += lf;
            }
            let seas = basin.fetchSeason(-1,true,true);
            for(let subId of basin.forSubBasinChain(sub)){
                if(basin.subInBasin(subId)){
                    let s = seas.stats(subId);
                    s.damage += dam;
                    s.damage = round(s.damage*100)/100;
                    s.deaths += ded;
                    s.landfalls += lf;
                }
            }
            seas.modified = true;
        }

        this.resetInteraction();
        if(basin.tick%ADVISORY_TICKS===0) this.advisory();
    }

    advisory(){
        let x = floor(this.pos.x);
        let y = floor(this.pos.y);
        let p = floor(this.pressure);
        let w = round(this.windSpeed/WINDSPEED_ROUNDING)*WINDSPEED_ROUNDING;
        let ty = this.type;
        let adv = new StormData(this.basin,x,y,p,w,ty);
        this.fetchStorm().updateStats(adv);
        this.fetchStorm().record.push(adv);
        this.doTrackForecast();
        // this.fetchStorm().renderTrack(true);
    }

    // getSteering(){
    //     let basin = this.basin;
    //     let l = basin.env.get("LLSteering",this.pos.x,this.pos.y,basin.tick);
    //     let u = basin.env.get("ULSteering",this.pos.x,this.pos.y,basin.tick);
    //     let d = sqrt(this.depth);
    //     let x = lerp(l.x,u.x,d);       // Deeper systems follow upper-level steering more and lower-level steering less
    //     let y = lerp(l.y,u.y,d);
    //     this.steering.set(x,y);
    //     this.steering.add(this.interaction.fuji); // Fujiwhara
    // }

    interact(that,first){   // Deals with multi-system interactions (i.e. Fujiwhara)
        let basin = this.basin;

        let interactionAdd;
        if(STORM_ALGORITHM[basin.actMode].interaction)
            interactionAdd = STORM_ALGORITHM[basin.actMode].interaction(this, that);
        else
            interactionAdd = STORM_ALGORITHM.defaults.interaction(this, that);
        for(let k in interactionAdd){
            if(interactionAdd[k] instanceof p5.Vector)
                this.interaction[k].add(interactionAdd[k]);
            else
                this.interaction[k] += interactionAdd[k];
        }
        
        // let v = createVector();
        // v.set(this.pos);
        // v.sub(that.pos);
        // let m = v.mag();
        // let r = map(that.lowerWarmCore,0,1,150,50);
        // if(m<r && m>0){
        //     v.rotate(basin.hem(-TAU/4+((3/m)*TAU/16)));
        //     v.setMag(map(m,r,0,0,map(constrain(that.pressure,990,1030),1030,990,0.2,2.2)));
        //     this.interaction.fuji.add(v);
        //     this.interaction.shear += map(m,r,0,0,map(that.pressure,1030,900,0,6));
        //     if((m<map(this.pressure,1030,1000,r/5,r/15) || m<5) && this.pressure>that.pressure) this.kill = true;
        // }

        if(first) that.interact(this);
    }

    resetInteraction(){
        let basin = this.basin;
        let i = this.interaction = {};
        // i.fuji.set(0);
        // i.shear = 0;

        let init;
        if(STORM_ALGORITHM[basin.actMode].interactionInit)
            init = STORM_ALGORITHM[basin.actMode].interactionInit;
        else
            init = STORM_ALGORITHM.defaults.interactionInit;
        for(let k in init){
            if(init[k])
                i[k] = createVector();
            else
                i[k] = 0;
        }
    }

    doTrackForecast(){
        let basin = this.basin;
        // let p = this.trackForecast.pVec;
        // let s = this.trackForecast.stVec;
        let p = createVector(0);
        let s = createVector(0);
        this.trackForecast/* .points */ = [];
        p.set(this.pos);

        let u = {};
        let t = 0;
        u.f = (field)=>basin.env.get(field, p.x, p.y, t);
        u.land = ()=>land ? land.get(Coordinate.convertFromXY(basin.mapType, p)) : false;

        for(let f=0;f<120;f++){
            t = basin.tick+f;
            // // Copy-paste from getSteering (will do something better in future)
            // let l = basin.env.get("LLSteering",p.x,p.y,t);
            // let u = basin.env.get("ULSteering",p.x,p.y,t);
            // let d = sqrt(this.depth);
            // let x = lerp(l.x,u.x,d);       // Deeper systems follow upper-level steering more and lower-level steering less
            // let y = lerp(l.y,u.y,d);
            // s.set(x,y);

            // use simulation mode's steering algorithm
            if(STORM_ALGORITHM[basin.actMode].steering)
                STORM_ALGORITHM[basin.actMode].steering(this, s, u);
            else
                STORM_ALGORITHM.defaults.steering(this, s, u);

            p.add(s);
            if((f+1)%ADVISORY_TICKS===0) this.trackForecast/* .points */.push({x:p.x,y:p.y});
        }
    }

    fetchStorm(){
        if(this.storm instanceof StormRef){
            console.error('ActiveSystem still needs to fetch StormRefs');
            let s = this.storm.fetch();
            if(!s) return new Storm(this.basin);
            this.storm = s;
            this.storm.deathTime = undefined;
            let r = this.storm.record;
            if(r.length>0 && tropOrSub(r[r.length-1].type)){
                this.storm.dissipationTime = undefined;
                if(land && land.inBasin(r[r.length-1].coord())) this.storm.exitTime = undefined;
            }
            this.storm.current = this;
        }
        return this.storm;
    }

    save(){
        let obj = super.save();
        let activeAttribs = ACTIVE_ATTRIBS[this.basin.actMode] || ACTIVE_ATTRIBS.defaults;
        for(let p of activeAttribs)
            obj[p] = this[p];
        obj.algorithmVersion = STORM_ALGORITHM[this.basin.actMode].version;
        obj.ref = new StormRef(this.basin,this.fetchStorm()).save();
        return obj;
    }

    load(data){
        if(data instanceof LoadData){
            let activeAttribs = ACTIVE_ATTRIBS[this.basin.actMode] || ACTIVE_ATTRIBS.defaults;
            let algorithmVersion = 0;
            if(data.format>=FORMAT_WITH_INDEXEDDB){
                let obj = data.value;
                super.load(data);
                algorithmVersion = obj.algorithmVersion || 0;
                if(algorithmVersion < STORM_ALGORITHM[this.basin.actMode].version && STORM_ALGORITHM[this.basin.actMode].upgrade)
                    STORM_ALGORITHM[this.basin.actMode].upgrade(this,obj,algorithmVersion); // upgrade active attributes in case of an algorithm version change
                else{
                    for(let p of activeAttribs)
                        this[p] = obj[p] || 0;
                }
                this.storm = new StormRef(this.basin,data.sub(obj.ref));
            }else{
                let str = data.value;
                let parts = str.split(".");
                super.load(data.sub(parts[0]));
                let activeData = decodeB36StringArray(parts[1]);
                if(algorithmVersion < STORM_ALGORITHM[this.basin.actMode].version && STORM_ALGORITHM[this.basin.actMode].upgrade){
                    let obj = {};
                    obj.depth = activeData.pop();
                    obj.upperWarmCore = activeData.pop();
                    obj.lowerWarmCore = activeData.pop();
                    obj.organization = activeData.pop();
                    // upgrade active attributes in case of an algorithm version change
                    STORM_ALGORITHM[this.basin.actMode].upgrade(this,obj,algorithmVersion);
                }else{
                    this.depth = activeData.pop();
                    this.upperWarmCore = activeData.pop();
                    this.lowerWarmCore = activeData.pop();
                    this.organization = activeData.pop();
                }
                this.storm = new StormRef(this.basin,data.sub(parts[2]));
            }
        }
    }
}

function tropOrSub(ty){
    return ty===TROP || ty===SUBTROP;
}

// --- START OF FILE: ui.ts ---

class UI{
    constructor(parent,x,y,w,h,renderer,onclick,showing){
        if(parent instanceof UI){
            this.parent = parent;
            this.parent.children.push(this);
        }
        this.relX = x;
        this.relY = y;
        this.width = w;
        this.height = h;
        if(renderer instanceof Function) this.renderFunc = renderer;
        if(renderer instanceof Array){
            let [size, charLimit, enterFunc] = renderer;
            this.isInput = true;
            this.value = '';
            this.clickFunc = function(){
                // textInput.value = this.value;
                // if(charLimit) textInput.maxLength = charLimit;
                // else textInput.removeAttribute('maxlength');
                // textInput.focus();
                UI.inputData.value = this.value;
                UI.inputData.maxLength = charLimit;
                UI.inputData.cursor = UI.inputData.selectionStart = UI.inputData.selectionEnd = this.value.length;
                UI.focusedInput = this;
                if(onclick instanceof Function) onclick.call(this,UI.focusedInput===this);
            };
            this.textCanvas = createBuffer(this.width,this.height);
            this.renderFunc = function(s){
                s.input(size);
            };
            if(enterFunc) this.enterFunc = enterFunc;
        }else{
            this.clickFunc = onclick;
            this.isInput = false;
        }
        this.children = [];
        this.showing = showing===undefined ? true : showing;
        if(!this.parent) UI.elements.push(this);
    }

    getX(){
        if(this.parent) return this.parent.getX() + this.relX;
        return this.relX;
    }

    getY(){
        if(this.parent) return this.parent.getY() + this.relY;
        return this.relY;
    }

    render(){
        if(this.showing){
            translate(this.relX,this.relY);
            if(this.renderFunc) this.renderFunc(this.schematics());
            if(this.children.length===1){
                this.children[0].render();
            }else{
                for(let c of this.children){
                    push();
                    c.render();
                    pop();
                }
            }
        }
    }

    schematics(){
        let s = {};
        s.fullRect = ()=>{
            rect(0,0,this.width,this.height);
        };
        s.button = (txt,box,size,grey)=>{
            noStroke();
            if(box){
                fill(COLORS.UI.buttonBox);
                s.fullRect();
            }
            if(this.isHovered()){
                fill(COLORS.UI.buttonHover);
                s.fullRect();
            }
            if(grey) fill(COLORS.UI.greyText);
            else fill(COLORS.UI.text);
            textAlign(CENTER,CENTER);
            textSize(size || 18);
            text(txt,this.width/2,this.height/2);
        };
        s.input = (size)=>{
            fill(COLORS.UI.input);
            if(UI.focusedInput===this) stroke(COLORS.UI.text);
            else{
                if(this.isHovered()){
                    noStroke();
                    s.fullRect();
                    fill(COLORS.UI.buttonHover);
                }
                stroke(COLORS.UI.nonSelectedInput);
            }
            s.fullRect();
            let c = this.textCanvas;
            c.clear();
            c.noStroke();
            c.fill(COLORS.UI.text);
            c.textSize(size || 18);
            let t = UI.focusedInput===this ? /* textInput */UI.inputData.value : this.value;
            let xAnchor;
            if(UI.focusedInput===this){
                c.textAlign(LEFT,CENTER);
                let caret1X = c.textWidth(t.slice(0,/* textInput */UI.inputData.selectionStart));
                let caret2X = c.textWidth(t.slice(0,/* textInput */UI.inputData.selectionEnd));
                if(caret2X>this.width-5) xAnchor = this.width-5-caret2X;
                else xAnchor = 5;
                caret1X += xAnchor;
                caret2X += xAnchor;
                c.text(t,xAnchor,this.height/2);
                if(/* textInput */UI.inputData.selectionStart === /* textInput */UI.inputData.selectionEnd){
                    c.stroke(COLORS.UI.text);
                    c.noFill();
                    if(millis()%1000<500) c.line(caret1X,this.height/8,caret1X,7*this.height/8);
                }else{
                    c.rect(caret1X,this.height/8,caret2X-caret1X,3*this.height/4);
                    c.fill(COLORS.UI.input);
                    c.text(t.slice(/* textInput */UI.inputData.selectionStart, /* textInput */UI.inputData.selectionEnd), caret1X, this.height / 2);
                }
            }else{
                if(c.textWidth(t)>this.width-5){
                    c.textAlign(RIGHT,CENTER);
                    xAnchor = this.width-5;
                }else{
                    c.textAlign(LEFT,CENTER);
                    xAnchor = 5;
                }
                c.text(t,xAnchor,this.height/2);
            }
            image(c, 0, 0, this.width, this.height);
        };
        return s;
    }

    setBox(x,y,w,h){    // Should be used inside of the renderer function
        if(x===undefined) x = this.relX;
        if(y===undefined) y = this.relY;
        if(w===undefined) w = this.width;
        if(h===undefined) h = this.height;
        translate(x-this.relX,y-this.relY);
        this.relX = x;
        this.relY = y;
        this.width = w;
        this.height = h;
    }

    append(chain,...opts){
        if(chain!==false && this.children.length>chain) return this.children[chain].append(0,...opts);
        return new UI(this,...opts);
    }

    checkMouseOver(){
        if(this.showing){
            if(this.children.length>0){
                let cmo = null;
                for(let i=this.children.length-1;i>=0;i--){
                    cmo = this.children[i].checkMouseOver();
                    if(cmo) return cmo;
                }
            }
            let left = this.getX();
            let right = left + this.width;
            let top = this.getY();
            let bottom = top + this.height;
            if(this.clickFunc && getScreenMouseX()>=left && getScreenMouseX()<right && getScreenMouseY()>=top && getScreenMouseY()<bottom) return this;
        }
        return null;
    }

    isHovered(){
        return UI.mouseOver===this;     // onclick parameter in constructor is required in order for hovering to work; use any truthy non-function value if clicking the UI does nothing
    }

    clicked(){
        if(this.clickFunc instanceof Function) this.clickFunc();
    }

    show(){
        this.showing = true;
    }

    hide(){
        this.showing = false;
    }

    toggleShow(){
        this.showing = !this.showing;
    }

    remove(){
        let mouseIsHere = false;
        if(this.checkMouseOver()){
            UI.mouseOver = undefined;
            mouseIsHere = true;
        }
        if(this.parent){
            for(let i=this.parent.children.length-1;i>=0;i--){
                if(this.parent.children[i]===this){
                    this.parent.children.splice(i,1);
                    break;
                }
            }
        }else{
            for(let i=UI.elements.length-1;i>=0;i--){
                if(UI.elements[i]===this){
                    UI.elements.splice(i,1);
                    break;
                }
            }
        }
        if(mouseIsHere) UI.updateMouseOver();
    }

    dropChildren(){
        let mouseIsHere = false;
        if(this.checkMouseOver()){
            UI.mouseOver = undefined;
            mouseIsHere = true;
        }
        this.children = [];
        if(mouseIsHere) UI.updateMouseOver();
    }
}

UI.elements = [];

UI.renderAll = function(){
    for(let u of UI.elements){
        push();
        u.render();
        pop();
    }
};

UI.mouseOver = undefined;
UI.focusedInput = undefined;
UI.inputData = {
    value: '',
    cursor: 0,
    selectionStart: 0,
    selectionEnd: 0,
    maxLength: undefined,
    insert: ''
};

UI.setInputCursorPosition = function(i, isSelecting){
    let anchor;
    if(UI.inputData.cursor === UI.inputData.selectionEnd)
        anchor = UI.inputData.selectionStart;
    else
        anchor = UI.inputData.selectionEnd;
    UI.inputData.cursor = i;
    if(isSelecting){
        UI.inputData.selectionStart = Math.min(i, anchor);
        UI.inputData.selectionEnd = Math.max(i, anchor);
    }else{
        UI.inputData.selectionStart = i;
        UI.inputData.selectionEnd = i;
    }
};

UI.updateMouseOver = function(){
    for(let i=UI.elements.length-1;i>=0;i--){
        let u = UI.elements[i];
        let mo = u.checkMouseOver();
        if(mo){
            UI.mouseOver = mo;
            return mo;
        }
    }
    UI.mouseOver = null;
    return null;
};

UI.click = function(){
    UI.updateMouseOver();
    if(UI.mouseOver === UI.focusedInput)
        return false;
    else if(UI.focusedInput){
        UI.focusedInput.value = UI.inputData.value;
        UI.focusedInput = undefined;
    }
    if(UI.mouseOver){
        UI.mouseOver.clicked();
        return true;
    }
    return false;
};

UI.viewBasin = undefined;
// UI.viewTick = undefined;

// Definitions for all UI elements

UI.init = function(){
    // hoist!

    let yearselbox;

    // "scene" wrappers

    mainMenu = new UI(null,0,0,WIDTH,HEIGHT);
    basinCreationMenu = new UI(null,0,0,WIDTH,HEIGHT,undefined,function(){
        yearselbox.enterFunc();
    },false);
    basinCreationMenuAdvanced = new UI(null,0,0,WIDTH,HEIGHT,undefined,undefined,false);
    loadMenu = new UI(null,0,0,WIDTH,HEIGHT,undefined,undefined,false);
    settingsMenu = new UI(null,0,0,WIDTH,HEIGHT,undefined,undefined,false);
    let desigSystemEditor = new UI(null,0,0,WIDTH,HEIGHT,undefined,undefined,false);
    primaryWrapper = new UI(null,0,0,WIDTH,HEIGHT,function(s){
        if(UI.viewBasin instanceof Basin){
            let basin = UI.viewBasin;
            if(basin.viewingPresent()) for(let S of basin.activeSystems) S.fetchStorm().renderIcon();
            else{
                let seas = basin.fetchSeason(viewTick,true);
                if(seas) for(let S of seas.forSystems(true)) S.renderIcon();
            }
    
            if(!land) return;
            if(!land.drawn){
                renderToDo = land.draw();
                return;
            }
            let drawMagGlass = ()=>{
                if(simSettings.showMagGlass){
                    let magMeta = buffers.get(magnifyingGlass);
                    let mx = getMapMouseX();
                    let my = getMapMouseY();
                    image(
                        magnifyingGlass,
                        mx - (magMeta.baseWidth / 2) / mapZoom,
                        my - (magMeta.baseHeight / 2) / mapZoom,
                        magMeta.baseWidth / mapZoom,
                        magMeta.baseHeight / mapZoom
                    );
                }
            };

            push();
            translate(mapPanX, mapPanY);
            scale(mapZoom);

            drawBuffer(outBasinBuffer);
            if(basin.env.displaying>=0 && basin.env.layerIsOceanic){
                drawBuffer(envLayer);
                drawMagGlass();
            }
            drawBuffer(landBuffer);
            if(simSettings.snowLayers){
                if(land.snowDrawn) drawBuffer(snow[floor(map(seasonCurve(viewTick,SNOW_SEASON_OFFSET),-1,1,0,simSettings.snowLayers*10))]);
                else renderToDo = land.drawSnow();
            }
            if(simSettings.useShadows){
                if(land.shaderDrawn) drawBuffer(landShadows);
                else renderToDo = land.drawShader();
            }
            if(basin.env.displaying>=0 && !basin.env.layerIsOceanic){
                drawBuffer(envLayer);
                drawMagGlass();
                if(!basin.env.layerIsVector) drawBuffer(coastLine);
            }
            // let sub = land.getSubBasin(getMouseX(),getMouseY());
            // if(basin.subBasins[sub] instanceof SubBasin && basin.subBasins[sub].mapOutline) drawBuffer(basin.subBasins[sub].mapOutline);   // test
            drawBuffer(tracks);
            drawBuffer(forecastTracks);
            drawBuffer(stormIcons);

            pop();
        }
    },function(){
        helpBox.hide();
        sideMenu.hide();
        seedBox.hide();
        if(hasDraggedMap){
            hasDraggedMap = false;
            return;
        }
        if(UI.viewBasin instanceof Basin){
            let basin = UI.viewBasin;
            if(basin.godMode && keyIsPressed && basin.viewingPresent()) {
                if(['l','x','d','D','s','S','1','2','3','4','5','6','7','8','9','0','y'].includes(key))
                    basin.spawnArchetype(key,getMouseX(),getMouseY());
                // let g = {x: getMouseX(), y: getMouseY()};
                // if(key === "l" || key === "L"){
                //     g.sType = "l";
                // }else if(key === "d"){
                //     g.sType = "d";
                // }else if(key === "D"){
                //     g.sType = "sd";
                // }else if(key === "s"){
                //     g.sType = "s";
                // }else if(key === "S"){
                //     g.sType = "ss";
                // }else if(key === "1"){
                //     g.sType = "1";
                // }else if(key === "2"){
                //     g.sType = "2";
                // }else if(key === "3"){
                //     g.sType = "3";
                // }else if(key === "4"){
                //     g.sType = "4";
                // }else if(key === "5"){
                //     g.sType = "5";
                // }else if(key === "6"){
                //     g.sType = "6";
                // }else if(key === "7"){
                //     g.sType = "7";
                // }else if(key === "8"){
                //     g.sType = "8";
                // }else if(key === "9"){
                //     g.sType = "9";
                // }else if(key === "0"){
                //     g.sType = "10";
                // }else if(key === "y" || key === "Y"){
                //     g.sType = "y";
                // }else if(key === "x" || key === "X"){
                //     g.sType = "x";
                // }else return;
                // basin.spawn(false,g);
            }else if(basin.viewingPresent()){
                let mVector = createVector(getMouseX(),getMouseY());
                for(let i=basin.activeSystems.length-1;i>=0;i--){
                    let s = basin.activeSystems[i].fetchStorm();
                    let p = s.getStormDataByTick(viewTick,true).pos;
                    if(p.dist(mVector)<DIAMETER){
                        selectStorm(s);
                        refreshTracks(true);
                        return;
                    }
                }
                selectStorm();
                refreshTracks(true);
            }else{
                let vSeason = basin.fetchSeason(viewTick,true);
                if(vSeason){
                    let mVector = createVector(getMouseX(),getMouseY());
                    for(let i=vSeason.systems.length-1;i>=0;i--){
                        let s = vSeason.fetchSystemAtIndex(i);
                        if(s && s.aliveAt(viewTick)){
                            let p = s.getStormDataByTick(viewTick).pos;
                            if(p.dist(mVector)<DIAMETER){
                                selectStorm(s);
                                refreshTracks(true);
                                return;
                            }
                        }
                    }
                    selectStorm();
                    refreshTracks(true);
                }
            }
        }
    },false);
    areYouSure = new UI(null,0,0,WIDTH,HEIGHT,function(s){
        fill(COLORS.UI.box);
        noStroke();
        s.fullRect();
    },true,false);

    // main menu

    // main menu is now rendered using React in src/main.tsx
    /*
    mainMenu.append(false,WIDTH/2,HEIGHT/4,0,0,function(s){  // title text
        fill(COLORS.UI.text);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(36);
        text(TITLE,0,0);
        textSize(18);
        textStyle(ITALIC);
        text("Simulate your own monster storms!",0,40);
    });

    mainMenu.append(false,WIDTH/2-100,HEIGHT/2-20,200,40,function(s){    // "New Basin" button
        s.button('New Basin',true,24);
    },function(){
        mainMenu.hide();
        basinCreationMenu.show();
    }).append(false,0,60,200,40,function(s){     // load button
        s.button('Load Basin',true,24);
    },function(){
        mainMenu.hide();
        loadMenu.show();
        loadMenu.refresh();
    }).append(false,0,60,200,40,function(s){     // settings menu button
        s.button('Settings',true,24);
    },function(){
        mainMenu.hide();
        settingsMenu.show();
    });
    */

    // basin creation menu

    let newBasinSettings = {};
    newBasinSettings.mapType = 6; // default to Atlantic
    let advancedBasinSettings = {};
    Object.assign(advancedBasinSettings, MAP_TYPES[newBasinSettings.mapType || 0].optionPresets);

    basinCreationMenu.append(false,WIDTH/2,HEIGHT/16,0,0,function(s){ // menu title text
        fill(COLORS.UI.text);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(36);
        text("New Basin Settings",0,0);
    });

    let basinCreationMenuButtonSpacing = 36;
    let basinCreationMenuButtonHeights = 28;
    let basinCreationMenuButtonWidths = 400;

    let maptypesel = basinCreationMenu.append(false,WIDTH/2-basinCreationMenuButtonWidths/2,HEIGHT/8,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){     // Map type Selector
        let maptype = MAP_TYPES[newBasinSettings.mapType || 0].label;
        s.button('Map Type: '+maptype,true);
    },function(){
        yearselbox.enterFunc();
        if(newBasinSettings.mapType===undefined) newBasinSettings.mapType = 0;
        newBasinSettings.mapType++;
        newBasinSettings.mapType %= MAP_TYPES.length;
        advancedBasinSettings = {};
        Object.assign(advancedBasinSettings, MAP_TYPES[newBasinSettings.mapType || 0].optionPresets);
    })

    let yearsel = maptypesel.append(false,0,basinCreationMenuButtonSpacing,0,basinCreationMenuButtonHeights,function(s){ // Year selector
        textAlign(LEFT,CENTER);
        text("Starting year: ",0,basinCreationMenuButtonHeights/2);
    });

    yearsel.append(false,110,0,basinCreationMenuButtonWidths-110,basinCreationMenuButtonHeights,function(s){
        let yName;
        if(newBasinSettings.year===undefined) yName = "Current year";
        else{
            let y = newBasinSettings.year;
            let h;
            if(advancedBasinSettings.hem===1) h = false;
            if(advancedBasinSettings.hem===2) h = true;
            if(h===undefined){
                yName = seasonName(y,false) + " or " + seasonName(y,true);
            }else yName = seasonName(y,h);
        }
        textAlign(LEFT,CENTER);
        let fontSize = 18;
        textSize(fontSize);
        while(textWidth(yName)>this.width-10 && fontSize>8){
            fontSize--;
            textSize(fontSize);
        }
        s.button(yName,true,fontSize);
    },function(){
        yearselbox.toggleShow();
        if(yearselbox.showing) yearselbox.clicked();
    });

    yearselbox = yearsel.append(false,110,0,basinCreationMenuButtonWidths-110,basinCreationMenuButtonHeights,[18,16,function(){
        if(yearselbox.showing){
            let v = yearselbox.value;
            let m = v.match(/^\s*(\d+)(\s+B\.?C\.?(?:E\.?)?)?(?:\s*-\s*(\d+))?(?:\s+(?:(B\.?C\.?(?:E\.?)?)|A\.?D\.?|C\.?E\.?))?\s*$/i);
            if(m){
                let bce = m[2] || m[4];
                let bce2 = m[4];
                let year1 = parseInt(m[1]);
                if(bce) year1 = 1-year1;
                let year2;
                if(m[3]){
                    year2 = parseInt(m[3]);
                    if(bce2) year2 = 1-year2;
                    if(year1+1===year2 || (year1+1)%100===year2) newBasinSettings.year = year1+1;
                    else newBasinSettings.year = undefined;
                }else newBasinSettings.year = year1;
            }else if(v!=='') newBasinSettings.year = undefined;
            if(newBasinSettings.year && !moment.utc([newBasinSettings.year,0,1]).isValid()) newBasinSettings.year = undefined;
            yearselbox.value = '';
            yearselbox.hide();
        }
    }],undefined,false);

    let gmodesel = yearsel.append(false,0,basinCreationMenuButtonSpacing,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){    // Simulation mode selector
        let mode = newBasinSettings.actMode || 0;
        mode = SIMULATION_MODES[mode];
        s.button('Simulation Mode: '+mode,true);
    },function(){
        yearselbox.enterFunc();
        if(newBasinSettings.actMode===undefined) newBasinSettings.actMode = 0;
        newBasinSettings.actMode++;
        newBasinSettings.actMode %= SIMULATION_MODES.length;
    }).append(false,0,basinCreationMenuButtonSpacing,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){     // God mode Selector
        let gMode = newBasinSettings.godMode ? "Enabled" : "Disabled";
        s.button('God Mode: '+gMode,true);
    },function(){
        yearselbox.enterFunc();
        newBasinSettings.godMode = !newBasinSettings.godMode;
    });

    gmodesel.append(false,0,basinCreationMenuButtonSpacing,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){     // Advanced options button
        s.button("Advanced",true);
    },function(){
        yearselbox.enterFunc();
        basinCreationMenu.hide();
        basinCreationMenuAdvanced.show();
    });

    basinCreationMenu.append(false,WIDTH/2-basinCreationMenuButtonWidths/2,7*HEIGHT/8-20,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){    // "Start" button
        s.button("Start",true,20);
    },function(){
        yearselbox.enterFunc();
        let seed = seedsel.value;
        if(/^-?\d+$/g.test(seed)) advancedBasinSettings.seed = parseInt(seed);
        else advancedBasinSettings.seed = hashCode(seed);
        seedsel.value = '';

        let opts = {};
        if(advancedBasinSettings.hem===1) opts.hem = false;
        else if(advancedBasinSettings.hem===2) opts.hem = true;
        else opts.hem = random()<0.5;
        opts.year = opts.hem ? SHEM_DEFAULT_YEAR : NHEM_DEFAULT_YEAR;
        if(newBasinSettings.year!==undefined) opts.year = newBasinSettings.year;
        for(let o of [
            'actMode',
            'mapType',
            'godMode',
        ]) opts[o] = newBasinSettings[o];
        for(let o of [
            'seed',
            'designations',
            'scale',
            'scaleFlavor'
        ]) opts[o] = advancedBasinSettings[o];
        let basin = new Basin(false,opts);

        newBasinSettings = {};
        newBasinSettings.mapType = 6; // default to Atlantic
        advancedBasinSettings = {};
        Object.assign(advancedBasinSettings, MAP_TYPES[newBasinSettings.mapType || 0].optionPresets);

        basin.initialized.then(()=>{
            basin.mount();
        });
        basinCreationMenu.hide();
    }).append(false,0,basinCreationMenuButtonSpacing,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){ // "Cancel" button
        s.button("Cancel",true,20);
    },function(){
        yearselbox.value = '';
        yearselbox.hide();
        basinCreationMenu.hide();
        mainMenu.show();
    });

    // basin creation menu advanced options

    basinCreationMenuAdvanced.append(false,WIDTH/2,HEIGHT/16,0,0,function(s){ // menu title text
        fill(COLORS.UI.text);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(36);
        text("New Basin Settings (Advanced)",0,0);
    });

    let hemsel = basinCreationMenuAdvanced.append(false,WIDTH/2-basinCreationMenuButtonWidths/2,HEIGHT/8,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){   // hemisphere selector
        let hem = "Random";
        if(advancedBasinSettings.hem===1) hem = "Northern";
        if(advancedBasinSettings.hem===2) hem = "Southern";
        s.button('Hemisphere: '+hem,true);
    },function(){
        yearselbox.enterFunc();
        if(advancedBasinSettings.hem===undefined) advancedBasinSettings.hem = 1;
        else{
            advancedBasinSettings.hem++;
            advancedBasinSettings.hem %= 3;
        }
    });

    let desigsel = hemsel.append(false,0,basinCreationMenuButtonSpacing,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){    // Scale selector
        let scale = advancedBasinSettings.scale || 0;
        scale = Scale.presetScales[scale].displayName;
        s.button('Scale: '+scale,true);
    },function(){
        if(advancedBasinSettings.scale===undefined) advancedBasinSettings.scale = 0;
        advancedBasinSettings.scale++;
        advancedBasinSettings.scale %= Scale.presetScales.length;
        advancedBasinSettings.scaleFlavor = 0;
    }).append(false,0,basinCreationMenuButtonSpacing,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){     // Scale flavor selector
        let scale = advancedBasinSettings.scale || 0;
        scale = Scale.presetScales[scale];
        let flavor = advancedBasinSettings.scaleFlavor || 0;
        let grey = scale.flavorDisplayNames.length<2;
        s.button('Scale Flavor: '+(scale.flavorDisplayNames[flavor] || 'N/A'),true,18,grey);
    },function(){
        let scale = advancedBasinSettings.scale || 0;
        scale = Scale.presetScales[scale];
        if(scale.flavorDisplayNames.length<2) return;
        if(advancedBasinSettings.scaleFlavor===undefined) advancedBasinSettings.scaleFlavor = 0;
        advancedBasinSettings.scaleFlavor++;
        advancedBasinSettings.scaleFlavor %= scale.flavorDisplayNames.length;
    }).append(false,0,basinCreationMenuButtonSpacing,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){     // Designations selector
        let ds = advancedBasinSettings.designations || 0;
        ds = DesignationSystem.presetDesignationSystems[ds].displayName;
        s.button('Designations: '+ds,true);
    },function(){
        if(advancedBasinSettings.designations===undefined) advancedBasinSettings.designations = 0;
        advancedBasinSettings.designations++;
        advancedBasinSettings.designations %= DesignationSystem.presetDesignationSystems.length;
    });

    let seedsel = desigsel.append(false,0,basinCreationMenuButtonSpacing,0,basinCreationMenuButtonHeights,function(s){
        textAlign(LEFT,CENTER);
        text('Seed:',0,basinCreationMenuButtonHeights/2);
    }).append(false,50,0,basinCreationMenuButtonWidths-50,basinCreationMenuButtonHeights,[18,16]);

    basinCreationMenuAdvanced.append(false,WIDTH/2-basinCreationMenuButtonWidths/2,7*HEIGHT/8-20,basinCreationMenuButtonWidths,basinCreationMenuButtonHeights,function(s){ // "Back" button
        s.button("Back", true, 20);
    },function(){
        basinCreationMenuAdvanced.hide();
        basinCreationMenu.show();
    });

    // load menu

    loadMenu.loadables = []; // cache that stores a list of saved basins and if they are loadable
    loadMenu.page = 0;

    loadMenu.append(false,WIDTH/2,HEIGHT/8,0,0,function(s){ // menu title text
        fill(COLORS.UI.text);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(36);
        text("Load Basin",0,0);
    });

    loadMenu.refresh = function(){
        loadMenu.loadables = [];
        waitForAsyncProcess(()=>{
            return db.transaction('r',db.saves,()=>{
                let col = db.saves.orderBy('format');
                let saveNames = col.primaryKeys();
                let formats = col.keys();
                return Promise.all([saveNames,formats]);
            }).then(res=>{
                let saveNames = res[0];
                let formats = res[1];
                for(let i=0;i<saveNames.length;i++){
                    loadMenu.loadables.push({
                        saveName: saveNames[i],
                        format: formats[i]
                    });
                }
                loadMenu.loadables.sort((a,b)=>{
                    a = a.saveName;
                    b = b.saveName;
                    if(a===AUTOSAVE_SAVE_NAME) return -1;
                    if(b===AUTOSAVE_SAVE_NAME) return 1;
                    return a>b ? 1 : -1;
                });
            });
        },'Fetching Saved Basins...').catch(e=>{
            console.error(e);
        });
    };

    let loadbuttonrender = function(s){
        let b = loadMenu.loadables[loadMenu.page*LOAD_MENU_BUTTONS_PER_PAGE+this.buttonNum];
        let label;
        let loadable;
        if(!b){
            label = '--Empty--';
            loadable = false;
        }else{
            label = b.saveName;
            if(b.format < EARLIEST_COMPATIBLE_FORMAT || b.format > SAVE_FORMAT){
                label += " [Incompatible]";
                loadable = false;
            }else loadable = true;
        }
        let fontSize = 18;
        textSize(fontSize);
        while(textWidth(label)>this.width-10 && fontSize>8){
            fontSize--;
            textSize(fontSize);
        }
        s.button(label,true,fontSize,!loadable);
    };

    let loadbuttonclick = function(){
        let b = loadMenu.loadables[loadMenu.page*LOAD_MENU_BUTTONS_PER_PAGE+this.buttonNum];
        if(b && b.format >= EARLIEST_COMPATIBLE_FORMAT && b.format <= SAVE_FORMAT){
            let basin = new Basin(b.saveName);
            basin.initialized.then(()=>{
                basin.mount();
            });
            loadMenu.hide();
        }
    };

    let loadbuttons = [];

    for(let i=0;i<LOAD_MENU_BUTTONS_PER_PAGE;i++){
        let x = i===0 ? WIDTH/2-150 : 0;
        let y = i===0 ? HEIGHT/4 : 40;
        loadbuttons[i] = loadMenu.append(1,x,y,300,30,loadbuttonrender,loadbuttonclick);
        loadbuttons[i].buttonNum = i;
    }

    loadMenu.append(1,0,40,300,30,function(s){ // "Cancel" button
        s.button("Cancel",true,20);
    },function(){
        loadMenu.hide();
        mainMenu.show();
    });

    loadMenu.append(false,WIDTH/2-75,HEIGHT/4-40,30,30,function(s){   // prev page
        s.button('',true,18,loadMenu.page<1);
        triangle(5,15,25,5,25,25);
    },function(){
        if(loadMenu.page>0) loadMenu.page--;
    }).append(false,120,0,30,30,function(s){    // next page
        let grey = loadMenu.page>=ceil(loadMenu.loadables.length/LOAD_MENU_BUTTONS_PER_PAGE)-1;
        s.button('',true,18,grey);
        triangle(5,5,25,15,5,25);
    },function(){
        if(loadMenu.page<ceil(loadMenu.loadables.length/LOAD_MENU_BUTTONS_PER_PAGE)-1) loadMenu.page++;
    });

    let delbuttonrender = function(s){
        let b = loadMenu.loadables[loadMenu.page*LOAD_MENU_BUTTONS_PER_PAGE+this.parent.buttonNum];
        s.button("Del",true,18,!b);
    };

    let delbuttonclick = function(){
        let b = loadMenu.loadables[loadMenu.page*LOAD_MENU_BUTTONS_PER_PAGE+this.parent.buttonNum];
        if(b){
            areYouSure.dialog(()=>{
                Basin.deleteSave(b.saveName,()=>{
                    loadMenu.refresh();
                });
            },'Delete "'+b.saveName+'"?');
        }
    };

    for(let i=0;i<LOAD_MENU_BUTTONS_PER_PAGE;i++) loadbuttons[i].append(false,315,0,40,30,delbuttonrender,delbuttonclick);

    // Settings Menu

    settingsMenu.append(false,WIDTH/2,HEIGHT/8,0,0,function(s){ // menu title text
        fill(COLORS.UI.text);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(36);
        text("Settings",0,0);
    });

    settingsMenu.append(false, WIDTH / 2 - 150, 3 * HEIGHT / 16, 300, 30, function(s){   // storm intensity indicator
        let b = simSettings.showStrength ? "Enabled" : "Disabled";
        s.button("Intensity Indicator: "+b,true);
    },function(){
        simSettings.setShowStrength("toggle");
    }).append(false,0,37,300,30,function(s){     // autosaving
        let b = simSettings.doAutosave ? "Enabled" : "Disabled";
        s.button("Autosaving: "+b,true);
    },function(){
        simSettings.setDoAutosave("toggle");
    }).append(false,0,37,300,30,function(s){     // track mode
        let m = ["Active TC Tracks","Full Active Tracks","Season Summary","No Tracks"][simSettings.trackMode];
        s.button("Track Mode: "+m,true);
    },function(){
        simSettings.setTrackMode("incmod",4);
        refreshTracks(true);
    }).append(false,0,37,300,30,function(s){     // snow
        let b = simSettings.snowLayers ? (simSettings.snowLayers*10) + " layers" : "Disabled";
        s.button("Snow: "+b,true);
    },function(){
        simSettings.setSnowLayers("incmod",floor(MAX_SNOW_LAYERS/10)+1);
        if(land) land.clearSnow();
    }).append(false,0,37,300,30,function(s){     // shadows (NOT a shader O~O)
        let b = simSettings.useShadows ? "Enabled" : "Disabled";
        s.button("Land Shadows: "+b,true);
    },function(){
        simSettings.setUseShadows("toggle");
    }).append(false,0,37,300,30,function(s){     // magnifying glass
        let b = simSettings.showMagGlass ? "Enabled" : "Disabled";
        s.button("Magnifying Glass: "+b,true);
    },function(){
        simSettings.setShowMagGlass("toggle");
        if(UI.viewBasin) UI.viewBasin.env.updateMagGlass();
    }).append(false,0,37,300,30,function(s){     // smooth land color
        let b = simSettings.smoothLandColor ? "Enabled" : "Disabled";
        s.button("Smooth Land Color: "+b,true);
    },function(){
        simSettings.setSmoothLandColor("toggle");
        if(land){
            // landBuffer.clear();
            land.drawn = false;
        }
    }).append(false,0,37,300,30,function(s){     // speed unit
        let u = ['kts', 'mph', 'km/h'][simSettings.speedUnit];
        s.button("Windspeed Unit: " + u, true);
    },function(){
        simSettings.setSpeedUnit("incmod", 3);
    }).append(false,0,37,300,30,function(s){     // color scheme
        let n = COLOR_SCHEMES[simSettings.colorScheme].name;
        s.button("Color Scheme: " + n, true);
    },function(){
        simSettings.setColorScheme("incmod", COLOR_SCHEMES.length);
        refreshTracks(true);
    });

    settingsMenu.append(false,WIDTH/2-150,7*HEIGHT/8-20,300,30,function(s){ // "Back" button
        s.button("Back",true,20);
    },function(){
        settingsMenu.hide();
        if(UI.viewBasin instanceof Basin) primaryWrapper.show();
        else mainMenu.show();
    });

    // Are you sure dialog

    areYouSure.append(false,WIDTH/2,HEIGHT/4,0,0,function(s){ // dialog text
        fill(COLORS.UI.text);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(36);
        text("Are You Sure?",0,0);
        if(areYouSure.desc){
            textSize(24);
            text(areYouSure.desc,0,50);
        }
    });

    areYouSure.append(false,WIDTH/2-108,HEIGHT/4+100,100,30,function(s){ // "Yes" button
        s.button("Yes",true,20);
    },function(){
        if(areYouSure.action){
            areYouSure.action();
            areYouSure.action = undefined;
        }
        else console.error("No action tied to areYouSure dialog");
        areYouSure.hide();
    }).append(false,116,0,100,30,function(s){ // "No" button
        s.button("No",true,20);
    },function(){
        areYouSure.hide();
    });

    areYouSure.dialog = function(action,desc){
        if(action instanceof Function){
            areYouSure.action = action;
            if(typeof desc === "string") areYouSure.desc = desc;
            else areYouSure.desc = undefined;
            areYouSure.show();
        }
    };

    // designation system editor

    const desig_editor_definition = (()=>{
        const section_spacing = 36;
        const section_heights = 28;
        const section_width = 400;
        const name_sections = 6;

        let editing_sub_basin;
        let desig_system;
        let name_list_num = 0;
        let name_list_page = 0;
        let list_lists_mode = true;
        let aux_list = false;
        let prefix_box;
        let suffix_box;
        let num_affix_section;
        let name_editor;
        let name_edit_box;
        let name_edit_index = 0;
        let adding_name = false;

        const refresh_num_section = ()=>{
            if(desig_system instanceof DesignationSystem){
                prefix_box.value = desig_system.numbering.prefix || '';
                suffix_box.value = desig_system.numbering.suffix || '';
            }
            if(desig_system && desig_system.numbering.enabled)
                num_affix_section.show();
            else
                num_affix_section.hide();
        };
        const refresh_name_section = ()=>{
            name_list_page = 0;
        };
        const refresh_desig_editor = ()=>{
            if(editing_sub_basin === undefined)
                editing_sub_basin = UI.viewBasin.mainSubBasin;
            let sb = UI.viewBasin.subBasins[editing_sub_basin];
            if(sb && sb.designationSystem)
                desig_system = sb.designationSystem;
            name_list_num = 0;
            list_lists_mode = true;
            aux_list = false;
            refresh_num_section();
            refresh_name_section();
        };

        const list_array = ()=>{
            if(desig_system instanceof DesignationSystem){
                if(aux_list)
                    return desig_system.naming.auxiliaryLists;
                else
                    return desig_system.naming.mainLists;
            }
        };
        const get_list_from_index = (i)=>{
            let list_arr = list_array();
            if(list_arr)
                return list_arr[i];
        };
        const get_list = ()=>{
            return get_list_from_index(name_list_num);
        };
        const name_at = (i)=>{
            let txt;
            let list = get_list();
            if(list && list[i])
                txt = list[i];
            return txt;
        };
        const invoke_name_editor = (i,is_new_name)=>{
            let list = get_list();
            if(list){
                name_edit_index = i;
                if(is_new_name)
                    name_edit_box.value = '';
                else
                    name_edit_box.value = list[i];
                adding_name = is_new_name;
                name_editor.show();
                name_edit_box.clicked();
            }
        };

        // title text
        desigSystemEditor.append(false,WIDTH/2,HEIGHT/16,0,0,s=>{
            fill(COLORS.UI.text);
            noStroke();
            textAlign(CENTER,CENTER);
            textSize(36);
            text("Designations Editor",0,0);
        });

        // sub-basin selector
        let sb_selector = desigSystemEditor.append(false,WIDTH/2-section_width/2,HEIGHT/8,section_width,0,s=>{
            let txt = 'Editing sub-basin: ';
            let sb = UI.viewBasin.subBasins[editing_sub_basin];
            if(sb instanceof SubBasin)
                txt += sb.getDisplayName();
            textAlign(CENTER,CENTER);
            textSize(18);
            text(txt,section_width/2,section_heights/2);
        });
        
        sb_selector.append(false,0,0,30,10,s=>{ // next sub-basin button
            s.button('',true);
            triangle(15,2,23,8,7,8);
        },()=>{
            do{
                editing_sub_basin++;
                if(editing_sub_basin > 255)
                    editing_sub_basin = 0;
            }while(!(UI.viewBasin.subBasins[editing_sub_basin] instanceof SubBasin && UI.viewBasin.subBasins[editing_sub_basin].designationSystem));
            refresh_desig_editor();
        }).append(false,0,18,30,10,s=>{ // prev sub-basin button
            s.button('',true);
            triangle(15,8,23,2,7,2);
        },()=>{
            do{
                editing_sub_basin--;
                if(editing_sub_basin < 0)
                    editing_sub_basin = 255;
            }while(!(UI.viewBasin.subBasins[editing_sub_basin] instanceof SubBasin && UI.viewBasin.subBasins[editing_sub_basin].designationSystem));
            refresh_desig_editor();
        });

        // numbering enabled/disabled button
        let num_button = sb_selector.append(false,0,section_spacing,section_width,section_heights,s=>{
            let txt = 'Numbering: ';
            let grey = false;
            if(desig_system instanceof DesignationSystem){
                if(desig_system.numbering.enabled)
                    txt += 'Enabled';
                else
                    txt += 'Disabled';
            }
            else{
                txt += 'N/A';
                grey = true;
            }
            s.button(txt,true,18,grey);
        },()=>{
            if(desig_system instanceof DesignationSystem){
                desig_system.numbering.enabled = !desig_system.numbering.enabled;
                refresh_num_section();
            }
        });

        num_affix_section = num_button.append(false,0,section_spacing,0,0);

        // numbering prefix box
        prefix_box = num_affix_section.append(false,0,0,0,0,s=>{
            textAlign(LEFT,CENTER);
            text('Prefix:',0,section_heights/2);
        }).append(false,70,0,section_width/2-75,section_heights,[18,6,()=>{
            if(desig_system instanceof DesignationSystem && desig_system.numbering.enabled)
                desig_system.numbering.prefix = prefix_box.value;
        }]);

        // numbering suffix box
        suffix_box = num_affix_section.append(false,section_width/2+5,0,0,0,s=>{
            textAlign(LEFT,CENTER);
            text('Suffix:',0,section_heights/2);
        }).append(false,70,0,section_width/2-75,section_heights,[18,6,()=>{
            if(desig_system instanceof DesignationSystem && desig_system.numbering.enabled)
                desig_system.numbering.suffix = suffix_box.value;
        }]);

        // name list selector
        let list_selector = num_button.append(false,0,section_spacing*2,section_width,section_heights,s=>{
            let txt;
            if(list_lists_mode)
                txt = aux_list ? `Auxiliary Name Lists` : `Main Name Lists`;
            else
                txt = `Editing name list:${aux_list ? ' Aux.' : ''} List ${name_list_num + 1}`;
            s.button(txt,true,18);
        },()=>{
            if(desig_system instanceof DesignationSystem){
                if(list_lists_mode)
                    aux_list = !aux_list;
                else
                    list_lists_mode = true;
                refresh_name_section();
            }
        });

        const add_name_edit_section = (prev,i)=>{
            const my_width = section_width - 80;
            const index = ()=>name_list_page * name_sections + i;

            let section = prev.append(false,0,section_spacing,my_width,section_heights,s=>{
                let txt = '--';
                let grey = true;
                if(list_lists_mode){
                    let list = get_list_from_index(index());
                    if(list){
                        txt = `${aux_list ? ' Aux.' : ''} List ${index() + 1}`;
                        grey = false;
                    }
                }else{
                    let name = name_at(index());
                    if(name){
                        txt = name;
                        grey = false;
                    }
                }
                s.button(txt,true,18,grey);
            },()=>{
                if(list_lists_mode){
                    let list = get_list_from_index(index());
                    if(list){
                        name_list_num = index();
                        list_lists_mode = false;
                        refresh_name_section();
                    }
                }else{
                    let name = name_at(index());
                    if(name)
                        invoke_name_editor(index(),false);
                }
            });

            section.append(false,my_width+10,0,30,12,s=>{
                let grey = true;
                if(list_lists_mode){
                    let list_arr = list_array();
                    if(list_arr && index() <= list_arr.length)
                        grey = false;
                }else{
                    let list = get_list();
                    if(list && index() <= list.length)
                        grey = false;
                }
                s.button('+',true,15,grey);
                triangle(25,3,28,10,22,10);
            },()=>{
                if(list_lists_mode){
                    let list_arr = list_array();
                    if(list_arr && index() <= list_arr.length){
                        list_arr.splice(index(), 0, []);
                        name_list_num = index();
                        list_lists_mode = false;
                    }
                }else{
                    let list = get_list();
                    if(list && index() <= list.length)
                        invoke_name_editor(index(), true);
                }
            }).append(false,0,section_heights-12,30,12,s=>{
                let grey = true;
                if(list_lists_mode){
                    let list_arr = list_array();
                    if(list_arr && (index() + 1) <= list_arr.length)
                        grey = false;
                }else{
                    let list = get_list();
                    if(list && (index() + 1) <= list.length)
                        grey = false;
                }
                s.button('+',true,15,grey);
                triangle(25,9,28,2,22,2);
            },()=>{
                if(list_lists_mode){
                    let list_arr = list_array();
                    if(list_arr && (index() + 1) <= list_arr.length){
                        list_arr.splice(index() + 1, 0, []);
                        name_list_num = index() + 1;
                        list_lists_mode = false;
                    }
                }else{
                    let list = get_list();
                    if(list && (index() + 1) <= list.length)
                        invoke_name_editor(index() + 1, true);
                }
            });

            section.append(false,my_width+50,0,30,section_heights,s=>{
                let grey;
                if(list_lists_mode)
                    grey = !get_list_from_index(index());
                else
                    grey = !name_at(index());
                s.button('X',true,21,grey);
            },()=>{
                if(list_lists_mode){
                    if(get_list_from_index(index())){
                        let list_arr = list_array();
                        areYouSure.dialog(()=>{
                            list_arr.splice(index(), 1);
                            if(list_arr.length <= name_list_page * name_sections && list_arr.length > 0)
                                name_list_page--;
                        }, `Delete ${aux_list ? 'Aux. ' : ''} List ${index() + 1}?`);
                    }
                }else if(name_at(index())){
                    let list = get_list();
                    list.splice(index(), 1);
                    if(list.length <= name_list_page * name_sections && list.length > 0)
                        name_list_page--;
                }
            });
            return section;
        };

        for(let i = 0, prev = list_selector; i < name_sections; i++){
            prev = add_name_edit_section(prev,i);
        }

        let list_nav = list_selector.append(false,0,section_spacing * (name_sections + 1),0,0);

        list_nav.append(false,section_width/2-40,0,30,section_heights,s=>{
            let grey = true;
            if(name_list_page > 0)
                grey = false;
            s.button('',true,18,grey);
            triangle(4,14,26,4,26,24);
        },()=>{
            if(name_list_page > 0)
                name_list_page--;
        }).append(false,50,0,30,section_heights,s=>{
            let grey = true;
            let list = list_lists_mode ? list_array() : get_list();
            if(list && (name_list_page + 1) * name_sections < list.length)
                grey = false;
            s.button('',true,18,grey);
            triangle(26,14,4,4,4,24);
        },()=>{
            let list = list_lists_mode ? list_array() : get_list();
            if(list && (name_list_page + 1) * name_sections < list.length)
                name_list_page++;
        });

        desigSystemEditor.append(false,WIDTH/2-section_width/2,7*HEIGHT/8+10,section_width,section_heights,function(s){ // "Done" button
            s.button("Done",true,20);
        },function(){
            prefix_box.enterFunc();
            suffix_box.enterFunc();
            editing_sub_basin = UI.viewBasin.mainSubBasin;
            list_lists_mode = true;
            aux_list = false;
            name_list_num = 0;
            name_list_page = 0;
            desigSystemEditor.hide();
            if(UI.viewBasin instanceof Basin)
                primaryWrapper.show();
            else
                mainMenu.show();
        });

        name_editor = desigSystemEditor.append(false,0,0,WIDTH,HEIGHT,s=>{
            fill(COLORS.UI.box);
            noStroke();
            s.fullRect();
        },true,false);

        name_editor.append(false,WIDTH/2,HEIGHT/4,0,0,s=>{
            fill(COLORS.UI.text);
            noStroke();
            textAlign(CENTER,CENTER);
            textSize(24);
            text("Add/Edit Name",0,0);
        });

        name_edit_box = name_editor.append(false, WIDTH/2-section_width/2, HEIGHT/3, section_width, section_heights, [20, 15, ()=>{
            let list = get_list();
            if(list && name_edit_box.value){
                if(adding_name)
                    list.splice(name_edit_index,0,name_edit_box.value);
                else
                    list[name_edit_index] = name_edit_box.value;
            }
            name_editor.hide();
        }]);

        name_edit_box.append(false, 0, section_spacing, section_width, section_heights, s=>{
            s.button('Done',true,20);
        },()=>{
            name_edit_box.enterFunc();
        }).append(false, 0, section_spacing, section_width, section_heights, s=>{
            s.button('Cancel',true,20);
        },()=>{
            name_editor.hide();
        });

        return {refresh: refresh_desig_editor};
    })();

    // primary "in sim" scene

    let topBar = primaryWrapper.append(false,0,0,WIDTH,30,function(s){   // Top bar
        fill(COLORS.UI.bar);
        noStroke();
        s.fullRect();
        textSize(18);
    },false);

    topBar.append(false,5,3,100,24,function(s){  // Date indicator
        if(!(UI.viewBasin instanceof Basin)) return;
        let basin = UI.viewBasin;
        let txtStr = formatDate(basin.tickMoment(viewTick)) + (basin.viewingPresent() ? '' : ' [Analysis]');
        this.setBox(undefined,undefined,textWidth(txtStr)+6);
        if(this.isHovered()){
            fill(COLORS.UI.buttonHover);
            s.fullRect();
        }
        fill(COLORS.UI.text);
        textAlign(LEFT,TOP);
        text(txtStr,3,3);
    },function(){
        dateNavigator.toggleShow();
    });

    let zoomControlBox = primaryWrapper.append(false, WIDTH - 135, topBar.height + 8, 125, 26, function(s){
        fill(COLORS.UI.box);
        noStroke();
        s.fullRect();
        fill(COLORS.UI.text);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(Math.round(mapZoom * 100) + '%', 62, 13);
    }, false);

    zoomControlBox.append(false, 3, 2, 22, 22, function(s){
        s.button('-', true, 16);
    }, function(){
        zoomMapAt(0.8, WIDTH / 2, HEIGHT / 2);
    });

    zoomControlBox.append(false, 28, 2, 22, 22, function(s){
        s.button('+', true, 16);
    }, function(){
        zoomMapAt(1.25, WIDTH / 2, HEIGHT / 2);
    });

    zoomControlBox.append(false, 98, 2, 22, 22, function(s){
        s.button('🏠', true, 12);
    }, function(){
        resetMapZoom();
    });

    let panel_timeline_container = primaryWrapper.append(false,0,topBar.height,0,0,undefined,undefined,false);

    dateNavigator = primaryWrapper.append(false,0,30,140,80,function(s){     // Analysis navigator panel
        fill(COLORS.UI.box);
        noStroke();
        s.fullRect();
        fill(COLORS.UI.text);
        textAlign(LEFT,TOP);
        textSize(15);
        text('Y:',15,53);
    },true,false);

    let navButtonRend = function(s){     // Navigator button render function
        s.button('',false,18,!paused);
        if(this.metadata%2===0) triangle(2,8,10,2,18,8);
        else triangle(2,2,18,2,10,8);
    };

    let navButtonClick = function(){    // Navigator button click function
        if(UI.viewBasin instanceof Basin && paused){
            let basin = UI.viewBasin;
            let m = basin.tickMoment(viewTick);
            switch(this.metadata){
                case 0:
                m.add(TICK_DURATION*ADVISORY_TICKS,"ms");
                break;
                case 1:
                m.subtract(TICK_DURATION*ADVISORY_TICKS,"ms");
                break;
                case 2:
                m.add(1,"M");
                break;
                case 3:
                m.subtract(1,"M");
                break;
                case 4:
                m.add(1,"d");
                break;
                case 5:
                m.subtract(1,"d");
                break;
                case 6:
                m.add(1,"y");
                break;
                case 7:
                m.subtract(1,"y");
                break;
            }
            let t = basin.tickFromMoment(m);
            if(this.metadata%2===0 && t%ADVISORY_TICKS!==0) t = floor(t/ADVISORY_TICKS)*ADVISORY_TICKS;
            if(this.metadata%2!==0 && t%ADVISORY_TICKS!==0) t = ceil(t/ADVISORY_TICKS)*ADVISORY_TICKS;
            if(t>basin.tick) t = basin.tick;
            if(t<0) t = 0;
            changeViewTick(t);
        }
    };

    for(let i=0;i<8;i++){   // Navigator buttons
        let x = floor(i/2)*30+15;
        let y = i%2===0 ? 10 : 30;
        let button = dateNavigator.append(false,x,y,20,10,navButtonRend,navButtonClick);
        button.metadata = i;
    }

    let dateNavYearInput = dateNavigator.append(false,30,50,70,20,[15,5,function(){
        if(!(UI.viewBasin instanceof Basin)) return;
        let basin = UI.viewBasin;
        let v = this.value;
        let n = parseInt(v);
        if(!Number.isNaN(n) && paused){
            let m = basin.tickMoment(viewTick);
            m.year(n);
            let t = basin.tickFromMoment(m);
            if(t%ADVISORY_TICKS!==0) t = floor(t/ADVISORY_TICKS)*ADVISORY_TICKS;
            if(t>basin.tick) t = basin.tick;
            if(t<0) t = 0;
            changeViewTick(t);
            this.value = '';
        }
    }]);

    dateNavYearInput.append(false,80,0,20,20,function(s){
        let v = UI.focusedInput === dateNavYearInput ? /* textInput */UI.inputData.value : dateNavYearInput.value;
        let grey;
        if(Number.isNaN(parseInt(v))) grey = true;
        s.button('',false,15,grey);
        triangle(6,3,17,10,6,17);
        rect(2,8,4,4);
    },function(){
        dateNavYearInput.enterFunc();
    });

    topBar.append(false,WIDTH-29,3,24,24,function(s){    // Toggle button for storm info panel and timeline
        s.button('');
        if(panel_timeline_container.showing) triangle(6,15,18,15,12,9);
        else triangle(6,9,18,9,12,15);
    },function(){
        if(!panel_timeline_container.showing) stormInfoPanel.target = selectedStorm || UI.viewBasin.getSeason(viewTick);
        panel_timeline_container.toggleShow();
    }).append(false,-29,0,24,10,function(s){     // Speed increase
        let grey = simSpeed == MAX_SPEED;
        s.button('', false, undefined, grey);
        triangle(4,2,12,5,4,8);
        triangle(12,2,20,5,12,8);
    },function(){
        if(simSpeed < MAX_SPEED)
            simSpeed++;
    }).append(false,0,14,24,10,function(s){     // Speed decrease
        let grey = simSpeed == MIN_SPEED;
        s.button('', false, undefined, grey);
        triangle(20,2,12,5,20,8);
        triangle(12,2,4,5,12,8);
    },function(){
        if(simSpeed > MIN_SPEED)
            simSpeed--;
    }).append(false,-29,-14,24,24,function(s){  // Pause/resume button
        s.button('');
        if(paused) triangle(3,3,21,12,3,21);
        else{
            rect(5,3,5,18);
            rect(14,3,5,18);
        }
    },function(){
        paused = !paused;
        lastUpdateTimestamp = performance.now();
    }).append(false,-105,0,100,24,function(s){  // Pause/speed/selected storm indicator
        let txtStr = "";
        if(selectedStorm){
            let sName = selectedStorm.getFullNameByTick(viewTick);
            let sData = selectedStorm.getStormDataByTick(viewTick);
            if(sData){
                let sWind = sData ? sData.windSpeed : 0;
                sWind = displayWindspeed(sWind);
                let sPrsr = sData ? sData.pressure: 1031;
                txtStr = `${sName}: ${sWind} / ${sPrsr} hPa`;
            }else{
                sName = selectedStorm.getFullNameByTick("peak");
                txtStr = sName + " - ACE: " + selectedStorm.ACE;
            }
        }else{
            if(paused)
                txtStr = "Paused";
            else if(simSpeed < -1)
                txtStr = `1/${Math.pow(2, -simSpeed)} Speed`;
            else if(simSpeed === -1)
                txtStr = 'Half-Speed';
            else if(simSpeed === 0)
                txtStr = 'Normal-Speed';
            else if(simSpeed === 1)
                txtStr = 'Double-Speed';
            else
                txtStr = `${Math.pow(2, simSpeed)}x Speed`;
        }
        let newW = textWidth(txtStr)+6;
        this.setBox(-newW-5,undefined,newW);
        if(this.isHovered()){
            fill(COLORS.UI.buttonHover);
            s.fullRect();
        }
        fill(COLORS.UI.text);
        textAlign(RIGHT,TOP);
        text(txtStr,this.width-3,3);
    },function(){
        if(!selectedStorm){
            paused = !paused;
            lastUpdateTimestamp = performance.now();
        }else{
            stormInfoPanel.target = selectedStorm;
            panel_timeline_container.show();
        }
    });

    let bottomBar = primaryWrapper.append(false,0,HEIGHT-30,WIDTH,30,function(s){    // Bottom bar
        fill(COLORS.UI.bar);
        noStroke();
        s.fullRect();
        textSize(18);
    },false);

    bottomBar.append(false,5,3,24,24,function(s){    // Side menu button
        s.button('');
        rect(3,6,18,2);
        rect(3,11,18,2);
        rect(3,16,18,2);
    },function(){
        sideMenu.toggleShow();
        saveBasinAsPanel.hide();
    }).append(false,29,0,100,24,function(s){   // Map layer/environmental field indicator
        let basin = UI.viewBasin;
        let txtStr = "Map Layer: ";
        let red = false;
        if(basin.env.displaying!==-1){
            let f = basin.env.fieldList[basin.env.displaying];
            txtStr += basin.env.getDisplayName(f) + " -- ";
            let x;
            let y;
            let S = selectedStorm && selectedStorm.aliveAt(viewTick);
            if(S){
                let p = selectedStorm.getStormDataByTick(viewTick,true).pos;
                x = p.x;
                y = p.y;
            }else{
                x = getMouseX();
                y = getMouseY();
            }
            if(x >= WIDTH || x < 0 || y >= HEIGHT || y < 0 || (basin.env.fields[f].oceanic && land && land.get(Coordinate.convertFromXY(basin.mapType, x, y)))){
                txtStr += "N/A";
            }else{
                let v = basin.env.get(f,x,y,viewTick);
                if(v===null){
                    txtStr += "Unavailable";
                    red = true;
                }else
                    txtStr += basin.env.formatFieldValue(f,v);
            }
            txtStr += " @ " + (S ? "selected storm" : "pointer");
            if(viewTick<=basin.env.fields[f].accurateAfter){
                txtStr += ' [MAY BE INACCURATE]';
                red = true;
            }
        }else txtStr += "none";
        this.setBox(undefined,undefined,textWidth(txtStr)+6);
        if(this.isHovered()){
            fill(COLORS.UI.buttonHover);
            s.fullRect();
        }
        if(red) fill('red');
        else fill(COLORS.UI.text);
        textAlign(LEFT,TOP);
        text(txtStr,3,3);
    },function(){
        UI.viewBasin.env.displayNext();
    });

    bottomBar.append(false,WIDTH-29,3,24,24,function(s){    // Fullscreen button
        s.button('',false);
        stroke(0);
        if(document.fullscreenElement===canvas){
            line(9,4,9,9);
            line(4,9,9,9);
            line(15,4,15,9);
            line(20,9,15,9);
            line(9,20,9,15);
            line(4,15,9,15);
            line(15,20,15,15);
            line(20,15,15,15);
        }else{
            line(4,4,4,9);
            line(4,4,9,4);
            line(20,4,20,9);
            line(20,4,15,4);
            line(4,20,4,15);
            line(4,20,9,20);
            line(20,20,20,15);
            line(20,20,15,20);
        }
    },function(){
        toggleFullscreen();
    }).append(false,-29,0,24,24,function(s){  // Help button
        noStroke();
        s.button("?",false,22);
    },function(){
        helpBox.toggleShow();
    });

    let timeline;
    let season_button;

    const INFO_PANEL_LEFT_BOUND = 11*WIDTH/16;

    stormInfoPanel = panel_timeline_container.append(false, INFO_PANEL_LEFT_BOUND, 0, WIDTH-INFO_PANEL_LEFT_BOUND, HEIGHT-topBar.height-bottomBar.height, function(s){
        let S = this.target;
        fill(COLORS.UI.box);
        noStroke();
        s.fullRect();
        fill(COLORS.UI.text);
        textAlign(CENTER,TOP);
        textSize(18);
        const txt_width = 7*this.width/8;
        const left_col_width = 7*txt_width/16;
        const right_col_width = 9*txt_width/16;
        let name;
        let txt_y = 35;
        let info_row = (left, right)=>{
            left = wrapText('' + left, left_col_width);
            right = wrapText('' + right, right_col_width);
            textAlign(LEFT, TOP);
            text(left, this.width/16, txt_y);
            textAlign(RIGHT, TOP);
            text(right, 15*this.width/16, txt_y);
            txt_y += max(countTextLines(left) * textLeading(), countTextLines(right) * textLeading()) + 3;
        };
        if(S instanceof Storm){
            season_button.show();
            name = S.getFullNameByTick("peak");
            name = wrapText(name, txt_width);
            text(name, this.width/2, txt_y);
            txt_y += countTextLines(name)*textLeading();
            textSize(15);
            let right_txt = '';
            if(S.inBasinTC){
                let enterTime = formatDate(UI.viewBasin.tickMoment(S.enterTime));
                let exitTime = formatDate(UI.viewBasin.tickMoment(S.exitTime));
                right_txt += enterTime;
                if(S.enterTime > S.formationTime)
                    right_txt += ' (entered basin)';
                right_txt += ' -\n';
                if(S.exitTime){
                    right_txt += exitTime;
                    if(!S.dissipationTime || S.exitTime < S.dissipationTime)
                        right_txt += ' (left basin)';
                }else
                    right_txt += 'currently active';
            }else if(S.TC){
                let formTime = formatDate(UI.viewBasin.tickMoment(S.formationTime));
                let dissTime = formatDate(UI.viewBasin.tickMoment(S.dissipationTime));
                right_txt += formTime + ' -\n';
                if(S.dissipationTime)
                    right_txt += dissTime;
                else
                    right_txt += 'currently active';
            }else
                right_txt += "N/A";
            info_row('Dates active', right_txt);
            if(S.peak)
                info_row('Peak pressure', S.peak.pressure + ' hPa');
            else
                info_row('Peak pressure', 'N/A');
            if(S.windPeak)
                info_row('Peak wind speed', displayWindspeed(S.windPeak.windSpeed));
            else
                info_row('Peak wind speed', 'N/A');
            info_row('ACE', S.ACE);
            info_row('Damage', damageDisplayNumber(S.damage));
            info_row('Deaths', S.deaths);
            info_row('Landfalls', S.landfalls);
        }else{
            if(S === undefined || S === null){
                text('No season selected', this.width / 2, txt_y);
                return;
            }
            name = seasonName(S);
            name = wrapText(name, txt_width);
            text(name, this.width/2, txt_y);
            txt_y += countTextLines(name)*textLeading();
            textSize(15);
            let se = UI.viewBasin.fetchSeason(S);
            if(se instanceof Season){
                let stats = se.stats(UI.viewBasin.mainSubBasin);
                let counters = stats.classificationCounters || {};
                let scale = UI.viewBasin.getScale(UI.viewBasin.mainSubBasin);
                for(let {statName, cNumber} of scale.statDisplay())
                    info_row(statName, counters[cNumber] ?? 0);
                info_row('Total ACE', stats.ACE ?? 0);
                info_row('Damage', damageDisplayNumber(stats.damage ?? 0));
                info_row('Deaths', stats.deaths ?? 0);
                info_row('Landfalls', stats.landfalls ?? 0);
                if(stats.most_intense){
                    let most_intense = stats.most_intense.fetch();
                    if(most_intense && most_intense.peak && most_intense.windPeak){
                        info_row('Most Intense', most_intense.getNameByTick(-1) + '\n' + most_intense.peak.pressure + ' hPa\n' + displayWindspeed(most_intense.windPeak.windSpeed));
                    }else if(most_intense){
                        info_row('Most Intense', most_intense.getNameByTick(-1));
                    }else{
                        info_row('Most Intense', 'N/A');
                    }
                }else
                    info_row('Most Intense', 'N/A');
            }else
                text('Season Data Unavailable', this.width/2, txt_y);
        }
    },true);

    let timeline_container = panel_timeline_container.append(false,0,0,0,0);

    function find_next_storm(storm,prev){
        if(storm instanceof Storm){
            let season = storm.basin.fetchSeason(storm.statisticalSeason());
            if(season instanceof Season){
                let recent;
                let found_me;
                for(let s of season.forSystems()){
                    if(s instanceof Storm){
                        if(s === storm){
                            if(prev)
                                return recent;
                            else
                                found_me = true;
                        }else if(s.inBasinTC){
                            if(prev)
                                recent = s;
                            else if(found_me)
                                return s;
                        }
                    }
                }
            }
        }
    }

    panel_timeline_container.append(false,INFO_PANEL_LEFT_BOUND+3,3,24,24,function(s){   // info panel/timeline previous storm/season button
        if(timeline.active())
            this.setBox(WIDTH*0.05,5,24,24);
        else
            this.setBox(INFO_PANEL_LEFT_BOUND+3,3,24,24);
        let S = stormInfoPanel.target;
        let grey;
        if(S instanceof Storm)
            grey = !find_next_storm(S,true);
        else
            grey = S<=UI.viewBasin.getSeason(0);
        s.button('',false,18,grey);
        triangle(19,5,19,19,5,12);
    },function(){
        let s = stormInfoPanel.target;
        if(s instanceof Storm){
            let n = find_next_storm(s,true);
            if(n)
                stormInfoPanel.target = n;
        }else if(s>UI.viewBasin.getSeason(0))
            stormInfoPanel.target--;
    });
    
    panel_timeline_container.append(false,WIDTH-27,3,24,24,function(s){ // info panel/timeline next storm/season button
        if(timeline.active())
            this.setBox(WIDTH*0.95-24,5,24,24);
        else
            this.setBox(WIDTH-27,3,24,24);
        let S = stormInfoPanel.target;
        let grey;
        if(S instanceof Storm)
            grey = !find_next_storm(S);
        else
            grey = S>=UI.viewBasin.getSeason(-1);
        s.button('',false,18,grey);
        triangle(5,5,5,19,19,12);
    },function(){
        let s = stormInfoPanel.target;
        if(s instanceof Storm){
            let n = find_next_storm(s);
            if(n)
                stormInfoPanel.target = n;
        }else if(s<UI.viewBasin.getSeason(-1))
            stormInfoPanel.target++;
    });

    season_button = panel_timeline_container.append(false, INFO_PANEL_LEFT_BOUND+30, 3, stormInfoPanel.width-60, 24, function(s){ // Season button
        if(timeline.active())
            this.setBox(5*WIDTH/12, 32, WIDTH/6, 24);
        else
            this.setBox(INFO_PANEL_LEFT_BOUND+30, 3, stormInfoPanel.width-60, 24);
        let t = stormInfoPanel.target;
        if(t instanceof Storm)
            s.button(seasonName(t.statisticalSeason()),false,15);
        else
            this.hide();
    },function(){
        let t = stormInfoPanel.target;
        if(t instanceof Storm)
            stormInfoPanel.target = t.statisticalSeason();
    });
    
    panel_timeline_container.append(false,INFO_PANEL_LEFT_BOUND+30,stormInfoPanel.height-54,stormInfoPanel.width-60,24,function(s){ // info panel "Jump to" button
        if(timeline.active())
            this.setBox(WIDTH*0.95 - WIDTH/6, 32, WIDTH/6, 24);
        else
            this.setBox(INFO_PANEL_LEFT_BOUND+30,stormInfoPanel.height-54,stormInfoPanel.width-60,24);
        s.button("Jump to",false,15,!paused || stormInfoPanel.target===undefined);
    },function(){
        if(paused && stormInfoPanel.target!==undefined){
            let s = stormInfoPanel.target;
            let t;
            if(s instanceof Storm){
                if(s.enterTime) t = s.enterTime;
                else if(s.formationTime) t = s.formationTime;
                else t = s.birthTime;
                t = ceil(t/ADVISORY_TICKS)*ADVISORY_TICKS;
            }else{
                t = UI.viewBasin.seasonTick(s);
            }
            changeViewTick(t);
        }
    });
    
    stormInfoPanel.append(false,30,stormInfoPanel.height-27,stormInfoPanel.width-60,24,function(s){ // show season summary timeline button
        s.button("View Timeline",false,15);
    },function(){
        timeline.view();
    });

    timeline = (function(){
        const BOX_WIDTH = WIDTH;
        const BOX_HEIGHT = (HEIGHT-topBar.height-bottomBar.height)*2/3;
        let months = 12;
        let sMonth = 0;
        let parts = [];
        let builtAt;
        let builtFor;
        let active = false;

        function build(){
            parts = [];
            let plotWidth = BOX_WIDTH*0.9;
            let target = stormInfoPanel.target;
            if(target!==undefined && !(target instanceof Storm)){
                let gen = s=>{
                    let TCs = [];
                    let beginSeasonTick;
                    let endSeasonTick;
                    for(let sys of s.forSystems()){
                        if(sys.inBasinTC && (UI.viewBasin.getSeason(sys.enterTime)===target || UI.viewBasin.getSeason(sys.enterTime)<target && (sys.exitTime===undefined || UI.viewBasin.getSeason(sys.exitTime-1)>=target))){
                            TCs.push(sys);
                            let dissTime = sys.exitTime || UI.viewBasin.tick;
                            if(beginSeasonTick===undefined || sys.enterTime<beginSeasonTick) beginSeasonTick = sys.enterTime;
                            if(endSeasonTick===undefined || dissTime>endSeasonTick) endSeasonTick = dissTime;
                        }
                    }
                    for(let n=0;n<TCs.length-1;n++){
                        let t0 = TCs[n];
                        let t1 = TCs[n+1];
                        if(t0.enterTime>t1.enterTime){
                            TCs[n] = t1;
                            TCs[n+1] = t0;
                            if(n>0) n -= 2;
                        }
                    }
                    let sMoment = UI.viewBasin.tickMoment(beginSeasonTick);
                    sMonth = sMoment.month();
                    sMoment.startOf('month');
                    let beginPlotTick = UI.viewBasin.tickFromMoment(sMoment);
                    let eMoment = UI.viewBasin.tickMoment(endSeasonTick);
                    eMoment.endOf('month');
                    let endPlotTick = UI.viewBasin.tickFromMoment(eMoment);
                    months = eMoment.diff(sMoment,'months') + 1;
                    for(let t of TCs){
                        let part = {};
                        part.storm = t;
                        part.segments = [];
                        part.label = t.getNameByTick(-2);
                        let aSegment;
                        for(let q=0;q<t.record.length;q++){
                            let rt = ceil(t.birthTime/ADVISORY_TICKS)*ADVISORY_TICKS + q*ADVISORY_TICKS;
                            let d = t.record[q];
                            if(tropOrSub(d.type)&&land&&land.inBasin(d.coord())){
                                let clsn = UI.viewBasin.getScale(UI.viewBasin.mainSubBasin).get(d);
                                if(!aSegment){
                                    aSegment = {};
                                    part.segments.push(aSegment);
                                    aSegment.startTick = rt;
                                    aSegment.maxCat = clsn;
                                    aSegment.fullyTrop = (d.type===TROP);
                                }
                                if(clsn > aSegment.maxCat) aSegment.maxCat = clsn;
                                aSegment.fullyTrop = aSegment.fullyTrop || (d.type===TROP);
                                aSegment.endTick = rt;
                            }else if(aSegment) aSegment = undefined;
                        }
                        for(let q=0;q<part.segments.length;q++){
                            let seg = part.segments[q];
                            seg.startX = map(seg.startTick,beginPlotTick,endPlotTick,0,plotWidth);
                            seg.endX = map(seg.endTick,beginPlotTick,endPlotTick,0,plotWidth);
                        }
                        let rowFits;
                        part.row = -1;
                        textSize(12);
                        let thisLabelZone = textWidth(part.label) + 6;
                        do{
                            part.row++;
                            rowFits = true;
                            for(let q=0;q<parts.length;q++){
                                let p = parts[q];
                                let otherLabelZone = textWidth(p.label) + 6;
                                let thisS = part.segments[0].startX;
                                let thisE = part.segments[part.segments.length-1].endX + thisLabelZone;
                                let otherS = p.segments[0].startX;
                                let otherE = p.segments[p.segments.length-1].endX + otherLabelZone;
                                if(p.row===part.row){
                                    if(thisS>=otherS && thisS<=otherE ||
                                        thisE>=otherS && thisE<=otherE ||
                                        otherS>=thisS && otherS<=thisE ||
                                        otherE>=thisS && otherE<=thisE) rowFits = false;
                                }
                            }
                        }while(!rowFits);
                        parts.push(part);
                    }
                };
                if(UI.viewBasin.fetchSeason(target)) gen(UI.viewBasin.fetchSeason(target));
                else{
                    months = 12;
                    sMonth = 0;
                    UI.viewBasin.fetchSeason(target,false,false,s=>{
                        gen(s);
                    });
                }
            }else{
                months = 12;
                sMonth = 0;
            }
            builtFor = target;
            builtAt = UI.viewBasin.tick;
        }

        const lBound = BOX_WIDTH*0.05;
        const rBound = BOX_WIDTH*0.95;
        const tBound = BOX_HEIGHT*0.2;
        const bBound = BOX_HEIGHT*0.93;
        const maxRowFit = Math.floor((bBound-tBound)/15);

        let timelineBox = timeline_container.append(false,0,0,BOX_WIDTH,BOX_HEIGHT,function(s){
            let target = stormInfoPanel.target;
            if(target!==builtFor || (UI.viewBasin.tick!==builtAt && (UI.viewBasin.getSeason(builtAt)===target || UI.viewBasin.getSeason(builtAt)===(target+1)))) build();
            fill(COLORS.UI.box);
            noStroke();
            s.fullRect();
            fill(COLORS.UI.text);
            textAlign(CENTER,TOP);
            textSize(18);
            if(target === undefined)
                text('No timeline selected', BOX_WIDTH * 0.5, BOX_HEIGHT * 0.03);
            else if(target instanceof Storm){
                text('Intensity graph of ' + target.getFullNameByTick('peak'), BOX_WIDTH * 0.5, BOX_HEIGHT * 0.03);
                season_button.show();
                let begin_tick = target.enterTime;
                let end_tick = target.exitTime || UI.viewBasin.tick;
                let max_wind;
                for(let t = begin_tick; t <= end_tick; t += ADVISORY_TICKS){
                    if(target.getStormDataByTick(t)){
                        let w = target.getStormDataByTick(t).windSpeed;
                        if(max_wind === undefined || w > max_wind)
                            max_wind = w;
                    }
                }
                let scale = UI.viewBasin.getScale(UI.viewBasin.mainSubBasin);
                if(scale.measure === SCALE_MEASURE_ONE_MIN_KNOTS || scale.measure === SCALE_MEASURE_TEN_MIN_KNOTS){
                    let bandColor = color(scale.getColor(0));
                    let y0 = bBound;
                    for(let i = 1; i < scale.classifications.length; i++){
                        let threshold = scale.classifications[i].threshold;
                        let y1 = map(threshold, 0, max_wind, bBound, tBound, true);
                        fill(
                            red(bandColor),
                            green(bandColor),
                            blue(bandColor),
                            90
                        );
                        rect(lBound, y1, rBound - lBound, y0 - y1);
                        bandColor = color(scale.getColor(i));
                        y0 = y1;
                        if(threshold > max_wind)
                            break;
                        if(i === scale.classifications.length - 1 && threshold < max_wind){
                            fill(
                                red(bandColor),
                                green(bandColor),
                                blue(bandColor),
                                90
                            );
                            rect(lBound, tBound, rBound - lBound, y0 - tBound);
                        }
                    }
                }
                stroke(COLORS.UI.text);
                line(lBound,bBound,rBound,bBound);
                line(rBound,bBound,rBound,tBound);
                textSize(13);
                fill(COLORS.UI.text);
                for(let m = UI.viewBasin.tickMoment(begin_tick).startOf('day'); UI.viewBasin.tickFromMoment(m) <= end_tick; m.add(1, 'd')){
                    stroke(COLORS.UI.text);
                    let x = map(UI.viewBasin.tickFromMoment(m), begin_tick, end_tick, lBound, rBound, true);
                    line(x, bBound, x, tBound);
                    noStroke();
                    text(m.date(), x, bBound + BOX_HEIGHT * 0.02);
                }
                textAlign(RIGHT, CENTER);
                let y_axis_inc = ceil((max_wind / 10) / 5) * 5;
                for(let i = 0; i <= max_wind; i += y_axis_inc){
                    stroke(COLORS.UI.text);
                    let y = map(i, 0, max_wind, bBound, tBound);
                    line(lBound - BOX_WIDTH * 0.008, y, lBound, y);
                    noStroke();
                    let unitLocalizedWind = [i, ktsToMph(i, WINDSPEED_ROUNDING), ktsToKmh(i, WINDSPEED_ROUNDING)][simSettings.speedUnit];
                    text(unitLocalizedWind, lBound - BOX_WIDTH * 0.01, y);
                }
                for(let t0 = begin_tick, t1 = t0 + ADVISORY_TICKS; t1 <= end_tick; t0 = t1, t1 += ADVISORY_TICKS){
                    let w0 = target.getStormDataByTick(t0).windSpeed;
                    let w1;
                    if(target.getStormDataByTick(t1))
                        w1 = target.getStormDataByTick(t1).windSpeed;
                    else
                        w1 = w0;
                    let x0 = map(t0, begin_tick, end_tick, lBound, rBound);
                    let y0 = map(w0, 0, max_wind, bBound, tBound);
                    let x1 = map(t1, begin_tick, end_tick, lBound, rBound);
                    let y1 = map(w1, 0, max_wind, bBound, tBound);

                    const tropical = tropOrSub(target.getStormDataByTick(t0).type);

                    // Light outline keeps the track visible over dark category bands.
                    stroke(255, 255, 255, 220);
                    strokeWeight(5);
                    line(x0, y0, x1, y1);
                    point(x0, y0);

                    // Dark core remains visible over light category bands.
                    stroke(tropical ? '#111827' : '#6B7280');
                    strokeWeight(2);
                    line(x0, y0, x1, y1);
                    point(x0, y0);
                }
                strokeWeight(1);
            }else{
                text('Timeline of ' + seasonName(target), BOX_WIDTH * 0.5, BOX_HEIGHT * 0.03);
                stroke(COLORS.UI.text);
                line(lBound,bBound,rBound,bBound);
                line(lBound,bBound,lBound,tBound);
                textSize(13);
                let M = ['J','F','M','A','M','J','J','A','S','O','N','D'];
                for(let i=0;i<months;i++){
                    stroke(COLORS.UI.text);
                    let x0 = map(i+1,0,months,lBound,rBound);
                    let x1 = map(i+0.5,0,months,lBound,rBound);
                    line(x0,bBound,x0,tBound);
                    noStroke();
                    text(M[(i+sMonth)%12],x1,bBound+BOX_HEIGHT*0.02);
                }
                noStroke();
                for(let i=0;i<parts.length;i++){
                    let p = parts[i];
                    let y = tBound+(p.row % maxRowFit)*15;
                    let mx = getMouseX()-this.getX();
                    let my = getMouseY()-this.getY();
                    textSize(12);
                    if(mx>=lBound+p.segments[0].startX && mx<lBound+p.segments[p.segments.length-1].endX+textWidth(p.label)+6 && my>=y && my<y+10) stroke(255);
                    else noStroke();
                    for(let j=0;j<p.segments.length;j++){
                        let S = p.segments[j];
                        fill(UI.viewBasin.getScale(UI.viewBasin.mainSubBasin).getColor(S.maxCat,!S.fullyTrop));
                        rect(lBound+S.startX,y,max(S.endX-S.startX,1),10);
                    }
                    let labelLeftBound = lBound + p.segments[p.segments.length-1].endX;
                    fill(COLORS.UI.text);
                    textAlign(LEFT,CENTER);
                    text(p.label,labelLeftBound+3,y+5);
                }
            }
        },function(){
            let newTarget;
            for(let i=parts.length-1;i>=0;i--){
                let p = parts[i];
                let y = tBound+(p.row % maxRowFit)*15;
                let mx = getMouseX()-this.getX();
                let my = getMouseY()-this.getY();
                textSize(12);
                if(mx>=lBound+p.segments[0].startX && mx<lBound+p.segments[p.segments.length-1].endX+textWidth(p.label)+6 && my>=y && my<y+10){
                    newTarget = p.storm;
                    break;
                }
            }
            if(newTarget) stormInfoPanel.target = newTarget;
        },false);

        timelineBox.append(false,timelineBox.width-27,0,27,timelineBox.height,function(s){
            s.button('',false,18);
            triangle(11,timelineBox.height/2-6,11,timelineBox.height/2+6,16,timelineBox.height/2);
        },function(){
            timelineBox.hide();
            stormInfoPanel.show();
            active = false;
        });

        const pub = {};

        pub.active = function(){
            return active;
        };

        pub.view = function(){
            stormInfoPanel.hide();
            timelineBox.show();
            active = true;
        };

        pub.reset = function(){
            active = false;
            builtAt = -1;
        };

        return pub;
    })();
    
    let returntomainmenu = function(p){
        sideMenu.hide();
        panel_timeline_container.hide();
        timeline.reset();
        primaryWrapper.hide();
        if(land) land.clear();
        for(let t in UI.viewBasin.seasonExpirationTimers) clearTimeout(UI.viewBasin.seasonExpirationTimers[t]);
        for(let s in UI.viewBasin.subBasins){
            let sb = UI.viewBasin.subBasins[s];
            if(sb instanceof SubBasin && sb.mapOutline) sb.mapOutline.remove();
        }
        let wait = ()=>{
            UI.viewBasin = undefined;
            mainMenu.show();
        };
        if(p instanceof Promise) p.then(wait);
        else wait();
    };

    sideMenu = primaryWrapper.append(false,0,topBar.height,WIDTH/4,HEIGHT-topBar.height-bottomBar.height,function(s){
        fill(COLORS.UI.box);
        noStroke();
        s.fullRect();
        fill(COLORS.UI.text);
        textAlign(CENTER,TOP);
        textSize(18);
        text("Menu",this.width/2,10);
    },true,false);

    sideMenu.append(false,5,30,sideMenu.width-10,25,function(s){ // Save and return to main menu button
        s.button("Save and Return to Main Menu",false,15);
    },function(){
        if(UI.viewBasin.saveName===AUTOSAVE_SAVE_NAME) saveBasinAsPanel.invoke(true);
        else{
            returntomainmenu(UI.viewBasin.save());
        }
    }).append(false,0,30,sideMenu.width-10,25,function(s){   // Return to main menu w/o saving button
        s.button("Return to Main Menu w/o Saving",false,15);
    },function(){
        areYouSure.dialog(returntomainmenu);
    }).append(false,0,30,sideMenu.width-10,25,function(s){   // Save basin button
        let txt = "Save Basin";
        if(UI.viewBasin.tick===UI.viewBasin.lastSaved) txt += " [Saved]";
        s.button(txt,false,15);
    },function(){
        if(UI.viewBasin.saveName===AUTOSAVE_SAVE_NAME) saveBasinAsPanel.invoke();
        else UI.viewBasin.save();
    }).append(false,0,30,sideMenu.width-10,25,function(s){   // Save basin as button
        s.button("Save Basin As...",false,15);
    },function(){
        saveBasinAsPanel.invoke();
    }).append(false,0,30,sideMenu.width-10,25,function(s){   // Settings menu button
        s.button("Settings",false,15);
    },function(){
        primaryWrapper.hide();
        settingsMenu.show();
        paused = true;
    }).append(false,0,30,sideMenu.width-10,25,function(s){   // Designation system editor menu button
        s.button("Edit Designations",false,15);
    },function(){
        desig_editor_definition.refresh();
        primaryWrapper.hide();
        desigSystemEditor.show();
        paused = true;
    }).append(false,0,30,sideMenu.width-10,25,function(s){  // Basin seed button
        s.button('Basin Seed',false,15);
    },function(){
        seedBox.toggleShow();
        if(seedBox.showing) seedBox.clicked();
    });

    saveBasinAsPanel = sideMenu.append(false,sideMenu.width,0,sideMenu.width*3/4,100,function(s){
        fill(COLORS.UI.box);
        noStroke();
        s.fullRect();
        fill(COLORS.UI.text);
        textAlign(CENTER,TOP);
        textSize(18);
        text("Save Basin As...",this.width/2,10);
        stroke(0);
        line(0,0,0,this.height);
    },true,false);

    let saveBasinAsTextBox = saveBasinAsPanel.append(false,5,40,saveBasinAsPanel.width-10,25,[15,32,function(){
        let n = this.value;
        if(n!=='' && n!==AUTOSAVE_SAVE_NAME){
            if(n===UI.viewBasin.saveName){
                UI.viewBasin.save();
                saveBasinAsPanel.hide();
            }else{
                let f = ()=>{
                    let p = UI.viewBasin.saveAs(n);
                    saveBasinAsPanel.hide();
                    if(saveBasinAsPanel.exit) returntomainmenu(p);
                };
                db.saves.where(':id').equals(n).count().then(c=>{
                    if(c>0) areYouSure.dialog(f,'Overwrite "'+n+'"?');
                    else f();
                });
            }
        }
    }]);

    saveBasinAsTextBox.append(false,0,30,saveBasinAsPanel.width-10,25,function(s){
        let n = UI.focusedInput===saveBasinAsTextBox ? /* textInput */UI.inputData.value : saveBasinAsTextBox.value;
        let grey = n==='' || n===AUTOSAVE_SAVE_NAME;
        s.button('Ok',false,15,grey);
    },function(){
        saveBasinAsTextBox.enterFunc();
    });

    saveBasinAsPanel.invoke = function(exit){
        saveBasinAsPanel.exit = exit;
        saveBasinAsPanel.toggleShow();
        saveBasinAsTextBox.value = UI.viewBasin.saveName===AUTOSAVE_SAVE_NAME ? '' : UI.viewBasin.saveName;
    };

    seedBox = primaryWrapper.append(false,WIDTH/2-100,HEIGHT/2-15,200,30,[18,undefined,function(){  // textbox for copying the basin seed
        this.value = UI.viewBasin.seed.toString();
    }],function(){
        /* textInput */UI.inputData.value = this.value = UI.viewBasin.seed.toString();
        // textInput.setSelectionRange(0,textInput.value.length);
        UI.inputData.selectionStart = 0;
        UI.inputData.selectionEnd = UI.inputData.value.length;
    },false);

    helpBox = primaryWrapper.append(false,WIDTH/8,HEIGHT/8,3*WIDTH/4,3*HEIGHT/4,function(s){
        fill(COLORS.UI.box);
        noStroke();
        s.fullRect();
        fill(COLORS.UI.text);
        textAlign(LEFT,TOP);
        textSize(15);
        text(HELP_TEXT,10,10);
    },true,false);

    helpBox.append(false,helpBox.width-30,10,20,20,function(s){
        s.button("X",false,22);
    },function(){
        helpBox.hide();
    });
};

function mouseInCanvas(){
    return coordinateInCanvas(getMouseX(),getMouseY());
}

function mouseClicked(){
    if(mouseInCanvas() && waitingFor<1){
        UI.click();
        return false;
    }
}

function selectStorm(s){
    if(s instanceof Storm){
        selectedStorm = s;
        stormInfoPanel.target = s;
    }else selectedStorm = undefined;
}

function keyPressed(){
    // console.log("keyPressed: " + key + " / " + keyCode);
    const k = key.toLowerCase();
    keyRepeatFrameCounter = -1;
    if(/* document.activeElement === textInput */ UI.focusedInput){
        switch(keyCode){
            case ESCAPE:
                // textInput.value = UI.focusedInput.value;
                // textInput.blur();
                UI.focusedInput = undefined;
                break;
            case ENTER:
                let u = UI.focusedInput;
                // textInput.blur();
                u.value = UI.inputData.value;
                UI.focusedInput = undefined;
                if(u.enterFunc) u.enterFunc();
                break;
            case UP_ARROW:
                UI.setInputCursorPosition(0, keyIsDown(SHIFT));
                break;
            case DOWN_ARROW:
                UI.setInputCursorPosition(UI.inputData.value.length, keyIsDown(SHIFT));
                break;
            // these are handled by keyRepeat(); break then return false so evt.preventDefault() is called
            case LEFT_ARROW:
            case RIGHT_ARROW:
            case BACKSPACE:
            case DELETE:
                break;
            default:
                if(keyIsDown(CONTROL)){
                    switch(k){
                        case 'x':
                            if(UI.inputData.selectionStart !== UI.inputData.selectionEnd){
                                navigator.clipboard.writeText(UI.inputData.value.slice(UI.inputData.selectionStart, UI.inputData.selectionEnd));
                                UI.inputData.value = UI.inputData.value.slice(0, UI.inputData.selectionStart) + UI.inputData.value.slice(UI.inputData.selectionEnd, UI.inputData.value.length);
                                UI.setInputCursorPosition(UI.inputData.selectionStart);
                            }
                            break;
                        case 'c':
                            if(UI.inputData.selectionStart !== UI.inputData.selectionEnd)
                                navigator.clipboard.writeText(UI.inputData.value.slice(UI.inputData.selectionStart, UI.inputData.selectionEnd));
                            break;
                        case 'v':
                            navigator.clipboard.readText().then(v => {
                                if(!UI.inputData.maxLength || UI.inputData.value.length + v.length - (UI.inputData.selectionEnd - UI.inputData.selectionStart) <= UI.inputData.maxLength){
                                    UI.inputData.value = UI.inputData.value.slice(0, UI.inputData.selectionStart) + v + UI.inputData.value.slice(UI.inputData.selectionEnd, UI.inputData.value.length);
                                    UI.setInputCursorPosition(UI.inputData.selectionStart + v.length);
                                }
                            });
                            break;
                        default:
                            return;
                    }
                }
                return;
        }
    }else{
        switch(k){
            case " ":
                if(UI.viewBasin && primaryWrapper.showing){
                    paused = !paused;
                    lastUpdateTimestamp = performance.now();
                }
                break;
            case "a":
                if(UI.viewBasin && paused && primaryWrapper.showing) UI.viewBasin.advanceSim();
                break;
            case "w":
                simSettings.setShowStrength("toggle");
                break;
            case "e":
                if(UI.viewBasin) UI.viewBasin.env.displayNext();
                break;
            case "t":
                simSettings.setTrackMode("incmod",4);
                refreshTracks(true);
                break;
            case "m":
                simSettings.setShowMagGlass("toggle");
                if(UI.viewBasin) UI.viewBasin.env.updateMagGlass();
                break;
            case 'u':
                simSettings.setSpeedUnit("incmod", 3);
                break;
            case 'c':
                simSettings.setColorScheme("incmod", COLOR_SCHEMES.length);
                refreshTracks(true);
                break;
            case '=':
            case '+':
                zoomMapAt(1.25, WIDTH / 2, HEIGHT / 2);
                break;
            case '-':
            case '_':
                zoomMapAt(0.8, WIDTH / 2, HEIGHT / 2);
                break;
            case '0':
            case 'r':
                resetMapZoom();
                break;
            default:
                switch(keyCode){
                    case KEY_LEFT_BRACKET:
                    if(simSpeed > MIN_SPEED)
                        simSpeed--;
                    break;
                    case KEY_RIGHT_BRACKET:
                    if(simSpeed < MAX_SPEED)
                        simSpeed++;
                    break;
                    case KEY_F11:
                    toggleFullscreen();
                    break;
                    default:
                    return;
                }
        }
    }
    return false;
}

function keyRepeat(){
    if(UI.focusedInput){
        switch(keyCode){
            case LEFT_ARROW:
                if(keyIsDown(LEFT_ARROW)){
                    let i;
                    if(keyIsDown(CONTROL))
                        i = UI.inputData.value.lastIndexOf(' ', UI.inputData.cursor - 2) + 1;
                    else if(UI.inputData.selectionStart !== UI.inputData.selectionEnd && !keyIsDown(SHIFT))
                        i = UI.inputData.selectionStart;
                    else
                        i = UI.inputData.cursor - 1;
                    UI.setInputCursorPosition(Math.max(0, i), keyIsDown(SHIFT));
                }
                break;
            case RIGHT_ARROW:
                if(keyIsDown(RIGHT_ARROW)){
                    let i;
                    if(keyIsDown(CONTROL)){
                        i = UI.inputData.value.indexOf(' ', UI.inputData.cursor + 1);
                        if(i === -1)
                            i = UI.inputData.value.length;
                    }else if(UI.inputData.selectionStart !== UI.inputData.selectionEnd && !keyIsDown(SHIFT))
                        i = UI.inputData.selectionEnd;
                    else
                        i = UI.inputData.cursor + 1;
                    UI.setInputCursorPosition(Math.min(UI.inputData.value.length, i), keyIsDown(SHIFT));
                }
                break;
            case BACKSPACE:
                if(keyIsDown(BACKSPACE)){
                    if(UI.inputData.selectionStart !== UI.inputData.selectionEnd){
                        UI.inputData.value = UI.inputData.value.slice(0, UI.inputData.selectionStart) + UI.inputData.value.slice(UI.inputData.selectionEnd, UI.inputData.value.length);
                        UI.setInputCursorPosition(UI.inputData.selectionStart);
                    }else if(UI.inputData.cursor > 0){
                        UI.inputData.value = UI.inputData.value.slice(0, UI.inputData.cursor - 1) + UI.inputData.value.slice(UI.inputData.cursor, UI.inputData.value.length);
                        UI.setInputCursorPosition(UI.inputData.cursor - 1);
                    }
                }
                break;
            case DELETE:
                if(keyIsDown(DELETE)){
                    if(UI.inputData.selectionStart !== UI.inputData.selectionEnd){
                        UI.inputData.value = UI.inputData.value.slice(0, UI.inputData.selectionStart) + UI.inputData.value.slice(UI.inputData.selectionEnd, UI.inputData.value.length);
                        UI.setInputCursorPosition(UI.inputData.selectionStart);
                    }else if(UI.inputData.cursor < UI.inputData.value.length){
                        UI.inputData.value = UI.inputData.value.slice(0, UI.inputData.cursor) + UI.inputData.value.slice(UI.inputData.cursor + 1, UI.inputData.value.length);
                    }
                }
                break;
            default:
                if(UI.inputData.insert && (!UI.inputData.maxLength || UI.inputData.value.length + UI.inputData.insert.length - (UI.inputData.selectionEnd - UI.inputData.selectionStart) <= UI.inputData.maxLength)){
                    UI.inputData.value = UI.inputData.value.slice(0, UI.inputData.selectionStart) + UI.inputData.insert + UI.inputData.value.slice(UI.inputData.selectionEnd, UI.inputData.value.length);
                    UI.setInputCursorPosition(UI.inputData.selectionStart + UI.inputData.insert.length);
                }
        }
    }
    else if(UI.viewBasin instanceof Basin && paused && primaryWrapper.showing){
        if(keyCode===LEFT_ARROW && viewTick>=ADVISORY_TICKS){
            changeViewTick(ceil(viewTick/ADVISORY_TICKS-1)*ADVISORY_TICKS);
        }else if(keyCode===RIGHT_ARROW){
            let t;
            if(viewTick<UI.viewBasin.tick-ADVISORY_TICKS) t = floor(viewTick/ADVISORY_TICKS+1)*ADVISORY_TICKS;
            else t = UI.viewBasin.tick;
            changeViewTick(t);
        }
    }
}

function keyTyped(){
    // console.log(`keyTyped: ${key} / ${keyCode}`);
    if(UI.focusedInput){
        UI.inputData.insert = key;
        return false;
    }
}

function keyReleased(){
    UI.inputData.insert = '';
}

function changeViewTick(t){
    let oldS = UI.viewBasin.getSeason(viewTick);
    viewTick = t;
    let newS = UI.viewBasin.getSeason(viewTick);
    let finish = ()=>{
        refreshTracks(oldS!==newS);
        UI.viewBasin.env.displayLayer();
    };
    let requisites = s=>{
        let arr = [];
        let allFound = true;
        for(let i=0;i<s.systems.length;i++){
            let r = s.systems[i];
            if(r instanceof StormRef && (r.lastApplicableAt===undefined || r.lastApplicableAt>=viewTick || simSettings.trackMode===2)){
                arr.push(r.season);
                allFound = allFound && UI.viewBasin.fetchSeason(r.season);
            }
        }
        if(allFound) finish();
        else{
            for(let i=0;i<arr.length;i++){
                arr[i] = UI.viewBasin.fetchSeason(arr[i],false,false,true);
            }
            Promise.all(arr).then(finish);
        }
    };
    if(UI.viewBasin.fetchSeason(viewTick,true)){
        requisites(UI.viewBasin.fetchSeason(viewTick,true));
    }else UI.viewBasin.fetchSeason(viewTick,true,false,s=>{
        requisites(s);
    });
}

// function deviceTurned(){
//     toggleFullscreen();
// }

function wrapText(str,w){
    let newStr = "";
    for(let i = 0, j = 0;i<str.length;i=j){
        if(str.charAt(i)==='\n'){
            i++;
            j++;
            newStr += '\n';
            continue;
        }
        j = str.indexOf('\n',i);
        if(j===-1) j = str.length;
        let line = str.slice(i,j);
        while(textWidth(line)>w){
            let k=0;
            while(textWidth(line.slice(0,k))<=w) k++;
            k--;
            if(k<1){
                newStr += line.charAt(0) + '\n';
                line = line.slice(1);
                continue;
            }
            let l = line.lastIndexOf(' ',k-1);
            if(l!==-1){
                newStr += line.slice(0,l) + '\n';
                line = line.slice(l+1);
                continue;
            }
            let sub = line.slice(0,k);
            l = sub.search(/\W(?=\w*$)/);
            if(l!==-1){
                newStr += line.slice(0,l+1) + '\n';
                line = line.slice(l+1);
                continue;
            }
            newStr += sub + '\n';
            line = line.slice(k);
        }
        newStr += line;
    }
    return newStr;
}

function countTextLines(str){
    let l = 1;
    for(let i=0;i<str.length;i++) if(str.charAt(i)==='\n') l++;
    return l;
}

function ktsToMph(k,rnd){
    let val = k*1.15078;
    if(rnd) val = round(val/rnd)*rnd;
    return val;
}

function ktsToKmh(k,rnd){
    let val = k*1.852;
    if(rnd) val = round(val/rnd)*rnd;
    return val;
}

function displayWindspeed(kts, rnd){
    if(!rnd)
        rnd = WINDSPEED_ROUNDING;
    let value = [kts, ktsToMph(kts,rnd), ktsToKmh(kts,rnd)][simSettings.speedUnit];
    let unitLabel = ['kts', 'mph', 'km/h'][simSettings.speedUnit];
    return `${value} ${unitLabel}`;
}

function oneMinToTenMin(w,rnd){
    let val = w*7/8;    // simple ratio
    if(rnd) val = round(val/rnd)*rnd;
    return val;
}

function mbToInHg(mb,rnd){
    let val = mb*0.02953;
    if(rnd) val = round(val/rnd)*rnd;
    return val;
}

// converts a radians-from-east angle into a degrees-from-north heading with compass direction for display formatting
function compassHeading(rad){
    // force rad into range of zero to two-pi
    if(rad < 0)
        rad = 2*PI - (-rad % (2*PI));
    else
        rad = rad % (2*PI);
    // convert heading from radians-from-east to degrees-from-north
    let heading = map(rad,0,2*PI,90,450) % 360;
    let compass;
    // calculate compass direction
    if(heading < 11.25)
        compass = 'N';
    else if(heading < 33.75)
        compass = 'NNE';
    else if(heading < 56.25)
        compass = 'NE';
    else if(heading < 78.75)
        compass = 'ENE';
    else if(heading < 101.25)
        compass = 'E';
    else if(heading < 123.75)
        compass = 'ESE';
    else if(heading < 146.25)
        compass = 'SE';
    else if(heading < 168.75)
        compass = 'SSE';
    else if(heading < 191.25)
        compass = 'S';
    else if(heading < 213.75)
        compass = 'SSW';
    else if(heading < 236.25)
        compass = 'SW';
    else if(heading < 258.75)
        compass = 'WSW';
    else if(heading < 281.25)
        compass = 'W';
    else if(heading < 303.75)
        compass = 'WNW';
    else if(heading < 326.25)
        compass = 'NW';
    else if(heading < 348.75)
        compass = 'NNW';
    else
        compass = 'N';
    heading = round(heading);
    return heading + '\u00B0 '/* degree sign */ + compass;
}

function damageDisplayNumber(d){
    if(d===0) return "none";
    if(d<50000000) return "minimal";
    if(d<1000000000) return "$ " + (round(d/1000)/1000) + " M";
    if(d<1000000000000) return "$ " + (round(d/1000000)/1000) + " B";
    return "$ " + (round(d/1000000000)/1000) + " T";
}

function formatDate(m){
    if(m instanceof moment){
        const f = 'HH[z] MMM DD';
        let str = m.format(f);
        let y = m.year();
        let bce;
        if(y<1){
            y = 1-y;
            bce = true;
        }
        str += ' ' + zeroPad(y,4);
        if(bce) str += ' B.C.E.';
        return str;
    }
}

function seasonName(y,h){
    if(h===undefined) h = UI.viewBasin instanceof Basin && UI.viewBasin.SHem;
    let str = '';
    let eraYear = yr=>{
        if(yr<1) return 1-yr;
        return yr;
    };
    const bce = ' B.C.E.';
    if(h){
        str += zeroPad(eraYear(y-1),4);
        if(y===1) str += bce;
        str += '-' + zeroPad(eraYear(y)%100,2);
        if(y<1) str += bce;
        return str;
    }
    str += zeroPad(eraYear(y),4);
    if(y<1) str += bce;
    return str;
}

// --- START OF FILE: environment.ts ---

class NoiseChannel{
    constructor(octaves,falloff,zoom,zZoom,xOff,yOff,zOff){
        this.octaves = octaves || 4;
        this.falloff = falloff || 0.5;
        this.zoom = zoom || 100;
        this.zZoom = zZoom || this.zoom;
        this.xOff = xOff || 0;
        this.yOff = yOff || 0;
        this.zOff = zOff || 0;
    }

    get(x,y,z,xo,yo,zo){
        x = x || 0;
        y = y || 0;
        z = z || 0;
        xo = xo!==undefined ? xo : this.xOff;
        yo = yo!==undefined ? yo : this.yOff;
        zo = zo!==undefined ? zo : this.zOff;
        noiseDetail(this.octaves,this.falloff);
        return noise(x/this.zoom+xo,y/this.zoom+yo,z/this.zZoom+zo);
    }
}

class EnvNoiseChannel extends NoiseChannel{
    constructor(basin,field,index,loadData,octaves,falloff,zoom,zZoom,wMax,zWMax,wRFac){
        let r = NC_OFFSET_RANDOM_FACTOR;
        super(octaves,falloff,zoom,zZoom,random(r),random(r),random(r));
        this.wobbleMax = wMax || 1;
        this.zWobbleMax = zWMax || this.wobbleMax;
        this.wobbleRotFactor = wRFac || PI/16;
        this.wobbleVector = p5.Vector.random2D();

        this.basin = basin instanceof Basin && basin;
        this.field = field;
        this.index = index;
        if(loadData instanceof LoadData) this.load(loadData);
    }

    get(x,y,z){
        let o = this.fetchOffsets(z);
        if(!o) throw ENVDATA_NOT_FOUND_ERROR;
        let {xo, yo, zo} = o;
        return super.get(x,y,z,xo,yo,zo);
    }

    fetchOffsets(t){
        let basin = this.basin;
        if(t>=basin.tick) return {
            xo: this.xOff,
            yo: this.yOff,
            zo: this.zOff
        };
        else{
            t = floor(t/ADVISORY_TICKS)*ADVISORY_TICKS;
            let s = basin.getSeason(t);
            t = (t-basin.seasonTick(s))/ADVISORY_TICKS;
            let d = basin.fetchSeason(s);
            if(d && d.envData && d.envData[this.field] && d.envData[this.field][this.index]){
                t -= d.envData[this.field][this.index].recordStart;
                if(t >= 0){
                    let o = d.envData[this.field][this.index].val[t];
                    return {
                        xo: o.x,
                        yo: o.y,
                        zo: o.z
                    };
                }
            }
        }
    }

    wobble(){
        let v = this.wobbleVector;
        v.setMag(random(0.0001,this.wobbleMax));
        this.xOff += v.x/this.zoom;
        this.yOff += v.y/this.zoom;
        this.zOff += random(-this.zWobbleMax,this.zWobbleMax)/this.zZoom;
        v.rotate(random(-this.wobbleRotFactor,this.wobbleRotFactor));
    }

    record(){
        let basin = this.basin;
        let seas = basin.fetchSeason(-1,true,true);
        let s = seas;
        // let startingRecord;
        if(!s.envData){
            s.envData = {};
            // startingRecord = true;
        }
        s = s.envData;
        if(!s[this.field]){
            s[this.field] = {};
            // startingRecord = true;
        }
        s = s[this.field];
        if(!s[this.index]){
            s[this.index] = {
                val: [],
                recordStart: floor(basin.tick/ADVISORY_TICKS)-basin.seasonTick()/ADVISORY_TICKS
            };
            // startingRecord = true;
        }
        s = s[this.index].val;
        // if(startingRecord) seas.envRecordStarts = floor(basin.tick/ADVISORY_TICKS)-basin.seasonTick()/ADVISORY_TICKS;
        s.push({
            x: this.xOff,
            y: this.yOff,
            z: this.zOff
        });
        seas.modified = true;
    }

    save(){
        let obj = {};
        let w = obj.wobbleVector = {};
        w.x = this.wobbleVector.x;
        w.y = this.wobbleVector.y;
        for(let p of ['xOff','yOff','zOff']) obj[p] = this[p];
        return obj;
    }

    load(data){
        if(data instanceof LoadData){
            let wx;
            let wy;
            if(data.format>=FORMAT_WITH_INDEXEDDB){
                let obj = data.value;
                for(let p of ['xOff','yOff','zOff']) if(obj[p]) this[p] = obj[p];
                wx = obj.wobbleVector && obj.wobbleVector.x;
                wy = obj.wobbleVector && obj.wobbleVector.y;
            }else{
                let str = data.value;
                let arr = decodeB36StringArray(str);
                this.xOff = arr.pop() || this.xOff;
                this.yOff = arr.pop() || this.yOff;
                this.zOff = arr.pop() || this.zOff;
                wx = arr.pop();
                wy = arr.pop();
            }
            if(wx!==undefined && wy!==undefined) this.wobbleVector = createVector(wx,wy);
        }
    }
}

class EnvField{
    constructor(basin,name,loadData,attribs){
        this.basin = basin instanceof Basin && basin;
        this.name = name;
        if(attribs.displayName)
            this.displayName = attribs.displayName;
        else
            this.displayName = name;
        this.noise = [];
        this.accurateAfter = -1;
        this.version = attribs.version;
        if(loadData instanceof LoadData && loadData.value){
            if(loadData.value.version!==this.version) this.accurateAfter = this.basin.tick;
            else this.accurateAfter = loadData.value.accurateAfter;
        }
        this.isVectorField = attribs.vector;
        this.noVectorFlip = attribs.noVectorFlip;   // do not reflect the output vector over the y-axis in the southern hemisphere if this is true
        this.noWobble = attribs.noWobble;
        if(attribs.hueMap)
            this.hueMap = attribs.hueMap;
        else if(!this.isVectorField)
            this.hueMap = [0,1,0,300];
        else
            this.hueMap = null;
        this.magMap = attribs.magMap || [0,1,0,10];
        if(attribs.displayFormat instanceof Function)
            this.displayFormat = attribs.displayFormat;
        else if(this.isVectorField)
            this.displayFormat = v=>{
                let m = v.mag();
                let h = v.heading();
                return "(a: " + (round(h*1000)/1000) + ", m: " + (round(m*1000)/1000) + ")";
            };
        else
            this.displayFormat = v=>''+round(v*1000)/1000;
        this.invisible = attribs.invisible;
        this.oceanic = attribs.oceanic;
        this.modifiers = attribs.modifiers;
        if(this.isVectorField) this.vec = createVector();
        if(attribs.mapFunc instanceof Function) this.mapFunc = attribs.mapFunc;
        let a = null;
        if(attribs.noiseChannels instanceof Array){
            let noiseC = attribs.noiseChannels;
            for(let i=0;i<noiseC.length;i++){
                if(noiseC[i] instanceof Array || (noiseC[i]==='' && a instanceof Array)){
                    let d;
                    if(loadData instanceof LoadData && loadData.value && loadData.value.noiseData && loadData.value.noiseData[i]){
                        d = loadData.value.noiseData[i];
                        d = loadData.sub(d);
                    }
                    if(noiseC[i] instanceof Array) a = noiseC[i];
                    let c = new EnvNoiseChannel(this.basin,this.name,i,d,...a);
                    this.noise.push(c);
                }
            }
        }
    }

    get(x,y,z,noHem){
        try{
            let longlat = Coordinate.convertFromXY(this.basin.mapType, x, y);
            if(!noHem) y = this.basin.hemY(y);
            if(this.mapFunc){
                let u = {}; // utility argument
                u.noise = (num,x1,y1,z1)=>{     // get noise channel value (coordinates optional as they default to the main "get" coordinates)
                    if(x1===undefined) x1 = x;
                    if(y1===undefined) y1 = y;
                    if(z1===undefined) z1 = z;
                    return this.noise[num].get(x1,y1,z1);
                };
                u.basin = this.basin;
                u.field = (name,x1,y1,z1)=>{    // get value of another env field (coordinates optional)
                    if(x1===undefined) x1 = x;
                    if(y1===undefined) y1 = y;
                    if(z1===undefined) z1 = z;
                    if(this.basin.env.fields[name].accurateAfter>this.accurateAfter) this.accurateAfter = this.basin.env.fields[name].accurateAfter;
                    return this.basin.env.get(name,x1,y1,z1,true);
                };
                u.yearfrac = z=>(z%YEAR_LENGTH)/YEAR_LENGTH;    // fraction of the way through the year for a tick (SHem year begins July 1 so this value is climatologically the same for both hemispheres)
                u.piecewise = (s,arr)=>{
                    // constructs and evaluates an interpolation function defined piecewise with linear segments
                    // s is a year fraction in the range 0 to 1 (the argument to the interpolation function)
                    // arr is an array of "points" expressed as length-2 arrays
                    // first value of each "point" ("x") represents a number of months through the year (range 0 to 12)
                    // second value of each "point" ("y") represents the value to interpolate from
                    let m = s*12;
                    let x = [arr[arr.length-1][0]-12,arr[arr.length-1][1]];
                    for(let q of arr){
                        if(m<q[0]) return map(m,x[0],q[0],x[1],q[1]);
                        x = q;
                    }
                    return map(m,x[0],arr[0][0]+12,x[1],arr[0][1]);
                };
                u.coord = longlat;
                u.vec = this.vec;
                u.modifiers = this.modifiers || {};
                let res = this.mapFunc(u,x,y,z);
                if(this.isVectorField && !this.noVectorFlip) res.y = this.basin.hem(res.y);
                return res;
            }
            if(this.isVectorField){
                this.vec.set(1);
                this.vec.rotate(map(this.noise[0].get(x,y,z),0,1,0,4*TAU));
                if(!this.noVectorFlip) this.vec.y = this.basin.hem(this.vec.y);
                return this.vec;
            }
            return this.noise[0].get(x,y,z);
        }catch(err){
            if(!noHem && err===ENVDATA_NOT_FOUND_ERROR) return null;
            throw err;
        }
    }

    wobble(){
        if(!this.noWobble){
            for(let i=0;i<this.noise.length;i++){
                this.noise[i].wobble();
            }
        }
    }

    render(){
        envLayer.noFill();
        let tileSize = ceil(ENV_LAYER_TILE_SIZE*scaler);
        for(let i=0;i<WIDTH;i+=ENV_LAYER_TILE_SIZE){
            for(let j=0;j<HEIGHT;j+=ENV_LAYER_TILE_SIZE){
                let x = i+ENV_LAYER_TILE_SIZE/2;
                let y = j+ENV_LAYER_TILE_SIZE/2;
                if(!this.oceanic || (land && land.tileContainsOcean(x,y))){
                    let v = this.get(x,y,viewTick);
                    if(this.isVectorField){
                        envLayer.push();
                        envLayer.scale(scaler);
                        envLayer.translate(x,y);
                        if(v!==null){
                            envLayer.rotate(v.heading());
                            let mg = v.mag();
                            let mp = this.magMap;
                            let l = map(mg,mp[0],mp[1],mp[2],mp[3]);
                            let h = this.hueMap;
                            let c;
                            if(h instanceof Function)
                                c = h(mg);
                            else if(h instanceof Array)
                                c = color(map(mg,h[0],h[1],h[2],h[3]),100,100);
                            else
                                c = 'black';
                            envLayer.stroke(c);
                            envLayer.line(0,0,l,0);
                            envLayer.noStroke();
                            envLayer.fill(c);
                            envLayer.triangle(l+5,0,l,3,l,-3);
                        }else{
                            envLayer.stroke(0);
                            envLayer.line(-3,-3,3,3);
                            envLayer.line(-3,3,3,-3);
                        }
                        envLayer.pop();
                    }else{
                        if(v!==null){
                            let h = this.hueMap;
                            if(h instanceof Function) envLayer.fill(h(v));
                            else envLayer.fill(map(v,h[0],h[1],h[2],h[3]),100,100);
                        }else envLayer.fill(0,0,50);
                        envLayer.rect(i*scaler,j*scaler,tileSize,tileSize);
                        if(v===null){
                            envLayer.fill(0,0,60);
                            envLayer.triangle(i*scaler,j*scaler,i*scaler+tileSize,j*scaler,i*scaler,j*scaler+tileSize);
                        }
                    }
                }
                
            }
        }
        if(simSettings.showMagGlass) this.renderMagGlass();
    }

    renderMagGlass(){
        let centerX = getMouseX();
        let centerY = getMouseY();
        magnifyingGlass.noFill();
        let vCenter = this.get(centerX,centerY,viewTick);
        if(this.isVectorField){
            if(coordinateInCanvas(centerX,centerY) && (!this.oceanic || (land && land.tileContainsOcean(centerX,centerY) && !land.get(Coordinate.convertFromXY(this.basin.mapType,centerX,centerY))))){
                let v = vCenter;
                magnifyingGlass.push();
                magnifyingGlass.stroke(0);
                magnifyingGlass.scale(scaler);
                let magMeta = buffers.get(magnifyingGlass);
                magnifyingGlass.translate(magMeta.baseWidth/2,magMeta.baseHeight/2);
                if(v!==null){
                    magnifyingGlass.rotate(v.heading());
                    let mg = v.mag();
                    let mp = this.magMap;
                    let l = map(mg,mp[0],mp[1],mp[2],mp[3]);
                    magnifyingGlass.line(0,0,l,0);
                    magnifyingGlass.noStroke();
                    magnifyingGlass.fill(0);
                    magnifyingGlass.triangle(l+5,0,l,3,l,-3);
                }else{
                    magnifyingGlass.line(-3,-3,3,3);
                    magnifyingGlass.line(-3,3,3,-3);
                }
                magnifyingGlass.pop();
            }
        }else{
            if(vCenter!==null){
                for(let i=floor(magnifyingGlass.width/4);i<3*magnifyingGlass.width/4;i++){
                    for(let j=floor(magnifyingGlass.height/4);j<3*magnifyingGlass.height/4;j++){
                        let i1 = i-magnifyingGlass.width/2;
                        let j1 = j-magnifyingGlass.height/2;
                        if(sqrt(sq(i1)+sq(j1))<magnifyingGlass.width/4){
                            let x = centerX+i1/scaler;
                            let y = centerY+j1/scaler;
                            if(coordinateInCanvas(x,y) && (!this.oceanic || (land && land.tileContainsOcean(x,y) && !land.get(Coordinate.convertFromXY(this.basin.mapType,x,y))))){
                                let v = this.get(x,y,viewTick);
                                if(v!==null){
                                    let h = this.hueMap;
                                    if(h instanceof Function) magnifyingGlass.fill(h(v));
                                    else magnifyingGlass.fill(map(v,h[0],h[1],h[2],h[3]),100,100);
                                }else magnifyingGlass.fill(0,0,50);
                                magnifyingGlass.rect(i,j,1,1);
                            }
                        }
                    }
                }
            }else{
                magnifyingGlass.fill(0,0,50);
                magnifyingGlass.ellipse(magnifyingGlass.width/2,magnifyingGlass.height/2,magnifyingGlass.width,magnifyingGlass.height);
            }
        }
    }

    record(){
        if(!this.noWobble){
            for(let i=0;i<this.noise.length;i++){
                this.noise[i].record();
            }
        }
    }
}

class Environment{  // Environmental fields that determine storm strength and steering
    constructor(basin){
        this.basin = basin instanceof Basin && basin;
        this.fields = {};
        this.fieldList = [];
        this.displaying = -1;
        this.layerIsOceanic = false;
        this.layerIsVector = false;
    }

    addField(name,...fieldArgs){
        this.fields[name] = new EnvField(this.basin,name,...fieldArgs);
        this.fieldList.push(name);
    }

    wobble(){
        for(let i in this.fields) this.fields[i].wobble();
    }

    record(){
        for(let i in this.fields) this.fields[i].record();
    }

    get(field,x,y,z,noHem){
        if(!this.fields[field]){
            console.error('Field "' + field + '" does not exist in simulation mode ' + this.basin.actMode);
            return 0;
        }
        return this.fields[field].get(x,y,z,noHem);
    }

    getDisplayName(field){
        if(!this.fields[field]){
            console.error('Field "' + field + '" does not exist in simulation mode ' + this.basin.actMode);
            return 0;
        }
        return this.fields[field].displayName;
    }

    formatFieldValue(field,val){
        if(!this.fields[field]){
            console.error('Field "' + field + '" does not exist in simulation mode ' + this.basin.actMode);
            return 0;
        }
        return this.fields[field].displayFormat(val);
    }

    displayLayer(){
        envLayer.clear();
        magnifyingGlass.clear();
        if(this.displaying>=0) this.fields[this.fieldList[this.displaying]].render();
    }

    displayNext(){
        do this.displaying++;
        while(this.displaying<this.fieldList.length && this.fields[this.fieldList[this.displaying]].invisible);
        if(this.displaying>=this.fieldList.length) this.displaying = -1;
        else{
            this.layerIsOceanic = this.fields[this.fieldList[this.displaying]].oceanic;
            this.layerIsVector = this.fields[this.fieldList[this.displaying]].isVectorField;
        }
        this.displayLayer();
    }

    updateMagGlass(){
        magnifyingGlass.clear();
        if(simSettings.showMagGlass && this.displaying>=0) this.fields[this.fieldList[this.displaying]].renderMagGlass();
    }

    init(data){
        if(data instanceof LoadData && data.format<FORMAT_WITH_IMPROVED_ENV){   // Hardcoded conversion of data structure to Format 3 (doesn't affect values, thus old format number should cascade)
            let newData = {};
            let v = data.value;
            let o = (...d)=>{return {
                version: 0,
                accurateAfter: -1,
                noiseData: d
            };};
            newData.jetstream = o(v[8]);
            newData.LLSteering = o(v[7],v[6],v[5],v[4]);
            newData.ULSteering = o(v[3],v[2]);
            newData.shear = o();
            newData.SSTAnomaly = o(v[1]);
            newData.SST = o();
            newData.moisture = o(v[0]);
            data = data.sub(newData);
        }

        for(let f in ENV_DEFS[this.basin.actMode]){ // add all fields specified for the basin's simulation mode
            let attribs = {};
            attribs.modifiers = {};
            if(ENV_DEFS.defaults[f]){
                // field attributes shared among simulation modes
                let defs = ENV_DEFS.defaults[f];
                for(let a in defs){
                    if(a==='modifiers'){
                        for(let m in defs.modifiers) attribs.modifiers[m] = defs.modifiers[m];
                    }else attribs[a] = defs[a];
                }
            }
            // field attributes unique to this basin's simulation mode
            let defs = ENV_DEFS[this.basin.actMode][f];
            for(let a in defs){
                if(a==='modifiers'){
                    for(let m in defs.modifiers) attribs.modifiers[m] = defs.modifiers[m];
                }else attribs[a] = defs[a];
            }
            let d = data instanceof LoadData && data.sub(data.value[f]);
            this.addField(f,d,attribs);
        }
    }
}

class Land{
    constructor(basin, mapImg){
        this.basin = basin instanceof Basin && basin;
        let mapTypeDef = MAP_TYPES[this.basin.mapType];
        this.earth = mapTypeDef.form === 'earth';
        const {fullW: W, fullH: H} = fullDimensions();
        this.map = createImage(W, H);
        if(this.earth){
            this.westBound = mapTypeDef.west;
            this.eastBound = mapTypeDef.east;
            this.northBound = mapTypeDef.north;
            this.southBound = mapTypeDef.south;
            this.wholeEarthMap = mapImg;
        }else if(mapImg){
            this.map.copy(mapImg, 0, 0, mapImg.width, mapImg.height, 0, 0, W, H);
        }
        this.noise = new NoiseChannel(9,0.5,100);
        this.oceanTile = [];
        this.mapDefinition = undefined;
        this.drawn = false;
        this.snowDrawn = false;
        this.shaderDrawn = false;
        this.calculate();
    }

    get(long, lat){
        if(long instanceof Coordinate)
            ({longitude: long, latitude: lat} = long);
        if(this.earth){
            let img = this.wholeEarthMap;
            long = (long + 180) % 360 - 180;
            let x1 = floor(map(long,-180,180,0,img.width));
            let y1 = floor(map(lat,90,-90,0,img.height-1));
            let index = 4 * (y1*img.width*sq(img._pixelDensity)+x1*img._pixelDensity);
            let hVal = img.pixels[index];
            let lVal = img.pixels[index+1];
            if(!lVal)
                return 0;
            else
                return map(sqrt(map(hVal,12,150,0,1,true)),0,1,0.501,1);
        }else{
            let img = this.map;
            let d = this.mapDefinition;
            let {x, y} = Coordinate.convertToXY(this.basin.mapType, long, lat);
            x = floor(x*d);
            y = floor(y*d);
            if(img && x >= 0 && x < img.width && y >= 0 && y < img.height){
                let d0 = img._pixelDensity;
                let index = 4 * (y * img.width * d0 * d0 + x * d0);
                let hVal = img.pixels[index];
                let lVal = img.pixels[index + 1];
                if(!lVal)
                    return 0;
                else
                    return hVal / 255;
            }else return 0;
        }
    }

    getSubBasin(long, lat){
        if(long instanceof Coordinate)
            ({longitude: long, latitude: lat} = long);
        if(this.earth){
            let img = this.wholeEarthMap;
            long = (long + 180) % 360 - 180;
            let x1 = floor(map(long,-180,180,0,img.width));
            let y1 = floor(map(lat,90,-90,0,img.height-1));
            let index = 4 * (y1*img.width*sq(img._pixelDensity)+x1*img._pixelDensity);
            return img.pixels[index+2];
        }else{
            let img = this.map;
            let d = this.mapDefinition;
            let {x, y} = Coordinate.convertToXY(this.basin.mapType, long, lat);
            x = floor(x*d);
            y = floor(y*d);
            if(img && x >= 0 && x < img.width && y >= 0 && y < img.height){
                let d0 = img._pixelDensity;
                let index = 4 * (y * img.width * d0 * d0 + x * d0);
                return img.pixels[index + 2];
            }else return 0;
        }
    }

    inBasin(long, lat){
        let r = this.getSubBasin(long, lat);
        return this.basin.subInBasin(r);
    }

    calculate(){
        const {fullW: W, fullH: H} = fullDimensions();
        let mapTypeControls = MAP_TYPES[this.basin.mapType];
        let mapForm = mapTypeControls.form;
        if(this.earth){                     // crop whole earth map to the map type's sector, used for drawing (but not getting)
            let earth = this.wholeEarthMap;
            let sector = this.map;
            let west_x = floor(map(this.westBound,-180,180,0,earth.width));
            let east_x = floor(map(this.eastBound,-180,180,0,earth.width));
            let north_y = floor(map(this.northBound,90,-90,0,earth.height-1));
            let south_y = floor(map(this.southBound,90,-90,0,earth.height-1));
            if(this.eastBound < this.westBound){
                let idl_x = W * (180 - this.westBound) / (this.eastBound + 360 - this.westBound);
                sector.copy(earth, west_x, north_y, earth.width - west_x, south_y - north_y, 0, 0, idl_x, H);
                sector.copy(earth, 0, north_y, east_x, south_y - north_y, idl_x, 0, W - idl_x, H);
            }else{
                sector.copy(earth, west_x, north_y, east_x - west_x, south_y - north_y, 0, 0, W, H);
            }
            sector.loadPixels();
            // for(let i = 0; i < sector.pixels.length; i += 4){
            //     let h = map(sqrt(map(sector.pixels[i],12,150,0,1,true)),0,1,0.501,1);
            //     sector.pixels[i] = floor(h * 255);
            // }
            // sector.updatePixels();
        }else if(mapForm === 'pixelmap'){   // map is already given; calculate ocean tile values
            let img = this.map;
            let mapDef = this.mapDefinition = W/WIDTH;
            let density = img._pixelDensity;
            let pixels = img.pixels;
            for(let i = 0; i < W; i++){
                for(let j = 0; j < H; j++){
                    let x = i/mapDef;
                    let y = j/mapDef;
                    let index = 4 * (j * W * density * density + i * density);
                    let landVal = pixels[index] / 255;
                    let ox = floor(x/ENV_LAYER_TILE_SIZE);
                    let oy = floor(y/ENV_LAYER_TILE_SIZE);
                    if(!this.oceanTile[ox])
                        this.oceanTile[ox] = [];
                    if(landVal <= 0.5)
                        this.oceanTile[ox][oy] = true;
                }
            }
        }else{                              // procedurally generate map from noise and store in this.map image
            let img = this.map;
            let mapDef = this.mapDefinition = W/WIDTH;

            img.loadPixels();
            let pixels = img.pixels;
            let density = img._pixelDensity;
    
            for(let i=0;i<W;i++){
                for(let j=0;j<H;j++){
                    let index = 4 * (j * W * density * density + i * density);
                    let landVal;
                    let x = i/mapDef;
                    let y = j/mapDef;
                    let n = this.noise.get(x,y);
                    let landBiasFactors = mapTypeControls.landBiasFactors;
                    let landBias;
                    if(mapTypeControls.form == "linear"){
                        let landBiasAnchor = WIDTH * landBiasFactors[0];
                        landBias = x < landBiasAnchor ?
                            map(x,0,landBiasAnchor,landBiasFactors[1],landBiasFactors[2]) :
                            map(x-landBiasAnchor,0,WIDTH-landBiasAnchor,landBiasFactors[2],landBiasFactors[3]);
                    }else if(mapTypeControls.form == "radial"){
                        let EWAnchor = WIDTH * landBiasFactors[0];
                        let NSAnchor = HEIGHT * landBiasFactors[1];
                        let pointDist = sqrt(sq(x-EWAnchor)+sq(y-NSAnchor));
                        let distAnchor1 = landBiasFactors[2] * sqrt(WIDTH*HEIGHT);
                        let distAnchor2 = landBiasFactors[3] * sqrt(WIDTH*HEIGHT);
                        landBias = pointDist < distAnchor1 ?
                            map(pointDist,0,distAnchor1,landBiasFactors[4],landBiasFactors[5]) : pointDist < distAnchor2 ?
                            map(pointDist,distAnchor1,distAnchor2,landBiasFactors[5],landBiasFactors[6]) :
                            landBiasFactors[6];
                    }
                    landVal = n + landBias;
                    pixels[index] = floor(landVal * 255);
                    pixels[index + 1] = landVal > 0.5 ? 255 : 0;
                    let ox = floor(x/ENV_LAYER_TILE_SIZE);
                    let oy = floor(y/ENV_LAYER_TILE_SIZE);
                    if(!this.oceanTile[ox])
                        this.oceanTile[ox] = [];
                    if(landVal <= 0.5)
                        this.oceanTile[ox][oy] = true;
                }
            }
            img.updatePixels();
        }
    }

    *draw(){
        yield "Rendering land...";
        const {fullW: W, fullH: H} = fullDimensions();
        const src = this.map.pixels; // source image for land data; red channel is elevation; green channel is land/water; blue channel is sub-basin id

        // abbreviate pixel arrays of images to draw to
        const landPx = landBuffer.pixels;
        const coastPx = coastLine.pixels;
        const outBasinPx = outBasinBuffer.pixels;

        // cache colors for 256 possible land height values to avoid expensive calculations in pixel loop
        const C = COLORS.land;
        const colorCache = [];
        for(let i = 255, ci = 0; i >= 0; i--){
            let l;
            if(this.earth)
                l = map(sqrt(map(i,12,150,0,1,true)),0,1,0.501,1);
            else
                l = Math.max(i / 255, 0.501);
            if(C[ci] && l <= C[ci][0])
                ci++;
            if(ci >= C.length)
                colorCache[i] = {r: 0, g: 0, b: 0};
            else{
                let color = C[ci][1];
                if(simSettings.smoothLandColor && ci > 0){
                    const color1 = C[ci - 1][1];
                    const f = map(l, C[ci][0], C[ci - 1][0], 0, 1);
                    color = lerpColor(color, color1, f);
                }
                colorCache[i] = {r: red(color), g: green(color), b: blue(color)};
            }
        }
        colorCache.outBasin = {r: red(COLORS.outBasin), g: green(COLORS.outBasin), b: blue(COLORS.outBasin)};

        // cache of booleans of whether a sub-basin is out-basin or not; cached as-needed from within pixel loop as sub-basin ids are assumed unknown
        const outBasinCache = {};

        for(let i=0;i<W;i++){
            for(let j=0;j<H;j++){
                let index = 4 * (j * W + i);
                if(src[index + 1]){ // if pixel is on land
                    const v = src[index]; // land elevation value
                    landPx[index] = colorCache[v].r;
                    landPx[index + 1] = colorCache[v].g;
                    landPx[index + 2] = colorCache[v].b;
                    landPx[index + 3] = 255;

                    let touchingOcean = false;
                    if(i>0 && !src[index - 4 + 1]) touchingOcean = true;
                    if(j>0 && !src[index - 4 * W + 1]) touchingOcean = true;
                    if(i<W-1 && !src[index + 4 + 1]) touchingOcean = true;
                    if(j<H-1 && !src[index + 4 * W + 1]) touchingOcean = true;
                    if(touchingOcean){
                        coastPx[index] = 0;
                        coastPx[index + 1] = 0;
                        coastPx[index + 2] = 0;
                        coastPx[index + 3] = 255;
                    }else
                        coastPx[index + 3] = 0;
                    outBasinPx[index + 3] = 0;
                }else{
                    landBuffer.pixels[index + 3] = 0;
                    coastPx[index + 3] = 0;
                    const sb = src[index + 2]; // sub-basin id
                    if(outBasinCache[sb] === undefined)
                        outBasinCache[sb] = !this.basin.subInBasin(sb);
                    if(outBasinCache[sb]){
                        outBasinPx[index] = colorCache.outBasin.r;
                        outBasinPx[index + 1] = colorCache.outBasin.g;
                        outBasinPx[index + 2] = colorCache.outBasin.b;
                        outBasinPx[index + 3] = 255;
                    }else
                        outBasinPx[index + 3] = 0;
                }
            }
        }
        landBuffer.updatePixels();
        outBasinBuffer.updatePixels();
        coastLine.updatePixels();
        if(simSettings.snowLayers && !this.snowDrawn){
            yield* this.drawSnow();
        }
        if(simSettings.useShadows && !this.shaderDrawn){
            yield* this.drawShader();
        }
        this.drawn = true;
    }

    *drawSnow(){
        yield "Rendering " + (random()<0.02 ? "sneaux" : "snow") + "...";
        const {fullW: W, fullH: H} = fullDimensions();
        const src = this.map.pixels; // source image for land data; red channel is elevation; green channel is land/water; blue channel is sub-basin id

        const eleCache = []; // cache elevation values to avoid expensive function calls in pixel loop
        for(let i = 255; i >= 0; i--){
            let l;
            if(this.earth)
                l = map(sqrt(map(i,12,150,0,1,true)),0,1,0.501,1);
            else
                l = Math.max(i / 255, 0.501);
            eleCache[i] = l;
        }
        const snowColor = {r: red(COLORS.snow), g: green(COLORS.snow), b: blue(COLORS.snow)};
        
        const SHem = this.basin.SHem;
        
        const snowLayers = simSettings.snowLayers * 10;
        for(let i=0;i<W;i++){
            for(let j=0;j<H;j++){
                let index = 4 * (j * W + i);
                if(src[index + 1]){ // if pixel is on land
                    let l = 1 - j / H;
                    if(SHem)
                        l = 1 - l;
                    let h = 0.95 - eleCache[src[index]];
                    let p = l > 0 ? Math.ceil((snowLayers / 0.3) * (h / l - 0.15)) : h < 0 ? 0 : snowLayers;
                    for(let k = 0; k < snowLayers; k++){
                        if(k >= p){
                            snow[k].pixels[index] = snowColor.r;
                            snow[k].pixels[index + 1] = snowColor.g;
                            snow[k].pixels[index + 2] = snowColor.b;
                            snow[k].pixels[index + 3] = 255;
                        }else
                            snow[k].pixels[index + 3] = 0;
                    }
                }else{
                    for(let k = 0; k < snowLayers; k++){
                        snow[k].pixels[index + 3] = 0;
                    }
                }
            }
        }
        for(let k = 0; k < snowLayers; k++){
            snow[k].updatePixels();
        }
        this.snowDrawn = true;
    }

    *drawShader(){
        yield "Rendering shadows...";
        const {fullW: W, fullH: H} = fullDimensions();
        const src = this.map.pixels; // source image for land data; red channel is elevation; green channel is land/water; blue channel is sub-basin id

        const eleCache = []; // cache elevation values to avoid expensive function calls in pixel loop
        for(let i = 255; i >= 0; i--){
            let l;
            if(this.earth)
                l = map(sqrt(map(i,12,150,0,1,true)),0,1,0.501,1);
            else
                l = Math.max(i / 255, 0.501);
            eleCache[i] = l;
        }
        
        for(let i=0;i<W;i++){
            for(let j=0;j<H;j++){
                let index = 4 * (j * W + i);
                let v = src[index + 1] ? eleCache[src[index]] : 0.5;
                let m = 0;
                for(let k = 1; k < 6; k++){
                    let s = eleCache[src[index - 4 * k * W - 4 * k]] - v - k * 0.0008;
                    s = Math.min(Math.max(s * 191 / 0.14, 0), 191);
                    if(s > m) m = s;
                }
                if(m > 0){
                    landShadows.pixels[index] = 0;
                    landShadows.pixels[index + 1] = 0;
                    landShadows.pixels[index + 2] = 0;
                    landShadows.pixels[index + 3] = Math.floor(m);
                }else
                    landShadows.pixels[index + 3] = 0;
            }
        }
        landShadows.updatePixels();
        this.shaderDrawn = true;
    }

    tileContainsOcean(x,y){
        if(this.earth)
            return true;
        
        x = floor(x/ENV_LAYER_TILE_SIZE);
        y = floor(y/ENV_LAYER_TILE_SIZE);
        return this.oceanTile[x][y];
    }

    clearSnow(){
        // for(let i=0;i<MAX_SNOW_LAYERS;i++) snow[i].clear();
        this.snowDrawn = false;
    }

    clear(){
        // landBuffer.clear();
        // outBasinBuffer.clear();
        // coastLine.clear();
        // landShadows.clear();
        this.clearSnow();
        this.drawn = false;
        this.shaderDrawn = false;
    }
}

function seasonalSine(t,off){
    off = off===undefined ? 5/12 : off;
    return sin((TAU*(t-YEAR_LENGTH*off))/YEAR_LENGTH);
}

// quick and sloppy copy-paste of spooky code for Halloween update
// this, the regular season curve, and the wild mode season curve could all be implemented in a more concise way, but that can be done later and this codebase is being retired eventually anyway
function spookySeasonCurve(t,off){
    off = off===undefined ? 0 : off;
    let n = (1+t/YEAR_LENGTH-off)%1;
    return n<5/24 ? map(n,0,5/24,-0.2,-1) : n<5/12 ? map(n,5/24,5/12,-1,0) : n<3/4 ? map(n,5/12,3/4,0,1.2) : n<39/48 ? map(n,3/4,39/48,1.2,1.5) : n<302.5/365.25 ? map(n,39/48,302.5/365.25,1.5,2.2) : n<305/365.25 ? 2.2 : n<81/96 ? map(n,305/365.25,81/96,2.2,0.8) : map(n,81/96,1,0.8,-0.2);
}

// --- START OF FILE: sim-mode-defs.ts ---

// ---- Simulation Modes ---- //

const SIMULATION_MODES = ['Normal','Hyper','Wild','Megablobs','Experimental','Spooky']; // Labels for sim mode selector UI
const SIM_MODE_NORMAL = 0;
const SIM_MODE_HYPER = 1;
const SIM_MODE_WILD = 2;
const SIM_MODE_MEGABLOBS = 3;
const SIM_MODE_EXPERIMENTAL = 4;
const SIM_MODE_SPOOKY = 5;

// ---- Active Attributes ---- //

// Active attributes are data of ActiveSystem not inherited from StormData; used for simulation of active storm systems
// Here defines the names of these attributes for a given simulation mode

const ACTIVE_ATTRIBS = {};

ACTIVE_ATTRIBS.defaults = [
    'organization',
    'lowerWarmCore',
    'upperWarmCore',
    'depth',
    'genesisProgress'
];

ACTIVE_ATTRIBS[SIM_MODE_EXPERIMENTAL] = [
    'organization',
    'lowerWarmCore',
    'upperWarmCore',
    'depth',
    'genesisProgress',
    'kaboom'
];

// ---- Season Curve ---- //

const SEASON_CURVE = {};

SEASON_CURVE.default = 'seasonalSine';
SEASON_CURVE[SIM_MODE_SPOOKY] = 'spookySeasonCurve';


// ---- Spawn Rules ---- //

const SPAWN_RULES = {};

SPAWN_RULES.defaults = {};
SPAWN_RULES[SIM_MODE_NORMAL] = {};
SPAWN_RULES[SIM_MODE_HYPER] = {};
SPAWN_RULES[SIM_MODE_WILD] = {};
SPAWN_RULES[SIM_MODE_MEGABLOBS] = {};
SPAWN_RULES[SIM_MODE_EXPERIMENTAL] = {};
SPAWN_RULES[SIM_MODE_SPOOKY] = {};

// -- Defaults -- //

SPAWN_RULES.defaults.archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.7,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    },
    'ex': {
        x: ()=>random(0,WIDTH-1),
        y: (b,x)=>b.hemY(b.env.get("jetstream",x,0,b.tick)+random(-75,75)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: EXTROP,
        organization: 0,
        lowerWarmCore: 0,
        upperWarmCore: 0,
        depth: 1
    },
    'l': {
        inherit: 'tw',
        pressure: 1015,
        windSpeed: 15,
        organization: 0.2
    },
    'x': {
        inherit: 'ex',
        pressure: 1005,
        windSpeed: 15
    },
    'tc': {
        pressure: 1005,
        windSpeed: 25,
        type: TROP,
        organization: 1,
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    },
    'stc': {
        inherit: 'tc',
        type: SUBTROP,
        lowerWarmCore: 0.6,
        upperWarmCore: 0.5
    },
    'd': {
        inherit: 'tc'
    },
    'D': {
        inherit: 'stc'
    },
    's': {
        inherit: 'tc',
        pressure: 995,
        windSpeed: 45
    },
    'S': {
        inherit: 'stc',
        pressure: 995,
        windSpeed: 45
    },
    '1': {
        inherit: 'tc',
        pressure: 985,
        windSpeed: 70
    },
    '2': {
        inherit: 'tc',
        pressure: 975,
        windSpeed: 90
    },
    '3': {
        inherit: 'tc',
        pressure: 960,
        windSpeed: 105
    },
    '4': {
        inherit: 'tc',
        pressure: 945,
        windSpeed: 125
    },
    '5': {
        inherit: 'tc',
        pressure: 925,
        windSpeed: 145
    },
    '6': {
        inherit: 'tc',
        pressure: 890,
        windSpeed: 170
    },
    '7': {
        inherit: 'tc',
        pressure: 840,
        windSpeed: 210
    },
    '8': {
        inherit: 'tc',
        pressure: 800,
        windSpeed: 270
    },
    '9': {
        inherit: 'tc',
        pressure: 765,
        windSpeed: 330
    },
    '0': {
        inherit: 'tc',
        pressure: 730,
        windSpeed: 400
    },
    'y': {
        inherit: 'tc',
        pressure: 690,
        windSpeed: 440
    },
    'monsoonLow': {
        pressure: [1004, 1012],
        windSpeed: [10, 25],
        type: TROPWAVE,

        organization: [0.1, 0.3],
        lowerWarmCore: [0.6, 0.9],
        upperWarmCore: [0.55, 0.8],
        depth: [0, 0.2],

        genesisProgress: 0
    }
};

function lowLevelDynamics(basin, x, y, t){
    const d = 10;

    const east = basin.env.get("LLSteering", x + d, y, t).copy();
    const west = basin.env.get("LLSteering", x - d, y, t).copy();
    const south = basin.env.get("LLSteering", x, y + d, t).copy();
    const north = basin.env.get("LLSteering", x, y - d, t).copy();

    const duDx = (east.x - west.x) / (2 * d);
    const dvDx = (east.y - west.y) / (2 * d);

    const duDy_screen = (south.x - north.x) / (2 * d);
    const dvDy_screen = (south.y - north.y) / (2 * d);

    const vorticity_nh = duDy_screen - dvDx;
    const convergence = -(duDx + dvDy_screen);

    const cyclonicVorticity = basin.SHem ? -vorticity_nh : vorticity_nh;

    return {
        vorticity: cyclonicVorticity,
        convergence: convergence
    };
}

function genesisPotential(basin, x, y){
    const coord = Coordinate.convertFromXY(basin.mapType, x, y);

    if(land && land.get(coord) > 0.5)
        return 0;

    const lat = abs(coord.latitude);
    if(lat < 3 || lat > 30)
        return 0;

    const t = basin.tick;
    const sst = basin.env.get("SST", x, y, t);
    const moisture = basin.env.get("moisture", x, y, t);
    const shearVec = basin.env.get("shear", x, y, t);
    const shear = shearVec ? shearVec.mag() : 0;

    const sstFactor = constrain(map(sst, 25, 29, 0, 1), 0, 1);
    if(sstFactor === 0) return 0;

    const moistureFactor = constrain(map(moisture, 0.45, 0.7, 0, 1), 0, 1);
    const shearFactor = constrain(map(shear, 3.5, 1, 0, 1), 0, 1);

    const lowLatitudeFactor = constrain(map(lat, 3, 8, 0, 1), 0, 1);
    const highLatitudeFactor = constrain(map(lat, 30, 22, 0, 1), 0, 1);
    const latitudeFactor = lowLatitudeFactor * highLatitudeFactor;
    if(latitudeFactor === 0) return 0;

    let dynamicsFactor = 0.1;
    try {
        const dynamics = lowLevelDynamics(basin, x, y, t);
        const vorticityFactor = constrain(map(dynamics.vorticity, 0, 0.03, 0, 1), 0, 1);
        const convergenceFactor = constrain(map(dynamics.convergence, 0, 0.03, 0, 1), 0, 1);
        dynamicsFactor = 0.1 + 0.9 * (vorticityFactor * 0.5 + convergenceFactor * 0.5);
    } catch(e) {
        dynamicsFactor = 0.1;
    }

    const thermoFactors = [
        sstFactor,
        moistureFactor,
        shearFactor,
        latitudeFactor
    ];

    const prod = thermoFactors.reduce((a, v) => a * v, 1);
    const thermoPotential = Math.pow(prod, 1 / thermoFactors.length);

    return thermoPotential * dynamicsFactor;
}

function southChinaSeaSeasonFactor(tick) {
    const frac = (tick % YEAR_LENGTH) / YEAR_LENGTH;
    const m = frac * 12;
    const arr = [
        [0, 0.05],
        [2, 0.05],
        [3.5, 0.1],
        [5, 0.45],
        [7, 0.95],
        [8.5, 0.85],
        [10, 0.65],
        [11, 0.2],
        [12, 0.05]
    ];
    let prev = arr[arr.length - 1];
    let prevX = prev[0] - 12;
    let prevY = prev[1];
    for (let i = 0; i < arr.length; i++) {
        let curr = arr[i];
        if (m < curr[0]) {
            return map(m, prevX, curr[0], prevY, curr[1]);
        }
        prevX = curr[0];
        prevY = curr[1];
    }
    return 0.05;
}

function trySpawnSouthChinaSeaDisturbance(basin){
    if(basin.mapType !== 8 || basin.SHem)
        return;

    const seasonFactor = southChinaSeaSeasonFactor(basin.tick);
    if(seasonFactor < 0.1)
        return;

    const longitude = random(105, 120);
    const latitude = random(5, 20);

    const pos = Coordinate.convertToXY(
        basin.mapType,
        longitude,
        latitude
    );

    if(pos.x < 0 || pos.x >= WIDTH || pos.y < 0 || pos.y >= HEIGHT)
        return;

    const coord = new Coordinate(longitude, latitude);

    if(land && land.get(coord) > 0.5)
        return;

    if(basin.activeSystems){
        for(let sys of basin.activeSystems){
            if(sys.pos && dist(sys.pos.x, sys.pos.y, pos.x, pos.y) < 60)
                return;
        }
    }

    const potential = genesisPotential(
        basin,
        pos.x,
        pos.y
    );

    const disturbanceChance = (0.0001 + 0.0012 * potential) * seasonFactor;

    if(random() < disturbanceChance){
        basin.spawnArchetype(
            'monsoonLow',
            pos.x,
            pos.y
        );
    }
}

SPAWN_RULES.defaults.doSpawn = function(b){
    // tropical waves
    if(random()<0.015*sq((seasonCurve(b.tick)+1)/2)) b.spawnArchetype('tw');

    // extratropical cyclones
    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');

    // South China Sea disturbance
    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Normal Mode -- //

SPAWN_RULES[SIM_MODE_NORMAL].doSpawn = SPAWN_RULES.defaults.doSpawn;

// -- Hyper Mode -- //

SPAWN_RULES[SIM_MODE_HYPER].doSpawn = function(b){
    if(random()<(0.013*sq((seasonCurve(b.tick)+1)/2)+0.002)) b.spawnArchetype('tw');

    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');

    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Wild Mode -- //

SPAWN_RULES[SIM_MODE_WILD].archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.2,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    }
};

SPAWN_RULES[SIM_MODE_WILD].doSpawn = function(b){
    if(random()<0.015) b.spawnArchetype('tw');
    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Megablobs Mode -- //

SPAWN_RULES[SIM_MODE_MEGABLOBS].doSpawn = function(b){
    if(random()<(0.013*sq((seasonCurve(b.tick)+1)/2)+0.002)) b.spawnArchetype('tw');

    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Experimental Mode -- //

SPAWN_RULES[SIM_MODE_EXPERIMENTAL].archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.7,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0,
        kaboom: 0
    },
    'ex': {
        x: ()=>random(0,WIDTH-1),
        y: (b,x)=>b.hemY(b.env.get("jetstream",x,0,b.tick)+random(-75,75)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: EXTROP,
        organization: 0,
        lowerWarmCore: 0,
        upperWarmCore: 0,
        depth: 1,
        kaboom: 0
    },
    'tc': {
        pressure: 1005,
        windSpeed: 25,
        type: TROP,
        organization: 1,
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0,
        kaboom: 0.2
    },
    'l': {
        inherit: 'tw',
        pressure: 1015,
        windSpeed: 15,
        organization: 0.2,
        kaboom: 0.2
    },
    'x': {
        inherit: 'ex',
        pressure: 1005,
        windSpeed: 15,
        kaboom: 0.2
    }
};

SPAWN_RULES[SIM_MODE_EXPERIMENTAL].doSpawn = SPAWN_RULES[SIM_MODE_HYPER].doSpawn;

// -- Spooky Mode -- //

SPAWN_RULES[SIM_MODE_SPOOKY].doSpawn = SPAWN_RULES.defaults.doSpawn;


// ---- Definitions of Environmental Fields ---- //

const ENV_DEFS = {};

ENV_DEFS.defaults = {}; // Env field attributes that are the same across multiple simulation modes
ENV_DEFS[SIM_MODE_NORMAL] = {}; // Register env fields as part of "Normal" simulation mode and define unique attributes
ENV_DEFS[SIM_MODE_HYPER] = {}; // Same for "Hyper" simulation mode
ENV_DEFS[SIM_MODE_WILD] = {};  // "Wild" simulation mode
ENV_DEFS[SIM_MODE_MEGABLOBS] = {}; // "Megablobs" simulation mode
ENV_DEFS[SIM_MODE_EXPERIMENTAL] = {}; // "Experimental" simulation mode
ENV_DEFS[SIM_MODE_SPOOKY] = {}; // "Spooky" simulation mode

// -- Sample Env Field -- //

// ENV_DEFS.defaults.sample = {
//     version: 0,
//     mapFunc: (u,x,y,z)=>{
//         // Insert code here
//     },
//     hueMap: (v)=>{
//         // Insert code here
//     },
//     oceanic: true,
//     vector: false,
//     invisible: false,
//     magMap: undefined,
//     noWobble: false,
//     noiseChannels: [
//         [6,0.5,150,3000,0.05,1.5]
//     ]
// };
// ENV_DEFS[SIM_MODE_NORMAL].sample = {};
// ENV_DEFS[SIM_MODE_HYPER].sample = {
//     mapFunc: (u,x,y,z)=>{
//         // Insert code here
//     }
// };
// ENV_DEFS[SIM_MODE_WILD].sample = {};
// ENV_DEFS[SIM_MODE_MEGABLOBS].sample = {};
// ENV_DEFS[SIM_MODE_EXPERIMENTAL].sample = {};

// -- jetstream -- //

ENV_DEFS.defaults.jetstream = {
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0,x-z*3,0,z);
        let peakLat = u.modifiers.peakLat;
        let antiPeakLat = u.modifiers.antiPeakLat;
        let peakRange = u.modifiers.peakRange;
        let antiPeakRange = u.modifiers.antiPeakRange;
        let s = seasonCurve(z);
        let l = map(sqrt(map(s,-1,1,0,1)),0,1,antiPeakLat,peakLat);
        let r = map(s,-1,1,antiPeakRange,peakRange);
        v = map(v,0,1,-r,r);
        return (l+v)*HEIGHT;
    },
    invisible: true,
    noiseChannels: [
        [4,0.5,160,300,1,2]
    ],
    modifiers: {
        peakLat: 0.35,
        antiPeakLat: 0.55,
        peakRange: 0.35,
        antiPeakRange: 0.5
    }
};
ENV_DEFS[SIM_MODE_NORMAL].jetstream = {};
ENV_DEFS[SIM_MODE_HYPER].jetstream = {
    modifiers: {
        peakLat: 0.25,
        antiPeakLat: 0.47,
        peakRange: 0.25,
        antiPeakRange: 0.45
    }
};
ENV_DEFS[SIM_MODE_WILD].jetstream = {
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0,x-z*3,0,z);
        let s = u.yearfrac(z);
        let l = u.piecewise(s,[[1,0.65],[2.5,-0.15],[10,-0.15],[11.5,0.65]]);
        let r = u.piecewise(s,[[0.5,0.3],[1.75,0.7],[3,0.2],[9.5,0.2],[10.75,0.7],[12,0.3]]);
        v = map(v,0,1,-r,r);
        return (l+v)*HEIGHT;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].jetstream = {
    modifiers: {
        peakLat: 0.25,
        antiPeakLat: 0.47,
        peakRange: 0.25,
        antiPeakRange: 0.45
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].jetstream = {};
ENV_DEFS[SIM_MODE_SPOOKY].jetstream = {};

// -- LLSteering -- //

ENV_DEFS.defaults.LLSteering = {
    displayName: 'Low-level steering',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);    // reset vector

        // Jetstream
        let j = u.field('jetstream');
        // Cosine curve from 0 at poleward side of map to 1 at equatorward side
        let h = map(cos(map(y,0,HEIGHT,0,PI)),-1,1,1,0);
        // westerlies
        let west = constrain(pow(1-h+map(u.noise(0), 0, 1, -u.modifiers.westerlyNoiseRange, u.modifiers.westerlyNoiseRange)+map(j, 0, HEIGHT, -u.modifiers.westerlyJetstreamEffectRange, u.modifiers.westerlyJetstreamEffectRange),2)*4,0, u.modifiers.westerlyMax);
        // ridging and trades
        let ridging = constrain(u.noise(1)+map(j, 0, HEIGHT, u.modifiers.ridgingJetstreamEffectRange, -u.modifiers.ridgingJetstreamEffectRange),0,1);
        let trades = constrain(pow(h+map(ridging, 0, 1, -u.modifiers.tradesRidgingEffectRange, u.modifiers.tradesRidgingEffectRange),2)*3,0, u.modifiers.tradesMax);
        let tAngle = map(h, 0.9, 1, u.modifiers.tradesAngle, u.modifiers.tradesAngleEquator); // trades angle
        // noise angle
        let a = map(u.noise(3),0,1,0,4*TAU);
        // noise magnitude
        let m = pow(u.modifiers.noiseBase, map(u.noise(2), 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax));

        // apply to vector
        u.vec.rotate(a);
        u.vec.mult(m);
        u.vec.add(west+trades*cos(tAngle),trades*sin(tAngle));
        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    magMap: [0,3,0,16],
    noiseChannels: [
        [4,0.5,80,100,1,3],
        '',
        '',
        [4,0.5,170,300,1,3]
    ],
    modifiers: {
        westerlyNoiseRange: 0.3,
        westerlyJetstreamEffectRange: 0.4,
        westerlyMax: 4,
        ridgingJetstreamEffectRange: 0.3,
        tradesRidgingEffectRange: 0.3,
        tradesMax: 3,
        tradesAngleEquator: 17*Math.PI/16,
        tradesAngle: 511*Math.PI/512,
        noiseBase: 1.5,
        noiseExponentMin: -8,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_NORMAL].LLSteering = {};
ENV_DEFS[SIM_MODE_HYPER].LLSteering = {};
ENV_DEFS[SIM_MODE_WILD].LLSteering = {
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);    // reset vector

        let s = u.yearfrac(z);
        let wind = u.piecewise(s,[[1,3],[2.5,1],[4.5,0.5],[6,0.75],[7.5,0.65],[7.75,0.05],[8,1.1],[10,1.8],[11,3]]); // wind strength
        let windAngle = u.piecewise(s,[[1,13*PI/8],[2.5,9*PI/8],[4.5,PI],[6,17*PI/16],[7.5,17*PI/16],[8,31*PI/16],[10,15*PI/8],[11.5,13*PI/8]]); // wind angle
        // noise angle
        let a = map(u.noise(3),0,1,0,4*TAU);
        // noise magnitude
        let m = pow(u.modifiers.noiseBase, map(u.noise(2), 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax));

        // apply to vector
        u.vec.rotate(a);
        u.vec.mult(m);
        u.vec.add(wind*cos(windAngle),wind*sin(windAngle));
        return u.vec;
    },
    modifiers: {
        noiseExponentMin: -3,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].LLSteering = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].LLSteering = {};
ENV_DEFS[SIM_MODE_SPOOKY].LLSteering = {};

// -- ULSteering -- //

ENV_DEFS.defaults.ULSteering = {
    displayName: 'Upper-level steering',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);                                                                           // reset vector

        const dx = u.modifiers.jetstreamDeltaX;                                                 // delta-x for jetstream differential (used for calculating wind direction in and near jetstream)

        let m = u.noise(1);

        let s = seasonCurve(z);
        let j0 = u.field('jetstream');                                                          // y-position of jetstream
        let j1 = u.field('jetstream',x+dx);                                                     // y-position of jetstream dx to the east for differential
        let j = abs(y-j0);                                                                      // distance of point north/south of jetstream
        let jet = pow(2, 3 - j / u.modifiers.jetstreamHalfDecay);                               // power of jetstream at point
        let jOP = pow(u.modifiers.jetstreamOverpowerBase, jet);                                 // factor for how strong other variables should be if 'overpowered' by jetstream
        let jAngle = atan((j1 - j0) / dx) + map(y-j0, -50, 50, u.modifiers.jetstreamInwardAngle, -u.modifiers.jetstreamInwardAngle, true); // angle of jetstream at point
        let trof = y>j0 ? pow(u.modifiers.troughBase, map(jAngle, -PI/2, PI/2, u.modifiers.troughExponentMax, u.modifiers.troughExponentMin)) * pow(0.7,j/20)*jOP : 0; // pole-eastward push from jetstream dips
        let tAngle = u.modifiers.troughAngle;                                                   // angle of push from jetstream dips
        let ridging = 0.45-j0/HEIGHT-map(sqrt(map(s,-1,1,0,1)),0,1,0.15,0);                     // how much 'ridge' or 'trough' there is from jetstream
        // power of winds equatorward of jetstream
        let hadley = (map(ridging, -0.3, 0.2, u.modifiers.hadleyUpperBound, u.modifiers.hadleyLowerBound, true) + map(m,0,1,-1.5,1.5))*jOP*(y>j0?1:0);
        // angle of winds equatorward of jetstream
        let hAngle = map(ridging,-0.3,0.2, u.modifiers.hadleyAngleMin, u.modifiers.hadleyAngleMax,true);
        let ferrel = 2*jOP*(y<j0?1:0);                                                          // power of winds poleward of jetstream
        let fAngle = 5*PI/8;                                                                    // angle of winds poleward of jetstream

        let a = map(u.noise(0),0,1,0,4*TAU);                                                    // noise angle
        m = pow(u.modifiers.noiseBase, map(m, 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax))*jOP; // noise magnitude

        // apply noise
        u.vec.rotate(a);
        u.vec.mult(m);

        // apply UL winds
        u.vec.add(jet*cos(jAngle),jet*sin(jAngle));                                             // apply jetstream
        u.vec.add(trof*cos(tAngle),trof*sin(tAngle));                                           // apply trough push
        u.vec.add(hadley*cos(hAngle),hadley*sin(hAngle));                                       // apply winds equatorward of jetstream
        u.vec.add(ferrel*cos(fAngle),ferrel*sin(fAngle));                                       // apply winds poleward of jetstream

        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    magMap: [0,8,0,25],
    modifiers: {
        jetstreamDeltaX: 10,
        jetstreamHalfDecay: 40,
        jetstreamOverpowerBase: 0.7,
        jetstreamInwardAngle: Math.PI/4,
        troughBase: 1.7,
        troughExponentMin: -5,
        troughExponentMax: 3,
        troughAngle: -Math.PI/16,
        hadleyUpperBound: 5,
        hadleyLowerBound: 1.5,
        hadleyAngleMin: -Math.PI/16,
        hadleyAngleMax: -15*Math.PI/16,
        noiseBase: 1.5,
        noiseExponentMin: -8,
        noiseExponentMax: 4
    },
    noiseChannels: [
        [4,0.5,180,300,1,2],
        [4,0.5,90,100,1,3]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].ULSteering = {};
ENV_DEFS[SIM_MODE_HYPER].ULSteering = {
    modifiers: {
        hadleyUpperBound: 3
    }
};
ENV_DEFS[SIM_MODE_WILD].ULSteering = {
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);                                                                   // reset vector

        const dx = 10;                                                                  // delta-x for jetstream differential (used for calculating wind direction in and near jetstream)

        let m = u.noise(1);

        let s = u.yearfrac(z);
        let j0 = u.field('jetstream');                                                  // y-position of jetstream
        let j1 = u.field('jetstream',x+dx);                                             // y-position of jetstream dx to the east for differential
        let j = abs(y-j0);                                                              // distance of point north/south of jetstream
        let jet = pow(2,3-j/30);                                                        // power of jetstream at point
        let jOP = pow(0.7,jet);                                                         // factor for how strong other variables should be if 'overpowered' by jetstream
        let jAngle = atan((j1-j0)/dx)+map(y-j0,-50,50,PI/15,-PI/17,true);               // angle of jetstream at point
        // power of winds equatorward of jetstream
        let hadley = (u.piecewise(s,[[1,4.5],[2.5,1.2],[4,0.5],[4.5,1.7],[5,0.6],[6.5,0.65],[7.5,0.65],[7.75,0.05],[8,1.3],[9,1.7],[10,2.3],[11.5,4.5]]))*jOP*(y>j0?1:0);
        // angle of winds equatorward of jetstream
        let hAngle = u.piecewise(s,[[1,11*PI/8],[2.5,9*PI/8],[4,17*PI/16],[4.5,11*PI/8],[5,17*PI/16],[6.5,35*PI/32],[7.5,17*PI/16],[8,31*PI/16],[9,15*PI/8],[10,7*PI/4],[10.5,11*PI/8]]);
        let ferrel = 2*jOP*(y<j0?map(j0-y,0,400,1,0,true):0);                           // power of winds poleward of jetstream
        let fAngle = 5*PI/8;                                                            // angle of winds poleward of jetstream

        let a = map(u.noise(0),0,1,0,4*TAU);                                            // noise angle
        m = pow(u.modifiers.noiseBase, map(m, 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax))*jOP; // noise magnitude

        // apply noise
        u.vec.rotate(a);
        u.vec.mult(m);

        // apply UL winds
        u.vec.add(jet*cos(jAngle),jet*sin(jAngle));                                     // apply jetstream
        u.vec.add(hadley*cos(hAngle),hadley*sin(hAngle));                               // apply winds equatorward of jetstream
        u.vec.add(ferrel*cos(fAngle),ferrel*sin(fAngle));                               // apply winds poleward of jetstream

        return u.vec;
    },
    modifiers: {
        noiseExponentMin: -3,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].ULSteering = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].ULSteering = {};
ENV_DEFS[SIM_MODE_SPOOKY].ULSteering = {};

// -- shear -- //

ENV_DEFS.defaults.shear = {
    displayName: 'Wind shear',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let ll = u.field('LLSteering');
        let ul = u.field('ULSteering');
        u.vec.set(ul);
        u.vec.sub(ll);
        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    noVectorFlip: true,
    magMap: [0,8,0,25],
    hueMap: (v)=>{
        colorMode(HSB);
        let strong = color(0,100,80);
        let moderate = color(60,100,90);
        let weak = color(120,100,80);
        let c;
        if(v < 2)
            c = lerpColor(weak, moderate, map(v,0.5,2,0,1));
        else
            c = lerpColor(moderate, strong, map(v,2,3.5,0,1));
        colorMode(RGB);
        return c;
    }
};
ENV_DEFS[SIM_MODE_NORMAL].shear = {};
ENV_DEFS[SIM_MODE_HYPER].shear = {};
ENV_DEFS[SIM_MODE_WILD].shear = {};
ENV_DEFS[SIM_MODE_MEGABLOBS].shear = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].shear = {};
ENV_DEFS[SIM_MODE_SPOOKY].shear = {};

// -- SSTAnomaly -- //

ENV_DEFS.defaults.SSTAnomaly = {
    displayName: 'Sea surface temp. anomaly',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        v = v*2;
        let i = v<1 ? -1 : 1;
        v = 1-abs(1-v);
        if(v===0) v = 0.000001;
        v = log(v);
        let r;
        if(u.modifiers.r!==undefined) r = u.modifiers.r;
        else r = map(y,0,HEIGHT,6,3);
        v = -r*v;
        v = v*i;
        if(u.modifiers.bigBlobBase!==undefined && v>u.modifiers.bigBlobExponentThreshold) v += pow(u.modifiers.bigBlobBase,v-u.modifiers.bigBlobExponentThreshold)-1;
        return v;
    },
    displayFormat: v=>{
        let str = '';
        if(v >= 0)
            str += '+';
        str += round(v*10)/10;
        str += '\u2103'; // degrees celsius sign
        return str;
    },
    hueMap: (v)=>{
        colorMode(HSB);
        let cold = color(240,100,70);
        let hot = color(0,100,70);
        let cNeutral = color(240,1,90);
        let hNeutral = color(0,1,90);
        let c;
        if(v<0) c = lerpColor(cold,cNeutral,map(v,-5,0,0,1));
        else c = lerpColor(hNeutral,hot,map(v,0,5,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    noiseChannels: [
        [6,0.5,150,3000,0.05,1.5]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_HYPER].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_WILD].SSTAnomaly = {
    modifiers: {
        r: 5,
        bigBlobBase: 1.4,
        bigBlobExponentThreshold: 1.5
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].SSTAnomaly = {
    modifiers: {
        r: 7,
        bigBlobBase: 1.8,
        bigBlobExponentThreshold: 1
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_SPOOKY].SSTAnomaly = {};

// -- SST -- //

ENV_DEFS.defaults.SST = {
    displayName: 'Sea surface temperature',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        if(y<0) return 0;
        let anom = u.field('SSTAnomaly');
        let s = seasonCurve(z);
        let w = map(cos(map(x,0,WIDTH,0,PI)),-1,1,0,1);
        let h0 = y/HEIGHT;
        let h1 = (sqrt(h0)+h0)/2;
        let h2 = sqrt(sqrt(h0));
        let h = map(cos(lerp(PI,0,lerp(h1,h2,sq(w)))),-1,1,0,1);
        let ospt = u.modifiers.offSeasonPolarTemp;
        let pspt = u.modifiers.peakSeasonPolarTemp;
        let ostt = u.modifiers.offSeasonTropicsTemp;
        let pstt = u.modifiers.peakSeasonTropicsTemp;
        let t = lerp(map(s,-1,1,ospt,pspt),map(s,-1,1,ostt,pstt),h);
        return t+anom;
    },
    displayFormat: v=>{
        let str = '';
        str += round(v*10)/10;
        str += '\u2103'; // degrees celsius sign
        return str;
    },
    hueMap: (v)=>{
        colorMode(HSB);
        let c;
        if(v<10) c = lerpColor(color(240,1,100),color(240,100,70),map(v,0,10,0,1));
        else if(v<20) c = lerpColor(color(240,100,70),color(180,50,90),map(v,10,20,0,1));
        else if(v<26) c = lerpColor(color(180,50,90),color(120,100,65),map(v,20,26,0,1));
        else if(v<29) c = lerpColor(color(60,100,100),color(0,100,70),map(v,26,29,0,1));
        else if(v<34) c = lerpColor(color(359,100,70),color(300,5,100),map(v,29,34,0,1));
        else if(v<40) c = lerpColor(color(300,5,100),color(150,10,90),map(v,34,40,0,1));
        else if(v<50) c = lerpColor(color(150,10,90),color(150,60,75),map(v,40,50,0,1));
        else if(v<75) c = lerpColor(color(30,90,90),color(30,30,90),map(v,50,75,0,1));
        else if(v<150) c = lerpColor(color(0,0,35),color(0,0,95),map(v,75,150,0,1));
        else c = lerpColor(color(0,0,25),color(0,0,95),map(v%150,0,150,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    modifiers: {
        offSeasonPolarTemp: -3,
        peakSeasonPolarTemp: 10,
        offSeasonTropicsTemp: 26,
        peakSeasonTropicsTemp: 29
    }
};
ENV_DEFS[SIM_MODE_NORMAL].SST = {};
ENV_DEFS[SIM_MODE_HYPER].SST = {
    modifiers: {
        offSeasonPolarTemp: 5,
        peakSeasonPolarTemp: 20,
        offSeasonTropicsTemp: 31,
        peakSeasonTropicsTemp: 35
    }
};
ENV_DEFS[SIM_MODE_WILD].SST = {
    mapFunc: (u,x,y,z)=>{
        if(y<0) return 0;
        let anom = u.field('SSTAnomaly');
        let s = u.yearfrac(z);
        let t = u.piecewise(s,[[0,22],[2,25.5],[4,25],[5,26.5],[6,27],[6.25,30],[6.75,31],[7,28],[9,27],[10,26],[11,23]]);
        return t+anom;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].SST = {
    modifiers: {
        offSeasonPolarTemp: -5,
        peakSeasonPolarTemp: 20,
        offSeasonTropicsTemp: 23,
        peakSeasonTropicsTemp: 28.5
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].SST = {
    version:1,
    modifiers: {
        offSeasonPolarTemp: 20,
        peakSeasonPolarTemp: 22,
        offSeasonTropicsTemp: 26,
        peakSeasonTropicsTemp: 28
    }
};
ENV_DEFS[SIM_MODE_SPOOKY].SST = {};

// -- moisture -- //

ENV_DEFS.defaults.moisture = {
    displayName: 'Relative humidity',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        let s = seasonCurve(z);
        let l = land ? land.get(Coordinate.convertFromXY(u.basin.mapType, x, u.basin.hemY(y))) : 0;
        let pm = u.modifiers.polarMoisture;
        let tm = u.modifiers.tropicalMoisture;
        let mm = u.modifiers.mountainMoisture;
        let m = map(l,0.5,0.7,map(y,0,HEIGHT,pm,tm),mm,true);
        m += map(s,-1,1,-0.08,0.08);
        m += map(v,0,1,-0.3,0.3);
        m = constrain(m,0,1);
        return m;
    },
    displayFormat: v=>{
        return round(v*1000)/10 + '%';
    },
    hueMap: v=>{
        colorMode(HSB);
        let c;
        if(v<0.5) c = lerpColor(color(45,100,30),color(45,1,90),map(v,0,0.5,0,1));
        else c = lerpColor(color(180,1,90),color(180,100,30),map(v,0.5,1,0,1));
        colorMode(RGB);
        return c;
    },
    modifiers: {
        polarMoisture: 0.43,
        tropicalMoisture: 0.57,
        mountainMoisture: 0.2
    },
    noiseChannels: [
        [4,0.5,120,120,0.3,2]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].moisture = {};
ENV_DEFS[SIM_MODE_HYPER].moisture = {
    modifiers: {
        polarMoisture: 0.52,
        tropicalMoisture: 0.62,
        mountainMoisture: 0.3
    }
};
ENV_DEFS[SIM_MODE_WILD].moisture = {
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        let s = u.yearfrac(z);
        let l = land ? land.get(Coordinate.convertFromXY(u.basin.mapType, x, u.basin.hemY(y))) : 0;
        let om = u.piecewise(s,[
            [0.5,0.35],[2,0.55],[4,0.6],[5.75,0.58],[6,0.1],[7,0.2],[7.25,0.6],[8.5,0.72],[10,0.55],[11.5,0.35]
        ]);
        let mm = u.modifiers.mountainMoisture;
        let m = map(l,0.5,0.7,om,mm,true);
        m += map(v,0,1,-0.3,0.3);
        m = constrain(m,0,1);
        return m;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].moisture = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].moisture = {};
ENV_DEFS[SIM_MODE_SPOOKY].moisture = {};

// ---- Active Storm System Algorithm ---- //

const STORM_ALGORITHM = {};

STORM_ALGORITHM.defaults = {};
STORM_ALGORITHM[SIM_MODE_NORMAL] = {};
STORM_ALGORITHM[SIM_MODE_HYPER] = {};
STORM_ALGORITHM[SIM_MODE_WILD] = {};
STORM_ALGORITHM[SIM_MODE_MEGABLOBS] = {};
STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL] = {};
STORM_ALGORITHM[SIM_MODE_SPOOKY] = {};

// -- Interaction -- //

STORM_ALGORITHM.defaults.interactionInit = {
    fuji: true,
    shear: false,
    kill: false
};

STORM_ALGORITHM.defaults.interaction = function(sys0, sys1){
    let interactionData = {};

    let v = createVector();
    v.set(sys0.pos);
    v.sub(sys1.pos);
    let m = v.mag();
    let r = map(sys1.lowerWarmCore,0,1,150,50);
    if(m<r && m>0){
        v.rotate(sys0.basin.hem(-TAU/4+((3/m)*TAU/16)));
        v.setMag(map(m,r,0,0,map(constrain(sys1.pressure,990,1030),1030,990,0.2,2.2)));
        interactionData.fuji = v;
        interactionData.shear = map(m,r,0,0,map(sys1.pressure,1030,900,0,6));
        if((m < map(sys0.pressure,1030,1000,r/5,r/15) || m<5) && sys0.pressure > sys1.pressure)
            interactionData.kill = 1;
    }

    return interactionData;
};

// -- Steering -- //

STORM_ALGORITHM.defaults.steering = function(sys,vec,u){
    let ll = u.f("LLSteering");
    let ul = u.f("ULSteering");
    let d = sqrt(sys.depth);
    let x = lerp(ll.x,ul.x,d);       // Deeper systems follow upper-level steering more and lower-level steering less
    let y = lerp(ll.y,ul.y,d);
    vec.set(x,y);
    vec.add(sys.interaction.fuji);
};

// -- Core -- //

STORM_ALGORITHM.defaults.core = function(sys,u){
    let SST = u.f("SST");
    let jet = u.f("jetstream");
    jet = sys.basin.hemY(sys.pos.y)-jet;
    let lnd = u.land();
    let moisture = u.f("moisture");
    let shear = u.f("shear").mag()+sys.interaction.shear;
    
    let targetWarmCore = (lnd ?
        sys.lowerWarmCore :
        max(pow(map(SST,10,25,0,1,true),3),sys.lowerWarmCore)
    )*map(jet,0,75,sq(1-sys.depth),1,true);
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,targetWarmCore,sys.lowerWarmCore>targetWarmCore ? map(jet,0,75,0.4,0.06,true) : 0.04);
    sys.upperWarmCore = lerp(sys.upperWarmCore,sys.lowerWarmCore,sys.lowerWarmCore>sys.upperWarmCore ? 0.05 : 0.4);
    sys.lowerWarmCore = constrain(sys.lowerWarmCore,0,1);
    sys.upperWarmCore = constrain(sys.upperWarmCore,0,1);
    let tropicalness = constrain(map(sys.lowerWarmCore,0.5,1,0,1),0,sys.upperWarmCore);
    let nontropicalness = constrain(map(sys.lowerWarmCore,0.75,0,0,1),0,1);

    sys.organization *= 100;
    if(!lnd) sys.organization += sq(map(SST,20,29,0,1,true))*3*tropicalness;
    if(!lnd && sys.organization<40) sys.organization += lerp(0,3,nontropicalness);
    // if(lnd) sys.organization -= pow(10,map(lnd,0.5,1,-3,1));
    // if(lnd && sys.organization<70 && moisture>0.3) sys.organization += pow(5,map(moisture,0.3,0.5,-1,1,true))*tropicalness;
    sys.organization -= pow(2,4-((HEIGHT-sys.basin.hemY(sys.pos.y))/(HEIGHT*0.01)));
    sys.organization -= (pow(map(sys.depth,0,1,1.17,1.31),shear)-1)*map(sys.depth,0,1,4.7,1.2);
    sys.organization -= map(moisture,0,0.65,3,0,true)*shear;
    sys.organization += sq(map(moisture,0.6,1,0,1,true))*4;
    sys.organization -= pow(1.3,20-SST)*tropicalness;
    sys.organization = constrain(sys.organization,0,100);
    sys.organization /= 100;

    let targetPressure = 1010-25*log((lnd||SST<25)?1:map(SST,25,30,1,2))/log(1.17);
    targetPressure = lerp(1010,targetPressure,pow(sys.organization,3));
    sys.pressure = lerp(sys.pressure,targetPressure,(sys.pressure>targetPressure?0.05:0.08)*tropicalness);
    sys.pressure -= random(-3,3.5)*nontropicalness;
    if(sys.organization<0.3) sys.pressure += random(-2,2.5)*tropicalness;
    sys.pressure += random(constrain(970-sys.pressure,0,40))*nontropicalness;
    sys.pressure += 0.5*sys.interaction.shear/(1+map(sys.lowerWarmCore,0,1,4,0));
    sys.pressure += map(jet,0,75,5*pow(1-sys.depth,4),0,true);

    let targetWind = map(sys.pressure,1030,900,1,160)*map(sys.lowerWarmCore,1,0,1,0.6);
    sys.windSpeed = lerp(sys.windSpeed,targetWind,0.15);

    let targetDepth = map(
        sys.upperWarmCore,
        0,1,
        1,map(
            sys.organization,
            0,1,
            sys.depth*pow(0.95,shear),max(map(sys.pressure,1010,950,0,0.7,true),sys.depth)
        )
    );
    sys.depth = lerp(sys.depth,targetDepth,0.05);

    if(sys.genesisProgress === undefined)
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP) ? 1 : 0;

    if(sys.type === TROPWAVE || sys.type === EXTROP || sys.genesisProgress < 1){
        const g = genesisPotential(sys.basin, sys.pos.x, sys.pos.y);
        if(g > 0.48){
            sys.genesisProgress += (g - 0.48) / 14;
        }else{
            sys.genesisProgress -= (0.48 - g) / 8;
        }

        const strongPreGenesis =
            g >= 0.52 &&
            sys.windSpeed >= 30 &&
            sys.organization >= 0.50 &&
            sys.lowerWarmCore >= 0.58;

        if(strongPreGenesis){
            sys.genesisProgress = max(sys.genesisProgress, 0.85);
        }

        const decisiveGenesis =
            g >= 0.55 &&
            sys.genesisProgress >= 0.82 &&
            sys.pressure < 998 &&
            sys.windSpeed >= 34;

        if(decisiveGenesis)
            sys.genesisProgress = 1;

        sys.genesisProgress = constrain(sys.genesisProgress, 0, 1);
    }else{
        sys.genesisProgress = 1;
    }

    if(sys.type === TROPWAVE && sys.genesisProgress < 1){
        const floorPressure = map(sys.genesisProgress, 0, 1, 1005, 995);
        if(sys.pressure < floorPressure)
            sys.pressure = lerp(sys.pressure, floorPressure, 0.2);
    }

    if(sys.pressure > 1030 || sys.interaction.kill > 0)
        sys.kill = true;
};

STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].core = function(sys,u){
    let SST = u.f("SST");
    let jet = u.f("jetstream");
    jet = sys.basin.hemY(sys.pos.y)-jet;
    let lnd = u.land();
    let moisture = u.f("moisture");
    let shear = u.f("shear").mag()+sys.interaction.shear;
    
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,0,map(jet,0,75,0.07,0));
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,1,map(jet,50,100,0,map(SST,16,26,0,0.13,true),true));
    if(sys.upperWarmCore > sys.lowerWarmCore)
        sys.upperWarmCore = sys.lowerWarmCore;
    else
        sys.upperWarmCore = lerp(sys.upperWarmCore,sys.lowerWarmCore,0.015);
    sys.lowerWarmCore = constrain(sys.lowerWarmCore,0,1);
    sys.upperWarmCore = constrain(sys.upperWarmCore,0,1);
    let tropicalness = (sys.lowerWarmCore+sys.upperWarmCore)/2;

    if(!lnd)
        sys.organization = lerp(sys.organization,1,sq(tropicalness)*map(SST,21,31,0,0.05,true));
    sys.organization = lerp(sys.organization,0,pow(3,shear*(1-moisture)*2.3)*0.0005);
    if(lnd>0.7)
        sys.organization = lerp(sys.organization,0,0.03);
    sys.organization = constrain(sys.organization,0,1);

    let hardCeiling = map(SST,21,31,1015,880);
    if(lnd)
        hardCeiling = 990;
    let softCeiling = map(sys.organization,0.93,0.98,lerp(1020,hardCeiling,0.7),hardCeiling,true);
    sys.pressure = lerp(sys.pressure,1032,0.006);
    sys.pressure = lerp(sys.pressure,980,(1-tropicalness)*map(jet,0,75,0.025,0,true));
    sys.pressure = lerp(sys.pressure,softCeiling,tropicalness*sys.organization*0.03);
    if(sys.pressure<1000)
        sys.pressure = lerp(sys.pressure,1000,tropicalness*(1-sys.organization)*0.01);
    sys.pressure = lerp(sys.pressure,1040,map(sys.pos.y,HEIGHT*0.97,HEIGHT,0,0.15,true));
    sys.pressure = lerp(sys.pressure,1040,map(lnd,0.8,0.93,0,0.2,true));
    sys.pressure += random(-1,1);

    let targetWind = map(sys.pressure,1030,900,1,160)*map(sys.lowerWarmCore,1,0,1,0.6);
    sys.windSpeed = lerp(sys.windSpeed,targetWind,0.15);

    sys.depth = lerp(sys.depth,1,(1-tropicalness)*0.02);
    sys.depth = lerp(sys.depth,0,tropicalness*(1-sys.organization)*0.02);
    sys.depth = lerp(sys.depth,lnd ? 0.5 : map(SST,26,29,0.5,0.65,true),tropicalness*sys.organization*0.025);

    if(sys.genesisProgress === undefined)
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP) ? 1 : 0;

    if(sys.type === TROPWAVE || sys.type === EXTROP || sys.genesisProgress < 1){
        const g = genesisPotential(sys.basin, sys.pos.x, sys.pos.y);
        if(g > 0.48){
            sys.genesisProgress += (g - 0.48) / 14;
        }else{
            sys.genesisProgress -= (0.48 - g) / 8;
        }

        const strongPreGenesis =
            g >= 0.52 &&
            sys.windSpeed >= 30 &&
            sys.organization >= 0.50 &&
            sys.lowerWarmCore >= 0.58;

        if(strongPreGenesis){
            sys.genesisProgress = max(sys.genesisProgress, 0.85);
        }

        const decisiveGenesis =
            g >= 0.55 &&
            sys.genesisProgress >= 0.82 &&
            sys.pressure < 998 &&
            sys.windSpeed >= 34;

        if(decisiveGenesis)
            sys.genesisProgress = 1;

        sys.genesisProgress = constrain(sys.genesisProgress, 0, 1);
    }else{
        sys.genesisProgress = 1;
    }

    if(sys.type === TROPWAVE && sys.genesisProgress < 1){
        const floorPressure = map(sys.genesisProgress, 0, 1, 1005, 995);
        if(sys.pressure < floorPressure)
            sys.pressure = lerp(sys.pressure, floorPressure, 0.2);
    }

    if(sys.kaboom > 0 && sys.kaboom < 1)
        sys.kaboom = random()<sys.kaboom ? 1 : 0;

    let namedBoom = false;
    if(sys.fetchStorm()){
        let d = sys.fetchStorm().designations.primary;
        for(let i = 0; i < d.length; i++){
            if(d[i].value === 'Boom'){
                namedBoom = true;
                sys.kaboom = 2;
            }
        }
    }

    if(sys.kaboom){
        if((!lnd || namedBoom) && (sys.organization > 0.8 || sys.kaboom === 2)){
            sys.kaboom = 2;
            if(sys.pressure > 600)
                sys.pressure -= random(5,10);
            sys.organization = 1;
            sys.lowerWarmCore = 1;
            if(sys.upperWarmCore < 0.5)
                sys.upperWarmCore = 0.5;
            sys.depth = 0.8;
        }

        if(lnd && !namedBoom){
            if(sys.kaboom === 2)
                sys.kaboom = 1;
            sys.organization = 0;
        }
    }else if(random()<0.0001)
        sys.kaboom = 1;

    if(sys.pressure > 1030 || sys.interaction.kill > 0)
        sys.kill = true;
};

// -- Type Determination -- //

STORM_ALGORITHM.defaults.typeDetermination = function(sys,u){
    if(sys.genesisProgress === undefined)
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP) ? 1 : 0;

    const canForm = sys.genesisProgress >= 1 && sys.organization >= 0.45 && sys.windSpeed >= 25 && sys.lowerWarmCore >= 0.55;

    switch(sys.type){
        case TROP:
            sys.type = sys.lowerWarmCore < 0.55 ? EXTROP : ((sys.organization < 0.4 && sys.windSpeed < 50) || sys.windSpeed < 20) ? (sys.upperWarmCore < 0.56 ? EXTROP : TROPWAVE) : (sys.upperWarmCore < 0.56 ? SUBTROP : TROP);
            break;
        case SUBTROP:
            sys.type = sys.lowerWarmCore < 0.55 ? EXTROP : ((sys.organization < 0.4 && sys.windSpeed < 50) || sys.windSpeed < 20) ? (sys.upperWarmCore < 0.57 ? EXTROP : TROPWAVE) : (sys.upperWarmCore < 0.57 ? SUBTROP : TROP);
            break;
        case TROPWAVE:
            if(sys.lowerWarmCore < 0.45)
                sys.type = EXTROP;
            else if(!canForm)
                sys.type = TROPWAVE;
            else if(sys.upperWarmCore < 0.56)
                sys.type = SUBTROP;
            else
                sys.type = TROP;
            break;
        default:
            if(sys.lowerWarmCore < 0.45)
                sys.type = EXTROP;
            else if(!canForm)
                sys.type = TROPWAVE;
            else if(sys.upperWarmCore < 0.57)
                sys.type = SUBTROP;
            else
                sys.type = TROP;
    }
};

// -- Version -- //
// Version number of a simulation mode's storm algorithm
// Used for upgrading the active attribute values if needed

STORM_ALGORITHM[SIM_MODE_NORMAL].version = 2;
STORM_ALGORITHM[SIM_MODE_HYPER].version = 2;
STORM_ALGORITHM[SIM_MODE_WILD].version = 2;
STORM_ALGORITHM[SIM_MODE_MEGABLOBS].version = 2;
STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].version = 3;
STORM_ALGORITHM[SIM_MODE_SPOOKY].version = 2;

// -- Upgrade -- //
// Converts active attributes in case an active system is loaded after an algorithm change breaks old values

STORM_ALGORITHM[SIM_MODE_NORMAL].upgrade =
STORM_ALGORITHM[SIM_MODE_HYPER].upgrade =
STORM_ALGORITHM[SIM_MODE_WILD].upgrade =
STORM_ALGORITHM[SIM_MODE_MEGABLOBS].upgrade =
STORM_ALGORITHM[SIM_MODE_SPOOKY].upgrade = function(sys,data,oldVersion){
    sys.organization = data.organization || 0;
    sys.lowerWarmCore = data.lowerWarmCore || 0;
    sys.upperWarmCore = data.upperWarmCore || 0;
    sys.depth = data.depth || 0;
    if(oldVersion < 1){
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP) ? 1 : 0;
    }
    if(oldVersion < 2){
        if(sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP)
            sys.genesisProgress = 1;
        else
            sys.genesisProgress = constrain(data.genesisProgress || 0, 0, 0.85);
    }
};

STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].upgrade = function(sys,data,oldVersion){
    if(oldVersion < 1){
        sys.organization = data.organization || 0;
        sys.lowerWarmCore = data.lowerWarmCore || 0;
        sys.upperWarmCore = data.upperWarmCore || 0;
        sys.depth = data.depth || 0;
        sys.kaboom = 0;
    }
    if(oldVersion < 2){
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP) ? 1 : 0;
    }
    if(oldVersion < 3){
        if(sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP)
            sys.genesisProgress = 1;
        else
            sys.genesisProgress = constrain(data.genesisProgress || 0, 0, 0.85);
    }
};

// STORM_ALGORITHM[SIM_MODE_SPOOKY].upgrade = function(sys,data,oldVersion){

// };

// --- START OF FILE: basin.ts ---

class Basin{
    constructor(load,opts){
        if(!opts) opts = {};
        this.seasons = {};
        this.seasonsBusyLoading = {};
        this.seasonExpirationTimers = {};
        this.activeSystems = [];
        this.subBasins = {};
        this.tick = 0;
        this.lastSaved = 0;
        this.godMode = opts.godMode;
        this.SHem = opts.hem;
        this.actMode = opts.actMode || 0;
        if(SEASON_CURVE[this.actMode])
            seasonCurve = window[SEASON_CURVE[this.actMode]];
        else
            seasonCurve = window[SEASON_CURVE.default];
        if(opts.year !== undefined)
            this.startYear = opts.year;
        else if(this.SHem)
            this.startYear = SHEM_DEFAULT_YEAR;
        else
            this.startYear = NHEM_DEFAULT_YEAR;
        this.mapType = opts.mapType || 0;
        if(MAP_TYPES[this.mapType].form === 'earth'){
            this.mainSubBasin = MAP_TYPES[this.mapType].mainSubBasin;
            this.defineEarthSubBasins();
            this.subBasins[this.mainSubBasin].scale = Scale.presetScales[opts.scale || 0].clone().flavor(opts.scaleFlavor || 0);
            this.subBasins[this.mainSubBasin].setDesignationSystem(DesignationSystem.presetDesignationSystems[opts.designations || 0].clone().setSecondary(false));
        }else{
            this.mainSubBasin = DEFAULT_MAIN_SUBBASIN;
            this.addSubBasin(this.mainSubBasin,undefined,undefined,undefined,
                Scale.presetScales[opts.scale || 0].clone().flavor(opts.scaleFlavor || 0),
                DesignationSystem.presetDesignationSystems[opts.designations || 0].clone().setSecondary(false)
            );
        }
        // if(MAP_TYPES[this.mapType].special==='CPac'){
        //     this.subBasins[DEFAULT_MAIN_SUBBASIN].designationSystem.naming.crossingMode = DESIG_CROSSMODE_KEEP;
        //     this.subBasins[DEFAULT_MAIN_SUBBASIN].designationSystem.numbering.crossingMode = DESIG_CROSSMODE_KEEP;
        //     this.addSubBasin(128,undefined,'Central Pacific',DEFAULT_MAIN_SUBBASIN,undefined,
        //         DesignationSystem.centralPacific.clone().setCrossingModes(DESIG_CROSSMODE_KEEP,DESIG_CROSSMODE_KEEP)
        //     );
        // }else if(MAP_TYPES[this.mapType].special==='PAGASA'){
        //     this.addSubBasin(128,undefined,'PAGASA AoR',DEFAULT_MAIN_SUBBASIN,undefined,
        //         DesignationSystem.PAGASA.clone()
        //     );
        // }else if(MAP_TYPES[this.mapType].special==='NIO'){
        //     // this.subBasins[DEFAULT_MAIN_SUBBASIN].designationSystem.numbering.enabled = false;
        //     // this.subBasins[DEFAULT_MAIN_SUBBASIN].designationSystem.numbering.prefix = undefined;
        //     // this.subBasins[DEFAULT_MAIN_SUBBASIN].designationSystem.numbering.suffix = undefined;
        //     this.addSubBasin(128,undefined,'Arabian Sea',DEFAULT_MAIN_SUBBASIN,undefined,
        //         new DesignationSystem({
        //             prefix: 'ARB',
        //             numCross: DESIG_CROSSMODE_KEEP
        //         })
        //     );
        //     this.addSubBasin(129,undefined,'Bay of Bengal',DEFAULT_MAIN_SUBBASIN,undefined,
        //         new DesignationSystem({
        //             prefix: 'BOB',
        //             numCross: DESIG_CROSSMODE_KEEP
        //         })
        //     );
        // }else if(MAP_TYPES[this.mapType].special==='AUS'){
        //     this.subBasins[DEFAULT_MAIN_SUBBASIN].designationSystem.naming.crossingMode = DESIG_CROSSMODE_KEEP;
        //     this.subBasins[DEFAULT_MAIN_SUBBASIN].designationSystem.numbering.crossingMode = DESIG_CROSSMODE_KEEP;
        //     this.addSubBasin(128,undefined,'Jakarta TCWC',DEFAULT_MAIN_SUBBASIN,undefined,
        //         DesignationSystem.australianRegionJakarta.clone().setCrossingModes(undefined,DESIG_CROSSMODE_KEEP)
        //     );
        //     this.addSubBasin(129,undefined,'Port Moresby TCWC',DEFAULT_MAIN_SUBBASIN,undefined,
        //         DesignationSystem.australianRegionPortMoresby.clone().setCrossingModes(undefined,DESIG_CROSSMODE_KEEP)
        //     );
        // }
        this.seed = opts.seed || moment().valueOf();
        this.env = new Environment(this);
        this.saveName = load || AUTOSAVE_SAVE_NAME;
        if(load) this.initialized = this.load();
        else{
            let mapImg;
            Basin.deleteSave(AUTOSAVE_SAVE_NAME);
            let f = ()=>{
                noiseSeed(this.seed);
                this.env.init();
                land = new Land(this, mapImg);
                this.seasons[this.getSeason(-1)] = new Season(this);
                this.expireSeasonTimer(this.getSeason(-1));
                this.env.record();
            };
            if(MAP_TYPES[this.mapType].form==='pixelmap' || MAP_TYPES[this.mapType].form==='earth'){
                let path;
                if(MAP_TYPES[this.mapType].form==='earth')
                    path = EARTH_MAP_PATH;
                else
                    path = MAP_TYPES[this.mapType].path;
                this.initialized = loadImg(path).then(img=>{
                    img.loadPixels();
                    mapImg = img;
                    f();
                    return this;
                }).catch(e=>{
                    console.error('Failed to load map image, proceeding with fallback canvas:', e);
                    const {fullW: W, fullH: H} = fullDimensions();
                    mapImg = createImage(W, H);
                    mapImg.loadPixels();
                    f();
                    return this;
                });
            }else{
                f();
                this.initialized = Promise.resolve(this);
            }
        }
    }

    mount(){    // mounts the basin to the viewer
        viewTick = this.tick;
        UI.viewBasin = this;
        selectedStorm = undefined;
        paused = this.tick!==0;
        lastUpdateTimestamp = performance.now();
        refreshTracks(true);
        primaryWrapper.show();
        if(land) renderToDo = land.draw();
    }

    advanceSimOneStep(){
        let metadata = {needTrackRefresh: false, needForceTrackRefresh: false, needEnvLayerRefresh: false, needSave: false};
        let vp = this.viewingPresent();
        let os = this.getSeason(-1);
        this.tick++;
        let vs = this.getSeason(viewTick);
        viewTick = this.tick;
        let curSeason = this.getSeason(-1);
        if(curSeason!==os){
            let e = new Season(this);
            for(let s of this.activeSystems) e.addSystem(new StormRef(this,s.fetchStorm()));
            this.seasons[curSeason] = e;
            this.expireSeasonTimer(curSeason);
        }
        if(!vp || curSeason!==vs){
            metadata.needTrackRefresh = true;
            metadata.needForceTrackRefresh = curSeason!==vs;
        }
        this.env.wobble();    // random change in environment for future forecast realism
        for(let i=0;i<this.activeSystems.length;i++){   // update active storm systems
            for(let j=i+1;j<this.activeSystems.length;j++){
                this.activeSystems[i].interact(this.activeSystems[j],true);
            }
            this.activeSystems[i].update();
        }
        SPAWN_RULES[this.actMode].doSpawn(this);    // spawn new storm systems
        let stormKilled = false;
        for(let i=this.activeSystems.length-1;i>=0;i--){    // remove dead storm systems from activeSystems array
            if(!this.activeSystems[i].fetchStorm().current){
                this.activeSystems.splice(i,1);
                stormKilled = true;
            }
        }
        metadata.needTrackRefresh |= stormKilled;   // redraw tracks whenever a storm system dies
        if(this.tick % ADVISORY_TICKS === 0){   // redraw map layer and record environmental field state every advisory
            metadata.needEnvLayerRefresh = true;
            this.env.record();
        }
        let curTime = this.tickMoment();
        if(simSettings.doAutosave && (curTime.date()===1 || curTime.date()===15) && curTime.hour()===0)    // autosave at 00z on the 1st and 15th days of every month
            metadata.needSave = true;
        return metadata;
    }

    advanceSim(steps){
        if(steps === undefined)
            steps = 1;
        else if(steps === 0)
            return;
        
        const advDiff = Math.floor((this.tick + steps) / ADVISORY_TICKS) - Math.floor(this.tick / ADVISORY_TICKS);

        let needTrackRefresh = false,
            needForceTrackRefresh = false,
            needEnvLayerRefresh = false,
            needSave = false;

        for(let i = 0; i < steps; i++){
            let metadata = this.advanceSimOneStep();
            needTrackRefresh |= metadata.needTrackRefresh;
            needForceTrackRefresh |= metadata.needForceTrackRefresh;
            needEnvLayerRefresh |= metadata.needEnvLayerRefresh;
            needSave |= metadata.needSave;
        }

        if(needTrackRefresh || advDiff >= 2)
            refreshTracks(needForceTrackRefresh || advDiff >= 2);

        if(advDiff === 1){
            for(let i = 0; i < this.activeSystems.length; i++)
                this.activeSystems[i].fetchStorm().renderTrack(true);
        }

        if(needEnvLayerRefresh)
            this.env.displayLayer();
        else if(simSettings.showMagGlass)   // redraw magnifying glass if displayed (and if it wasn't already redrawn with the map layer)
            this.env.updateMagGlass();
        
        if(needSave)
            this.save();
    }

    startTime(){
        let y = this.startYear;
        let mo = moment.utc([y]);
        if(this.SHem){
            mo.month(6);
            mo.year(y-1);
        }
        return mo.valueOf();
    }

    tickMoment(t){
        if(t===undefined) t = this.tick;
        return moment.utc(this.startTime()+t*TICK_DURATION);
    }

    tickFromMoment(m){
        if(m instanceof moment) return floor((m.valueOf()-this.startTime())/TICK_DURATION);
    }

    seasonTick(n){
        if(n===undefined) n = this.getSeason(-1);
        let m = moment.utc(this.SHem ? [n-1, 6, 1] : [n, 0, 1]);
        let t = floor((m.valueOf()-this.startTime())/TICK_DURATION);
        t = floor(t/ADVISORY_TICKS)*ADVISORY_TICKS;
        return t;
    }

    viewingPresent(){
        return viewTick === this.tick;
    }

    hem(v){
        return this.SHem ? -v : v;
    }

    hemY(y){
        return this.SHem ? HEIGHT-y : y;
    }

    spawn(data){
        this.activeSystems.push(new ActiveSystem(this,data));
    }

    spawnArchetype(a,x,y){
        let data = {};
        let arch = [];
        let i = -1;
        let a1 = a;
        while(a1){
            i++;
            if(SPAWN_RULES[this.actMode].archetypes && SPAWN_RULES[this.actMode].archetypes[a1])
                arch[i] = SPAWN_RULES[this.actMode].archetypes[a1];
            else if(SPAWN_RULES.defaults.archetypes[a1])
                arch[i] = SPAWN_RULES.defaults.archetypes[a1];
            else{
                i--;
                break;
            }
            a1 = arch[i].inherit;
            if(a1 === a)
                break;
        }
        while(i >= 0){
            for(let k in arch[i]){
                if(k !== 'inherit'){
                    if(arch[i][k] instanceof Array)
                        data[k] = random(arch[i][k][0],arch[i][k][1]);
                    else
                        data[k] = arch[i][k];
                }
            }
            i--;
        }
        if(x !== undefined)
            data.x = x;
        if(y !== undefined)
            data.y = y;
        this.spawn(data);
    }

    addSubBasin(id,...args){
        id = parseInt(id);
        this.subBasins[id] = new SubBasin(this,id,...args);
    }

    subInBasin(sub){
        let s = this.subBasins[sub];
        if(s instanceof SubBasin) return !s.outBasin();
        if(sub===DEFAULT_OUTBASIN_SUBBASIN) return false;
        return true;
    }

    *forSubBasinChain(id){
        let s = this.subBasins[id];
        if(s instanceof SubBasin) yield* s.forChain();
        else{
            yield id;
            if(id!==DEFAULT_OUTBASIN_SUBBASIN) yield DEFAULT_MAIN_SUBBASIN;
        }
    }

    relevantPrimaryDesignationSubBasins(id){
        if(id !== undefined){
            let numbering;
            let naming;
            let altPre;
            let altSuf;
            for(let subId of this.forSubBasinChain(id)){
                let sb = this.subBasins[subId];
                if(sb instanceof SubBasin && sb.designationSystem){
                    let ds = sb.designationSystem;
                    if(!ds.secondary){
                        if(numbering===undefined){
                            if(ds.numbering.enabled) numbering = subId;
                            else{
                                if(ds.numbering.prefix!==undefined) altPre = ds.numbering.prefix;
                                if(ds.numbering.suffix!==undefined) altSuf = ds.numbering.suffix;
                            }
                        }
                        if(naming===undefined && ds.naming.mainLists.length>0) naming = subId;
                    }
                }
                if(numbering!==undefined && naming!==undefined) break;
            }
            return {numbering, naming, altPre, altSuf};
        }
    }

    getScale(sub){
        let scale;
        for(let subId of this.forSubBasinChain(sub)){
            let sb = this.subBasins[subId];
            if(sb instanceof SubBasin && sb.scale){
                scale = sb.scale;
                break;
            }
        }
        if(scale) return scale;
        let mainSB = this.subBasins[this.mainSubBasin];
        if(mainSB instanceof SubBasin && mainSB.scale) return mainSB.scale;
        return Scale.saffirSimpson;
    }

    getSeason(t){       // returns the year number of a season given a sim tick
        if(t===-1) t = this.tick;
        if(this.SHem){
            let tm = this.tickMoment(t);
            let m = tm.month();
            let y = tm.year();
            if(m>=6) return y+1;
            return y;
        }
        return this.tickMoment(t).year();
    }

    fetchSeason(n,isTick,loadedRequired,callback){  // returns the season object given a year number, or given a sim tick if isTick is true
        if(isTick) n = this.getSeason(n);
        let season;
        let promise;
        if(this.seasons[n]){
            season = this.seasons[n];
            promise = Promise.resolve(season);
        }else{
            if(this.seasonsBusyLoading[n]) promise = this.seasonsBusyLoading[n];
            else{
                promise = this.seasonsBusyLoading[n] = waitForAsyncProcess(()=>{
                    return db.seasons.where('[saveName+season]').equals([this.saveName,n]).last().then(res=>{
                        if(res){
                            let d = LoadData.wrap(res);
                            let seas = this.seasons[n] = new Season(this,d);
                            this.expireSeasonTimer(n);
                            this.seasonsBusyLoading[n] = undefined;
                            seas.lastAccessed = moment().valueOf();
                            return seas;
                        }else return undefined;
                    });
                },'Retrieving Season...');
            }
        }
        if(season) season.lastAccessed = moment().valueOf();
        else if(loadedRequired) throw new Error(LOADED_SEASON_REQUIRED_ERROR);
        if(callback instanceof Function) promise.then(callback);
        else if(callback) return promise;
        return season;
    }

    seasonUnloadable(n){
        n = parseInt(n);
        if(!this.seasons[n]) return false;
        let s = this.seasons[n];
        let v = this.getSeason(viewTick);
        for(let a of this.activeSystems) if(a.fetchStorm().originSeason()===n) return false;
        return !s.modified && n!==v && n!==v-1 && n!==this.getSeason(-1);
    }
    
    expireSeasonTimer(n){
        let f = ()=>{
            if(this.seasons[n]){
                if(moment().diff(this.seasons[n].lastAccessed)>=LOADED_SEASON_EXPIRATION && this.seasonUnloadable(n)) this.seasons[n] = undefined;
                else this.expireSeasonTimer(n);
            }
        };
        this.seasonExpirationTimers[n] = setTimeout(f,LOADED_SEASON_EXPIRATION);
    }

    // hard-coded definition of earth map sub-basins (could use a data-driven approach but this codebase is now beyond forsaken so why bother)
    defineEarthSubBasins(){
        const ids = EARTH_SB_IDS;
        this.addSubBasin(ids.world, undefined, 'World');
        this.addSubBasin(ids.nhem, undefined, 'Northern Hemisphere', ids.world);
        this.addSubBasin(ids.shem, undefined, 'Southern Hemisphere', ids.world);
        this.addSubBasin(ids.atl, undefined, 'Atlantic', ids.nhem,
            Scale.saffirSimpson.clone(),
            DesignationSystem.atlantic.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.atlland, undefined, 'Atl Land (technical)', ids.atl);
        this.addSubBasin(ids.epac, undefined, 'Eastern Pacific', ids.nhem,
            Scale.saffirSimpson.clone(),
            DesignationSystem.easternPacific.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.epacland, undefined, 'EPac Land (technical)', ids.epac);
        this.addSubBasin(ids.cpac, undefined, 'Central Pacific', ids.epac,
            undefined,
            DesignationSystem.centralPacific.clone().setCrossingModes(DESIG_CROSSMODE_KEEP, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.wpac, undefined, 'Western Pacific', ids.nhem,
            Scale.JMA.clone(),
            DesignationSystem.westernPacific.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.pagasa, undefined, 'PAGASA AoR', ids.wpac,
            undefined,
            DesignationSystem.PAGASA.clone()
            );
        this.addSubBasin(ids.nio, undefined, 'North Indian Ocean', ids.nhem,
            Scale.IMD.clone(),
            DesignationSystem.northIndianOcean.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.bob, undefined, 'Bay of Bengal', ids.nio,
            undefined,
            new DesignationSystem({
                prefix: 'BOB ',
                numCross: DESIG_CROSSMODE_KEEP
            })
            );
        this.addSubBasin(ids.arb, undefined, 'Arabian Sea', ids.nio,
            undefined,
            new DesignationSystem({
                prefix: 'ARB ',
                numCross: DESIG_CROSSMODE_KEEP
            })
            );
        this.addSubBasin(ids.nioland, undefined, 'LAND (NIO)', ids.nio,
            undefined,
            new DesignationSystem({
                prefix: 'LAND ',
                numCross: DESIG_CROSSMODE_KEEP
            })
            );
        this.addSubBasin(ids.medi, undefined, 'Mediterranean Sea', ids.nhem,
            undefined,
            DesignationSystem.mediterranean.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.aus, undefined, 'Australian Region', ids.shem,
            Scale.australian.clone(),
            DesignationSystem.australianRegionBoM.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.jakarta, undefined, 'TCWC Jakarta AoR', ids.aus,
            undefined,
            DesignationSystem.australianRegionJakarta.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.pm, undefined, 'TCWC Port Moresby AoR', ids.aus,
            undefined,
            DesignationSystem.australianRegionPortMoresby.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.swio, undefined, 'South-West Indian Ocean', ids.shem,
            Scale.southwestIndianOcean.clone(),
            DesignationSystem.southWestIndianOcean.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.spac, undefined, 'South Pacific', ids.shem,
            Scale.australian.clone(),
            DesignationSystem.southPacific.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
        this.addSubBasin(ids.satl, undefined, 'South Atlantic', ids.shem,
            undefined,
            DesignationSystem.southAtlantic.clone().setCrossingModes(undefined, DESIG_CROSSMODE_KEEP)
            );
    }

    save(){
        let reqSeasons = [];
        for(let k in this.seasons){
            if(this.seasons[k] && this.seasons[k].modified){
                let seas = this.seasons[k];
                for(let i=0;i<seas.systems.length;i++){
                    if(seas.systems[i] instanceof StormRef){
                        reqSeasons.push(this.fetchSeason(seas.systems[i].season,false,false,true));
                    }
                }
            }
        }
        return Promise.all(reqSeasons).then(()=>{
            let obj = {};
            obj.format = SAVE_FORMAT;
            let b = obj.value = {};
            b.activeSystems = [];
            for(let a of this.activeSystems){
                b.activeSystems.push(a.save());
            }
            b.envData = {};
            for(let f of this.env.fieldList){
                let fd = b.envData[f] = {};
                fd.version = this.env.fields[f].version;
                fd.accurateAfter = this.env.fields[f].accurateAfter;
                let d = fd.noiseData = [];
                for(let c of this.env.fields[f].noise){
                    d.push(c.save());
                }
            }
            b.subBasins = {};
            for(let i in this.subBasins){
                let s = this.subBasins[i];
                if(s instanceof SubBasin) b.subBasins[i] = s.save();
            }
            b.flags = 0;
            b.flags |= 0;   // former hyper mode
            b.flags <<= 1;
            b.flags |= this.godMode;
            b.flags <<= 1;
            b.flags |= this.SHem;
            for(let p of [
                'mapType',
                'tick',
                'seed',
                'startYear',
                'actMode'
            ]) b[p] = this[p];
            return db.transaction('rw',db.saves,db.seasons,()=>{
                db.saves.put(obj,this.saveName);
                for(let k in this.seasons){
                    if(this.seasons[k] && this.seasons[k].modified){
                        let seas = {};
                        seas.format = SAVE_FORMAT;
                        seas.saveName = this.saveName;
                        seas.season = parseInt(k);
                        seas.value = this.seasons[k].save();
                        let cur = db.seasons.where('[saveName+season]').equals([this.saveName,seas.season]);
                        cur.count().then(c=>{
                            if(c>1){
                                cur.delete().then(()=>{
                                    db.seasons.put(seas);
                                });
                            }else if(c===1) cur.modify((s,ref)=>{
                                ref.value = seas;
                            });
                            else db.seasons.put(seas);
                        });
                    }
                }
            }).then(()=>{
                this.lastSaved = this.tick;
                for(let k in this.seasons){
                    if(this.seasons[k]) this.seasons[k].modified = false;
                }
            });
        }).catch(e=>{
            console.warn("Could not save due to an error");
            console.error(e);
        });
    }

    load(){
        return waitForAsyncProcess(()=>{
            let mapImg;
            return db.saves.get(this.saveName).then(res=>{
                if(res && res.format>=EARLIEST_COMPATIBLE_FORMAT){
                    let data = LoadData.wrap(res);
                    let oldhyper;
                    let envData;
                    let oldNameList;
                    let oldSeqNameIndex;
                    let oldHypoCats;
                    let oldHurricaneStrengthTerm;
                    if(data.format>=FORMAT_WITH_INDEXEDDB){
                        let obj = data.value;
                        let flags = obj.flags;
                        this.SHem = flags & 1;
                        flags >>= 1;
                        this.godMode = flags & 1;
                        flags >>= 1;
                        oldhyper = flags & 1;
                        this.actMode = obj.actMode;
                        if(this.actMode === undefined){
                            if(oldhyper)
                                this.actMode = SIM_MODE_HYPER;
                            else
                                this.actMode = SIM_MODE_NORMAL;
                        }
                        this.mapType = obj.mapType;
                        for(let a of obj.activeSystems){
                            this.activeSystems.push(new ActiveSystem(this,data.sub(a)));
                        }
                        envData = data.sub(obj.envData);
                        if(obj.subBasins){
                            for(let i in obj.subBasins){
                                let s = obj.subBasins[i];
                                if(typeof s === "object") this.addSubBasin(i,data.sub(s));
                            }
                        }
                        for(let p of [
                            'tick',
                            'seed',
                            'startYear'
                        ]) this[p] = obj[p];
                        if(obj.nameList) oldNameList = obj.nameList;
                        if(obj.sequentialNameIndex!==undefined) oldSeqNameIndex = obj.sequentialNameIndex;
                        if(obj.hypoCats) oldHypoCats = obj.hypoCats;
                        if(obj.hurricaneStrengthTerm!==undefined) oldHurricaneStrengthTerm = obj.hurricaneStrengthTerm;
                        this.lastSaved = this.tick;
                    }else{  // localstorage format backwards compatibility
                        let str = data.value.str;
                        let format = data.format;
                        let names = data.value.names;
                        if(str){
                            let parts = str.split(";");
                            let arr = decodeB36StringArray(parts.pop());
                            let flags = arr.pop() || 0;
                            this.startYear = arr.pop();
                            this.seed = arr.pop() || moment().valueOf();
                            this.lastSaved = this.tick = arr.pop() || 0;
                            oldSeqNameIndex = arr.pop();
                            oldHurricaneStrengthTerm = arr.pop() || 0;
                            this.mapType = arr.pop() || 0;
                            this.SHem = flags & 1;
                            flags >>= 1;
                            this.godMode = flags & 1;
                            flags >>= 1;
                            oldhyper = flags & 1;
                            if(oldhyper)
                                this.actMode = SIM_MODE_HYPER;
                            else
                                this.actMode = SIM_MODE_NORMAL;
                            if(this.startYear===undefined) this.startYear = this.SHem ? SHEM_DEFAULT_YEAR : NHEM_DEFAULT_YEAR;
                            if(names){
                                names = names.split(";");
                                if(names[0].indexOf(",")>-1){
                                    for(let i=0;i<names.length;i++){
                                        names[i] = names[i].split(",");
                                    }
                                    if(names[0][0]==="") names[0].shift();
                                }
                                oldNameList = names;
                            }
                            if(oldSeqNameIndex===undefined) oldSeqNameIndex = typeof oldNameList[0] === "string" ? 0 : -1;
                            let envLoadData = parts.pop();
                            if(envLoadData) envData = data.sub(envLoadData.split(','));
                            let activeSystemData = parts.pop();
                            if(activeSystemData){
                                activeSystemData = activeSystemData.split(",");
                                while(activeSystemData.length>0) this.activeSystems.push(new ActiveSystem(this,data.sub(activeSystemData.pop())));
                            }
                            if(format<FORMAT_WITH_SAVED_SEASONS) this.lastSaved = this.tick = 0; // resets tick to 0 in basins test-saved in versions prior to full saving including seasons added
                        }
                    }
                    if(MAP_TYPES[this.mapType].form === 'earth'){
                        this.mainSubBasin = MAP_TYPES[this.mapType].mainSubBasin;
                        if(data.format < FORMAT_WITH_EARTH_SUBBASINS){
                            let loadedSubBasins = this.subBasins;
                            this.subBasins = {};
                            this.defineEarthSubBasins();
                            for(let [oldId, newId] of updateEarthSubBasinIds(this.mapType)){
                                if(loadedSubBasins[oldId]){
                                    let sb = this.subBasins[newId];
                                    sb.setDesignationSystem(loadedSubBasins[oldId].designationSystem);
                                    sb.scale = loadedSubBasins[oldId].scale;
                                }
                            }
                        }
                    }
                    this.env.init(envData);
                    if(SEASON_CURVE[this.actMode])
                        seasonCurve = window[SEASON_CURVE[this.actMode]];
                    else
                        seasonCurve = window[SEASON_CURVE.default];
                    if(oldNameList){
                        let desSys = DesignationSystem.convertFromOldNameList(oldNameList);
                        if(!desSys.naming.annual)
                            desSys.naming.continuousNameIndex = oldSeqNameIndex;
                        if(!this.subBasins[this.mainSubBasin])
                            this.addSubBasin(this.mainSubBasin);
                        let sb = this.subBasins[this.mainSubBasin];
                        if(sb instanceof SubBasin)
                            sb.setDesignationSystem(desSys);
                    }
                    if(data.format<FORMAT_WITH_SCALES){
                        if(!this.subBasins[this.mainSubBasin])
                            this.addSubBasin(this.mainSubBasin);
                        let sb = this.subBasins[this.mainSubBasin];
                        if(sb instanceof SubBasin){
                            if(oldHypoCats) sb.scale = Scale.extendedSaffirSimpson.clone();
                            else sb.scale = Scale.saffirSimpson.clone();
                            if(oldHurricaneStrengthTerm!==undefined) sb.scale.flavor(oldHurricaneStrengthTerm===0 ? 2 : oldHurricaneStrengthTerm-1);
                        }
                    }
                }else{
                    let t = 'Could not load basin';
                    console.error(t);
                    alert(t);
                }
                return this;
            }).then(b=>{
                if(MAP_TYPES[b.mapType].form === 'pixelmap' || MAP_TYPES[b.mapType].form === 'earth'){
                    let path;
                    if(MAP_TYPES[b.mapType].form === 'earth')
                        path = EARTH_MAP_PATH;
                    else
                        path = MAP_TYPES[b.mapType].path;
                    return loadImg(path).then(img=>{
                        img.loadPixels();
                        mapImg = img;
                        return b;
                    });
                }
                return b;
            }).then(b=>{
                noiseSeed(b.seed);
                land = new Land(b, mapImg);
                return b.fetchSeason(-1,true,false,true).then(s=>{
                    let arr = [];
                    for(let i=0;i<s.systems.length;i++){
                        let r = s.systems[i];
                        if(r instanceof StormRef && (r.lastApplicableAt===undefined || r.lastApplicableAt>=b.tick || simSettings.trackMode===2)){
                            arr.push(b.fetchSeason(r.season,false,false,true));
                        }
                    }
                    return Promise.all(arr);
                });
            }).then(()=>this);
        },'Loading Basin...').catch(e=>{
            console.error(e);
        });
    }

    saveAs(newName){
        let oldName = this.saveName;
        return Basin.deleteSave(newName,()=>{
            return db.transaction('rw',db.saves,db.seasons,()=>{
                db.saves.get(oldName).then(res=>{
                    db.saves.put(res,newName);
                });
                db.seasons.where('saveName').equals(oldName).modify(v=>{
                    db.seasons.put({
                        format: v.format,
                        saveName: newName,
                        season: v.season,
                        value: v.value
                    });
                });
            }).then(()=>{
                this.saveName = newName;
                this.save();
            });
        });
    }

    static deleteSave(name,callback){
        return db.transaction('rw',db.saves,db.seasons,()=>{
            db.saves.delete(name);
            db.seasons.where('saveName').equals(name).delete();
        }).then(callback).catch(e=>{
            console.error(e);
        });
    }
}

class Season{
    constructor(basin,loaddata){
        if(basin instanceof Basin) this.basin = basin;
        this.systems = [];
        this.envData = {};
        this.idSystemCache = {};
        this.subBasinStats = {};
        this.totalSystemCount = 0;
        // this.envRecordStarts = 0;
        this.modified = true;
        this.lastAccessed = moment().valueOf();
        if(loaddata instanceof LoadData) this.load(loaddata);
    }

    addSystem(s){
        this.systems.push(s);
        if(s.current) s.id = this.totalSystemCount++;
        this.modified = true;
    }

    fetchSystemById(id){
        if(this.idSystemCache[id]) return this.idSystemCache[id];
        for(let i=0;i<this.systems.length;i++){
            let s = this.systems[i];
            if(s.id===id){
                this.idSystemCache[id] = s;
                return s;
            }
        }
        return null;
    }

    fetchSystemAtIndex(i,lazy){
        if(this.systems[i] instanceof StormRef){
            if(lazy){
                let r = this.systems[i];
                if(r.lastApplicableAt===undefined || r.lastApplicableAt>=viewTick || simSettings.trackMode===2) return r.fetch();
                return undefined;
            }else return this.systems[i].fetch();
        }
        return this.systems[i];
    }

    *forSystems(lazy){
        for(let i=0;i<this.systems.length;i++){
            let s = this.fetchSystemAtIndex(i,lazy);
            if(s) yield s;
        }
    }

    stats(sub){
        let s = this.subBasinStats[sub];
        if(s instanceof SeasonStats) return s;
        let n = this.subBasinStats[sub] = new SeasonStats(this.basin,sub);
        return n;
    }

    get_season_year(){
        // bad hacky way at getting the season year
        for(let y in this.basin.seasons){
            if(this.basin.seasons[y] === this)
                return +y;
        }
    }

    save(forceStormRefs){
        let basin = this.basin;
        let val = {};
        // for(let p of [
        //     'totalSystemCount',
        //     'envRecordStarts'
        // ]) val[p] = this[p];
        val.totalSystemCount = this.totalSystemCount;
        val.stats = {};
        for(let sub in this.subBasinStats){
            let s = this.subBasinStats[sub];
            if(s instanceof SeasonStats) val.stats[sub] = s.save();
        }
        val.envData = {};
        for(let f of basin.env.fieldList){
            let fd = val.envData[f] = {};
            for(let i=0;i<basin.env.fields[f].noise.length;i++){
                let nd = fd[i] = {};
                let x = [];
                let y = [];
                let z = [];
                for(let e of this.envData[f][i].val){
                    x.push(e.x);
                    y.push(e.y);
                    z.push(e.z);
                }
                nd.x = new Float32Array(x);
                nd.y = new Float32Array(y);
                nd.z = new Float32Array(z);
                nd.recordStart = this.envData[f][i].recordStart;
            }
        }
        val.systems = [];
        for(let i=0;i<this.systems.length;i++){
            let s = this.systems[i];
            if(s instanceof StormRef && (forceStormRefs || s.fetch() && (s.fetch().inBasinTC || s.fetch().current))){
                val.systems.push({isRef:true,val:s.save()});
            }else if(s.inBasinTC || s.current){
                val.systems.push({isRef:false,val:s.save()});
            }
        }
        return val;
    }

    load(data){
        let basin = this.basin;
        if(data instanceof LoadData && data.format >= EARLIEST_COMPATIBLE_FORMAT && data.format <= SAVE_FORMAT){
            let oldStats = {};
            if(data.format>=FORMAT_WITH_INDEXEDDB){
                let obj = data.value;
                // for(let p of [
                //     'totalSystemCount',
                //     'envRecordStarts'
                // ]) this[p] = obj[p] || 0;
                this.totalSystemCount = obj.totalSystemCount || 0;
                if(data.format<FORMAT_WITH_SUBBASIN_SEASON_STATS){
                    for(let p of [
                        'depressions',
                        'namedStorms',
                        'hurricanes',
                        'majors',
                        'c5s',
                        'c8s',
                        'hypercanes',
                        'ACE',
                        'deaths',
                        'damage',
                        'landfalls'
                    ]) oldStats[p] = obj[p];
                }
                if(obj.stats){
                    if(data.format >= FORMAT_WITH_EARTH_SUBBASINS || MAP_TYPES[basin.mapType].form !== 'earth'){
                        for(let sub in obj.stats)
                            this.subBasinStats[sub] = new SeasonStats(basin, sub, data.sub(obj.stats[sub]));
                    }else{
                        for(let [oldSub, newSub] of updateEarthSubBasinIds(basin.mapType)){
                            if(obj.stats[oldSub])
                                this.subBasinStats[newSub] = new SeasonStats(basin, newSub, data.sub(obj.stats[oldSub]));
                        }
                    }
                }
                if(data.format>ENVDATA_COMPATIBLE_FORMAT && obj.envData){
                    for(let f of basin.env.fieldList){
                        if(obj.envData[f]){
                            let fd = this.envData[f] = {};
                            for(let i=0;i<basin.env.fields[f].noise.length;i++){
                                if(obj.envData[f][i]){
                                    fd[i] = {};
                                    let nd = fd[i].val = [];
                                    let sd = obj.envData[f][i];
                                    fd[i].recordStart = sd.recordStart || obj.envRecordStarts || 0;
                                    let x = [...sd.x];
                                    let y = [...sd.y];
                                    let z = [...sd.z];
                                    for(let j=0;j<x.length;j++){
                                        nd.push({
                                            x: x[j],
                                            y: y[j],
                                            z: z[j]
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                for(let i=0;i<obj.systems.length;i++){
                    let s = obj.systems[i];
                    if(s.isRef) this.systems.push(new StormRef(basin,data.sub(s.val)));
                    else{
                        let v = data.sub(s.val);
                        v.season = data.season;
                        this.systems.push(new Storm(basin,v));
                    }
                }
            }else{  // localstorage format backwards compatibility
                let str = data.value;
                let mainparts = str.split(";");
                let stats = decodeB36StringArray(mainparts[0]);
                data.format = stats.pop();
                if(data.format===undefined){
                    this.envData = null;
                    return;
                }
                let envRecordStarts = stats.pop() || 0;
                oldStats.damage = stats.pop()*DAMAGE_DIVISOR || 0;
                oldStats.deaths = stats.pop() || 0;
                oldStats.ACE = stats.pop()/ACE_DIVISOR || 0;
                oldStats.c5s = stats.pop() || 0;
                oldStats.majors = stats.pop() || 0;
                oldStats.hurricanes = stats.pop() || 0;
                oldStats.namedStorms = stats.pop() || 0;
                oldStats.depressions = stats.pop() || 0;
                this.totalSystemCount = stats.pop() || 0;
                if(data.format>=ENVDATA_COMPATIBLE_FORMAT && mainparts[1]!==""){
                    let e = mainparts[1].split(",");
                    let i = 0;
                    let mapR = r=>n=>map(n,0,ENVDATA_SAVE_MULT,-r,r);
                    for(let f of basin.env.fieldList){
                        for(let j=0;j<basin.env.fields[f].noise.length;j++,i++){
                            let c = basin.env.fields[f].noise[j];
                            let s = e[i].split(".");
                            let k = decodeB36StringArray(s[0]);
                            k = {x:k[0],y:k[1],z:k[2]};
                            let opts = {};
                            opts.h = opts.w = ENVDATA_SAVE_MULT;
                            let xyrange = (c.wobbleMax/c.zoom)*ADVISORY_TICKS;
                            let zrange = (c.zWobbleMax/c.zZoom)*ADVISORY_TICKS;
                            opts.mapY = opts.mapX = mapR(xyrange);
                            opts.mapZ = mapR(zrange);
                            let m = decodePointArray(s[1],opts);
                            for(let n=0;n<m.length;n++){
                                let p1;
                                if(n===0) p1 = k;
                                else p1 = m[n-1];
                                let p2 = m[n];
                                m[n] = {
                                    x: p1.x + p2.x,
                                    y: p1.y + p2.y,
                                    z: p1.z + p2.z
                                };
                            }
                            m.unshift(k);
                            if(!this.envData[f]) this.envData[f] = {};
                            this.envData[f][j] = {recordStart: envRecordStarts, val: m};
                        }
                    }
                }else this.envData = null;
                let storms = mainparts[2];
                for(let i=0,i1=0;i1<storms.length;i=i1){
                    i1 = storms.slice(i+1).search(/[~,]/g);
                    i1 = i1<0 ? storms.length : i+1+i1;
                    let s = storms.slice(i,i1);
                    if(s.charAt(0)==="~") this.systems.push(new StormRef(basin,data.sub(s.slice(1))));
                    else if(s.charAt(0)===","){
                        let v = data.sub(s.slice(1));
                        v.season = data.season;
                        this.systems.push(new Storm(basin,v));
                    }
                }
            }
            if(data.format<FORMAT_WITH_SUBBASIN_SEASON_STATS){
                let s = this.stats(this.basin.mainSubBasin);
                for(let p of [
                    'ACE',
                    'deaths',
                    'damage',
                    'landfalls'
                ]) s[p] = oldStats[p] || 0;
                let cCounters = s.classificationCounters;
                cCounters[0] = oldStats.depressions || 0;
                cCounters[1] = oldStats.namedStorms || 0;
                cCounters[2] = oldStats.hurricanes || 0;
                cCounters[4] = oldStats.majors || 0;
                cCounters[7] = oldStats.c5s || 0;
                if(basin.getScale(this.basin.mainSubBasin).classifications.length>8){
                    cCounters[10] = oldStats.c8s || 0;
                    cCounters[13] = oldStats.hypercanes || 0;
                }
                let dCounters = s.designationCounters;
                dCounters.number = oldStats.depressions || 0;
                dCounters.name = oldStats.namedStorms || 0;
            }
            for(let s in this.subBasinStats)
                this.subBasinStats[s].update_most_intense(this);
            if(data.format===SAVE_FORMAT) this.modified = false;
            /* else if(simSettings.doAutosave){
                db.transaction('rw',db.seasons,()=>{
                    let seas = {};
                    seas.format = SAVE_FORMAT;
                    seas.saveName = data.saveName;
                    seas.season = data.season;
                    seas.value = this.save(true);
                    let cur = db.seasons.where('[saveName+season]').equals([data.saveName,data.season]);
                    cur.count().then(c=>{
                        if(c>0) cur.modify((s,ref)=>{
                            ref.value = seas;
                        });
                        else db.seasons.put(seas);
                    });
                }).then(()=>{
                    this.modified = false;
                }).catch(e=>{
                    console.error(e);
                });
            } */
        }else this.envData = null;
    }
}

class SeasonStats{
    constructor(basin,sub,data){
        this.basin = basin instanceof Basin && basin;
        this.subBasinId = sub;
        if(this.basin) this.subBasin = this.basin.subBasins[this.subBasinId];

        this.ACE = 0;
        this.deaths = 0;
        this.damage = 0;
        this.landfalls = 0;

        this.classificationCounters = {};       // counters for systems by classification on the sub-basin's scale (e.g. tropical depression, tropical storm, etc.)
        let clsns = this.basin.getScale(this.subBasinId).classifications.length;
        for(let i=0;i<clsns;i++) this.classificationCounters[i] = 0;

        this.designationCounters = {};
        this.designationCounters.number = 0;    // counter for numerical designations
        this.designationCounters.name = 0;      // counter for annual-based name designations

        this.most_intense = undefined;

        if(data instanceof LoadData) this.load(data);
    }

    addACE(v){
        this.ACE = round((this.ACE + v) * ACE_DIVISOR) / ACE_DIVISOR;
    }

    update_most_intense(season, storm, data){
        if(this.most_intense === undefined){
            let lowest_pressure;
            let record_holder;
            let year = season.get_season_year();
            for(let s of season.forSystems()){
                if(s.inBasinTC){
                    for(let i = 0; i < s.record.length; i++){
                        let d = s.record[i];
                        let in_subbasin = false;
                        let in_year = this.basin.getSeason(s.get_tick_from_record_index(i)) === year;
                        for(let sbid of this.basin.forSubBasinChain(land.getSubBasin(d.coord()))){
                            if(sbid === +this.subBasinId)
                                in_subbasin = true;
                        }
                        if(in_subbasin && in_year && tropOrSub(d.type) && (lowest_pressure === undefined || d.pressure < lowest_pressure)){
                            lowest_pressure = d.pressure;
                            record_holder = s;
                        }
                    }
                }
            }
            if(record_holder)
                this.most_intense = new StormRef(this.basin, record_holder);
        }
        if(storm && data){
            if(this.most_intense instanceof StormRef){
                let most_intense_storm = this.most_intense.fetch();
                if(!most_intense_storm || !most_intense_storm.peak || data.pressure < most_intense_storm.peak.pressure)
                    this.most_intense = new StormRef(this.basin, storm);
            }else
                this.most_intense = new StormRef(this.basin, storm);
        }
    }

    save(){
        let d = {};
        if(this.subBasin instanceof SubBasin ? !this.subBasin.outBasin() : this.subBasinId!==DEFAULT_OUTBASIN_SUBBASIN){
            for(let p of [
                'ACE',
                'deaths',
                'damage',
                'landfalls'
            ]) d[p] = this[p];
            d.cCounters = {};
            for(let i in this.classificationCounters) d.cCounters[i] = this.classificationCounters[i];
            if(this.most_intense)
                d.most_intense = this.most_intense.save();
        }
        d.dCounters = {};
        d.dCounters.number = this.designationCounters.number;
        d.dCounters.name = this.designationCounters.name;
        return d;
    }

    load(data){
        if(data instanceof LoadData){
            let d = data.value;
            if(this.subBasin instanceof SubBasin ? !this.subBasin.outBasin() : this.subBasinId!==DEFAULT_OUTBASIN_SUBBASIN){
                for(let p of [
                    'ACE',
                    'deaths',
                    'damage',
                    'landfalls'
                ]) this[p] = d[p];
                if(d.cCounters){
                    for(let i in d.cCounters){
                        if(data.format>=FORMAT_WITH_SCALES) this.classificationCounters[i] = d.cCounters[i];
                        else{   // convert pre-v0.2 values
                            this.classificationCounters[Scale.convertOldValue(+i)] = d.cCounters[i];
                            if(i==='5') this.classificationCounters['6'] = d.cCounters[i];
                        }
                    }
                }
                if(d.most_intense)
                    this.most_intense = new StormRef(this.basin, data.sub(d.most_intense));
            }
            if(d.dCounters){
                this.designationCounters.number = d.dCounters.number;
                this.designationCounters.name = d.dCounters.name;
            }
        }
    }
}

class SubBasin{
    constructor(basin,id,data,dName,parent,scale,desSys){
        this.basin = basin instanceof Basin && basin;
        this.id = id || DEFAULT_MAIN_SUBBASIN;
        this.parent = undefined;
        if(parent) this.parent = parent;
        else if(this.id!==DEFAULT_MAIN_SUBBASIN && this.id!==DEFAULT_OUTBASIN_SUBBASIN && parent!==false) this.parent = DEFAULT_MAIN_SUBBASIN;
        this.displayName = undefined;
        if(dName) this.displayName = dName;
        this.designationSystem = undefined;
        this.scale = undefined;
        this.setDesignationSystem(desSys);
        if(scale instanceof Scale) this.scale = scale;
        this.mapOutline = undefined;
        if(!this.outBasin() && this.id!==DEFAULT_MAIN_SUBBASIN){
            let {fullW, fullH} = fullDimensions();
            this.mapOutline = createBuffer(fullW, fullH, true);
            this.mapOutline.noStroke();
        }
        if(data instanceof LoadData) this.load(data);
    }

    setDesignationSystem(ds){
        if(ds instanceof DesignationSystem){
            ds.setSubBasin(this);
            this.designationSystem = ds;
        }
    }

    outBasin(origin){
        if(this.id===this.basin.mainSubBasin) return false;
        if(this.parent===this.basin.mainSubBasin) return false;
        if(this.parent===undefined) return true;
        if(this.parent===origin) return true;
        let p = this.basin.subBasins[this.parent];
        if(p instanceof SubBasin) return p.outBasin(origin || this.id);
        if(this.parent===DEFAULT_OUTBASIN_SUBBASIN) return true;
        return false;
    }

    getDisplayName(){
        if(this.displayName) return this.displayName;
        if(this.id===DEFAULT_MAIN_SUBBASIN) return 'Main Basin';
        return 'SubBasin ' + this.id;
    }

    *forParents(origin){
        if(this.id!==DEFAULT_MAIN_SUBBASIN && this.parent!==undefined && this.parent!==origin){
            yield this.parent;
            if(this.parent!==DEFAULT_MAIN_SUBBASIN){
                let p = this.basin.subBasins[this.parent];
                if(p instanceof SubBasin) yield* p.forParents(origin || this.id);
                else if(this.parent!==DEFAULT_OUTBASIN_SUBBASIN) yield DEFAULT_MAIN_SUBBASIN;
            }
        }
    }

    *forChain(){
        yield this.id;
        yield* this.forParents();
    }

    save(){
        let d = {};
        for(let p of [
            'parent',
            'displayName'
        ]) d[p] = this[p];
        d.desSys = undefined;
        d.scale = undefined;
        if(this.designationSystem instanceof DesignationSystem) d.desSys = this.designationSystem.save();
        if(this.scale instanceof Scale) d.scale = this.scale.save();
        return d;
    }

    load(data){
        if(data instanceof LoadData){
            let d = data.value;
            for(let p of [
                'parent',
                'displayName'
            ]) this[p] = d[p];
            if(d.desSys) this.setDesignationSystem(new DesignationSystem(data.sub(d.desSys)));
            if(d.scale) this.scale = new Scale(data.sub(d.scale));
        }
    }
}

// saving/loading helpers

function setupDatabase(){
    db = new Dexie("cyclone-sim");
    db.version(1).stores({
        saves: '',
        seasons: '++,saveName,season',
        settings: ''
    });
    db.version(2).stores({
        saves: ',format',
        seasons: '++,format,saveName,[saveName+season]'
    });
}

class LoadData{
    constructor(format,value){
        this.format = format;
        this.value = value;
    }

    sub(v){
        return new LoadData(this.format,v);
    }

    static wrap(obj){
        let d = new LoadData(obj.format,obj.value);
        for(let k in obj){
            if(k!=='format' && k!=='value') d[k] = obj[k];
        }
        return d;
    }
}

// legacy localstorage decoders (for backwards compatibility)

function decodeB36StringArray(str){
    const R = SAVING_RADIX;
    let arr = [];
    let fl = str.slice(0,1);
    fl = parseInt(fl,R);
    if(fl>R/2) fl -= R;
    for(let i=1,runLen=0,run=0,nLen;i<str.length;i+=nLen,run++){
        if(run>=runLen){
            runLen = str.slice(i,++i);
            nLen = str.slice(i,++i);
            runLen = parseInt(runLen,R)+1;
            nLen = parseInt(nLen,R)+1;
            run = 0;
        }
        let n = str.slice(i,i+nLen);
        n = parseInt(n,R);
        n = n%2===0 ? n/2 : -(n-1)/2;
        n *= pow(R,fl);
        arr.push(n);
    }
    return arr;
}

function decodePoint(n,o){
    if(!o) o = {};
    let w = floor(o.w || WIDTH);
    let h = floor(o.h || HEIGHT);
    let z = floor(n/(w*h));
    n %= w*h;
    let y = floor(n/w);
    n %= w;
    let x = n;
    if(o.mapX instanceof Function) x = o.mapX(x);
    if(o.mapY instanceof Function) y = o.mapY(y);
    if(o.mapZ instanceof Function) z = o.mapZ(z);
    if(o.p5Vec) return createVector(x,y,z);
    return {x,y,z};
}

function decodePointArray(s,o){
    let arr = decodeB36StringArray(s);
    for(let i=0;i<arr.length;i++){
        arr[i] = decodePoint(arr[i],o);
    }
    return arr;
}

// earth sub-basin id converter (for pre-v0.4 saves)

function* updateEarthSubBasinIds(mapType){
    if(MAP_TYPES[mapType].form === 'earth'){
        const ids = EARTH_SB_IDS;
        yield [0, MAP_TYPES[mapType].mainSubBasin]; // main (sub-)basin
        // hardcoded conversion of special sub-basin ids by map type
        if(mapType === 7) // Eastern Pacific
            yield [128, ids.cpac];
        else if(mapType === 8) // Western Pacific
            yield [128, ids.pagasa];
        else if(mapType === 9){ // North Indian Ocean
            yield [128, ids.arb];
            yield [129, ids.bob];
        }else if(mapType === 10){ // Australian Region
            yield [128, ids.jakarta];
            yield [129, ids.pm];
        }
    }
}

// --- START OF FILE: designations.ts ---

class Designation{
    constructor(value,tick,sub){
        this.num = undefined;
        if(value instanceof Array){
            let n;
            if(value.length>2){
                n = value[1];
                value[1] = zeroPad(n,2);
            }else{
                n = value[0];
                value[0] = zeroPad(n,2);
            }
            this.value = value.join('');
            if(typeof n === 'number') this.num = n;
        }else this.value = value;
        this.effectiveTicks = [tick];
        this.hideTicks = [];
        this.subBasin = sub || 0;
        if(this.value instanceof LoadData) this.load(this.value);
    }

    isName(){
        if(this.num===undefined) return true;
    }

    truncate(){
        if(this.isName()){
            return ({
                'Alpha':'\u03B1',
                'Beta':'\u03B2',
                'Gamma':'\u03B3',
                'Delta':'\u03B4',
                'Epsilon':'\u03B5',
                'Zeta':'\u03B6',
                'Eta':'\u03B7',
                'Theta':'\u03B8',
                'Iota':'\u03B9',
                'Kappa':'\u03BA',
                'Lambda':'\u03BB',
                'Mu':'\u03BC',
                'Nu':'\u03BD',
                'Xi':'\u03BE',
                'Omicron':'\u03BF',
                'Pi':'\u03C0',
                'Rho':'\u03C1',
                'Sigma':'\u03C3',
                'Tau':'\u03C4',
                'Upsilon':'\u03C5',
                'Phi':'\u03C6',
                'Chi':'\u03C7',
                'Psi':'\u03C8',
                'Omega':'\u03C9'
            })[this.value] || this.value.slice(0,1);
        }else return this.num + '';
    }
    
    activeAt(t){
        let e;
        let h;
        for(let i=0;i<this.effectiveTicks.length;i++){
            let n = this.effectiveTicks[i];
            if(t>=n && (!e || n>e)) e = n;
        }
        for(let i=0;i<this.hideTicks.length;i++){
            let n = this.hideTicks[i];
            if(t>=n && (!h || n>h)) h = n;
        }
        if(e && (!h || e>h)) return e;
        return false;
    }

    hide(t){
        if(typeof t === 'number') this.hideTicks.push(t);
    }

    show(t){
        if(typeof t === 'number') this.effectiveTicks.push(t);
    }

    save(){
        let o = {};
        for(let p of [
            'value',
            'num',
            'effectiveTicks',
            'hideTicks',
            'subBasin'
        ]) o[p] = this[p];
        return o;
    }

    load(data){
        if(data instanceof LoadData){
            let o = data.value;
            for(let p of [
                'value',
                'num',
                'subBasin'
            ]) this[p] = o[p];
            for(let p of [
                'effectiveTicks',
                'hideTicks'
            ]) if(o[p]) this[p] = o[p];
            if(o.effectiveTick) this.effectiveTicks.push(o.effectiveTick);
        }
    }
}

class DesignationSystem{
    constructor(data){
        let opts;
        if(data && !(data instanceof LoadData)) opts = data;
        else opts = {};
        this.subBasin = undefined;
        this.displayName = opts.displayName;
        // if designations should be secondary instead of primary
        this.secondary = opts.secondary;
        this.numbering = {};
        // set to false to disable numbering (prefixes and suffixes may still be used for numbered designations from a parent sub-basin)
        this.numbering.enabled = opts.numEnable===undefined ? true : opts.numEnable;
        // a prefix for numbered designations (e.g. "BOB" and "ARB")
        this.numbering.prefix = undefined;
        if(opts.prefix!==undefined) this.numbering.prefix = opts.prefix;
        else if(this.numbering.enabled) this.numbering.prefix = '';
        // a suffix for numbered designations (e.g. "L" and "E")
        this.numbering.suffix = undefined;
        if(opts.suffix!==undefined) this.numbering.suffix = opts.suffix;
        else if(this.numbering.enabled){
            if(opts.prefix!==undefined) this.numbering.suffix = '';
            else this.numbering.suffix = DEPRESSION_LETTER;
        }
        // scale category threshold for numbering a system (overrides Scale.numberingThreshold)
        this.numbering.threshold = opts.numThresh;
        // behavior for primary designations of basin-crossing systems [may need more testing]
        // 0 = always redesignate (use previous designation from this sub-basin if exists)
        // 1 = strictly redesignate (use new designation even if a previous one from this sub-basin exists)
        // 2 = redesignate regenerating systmes (keep designations of systems that retain TC status through the crossing; use previous designation if applicable)
        // 3 = strictly redesignate regenerating systems (always use new designation for regenerating systems even if previous one exists)
        // 4 = never redesignate (keep designations regardless of retaining TC status)
        this.numbering.crossingMode = opts.numCross===undefined ? DESIG_CROSSMODE_ALWAYS : opts.numCross;
        this.naming = {};
        // main name lists to be used
        this.naming.mainLists = [];
        if(opts.mainLists instanceof Array) this.naming.mainLists = opts.mainLists;
        // auxiliary lists to be used if the main list for a year is exhausted (only applicable to annual naming)
        this.naming.auxiliaryLists = [];
        if(opts.auxLists instanceof Array) this.naming.auxiliaryLists = opts.auxLists;
        // lists to be used for automatic replacement of names on other lists [To Be Implemented]
        this.naming.replacementLists = [];
        if(opts.repLists instanceof Array) this.naming.replacementLists = opts.repLists;
        // whether naming should be annual (Atl/EPac/SWIO/PAGASA) or continuous (WPac/CPac/Aus/etc.)
        this.naming.annual = opts.annual;
        // the year to anchor the cycle of annual lists to (this year will use the #0 (first) name list)
        this.naming.annualAnchorYear = opts.anchor===undefined ? 1979 : opts.anchor;
        // counter for continuous name assignment (only applicable to continuous naming)
        this.naming.continuousNameIndex = opts.indexOffset || 0;
        // scale category threshold for naming a system (overrides Scale.namingThreshold)
        this.naming.threshold = opts.nameThresh;
        // behavior for primary designations of basin-crossing systems (see above)
        this.naming.crossingMode = opts.nameCross===undefined ? DESIG_CROSSMODE_STRICT_REGEN : opts.nameCross;
        if(data instanceof LoadData) this.load(data);
    }

    setSubBasin(sb){
        if(sb instanceof SubBasin) this.subBasin = sb;
    }

    addMainLists(...lists){
        for(let l of lists){
            if(l instanceof Array){
                this.naming.mainLists.push(l);
            }
        }
        return this;
    }

    addAuxiliaryLists(...lists){
        for(let l of lists){
            if(l instanceof Array){
                this.naming.auxiliaryLists.push(l);
            }
        }
        return this;
    }

    addReplacementLists(...lists){
        for(let l of lists){
            if(l instanceof Array){
                this.naming.replacementLists.push(l);
            }
        }
        return this;
    }

    setSecondary(v){
        this.secondary = !!v;
        return this;
    }

    setCrossingModes(numCM,nameCM){
        if(numCM !== undefined) this.numbering.crossingMode = numCM;
        if(nameCM !== undefined) this.naming.crossingMode = nameCM;
        return this;
    }

    setThresholds(numThresh,nameThresh){
        if(numThresh !== undefined) this.numbering.threshold = numThresh;
        if(nameThresh !== undefined) this.naming.threshold = nameThresh;
        return this;
    }

    setContinuousNameIndex(i){
        if(i !== undefined) this.naming.continuousNameIndex = i;
        return this;
    }

    getName(tick,year,index){
        if(this.naming.mainLists.length<1) return undefined;
        if(tick===undefined && this.subBasin) tick = this.subBasin.basin.tick;
        let name;
        if(this.naming.annual){
            if(year===undefined && this.subBasin) year = this.subBasin.basin.getSeason(tick);
            let y = year - this.naming.annualAnchorYear;
            let m = this.naming.mainLists;
            let numOfLists = m.length;
            let i = (y%numOfLists+numOfLists)%numOfLists;
            let l = m[i];
            if(index===undefined) index = 0;
            if(index>=l.length){
                index -= l.length;
                m = this.naming.auxiliaryLists;
                i = 0;
                let sum = 0;
                while(i<m.length && index-sum >= m[i].length){
                    sum += m[i].length;
                    i++;
                }
                if(i>=m.length) return undefined;
                index -= sum;
                name = m[i][index];
            }else name = l[index];
        }else{
            if(index===undefined) index = 0;
            let m = this.naming.mainLists;
            let i = 0;
            let sum = 0;
            while(i<m.length && index-sum >= m[i].length){
                sum += m[i].length;
                i++;
            }
            if(i>=m.length){
                index = 0;
                i = 0;
            }else index -= sum;
            name = m[i][index];
        }
        return new Designation(name,tick,this.subBasin ? this.subBasin.id : 0);
    }

    getNewName(){
        if(this.subBasin){
            let sb = this.subBasin;
            let basin = sb.basin;
            let t = basin.tick;
            let y = basin.getSeason(t);
            let season = basin.fetchSeason(y,false,true);
            let i;
            if(this.naming.annual) i = season.stats(sb.id).designationCounters.name++;
            else{
                i = this.naming.continuousNameIndex++;
                let totalLength = 0;
                for(let l of this.naming.mainLists) totalLength += l.length;
                if(this.naming.continuousNameIndex>=totalLength) this.naming.continuousNameIndex = 0;
            }
            return this.getName(t,y,i);
        }
        return undefined;
    }

    getNum(tick,index,altPre,altSuf){
        let pre = this.numbering.prefix;
        let suf = this.numbering.suffix;
        if(altPre!==undefined) pre = altPre;
        if(altSuf!==undefined) suf = altSuf;
        let num = [pre,index,suf];
        return new Designation(num,tick,this.subBasin ? this.subBasin.id : 0);
    }

    getNewNum(altPre,altSuf){
        if(this.subBasin){
            let sb = this.subBasin;
            let basin = sb.basin;
            let t = basin.tick;
            let season = basin.fetchSeason(t,true,true);
            let i = ++season.stats(sb.id).designationCounters.number; // prefix increment because numbering starts at 01
            let numDesig = this.getNum(t,i,altPre,altSuf);
            return numDesig;
        }
        return undefined;
    }

    clone(){
        let newDS = new DesignationSystem();
        newDS.secondary = this.secondary;
        newDS.displayName = this.displayName;
        let numg = this.numbering;
        let namg = this.naming;
        let Numg = newDS.numbering;
        let Namg = newDS.naming;
        for(let p of [
            'enabled',
            'prefix',
            'suffix',
            'threshold',
            'crossingMode'
        ]) Numg[p] = numg[p];
        for(let p of [
            'annual',
            'annualAnchorYear',
            'continuousNameIndex',
            'threshold',
            'crossingMode'
        ]) Namg[p] = namg[p];
        for(let p of [
            'mainLists',
            'auxiliaryLists',
            'replacementLists'
        ]) Namg[p] = JSON.parse(JSON.stringify(namg[p]));
        return newDS;
    }

    save(){
        let d = {};
        d.secondary = this.secondary;
        d.displayName = this.displayName;
        let numg = d.numbering = {};
        let namg = d.naming = {};
        let Numg = this.numbering;
        let Namg = this.naming;
        for(let p of [
            'enabled',
            'prefix',
            'suffix',
            'threshold',
            'crossingMode'
        ]) numg[p] = Numg[p];
        for(let p of [
            'mainLists',
            'auxiliaryLists',
            'replacementLists',
            'annual',
            'annualAnchorYear',
            'continuousNameIndex',
            'threshold',
            'crossingMode'
        ]) namg[p] = Namg[p];
        return d;
    }

    load(data){
        if(data instanceof LoadData){
            let d = data.value;
            this.secondary = d.secondary;
            this.displayName = d.displayName;
            let Numg = this.numbering;
            let Namg = this.naming;
            let numg = d.numbering;
            let namg = d.naming;
            for(let p of [
                'enabled',
                'prefix',
                'suffix',
                'threshold'
            ]) Numg[p] = numg[p];
            Numg.crossingMode = numg.crossingMode || 0;
            for(let p of [
                'mainLists',
                'auxiliaryLists',
                'replacementLists',
                'annual',
                'annualAnchorYear',
                'continuousNameIndex',
                'threshold'
            ]) Namg[p] = namg[p];
            Namg.crossingMode = namg.crossingMode===undefined ? DESIG_CROSSMODE_STRICT_REGEN : namg.crossingMode;
            for(let i=Namg.auxiliaryLists.length-1;i>=0;i--){
                let a = Namg.auxiliaryLists[i];
                if(a.length===1 && a[0]==="Unnamed") Namg.auxiliaryLists.splice(i,1);
            }
            if(data.format<FORMAT_WITH_SCALES){ // convert thresholds from pre-v0.2 values
                Numg.threshold = Scale.convertOldValue(Numg.threshold);
                Namg.threshold = Scale.convertOldValue(Namg.threshold);
            }
        }
    }

    static convertFromOldNameList(list){
        let annual = list[0] instanceof Array;
        let main = [];
        let aux = [];
        if(annual){
            for(let i=0;i<list.length-1;i++) main.push(JSON.parse(JSON.stringify(list[i])));
            let auxlist = list[list.length-1];
            if(auxlist && auxlist[0]!=="Unnamed") aux.push(JSON.parse(JSON.stringify(auxlist)));
        }else main.push(JSON.parse(JSON.stringify(list)));
        return new DesignationSystem({
            mainLists: main,
            auxLists: aux,
            annual: annual
        });
    }
}

DesignationSystem.atlantic = new DesignationSystem({
    displayName: 'Atlantic',
    suffix: 'L',
    annual: true,
    anchor: 1979,
    mainLists: [
        ['Ana','Bill','Claudette','Danny','Elsa','Fred','Grace','Henri','Imani','Julian','Kate','Larry','Mindy','Nicholas','Odette','Peter','Rose','Sam','Teresa','Victor','Wanda'],
        ['Alex','Bonnie','Colin','Danielle','Earl','Farrah','Gaston','Hermine','Idris','Julia','Karl','Lisa','Martin','Nicole','Owen','Paula','Richard','Shary','Tobias','Virginie','Walter'],
        ['Arlene','Bret','Cindy','Don','Emily','Franklin','Gert','Harold','Idalia','Jose','Katia','Lee','Margot','Nigel','Ophelia','Philippe','Rina','Sean','Tammy','Vince','Whitney'],
        ['Alberto','Beryl','Chris','Debby','Ernesto','Francine','Gordon','Helene','Isaac','Joyce','Kirk','Leslie','Milton','Nadine','Oscar','Patty','Rafael','Sara','Tony','Valerie','William'],
        ['Andrea','Barry','Chantal','Dexter','Erin','Fernand','Gabrielle','Humberto','Imelda','Jerry','Karen','Lorenzo','Melissa','Nestor','Olga','Pablo','Rebekah','Sebastien','Tanya','Van','Wendy'],
        ['Arthur','Bertha','Cristobal','Dolly','Edouard','Fay','Gonzalo','Hanna','Isaias','Josephine','Kyle','Leah','Marco','Nana','Omar','Paulette','Rene','Sally','Teddy','Vicky','Wilfred']
    ],
    auxLists: [
        ["Adria", "Braylen", "Caridad", "Deshawn", "Emery", "Foster", "Gemma", "Heath", "Isla", "Jacobus", "Kenzie", "Lucio", "Makayla", "Nolan", "Orlanda", "Pax", "Ronin", "Sophie", "Tayshaun", "Viviana", "Will"]
    ]
});

DesignationSystem.easternPacific = new DesignationSystem({
    displayName: 'Eastern Pacific',
    suffix: 'E',
    annual: true,
    anchor: 1979,
    mainLists: [
        ["Andres","Blanca","Carlos","Dolores","Enrique","Felicia","Guillermo","Hilda","Ignacio","Jimena","Kevin","Linda","Marty","Nora","Olaf","Pamela","Rick","Sandra","Terry","Vivian","Waldo","Xina","York","Zelda"],
        ["Agatha","Blas","Celia","Darby","Estelle","Frank","Georgette","Howard","Ivette","Javier","Kay","Lester","Madeline","Newton","Orlene","Paine","Roslyn","Seymour","Tina","Virgil","Winifred","Xavier","Yolanda","Zeke"],
        ["Adrian","Beatriz","Calvin","Debora","Eugene","Fernanda","Greg","Hilary","Irwin","Jova","Kenneth","Lidia","Max","Norma","Otilio","Pilar","Ramon","Selma","Todd","Veronica","Wiley","Xina","York","Zelda"],
        ["Aletta","Bud","Carlotta","Daniel","Emilia","Fabio","Gilma","Hector","Ileana","John","Kristy","Lane","Miriam","Norman","Olivia","Paul","Rosa","Sergio","Tara","Vicente","Willa","Xavier","Yolanda","Zeke"],
        ["Alvin","Barbara","Cosme","Dalila","Erick","Flossie","Gil","Henriette","Ivo","Juliette","Kiko","Lorena","Mario","Narda","Octave","Priscilla","Raymond","Sonia","Tico","Velma","Wallis","Xina","York","Zelda"],
        ["Amanda","Boris","Cristina","Douglas","Elida","Fausto","Genevieve","Hernan","Iselle","Julio","Karina","Lowell","Marie","Norbert","Odalys","Polo","Rachel","Simon","Trudy","Vance","Winnie","Xavier","Yolanda","Zeke"]
    ],
    auxLists: [
        ["Aidan", "Bruna", "Carmelo", "Daniella", "Esteban", "Flor", "Gerardo", "Hedda", "Izzy", "Jacinta", "Kenito", "Luna", "Marina", "Nancy", "Ovidio", "Pia", "Rey", "Skylar", "Teo", "Violeta", "Wilfredo", "Xinia", "Yariel", "Zoe"]
    ]
});

DesignationSystem.centralPacific = new DesignationSystem({
    displayName: 'Central Pacific',
    suffix: 'C',
    mainLists: [
        ["Akoni","Ema","Hone","Iona","Keli","Lala","Moke","Nolo","Olana","Pena","Ulana","Wale"],
        ["Aka","Ekeka","Hene","Iolana","Keoni","Lino","Mele","Nona","Oliwa","Pama","Upana","Wene"],
        ["Alika","Ele","Huko","Iopa","Kika","Lana","Maka","Neki","Omeka","Pewa","Unala","Wali"],
        ["Ana","Ela","Halola","Iune","Kilo","Loke","Malia","Niala","Oho","Pali","Ulika","Walaka"]
    ]
});

DesignationSystem.westernPacific = new DesignationSystem({
    displayName: 'Western Pacific',
    suffix: 'W',
    mainLists: [    // names marked with empty comments are retired and will be replaced when replacement names are announced
        ["Damrey","Haikui"/**/,"Kirogi","Yun-yeung","Koinu","Bolaven","Sanba","Jelawat","Ewiniar","Maliksi","Gaemi","Prapiroon","Maria","Son-Tinh","Ampil","Wukong","Jongdari","Shanshan","Yagi","Leepi","Bebinca","Pulasan","Soulik","Cimaron","Jebi","Krathon","Barijat","Trami"],
        ["Kong-rey","Yinxing","Toraji","Man-yi","Usagi","Pabuk","Wutip","Sepat","Mun","Danas","Nari","Wipha","Francisco","Co-May","Krosa","Bailu","Podul","Lingling","Kajiki","Nongfa","Peipah","Tapah","Mitag","Ragasa","Neoguri","Bualoi","Matmo","Halong"],
        ["Nakri","Fengshen","Kalmaegi","Fung-wong","Koto","Nokaen","Penha","Nuri","Sinlaku","Hagupit","Jangmi","Mekkhala","Higos","Bavi","Maysak","Haishen","Noul","Dolphin","Kujira","Chan-hom","Peilou","Nangka","Saudel","Narra","Gaenari","Atsani","Etau","Bang-lang"],
        ["Krovanh","Dujuan","Surigae","Choi-wan","Koguma","Champi","In-fa","Cempaka","Nepartak","Lupit","Mirinae","Nida","Omais","Luc-binh","Chanthu","Dianmu","Mindulle","Lionrock","Tokei","Namtheun","Malou","Nyatoh","Sarbul","Amuyao","Gosari","Chaba","Aere","Songda"],
        ["Trases","Mulan","Meari","Tsing-ma","Tokage","Ong-mang","Muifa","Merbok","Nanmadol","Talas","Hodu","Kulap","Roke","Sonca","Nesat","Haitang","Jamjari","Banyan","Yamaneko","Pakhar","Sanvu","Mawar","Guchol","Talim","Doksuri"/**/,"Khanun","Lan","Saola"/**/]
    ]
});

DesignationSystem.PAGASA = new DesignationSystem({
    displayName: 'PAGASA',
    secondary: true,
    numEnable: false,
    annual: true,
    anchor: 2001,
    nameThresh: 0,
    mainLists: [
        ["Auring","Bising","Crising","Dante","Emong","Fabian","Gorio","Huaning","Isang","Jacinto","Kiko","Lannie","Mirasol","Nando","Opong","Paolo","Quedan","Ramil","Salome","Tino","Uwan","Verbena","Wilma","Yasmin","Zoraida","Alamid","Bruno","Conching","Dolor","Ernie","Florante","Gerardo","Hernan","Isko","Jerome"],
        ["Ada","Basyang","Caloy","Domeng","Ester","Francisco","Gardo","Henry","Inday","Josie","Kiyapo","Luis","Maymay","Neneng","Obet","Pilandok","Queenie","Rosal","Samuel","Tomas","Umberto","Venus","Waldo","Yayang","Zeny","Agila","Bagwis","Chito","Diego","Elena","Felino","Gunding","Harriet","Indang","Jessa"],
        ["Amang","Betty","Chedeng","Dodong","Egay","Falcon","Goring","Hanna","Ineng","Jenny","Kabayan","Liwayway","Marilyn","Nimfa","Onyok","Perla","Quiel","Ramon","Sarah","Tamaraw","Ugong","Viring","Weng","Yoyoy","Zigzag","Abe","Berto","Charo","Dado","Estoy","Felion","Gening","Herman","Irma","Jaime"],
        ["Aghon","Butchoy","Carina","Dindo","Enteng","Ferdie","Gener","Helen","Igme","Julian","Kristine","Leon","Marce","Nika","Ofel","Pepito","Querubin","Romina","Siony","Tonyo","Upang","Vicky","Warren","Yoyong","Zosimo","Alakdan","Baldo","Clara","Dencio","Estong","Felipe","Gomer","Heling","Ismael","Julio"]
    ]
});

DesignationSystem.australianRegionBoM = new DesignationSystem({
    displayName: 'Australian Region (BoM)',
    suffix: 'U',
    mainLists: [
        ["Anika","Billy","Charlotte","Darian","Ellie","Freddy"/* to be replaced */,"Gemm","Herman","Isabella","Jasper","Kirrily","Lincoln","Megan","Neville","Olga","Paul","Robyn","Sean","Taliah","Vince","Zelia"],
        ["Anthony","Bianca","Courtney","Dianne","Errol","Fina","Grant","Hayley","Iggy","Jenna","Koji","Luana","Mitchell","Narelle","Oran","Peta","Riordan","Sandra","Tim","Victoria","Zane"],
        ["Alessia","Bruce","Catherine","Dylan","Edna","Fletcher","Gillian","Hadi","Ivana","Jack","Kate","Laszlo","Mingzhu","Nathan","Oriana","Quincey","Raquel","Stan","Tatiana","Uriah","Yvette"],
        ["Alfred","Blanche","Caleb","Dara","Ernie","Frances","Greg","Hilda","Irving","Joyce","Kelvin","Linda","Marco","Nora","Owen","Penny","Riley","Savannah","Trung","Verity","Wallace"],
        ["Amber","Blake","Claudia","Declan","Esther","Ferdinand","Gretel","Heath","Imogen","Joshua","Kimi","Lucas","Marian","Niran","Odette","Paddy","Ruby","Stafford","Tiffany","Vernon"]
    ]
});

DesignationSystem.australianRegionJakarta = new DesignationSystem({
    displayName: 'Australian Region (Jakarta)',
    numEnable: false,
    mainLists: [
        ['Anggrek','Bakung','Cempaka','Dahlia','Flamboyan','Kenanga','Lili','Melati','Rambutan','Teratai']
    ],
    replacementLists: [
        ['Anggur','Belimbing','Duku','Jambu','Lengkeng','Manggis','Nangka','Pepaya','Terong','Sawo']
    ]
});

DesignationSystem.australianRegionPortMoresby = new DesignationSystem({
    displayName: 'Australian Region (Port Moresby)',
    numEnable: false,
    mainLists: [
        ['Alu','Buri','Dodo','Emau','Fere','Hibu','Ila','Kama','Lobu','Maila']
    ],
    replacementLists: [
        ['Nou','Obaha','Paia','Ranu','Sabi','Tau','Ume','Vali','Wau','Auram']
    ]
});

DesignationSystem.northIndianOcean = new DesignationSystem({
    displayName: 'North Indian Ocean',
    numEnable: false,
    mainLists: [
        ['Onil','Agni','Hibaru','Pyarr','Baaz','Fanoos','Mala','Mukda'],
        ['Ogni','Akash','Gonu','Yemyin','Sidr','Nargis','Rashmi','Khai-Muk'],
        ['Nisha','Bijli','Aila','Phyan','Ward','Laila','Bandu','Phet'],
        ['Giri','Jal','Keila','Thane','Murjan','Nilam','Viyaru','Phailin'],
        ['Helen','Lehar','Madi','Nanauk','Hudhud','Nilofar','Ashobaa','Komen'],
        ['Chapala','Megh','Roanu','Kyant','Nada','Vardah','Maarutha','Mora'],
        ['Ockhi','Sagar','Mekunu','Daye','Luban','Titli','Gaja','Phethai'],
        ['Fani','Vayu','Hikaa','Kyarr','Maha','Bulbul','Pawan','Amphan'],
        ['Nisarga','Gati','Nivar','Burevi','Tauktae','Yaas','Gulab','Shaheen','Jawad','Asani','Sitrang','Mandous','Mocha'],
        ['Biparjoy','Tej','Hamoon','Midhili','Michaung','Remal','Asna','Dana','Fengal','Shakhti','Montha','Senyar','Ditwah'],
        ['Arnab','Murasu','Akvan','Kaani','Ngamann','Sail','Sahab','Lulu','Ghazeer','Gigum','Thianyot','Afoor','Diksam'],
        ['Upakul','Aag','Sepand','Odi','Kyarthit','Naseem','Afshan','Mouj','Asif','Gagana','Bulan','Nahhaam','Sira'],
        ['Barshon','Vyom','Booran','Kenau','Sapakyee','Muzn','Manahil','Suhail','Sidrah','Verambha','Phutala','Quffal','Bakhur'],
        ['Rajani','Jhar','Anahita','Endheri','Wetwun','Sadeem','Shujana','Sadaf','Hareed','Garjana','Aiyara','Daaman','Ghwyzi'],
        ['Nishith','Probaho','Azar','Riyau','Mwaihout','Dima','Parwaz','Reem','Faid','Neeba','Saming','Deem','Hawf'],
        ['Urmi','Neer','Pooyan','Guruva','Kywe','Manjour','Zannata','Rayhan','Kaseer','Ninnada','Kraison','Gargoor','Balhaf'],
        ['Meghala','Prabhanjan','Arsham','Kurangi','Pinku','Rukam','Sarsar','Anbar','Nakheel','Viduli','Matcha','Khubb','Brom'],
        ['Samiron','Ghurni','Hengame','Kuredhi','Yinkaung','Watad','Badban','Oud','Haboob','Ogha','Mahingsa','Degl','Shuqra'],
        ['Pratikul','Ambud','Savas','Horangu','Linyone','Al-jarz','Sarrab','Bahar','Bareq','Salitha','Phraewa','Athmad','Fartak'],
        ['Sarobor','Jaladhi','Tahamtan','Thundi','Kyeekan','Rabab','Gulnar','Seef','Alreem','Rivi','Asuri','Boom','Darsah'],
        ['Mahanisha','Vega','Toofan','Faana','Bautphat','Raad','Waseq','Fanar','Wabil','Rudu','Thara','Saffar','Samhah']
    ]
});

DesignationSystem.southWestIndianOcean = new DesignationSystem({
    displayName: 'Southwest Indian Ocean',
    suffix: 'R',
    annual: true,
    anchor: 2017,
    mainLists: [
        ['Awo','Blossom','Chenge','Dudzai','Ewetse','Fyita','Gezani','Horacio','Indusa','Juluka','Kundai','Lisebo','Michel','Nousra','Olivier','Pokera','Quincy','Rebaone','Salama','Tristan','Ursula','Violet','Wilson','Xila','Yekela','Zaina'],
        ['Alvaro','Belal','Candice','Djoungou','Eleanor','Filipo','Gamane','Hidaya','Ialy','Jeremy','Kanga','Ludzi','Melina','Noah','Onias','Pelagie','Quamar','Rita','Solani','Tarik','Urilia','Vuyane','Wagner','Xusa','Yarona','Zacarias'],
        ['Ancha','Bheki','Chido','Dikeledi','Elvis','Faida','Garance','Honde','Ivone','Jude','Kanto','Lira','Maipelo','Njazi','Oscar','Pamela','Quentin','Rajab','Savana','Themba','Uyapo','Viviane','Walter','Xangy','Yemurai','Zanele']
    ]
});

DesignationSystem.southPacific = new DesignationSystem({
    displayName: 'South Pacific',
    suffix: 'F',
    mainLists: [
        ['Aru','Bina','Carol','Dovi','Eva','Fili','Gina','Hale','Irene','Josese','Kirio','Lola','Mal','Nat','Osai','Pita','Rae','Seru','Tam','Urmil','Vaianu','Wati','Xavier','Yani','Zita'],
        ['Arthur','Becky','Chip','Denia','Elisa','Fotu','Glen','Hettie','Innis','Julie','Ken','Lin','Maciu','Nisha','Orea','Palu','Rene','Sarah','Troy','Uinita','Vanessa','Wano','Yvonne','Zaka'],
        ['Alvin','Bune','Cyril','Danial','Eden','Florin','Garry','Haley','Isa','June','Kofi','Louise','Mike','Niko','Opeti','Perry','Reuben','Solo','Tuni','Ulu','Victor','Wanita','Yates','Zidane'],
        ['Amos','Bart','Crystal','Dean','Ella','Fehi','Garth','Hola','Iris','Jo','Kala','Liua','Mona','Neil','Oma','Pana','Rita','Samadiyo','Tasi','Uesi','Vicky','Wasi','Yabaki','Zazu']
    ],
    replacementLists: [
        ['Adama','Ben','Christy','Dakai','Emosi','Feki','Germaine','Hart','Ili','Junina','Kosi','Lute','Mata','Neta','Olina','Paea','Rex','Sete','Temo','Uila','Velma','Wane','Yavala','Zanna']
    ]
});

DesignationSystem.southAtlantic = new DesignationSystem({
    displayName: 'South Atlantic',
    suffix: 'Q',
    mainLists: [
        ['Arani','Bapo','Cari','Deni','E\u00e7a\u00ed','Guar\u00e1','Iba','Jaguar','Kurum\u00ed','Mani','Oquira','Potira','Raoni','Ub\u00e1','Yakecan'],
        ['Akar\u00e1', 'Bigu\u00e1', 'Caiob\u00e1', 'Endy', 'Guarani', 'Igua\u00e7\u00fa', 'Jaci', 'Kaet\u00e9', 'Marac\u00e1', 'Okanga', 'Poti', 'Reri', 'Sum\u00e9', 'Tup\u00e3', 'Upaba', 'Ybatinga'],
        ['Aratu', 'Buri', 'Cai\u00e7ara', 'Esap\u00e9', 'Gua\u00ed', 'It\u00e3', 'Juru', 'Katu', 'Murici', 'Oryba', 'Peri', 'Reia', 'Sambur\u00e1', 'Taubat\u00e9', 'Uruana', 'Ytu']
    ]
});

// This is somewhat inaccurate but it works for now
DesignationSystem.mediterranean = new DesignationSystem({
    displayName: 'Mediterranean',
    suffix: 'M',
    annual: true,
    anchor: 2021,
    mainLists: [
        ['Apollo', 'Bianca', 'Ciril', 'Diana', 'Enea', 'Fedra', 'Goran', 'Hera', 'Ivan', 'Lina', 'Marco', 'Nada', 'Ole', 'Pandora', 'Remo', 'Sandra', 'Teodor', 'Ursula', 'Vito', 'Zora'],
        ['Ana', 'Bogdan', 'Clio', 'Dino', 'Eva', 'Fobos', 'Gaia', 'Helios', 'Ilina', 'Leon', 'Minerva', 'Nino', 'Olga', 'Petar', 'Rea', 'Silvan', 'Talia', 'Ugo', 'Vesta', 'Zenon'],
        ['Alexis', 'Bettina', 'Ciro', 'Dorothea', 'Emil', 'Fedra', 'Gori', 'Helga', 'Italo', 'Lilith', 'Marco', 'Nada', 'Ole', 'Palmira', 'Rocky', 'Shirlene', 'Tino', 'Ute', 'Vito', 'Zena']
    ]
});

DesignationSystem.atlantic1950 = new DesignationSystem({
    displayName: 'Atlantic (1950-52)',
    suffix: 'L',
    annual: true,
    anchor: 1950,
    mainLists: [
        ['Able', 'Baker', 'Charlie', 'Dog', 'Easy', 'Fox', 'George', 'How', 'Item', 'Jig', 'King', 'Love', 'Mike', 'Nan', 'Oboe', 'Peter', 'Queen', 'Roger', 'Sugar', 'Tare', 'Uncle', 'Victor', 'William', 'Xray', 'Yoke', 'Zebra']
    ]
});

DesignationSystem.atlantic1953 = new DesignationSystem({
    displayName: 'Atlantic (1953-59)',
    suffix: 'L',
    annual: true,
    anchor: 1953,
    mainLists: [
        ['Alice', 'Barbara', 'Carol', 'Dolly', 'Edna', 'Florence', 'Gail', 'Hazel', 'Irene', 'Jill', 'Katherine', 'Lucy', 'Mabel', 'Norma', 'Orpha', 'Patsy', 'Queen', 'Rachel', 'Susie', 'Tina', 'Una', 'Vicky', 'Wallis'],
        ['Alice', 'Barbara', 'Carol', 'Dolly', 'Edna', 'Florence', 'Gilda', 'Hazel', 'Irene', 'Jill', 'Katherine', 'Lucy', 'Mabel', 'Norma', 'Orpha', 'Patsy', 'Queen', 'Rachel', 'Susie', 'Tina', 'Una', 'Vicky', 'Wallis'],
        ['Alice', 'Brenda', 'Connie', 'Diane', 'Edith', 'Flora', 'Gladys', 'Hilda', 'Ione', 'Janet', 'Katie', 'Linda', 'Martha', 'Nelly', 'Orva', 'Peggy', 'Queena', 'Rosa', 'Stella', 'Trudy', 'Ursa', 'Verna', 'Wilma', 'Xenia', 'Yvonne', 'Zelda'],
        ['Anna', 'Betsy', 'Carla', 'Dora', 'Ethel', 'Flossy', 'Greta', 'Hattie', 'Inez', 'Judith', 'Kitty', 'Laura', 'Molly', 'Nona', 'Odette', 'Paula', 'Quenby', 'Rhoda', 'Sadie', 'Terese', 'Ursel', 'Vesta', 'Winny', 'Xina', 'Yola', 'Zenda'],
        ['Audrey', 'Bertha', 'Carrie', 'Debbie', 'Esther', 'Frieda', 'Gracie', 'Hannah', 'Inga', 'Jessie', 'Kathie', 'Lisa', 'Margo', 'Netty', 'Odelle', 'Patty', 'Quinta', 'Roxie', 'Sandra', 'Theo', 'Undine', 'Venus', 'Wenda', 'Xmay', 'Yasmin', 'Zita'],
        ['Alma', 'Becky', 'Cleo', 'Daisy', 'Ella', 'Fifi', 'Gerda', 'Helene', 'Ilsa', 'Janice', 'Katy', 'Lila', 'Milly', 'Nola', 'Orchid', 'Portia', 'Queeny', 'Rena', 'Sherry', 'Thora', 'Udele', 'Virgy', 'Wilna', 'Xrae', 'Yurith', 'Zorna'],
        ['Arlene', 'Beulah', 'Cindy', 'Debra', 'Edith', 'Flora', 'Gracie', 'Hannah', 'Irene', 'Judith', 'Kristy', 'Lois', 'Marsha', 'Nellie', 'Orpha', 'Penny', 'Quella', 'Rachel', 'Sophie', 'Tanya', 'Udele', 'Vicky', 'Wilma', 'Xcel', 'Yasmin', 'Zasu']
    ]
});

DesignationSystem.atlantic1960 = new DesignationSystem({
    displayName: 'Atlantic (1960-63)',
    suffix: 'L',
    annual: true,
    anchor: 1960,
    mainLists: [
        ['Abby', 'Brenda', 'Cleo', 'Donna', 'Ethel', 'Florence', 'Gladys', 'Hilda', 'Isbell', 'Janet', 'Katy', 'Lila', 'Molly', 'Nita', 'Odette', 'Paula', 'Roxie', 'Stella', 'Trudy', 'Vesta', 'Winny'],
        ['Anna', 'Betsy', 'Carla', 'Debbie', 'Esther', 'Frances', 'Gerda', 'Hattie', 'Inga', 'Jenny', 'Kara', 'Laurie', 'Martha', 'Netty', 'Orva', 'Peggy', 'Rhoda', 'Sadie', 'Tanya', 'Virgy', 'Wenda'],
        ['Alma', 'Becky', 'Celia', 'Daisy', 'Ella', 'Flossie', 'Greta', 'Hallie', 'Inez', 'Judith', 'Kendra', 'Lois', 'Marsha', 'Noreen', 'Orpha', 'Patty', 'Rena', 'Sherry', 'Thora', 'Vicky', 'Wilna'],
        ['Arlene', 'Beulah', 'Cindy', 'Debra', 'Edith', 'Flora', 'Ginny', 'Helena', 'Irene', 'Janice', 'Kristy', 'Laura', 'Margo', 'Nona', 'Orchid', 'Portia', 'Rachel', 'Sandra', 'Terese', 'Verna', 'Wallis']
    ]
});

DesignationSystem.atlantic1972 = new DesignationSystem({
    displayName: 'Atlantic (1972-78)',
    suffix: 'L',
    annual: true,
    anchor: 1972,
    mainLists: [
        ['Agnes', 'Betty', 'Carrie', 'Dawn', 'Edna', 'Felice', 'Gerda', 'Harriet', 'Ilene', 'Jane', 'Kara', 'Lucile', 'Mae', 'Nadine', 'Odette', 'Polly', 'Rita', 'Sarah', 'Tina', 'Velma', 'Wendy'],
        ['Alice', 'Brenda', 'Christine', 'Delia', 'Ellen', 'Fran', 'Gilda', 'Helen', 'Imogene', 'Joy', 'Kate', 'Loretta', 'Madge', 'Nancy', 'Ona', 'Patsy', 'Rose', 'Sally', 'Tam', 'Vera', 'Wilda'],
        ['Alma', 'Becky', 'Dolly', 'Elaine', 'Fifi', 'Gertrude', 'Hester', 'Ivy', 'Justine', 'Kathy', 'Linda', 'Marsha', 'Nelly', 'Olga', 'Pearl', 'Roxanne', 'Sabrina', 'Thelma', 'Viola', 'Wilma'],
        ['Amy', 'Blanche', 'Caroline', 'Doris', 'Eloise', 'Faye', 'Gladys', 'Hallie', 'Ingrid', 'Julia', 'Kitty', 'Lilly', 'Mabel', 'Niki', 'Opal', 'Peggy', 'Ruby', 'Sheila', 'Tilda', 'Vicky', 'Winnie'],
        ['Anna', 'Belle', 'Candice', 'Dottie', 'Emmy', 'Frances', 'Gloria', 'Holly', 'Inga', 'Jill', 'Kay', 'Lilias', 'Maria', 'Nola', 'Orpha', 'Pamela' ,'Ruth', 'Shirley', 'Trixie', 'Vilda', 'Wynne'],
        ['Anita', 'Babe', 'Clara', 'Dorothy', 'Evelyn', 'Frieda', 'Grace', 'Hannah', 'Ida', 'Jodie', 'Kristina', 'Lois', 'Mary', 'Nora', 'Odel', 'Penny', 'Raquel', 'Sophia', 'Trudy', 'Virginia', 'Willene'],
        ['Amelia', 'Bess', 'Cora', 'Debra', 'Ella', 'Flossie', 'Greta', 'Hope', 'Irma', 'Juliet', 'Kendra', 'Louise', 'Martha', 'Noreen', 'Ora', 'Paula', 'Rosalie', 'Susan', 'Tanya', 'Vanessa', 'Wanda']
    ]
});

DesignationSystem.atlantic1979 = new DesignationSystem({
    displayName: 'Atlantic (1979-84)',
    suffix: 'L',
    annual: true,
    anchor: 1979,
    mainLists: [
        ['Ana','Bob','Claudette','David','Elena','Frederic','Gloria','Henri','Isabel','Juan','Kate','Larry','Mindy','Nicholas','Odette','Peter','Rose','Sam','Teresa','Victor','Wanda'],
        ['Allen','Bonnie','Charley','Danielle','Earl','Frances','Georges','Hermine','Ivan','Jeanne','Karl','Lisa','Mitch','Nicole','Otto','Paula','Richard','Shary','Tomas','Virginie','Walter'],
        ['Arlene','Bret','Cindy','Dennis','Emily','Floyd','Gert','Harvey','Irene','Jose','Katrina','Lenny','Maria','Nate','Ophelia','Philippe','Rita','Stan','Tammy','Vince','Wilma'],
        ['Alberto','Beryl','Chris','Debby','Ernesto','Florence','Gilbert','Helene','Isaac','Joan','Keith','Leslie','Michael','Nadine','Oscar','Patty','Rafael','Sandy','Tony','Valerie','William'],
        ['Alicia','Barry','Chantal','Dean','Erin','Felix','Gabrielle','Hugo','Iris','Jerry','Karen','Luis','Marilyn','Noel','Opal','Pablo','Roxanne','Sebastien','Tanya','Van','Wendy'],
        ['Arthur','Bertha','Cesar','Diana','Edouard','Fran','Gustav','Hortense','Isidore','Josephine','Klaus','Lili','Marco','Nana','Omar','Paloma','Rene','Sally','Teddy','Vicky','Wilfred']
    ],
    auxLists: [
        ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu','Nu','Xi','Omicron','Pi','Rho','Sigma','Tau','Upsilon','Phi','Chi','Psi','Omega']
    ]
});

DesignationSystem.easternPacific1960 = new DesignationSystem({
    displayName: 'Eastern Pacific (1960-65)',
    suffix: 'E',
    mainLists: [
        ['Annette', 'Bonny', 'Celeste', 'Diana', 'Estelle', 'Fernanda', 'Gwen', 'Hyacinth', 'Iva', 'Joanne', 'Kathleen', 'Liza', 'Madeline', 'Naomi', 'Orla', 'Pauline', 'Rebecca', 'Simone', 'Tara', 'Valerie', 'Willa'],
        ['Ava', 'Bernice', 'Claudia', 'Doreen', 'Emily', 'Florence', 'Glenda', 'Hazel', 'Irah', 'Jennifer', 'Katherine', 'Lillian', 'Mona', 'Natalie', 'Odessa', 'Prudence', 'Roslyn', 'Silvia', 'Tillie', 'Victoria', 'Wallie']
    ]
});

DesignationSystem.easternPacific1965 = new DesignationSystem({
    displayName: 'Eastern Pacific (1965-68)',
    suffix: 'E',
    annual: true,
    anchor: 1965,
    mainLists: [
        ['Ava', 'Bernice', 'Claudia', 'Doreen', 'Emily', 'Florence', 'Glenda', 'Hazel', 'Irah', 'Jennifer', 'Katherine', 'Lillian', 'Mona', 'Natalie', 'Odessa', 'Prudence', 'Roslyn', 'Silvia', 'Tillie', 'Victoria', 'Wallie'],
        ['Adele', 'Blanca', 'Connie', 'Dolores', 'Eileen', 'Francesca', 'Gretchen', 'Helga', 'Ione', 'Joyce', 'Kirsten', 'Lorraine', 'Maggie', 'Norma', 'Orlene', 'Patricia', 'Rosalie', 'Selma', 'Toni', 'Vivian', 'Winona'],
        ['Agatha', 'Bridget', 'Carlotta', 'Denise', 'Eleanor', 'Francene', 'Georgette', 'Hilary', 'Ilsa', 'Jewel', 'Katrina', 'Lily', 'Monica', 'Nanette', 'Olivia', 'Priscilla', 'Ramona', 'Sharon', 'Terry', 'Veronica', 'Winifred'],
        ['Annette', 'Bonny', 'Celeste', 'Diana', 'Estelle', 'Fernanda', 'Gwen', 'Hyacinth', 'Iva', 'Joanne', 'Kathleen', 'Liza', 'Madeline', 'Naomi', 'Orla', 'Pauline', 'Rebecca', 'Simone', 'Tara', 'Valerie', 'Willa']
    ]
});

// original four-year rotation of male/female EPac names
DesignationSystem.easternPacific1978 = new DesignationSystem({
    displayName: 'Eastern Pacific (1978-81)',
    suffix: 'E',
    annual: true,
    anchor: 1978,
    mainLists: [
        ['Aletta', 'Bud', 'Carlotta', 'Daniel', 'Emilia', 'Fico', 'Gilma', 'Hector', 'Iva', 'John', 'Kristy', 'Lane', 'Miriam', 'Norman', 'Olivia', 'Paul', 'Rosa', 'Sergio', 'Tara', 'Vicente', 'Willa'],
        ['Andres', 'Blanca', 'Carlos', 'Dolores', 'Enrique', 'Fefa', 'Guillermo', 'Hilda', 'Ignacio', 'Jimena', 'Kevin', 'Linda', 'Marty', 'Nora', 'Olaf', 'Pauline', 'Rick', 'Sandra', 'Terry', 'Vivian', 'Waldo'],
        ['Agatha', 'Blas', 'Celia', 'Darby', 'Estelle', 'Frank', 'Georgetta', 'Howard', 'Isis', 'Javier', 'Kay', 'Lester', 'Madeline', 'Newton', 'Orlene', 'Paine', 'Roslyn', 'Seymour', 'Tina', 'Virgil', 'Winifred'],
        ['Adrian', 'Beatriz', 'Calvin', 'Dora', 'Eugene', 'Fernanda', 'Greg', 'Hilary', 'Irwin', 'Jova', 'Knut', 'Lidia', 'Max', 'Norma', 'Otis', 'Pilar', 'Ramon', 'Selma', 'Todd', 'Veronica', 'Wiley']
    ],
    auxLists: [
        ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega']
    ]
});

// modern six-year rotation of male/female EPac names (overlaps with previous four-year rotation)
DesignationSystem.easternPacific1979 = new DesignationSystem({
    displayName: 'Eastern Pacific (1979-84)',
    suffix: 'E',
    annual: true, 
    anchor: 1979,
    mainLists: [
        ['Andres', 'Blanca', 'Carlos', 'Dolores', 'Enrique', 'Fefa', 'Guillermo', 'Hilda', 'Ignacio', 'Jimena', 'Kevin', 'Linda', 'Marty', 'Nora', 'Olaf', 'Pauline', 'Rick', 'Sandra', 'Terry', 'Vivian', 'Waldo'],
        ['Agatha', 'Blas', 'Celia', 'Darby', 'Estelle', 'Frank', 'Georgetta', 'Howard', 'Isis', 'Javier', 'Kay', 'Lester', 'Madeline', 'Newton', 'Orlene', 'Paine', 'Roslyn', 'Seymour', 'Tina', 'Virgil', 'Winifred'],
        ['Adrian', 'Beatriz', 'Calvin', 'Dora', 'Eugene', 'Fernanda', 'Greg', 'Hilary', 'Irwin', 'Jova', 'Knut', 'Lidia', 'Max', 'Norma', 'Otis', 'Pilar', 'Ramon', 'Selma', 'Todd', 'Veronica', 'Wiley'],
        ['Aletta', 'Bud', 'Carlotta', 'Daniel', 'Emilia', 'Fabio', 'Gilma', 'Hector', 'Iva', 'John', 'Kristy', 'Lane', 'Miriam', 'Norman', 'Olivia', 'Paul', 'Rosa', 'Sergio', 'Tara', 'Vicente', 'Willa'],
        ['Adolph', 'Barbara', 'Cosme', 'Dalila', 'Erick', 'Flossie', 'Gil', 'Henriette', 'Ismael', 'Juliette', 'Kiko', 'Lorena', 'Manuel', 'Narda', 'Octave', 'Priscilla', 'Raymond', 'Sonia', 'Tico', 'Velma', 'Winnie'],
        ['Alma', 'Boris', 'Cristina', 'Douglas', 'Elida', 'Fausto', 'Genevieve', 'Hernan', 'Iselle', 'Julio', 'Kenna', 'Lowell', 'Marie', 'Norbert', 'Odile', 'Polo', 'Rachel', 'Simon', 'Trudy', 'Vance', 'Wallis']
    ],
    auxLists: [
        ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega']
    ]
});

DesignationSystem.periodicTable = new DesignationSystem({
    displayName: 'Periodic Table',
    suffix: DEPRESSION_LETTER,
    mainLists: [
        ["Hydrogen","Helium","Lithium","Beryllium","Boron","Carbon","Nitrogen","Oxygen","Fluorine","Neon","Sodium","Magnesium","Aluminium","Silicon","Phosphorus","Sulfur","Chlorine","Argon","Potassium","Calcium","Scandium","Titanium","Vanadium","Chromium","Manganese","Iron","Cobalt","Nickel","Copper","Zinc","Gallium","Germanium","Arsenic","Selenium","Bromine","Krypton","Rubidium","Strontium","Yttrium","Zirconium","Niobium","Molybdenum","Technetium","Ruthenium","Rhodium","Palladium","Silver","Cadmium","Indium","Tin","Antimony","Tellurium","Iodine","Xenon","Caesium","Barium","Lanthanum","Cerium","Praseodymium","Neodymium","Promethium","Samarium","Europium","Gadolinium","Terbium","Dysprosium","Holmium","Erbium","Thulium","Ytterbium","Lutetium","Hafnium","Tantalum","Tungsten","Rhenium","Osmium","Iridium","Platinum","Gold","Mercury","Thallium","Lead","Bismuth","Polonium","Astatine","Radon","Francium","Radium","Actinium","Thorium","Protactinium","Uranium","Neptunium","Plutonium","Americium","Curium","Berkelium","Californium","Einsteinium","Fermium","Mendelevium","Nobelium","Lawrencium","Rutherfordium","Dubnium","Seaborgium","Bohrium","Hassium","Meitnerium","Darmstadtium","Roentgenium","Copernicium","Nihonium","Flerovium","Moscovium","Livermorium","Tennessine","Oganesson"]
    ]
});

DesignationSystem.periodicTableAnnual = DesignationSystem.periodicTable.clone();
DesignationSystem.periodicTableAnnual.naming.annual = true;
DesignationSystem.periodicTableAnnual.displayName = 'Periodic Table (Annual)';

DesignationSystem.presetDesignationSystems = [
    DesignationSystem.atlantic,
    DesignationSystem.easternPacific,
    DesignationSystem.centralPacific,
    DesignationSystem.westernPacific,
    DesignationSystem.PAGASA,
    DesignationSystem.northIndianOcean,
    DesignationSystem.australianRegionBoM,
    DesignationSystem.southPacific,
    DesignationSystem.southWestIndianOcean,
    DesignationSystem.southAtlantic,
    DesignationSystem.mediterranean,
    DesignationSystem.australianRegionJakarta,
    DesignationSystem.australianRegionPortMoresby,
    DesignationSystem.atlantic1950,
    DesignationSystem.atlantic1953,
    DesignationSystem.atlantic1960,
    DesignationSystem.atlantic1972,
    DesignationSystem.atlantic1979,
    DesignationSystem.easternPacific1960,
    DesignationSystem.easternPacific1965,
    DesignationSystem.easternPacific1978,
    DesignationSystem.easternPacific1979,
    DesignationSystem.periodicTable,
    DesignationSystem.periodicTableAnnual
];

// --- START OF FILE: scale.ts ---

class Scale{
    constructor(/* basin, */data){
        // this.basin = basin instanceof Basin && basin;
        let opts;
        if(data && !(data instanceof LoadData)) opts = data;
        else opts = {};
        this.displayName = opts.displayName;
        this.measure = opts.measure || SCALE_MEASURE_ONE_MIN_KNOTS;   // 0 = 1-minute wind speed; 2 = pressure (10-minute wind speed not yet implemented)
        this.classifications = [];
        let cData;
        if(opts instanceof Array) cData = opts;
        else if(opts.classifications instanceof Array) cData = opts.classifications;
        if(cData){
            for(let c of cData){
                let clsn = {};
                clsn.threshold = c.threshold;
                if(clsn.threshold===undefined){
                    if(this.measure===SCALE_MEASURE_MILLIBARS) clsn.threshold = 1000;
                    else clsn.threshold = 35;
                }
                clsn.color = c.color===undefined ? 'white' : c.color;
                clsn.subtropicalColor = c.subtropicalColor;
                clsn.symbol = c.symbol===undefined ? 'C' : c.symbol;
                clsn.arms = c.arms===undefined ? 2 : c.arms;
                clsn.subtropicalSymbol = c.subtropicalSymbol;
                clsn.stormNom = c.stormNom;
                clsn.subtropicalStormNom = c.subtropicalStormNom;
                clsn.stat = c.stat;
                clsn.cName = c.cName;
                this.classifications.push(clsn);
            }
        }
        this.flavorValue = 0;
        this.flavorDisplayNames = opts.flavorDisplayNames || [];
        // numbering/naming thresholds may be overridden by DesignationSystem
        this.numberingThreshold = opts.numberingThreshold===undefined ? 0 : opts.numberingThreshold;
        this.namingThreshold = opts.namingThreshold===undefined ? 1 : opts.namingThreshold;
        if(data instanceof LoadData) this.load(data);
    }

    get(stormData){
        if(stormData instanceof StormData){
            let m;
            let c = 0;
            if(this.measure===SCALE_MEASURE_MILLIBARS || this.measure===SCALE_MEASURE_INHG){    // pressure
                m = stormData.pressure;     // millibars by default
                if(this.measure===SCALE_MEASURE_INHG) m = mbToInHg(m);
                while(c+1<this.classifications.length && m<=this.classifications[c+1].threshold) c++;
            }else{                                                                              // wind speed
                m = stormData.windSpeed;    // 1-minute knots by default
                if(this.measure===SCALE_MEASURE_TEN_MIN_KNOTS || this.measure===SCALE_MEASURE_TEN_MIN_MPH || this.measure===SCALE_MEASURE_TEN_MIN_KMH) m = oneMinToTenMin(m);    // one-minute to ten-minute wind conversion
                if(this.measure===SCALE_MEASURE_ONE_MIN_MPH || this.measure===SCALE_MEASURE_TEN_MIN_MPH) m = ktsToMph(m);   // knots-to-mph conversion
                if(this.measure===SCALE_MEASURE_ONE_MIN_KMH || this.measure===SCALE_MEASURE_TEN_MIN_KMH) m = ktsToKmh(m);   // knots-to-km/h conversion
                while(c+1<this.classifications.length && m>=this.classifications[c+1].threshold) c++;
            }
            return c;
        }
    }

    getColor(){
        let c;
        let subtropical;
        if(arguments[0] instanceof StormData){
            if(arguments[0].type===EXTROP) return COLORS.storm[EXTROP];
            if(arguments[0].type===TROPWAVE) return COLORS.storm[TROPWAVE];
            c = this.get(arguments[0]);
            subtropical = arguments[0].type===SUBTROP;
        }else{
            c = arguments[0];
            subtropical = arguments[1];
        }
        if(this.classifications.length<1) return 'white';
        while(!this.classifications[c].color && c>0) c--;
        let clsn = this.classifications[c];
        let color;
        if(subtropical && clsn.subtropicalColor) color = clsn.subtropicalColor;
        else color = clsn.color;
        if(typeof color === 'string' && color.charAt(0) === '$')
            return COLOR_SCHEMES[simSettings.colorScheme].values[color.slice(1)];
        else
            return color;
    }

    getIcon(){
        let c;
        let subtropical;
        let color;
        if(arguments[0] instanceof StormData){
            c = this.get(arguments[0]);
            subtropical = arguments[0].type===SUBTROP;
            color = this.getColor(arguments[0]);
        }else{
            c = arguments[0];
            subtropical = arguments[1];
            color = this.getColor(c,subtropical);
        }
        if(this.classifications.length<1) return {symbol: subtropical ? 'SC' : 'C', arms: 2, color: 'white'};
        while(!this.classifications[c].symbol && c>0) c--;
        let clsn = this.classifications[c];
        let symbol;
        let fetch = sym=>{
            if(sym instanceof Array) return sym[this.flavorValue];
            return sym;
        };
        if(subtropical){
            if(clsn.subtropicalSymbol) symbol = fetch(clsn.subtropicalSymbol);
            else symbol = 'S' + fetch(clsn.symbol);
        }else symbol = fetch(clsn.symbol);
        let arms = clsn.arms;
        return {symbol, arms, color};
    }

    getStormNom(){
        let c;
        let subtropical;
        if(arguments[0] instanceof StormData){
            c = this.get(arguments[0]);
            subtropical = arguments[0].type===SUBTROP;
        }else{
            c = arguments[0];
            subtropical = arguments[1];
        }
        if(this.classifications.length<1) return subtropical ? 'Subtropical Cyclone' : 'Tropical Cyclone';
        while(!this.classifications[c].stormNom && c>0) c--;
        let clsn = this.classifications[c];
        let fetch = n=>{
            if(n instanceof Array) return n[this.flavorValue];
            return n;
        };
        if(subtropical){
            if(clsn.subtropicalStormNom) return fetch(clsn.subtropicalStormNom);
            if(clsn.stormNom) return 'Subtropical ' + fetch(clsn.stormNom);
            return 'Subtropical Cyclone';
        }
        if(clsn.stormNom) return fetch(clsn.stormNom);
        return 'Tropical Cyclone';
    }

    getClassificationName(){
        let c;
        if(arguments[0] instanceof StormData) c = this.get(arguments[0]);
        else c = arguments[0];
        if(this.classifications.length<1) return 'Cyclone';
        if(this.classifications[c].cName) return this.classifications[c].cName;
        return c + '';
    }

    *statDisplay(){
        for(let i=0;i<this.classifications.length;i++){
            let clsn = this.classifications[i];
            if(clsn.stat){
                if(clsn.stat instanceof Array && clsn.stat[this.flavorValue]) yield {statName: clsn.stat[this.flavorValue], cNumber: i};
                else if(typeof clsn.stat === 'string') yield {statName: clsn.stat, cNumber: i};
            }
        }
    }

    flavor(v){
        if(typeof v === 'number'){
            this.flavorValue = v;
            return this;
        }
        return this.flavorValue;
    }

    clone(){
        let newScale = new Scale();
        for(let p of [
            'displayName',
            'measure',
            'flavorValue',
            'numberingThreshold',
            'namingThreshold'
        ]) newScale[p] = this[p];
        for(let p of [
            'classifications',
            'flavorDisplayNames'
        ]) newScale[p] = JSON.parse(JSON.stringify(this[p]));
        return newScale;
    }

    save(){
        let d = {};
        for(let p of [
            'displayName',
            'measure',
            'classifications',
            'flavorValue',
            'flavorDisplayNames',
            'numberingThreshold',
            'namingThreshold'
        ]) d[p] = this[p];
        return d;
    }

    load(data){
        if(data instanceof LoadData){
            let d = data.value;
            for(let p of [
                'displayName',
                'measure',
                'classifications',
                'flavorValue',
                'flavorDisplayNames'
            ]) this[p] = d[p];
            if(d.numberingThreshold !== undefined)
                this.numberingThreshold = d.numberingThreshold;
            if(d.namingThreshold !== undefined)
                this.namingThreshold = d.namingThreshold;
            if(d.colorSchemeValue !== undefined){
                for(let c of this.classifications){
                    if(c.color instanceof Array)
                        c.color = c.color[d.colorSchemeValue];
                }
            }
        }
    }

    static convertOldValue(v){  // converts pre-v0.2 (extended) Saffir-Simpson values to Scale.extendedSaffirSimpson values
        if(v<5) return v+1;
        return v+2;
    }
}

Scale.saffirSimpson = new Scale({
    displayName: 'Saffir-Simpson',
    flavorDisplayNames: ['Hurricane','Typhoon','Cyclone'],
    classifications: [
        {
            threshold: 0,
            color: '$TD',
            subtropicalColor: '$SD',
            symbol: 'D',
            arms: 0,
            stormNom: 'Tropical Depression',
            subtropicalStormNom: 'Subtropical Depression',
            stat: 'Depressions',
            cName: 'Depression'
        },
        {
            threshold: 34,
            color: '$TS',
            subtropicalColor: '$SS',
            symbol: 'S',
            stormNom: 'Tropical Storm',
            subtropicalStormNom: 'Subtropical Storm',
            stat: 'Named Storms',
            cName: 'Storm'
        },
        {
            threshold: 64,
            color: '$C1',
            symbol: '1',
            stormNom: ['Hurricane','Typhoon','Cyclone'],
            stat: ['Hurricanes','Typhoons','Cyclones'],
            cName: 'Category 1'
        },
        {
            threshold: 83,
            color: '$C2',
            symbol: '2',
            cName: 'Category 2'
        },
        {
            threshold: 96,
            color: '$C3',
            symbol: '3',
            stormNom: ['Major Hurricane','Typhoon','Cyclone'],
            stat: ['Major Hurricanes','Category 3+','Category 3+'],
            cName: 'Category 3'
        },
        {
            threshold: 113,
            color: '$C4',
            symbol: '4',
            cName: 'Category 4'
        },
        {
            threshold: 130,
            color: '$C4',
            symbol: '4',
            stormNom: ['Major Hurricane','Super Typhoon','Cyclone'],
            stat: [undefined,'Super Typhoons'],
            cName: 'Category 4 STY'
        },
        {
            threshold: 137,
            color: '$C5',
            symbol: '5',
            stat: 'Category 5s',
            cName: 'Category 5'
        }
    ]
});

Scale.extendedSaffirSimpson = new Scale({
    displayName: 'Extended Saffir-Simpson',
    flavorDisplayNames: ['Hurricane','Typhoon','Cyclone'],
    classifications: [
        {
            threshold: 0,
            color: '$TD',
            subtropicalColor: '$SD',
            symbol: 'D',
            arms: 0,
            stormNom: 'Tropical Depression',
            subtropicalStormNom: 'Subtropical Depression',
            stat: 'Depressions',
            cName: 'Depression'
        },
        {
            threshold: 34,
            color: '$TS',
            subtropicalColor: '$SS',
            symbol: 'S',
            stormNom: 'Tropical Storm',
            subtropicalStormNom: 'Subtropical Storm',
            stat: 'Named Storms',
            cName: 'Storm'
        },
        {
            threshold: 64,
            color: '$C1',
            symbol: '1',
            stormNom: ['Hurricane','Typhoon','Cyclone'],
            stat: ['Hurricanes','Typhoons','Cyclones'],
            cName: 'Category 1'
        },
        {
            threshold: 83,
            color: '$C2',
            symbol: '2',
            cName: 'Category 2'
        },
        {
            threshold: 96,
            color: '$C3',
            symbol: '3',
            stormNom: ['Major Hurricane','Typhoon','Cyclone'],
            stat: ['Major Hurricanes','Category 3+','Category 3+'],
            cName: 'Category 3'
        },
        {
            threshold: 113,
            color: '$C4',
            symbol: '4',
            cName: 'Category 4'
        },
        {
            threshold: 130,
            color: '$C4',
            symbol: '4',
            stormNom: ['Major Hurricane','Super Typhoon','Cyclone'],
            stat: [undefined,'Super Typhoons'],
            cName: 'Category 4 STY'
        },
        {
            threshold: 137,
            color: '$C5',
            symbol: '5',
            stat: 'Category 5+',
            cName: 'Category 5'
        },
        {
            threshold: 165,
            color: '$C6',
            symbol: '6',
            cName: 'Category 6'
        },
        {
            threshold: 198,
            color: '$C7',
            symbol: '7',
            cName: 'Category 7'
        },
        {
            threshold: 255,
            color: '$C8',
            symbol: '8',
            stat: 'Category 8+',
            cName: 'Category 8'
        },
        {
            threshold: 318,
            color: '$C9',
            symbol: '9',
            cName: 'Category 9'
        },
        {
            threshold: 378,
            color: '$C10',
            symbol: '10',
            cName: 'Category 10'
        },
        {
            threshold: 434,
            color: '$HYC',
            symbol: 'HY',
            stormNom: ['Hypercane','Hyperphoon','Hyperclone'],
            stat: ['Hypercanes','Hyperphoons','Hyperclones'],
            cName: 'Hypercane'
        }
    ]
});

Scale.australian = new Scale({
    measure: SCALE_MEASURE_TEN_MIN_KNOTS,
    displayName: 'Australian',
    flavorDisplayNames: ['Cyclone'],
    classifications: [
        {
            threshold: 0,
            color: '$TD',
            subtropicalColor: '$SD',
            symbol: 'D',
            arms: 0,
            stormNom: 'Tropical Depression',
            subtropicalStormNom: 'Subtropical Depression',
            stat: 'Depressions',
            cName: 'Depression'
        },
        {
            threshold: 34,
            color: '$TS',
            subtropicalColor: '$SS',
            symbol: '1',
            stormNom: 'Tropical Cyclone',
            subtropicalStormNom: 'Subtropical Cyclone',
            stat: 'Cyclones',
            cName: 'Category 1'
        },
        {
            threshold: 48,
            color: '$STS',
            subtropicalColor: '$SSS',
            symbol: '2',
            stat: 'Category 2+',
            cName: 'Category 2'
        },
        {
            threshold: 64,
            color: '$C1',
            symbol: '3',
            stat: 'Category 3+',
            cName: 'Category 3'
        },
        {
            threshold: 86,
            color: '$C3',
            symbol: '4',
            stat: 'Category 4+',
            cName: 'Category 4'
        },
        {
            threshold: 108,
            color: '$C5',
            symbol: '5',
            stat: 'Category 5s',
            cName: 'Category 5'
        }
    ]
});

Scale.JMA = new Scale({
    measure: SCALE_MEASURE_TEN_MIN_KNOTS,
    displayName: 'Japan Meteorological Agency',
    flavorDisplayNames: ['Typhoon'],
    classifications: [
        {
            threshold: 0,
            color: '$TD',
            subtropicalColor: '$SD',
            symbol: 'D',
            arms: 0,
            stormNom: 'Tropical Depression',
            subtropicalStormNom: 'Subtropical Depression',
            stat: 'Depressions',
            cName: 'Depression'
        },
        {
            threshold: 34,
            color: '$TS',
            subtropicalColor: '$SS',
            symbol: 'S',
            stormNom: 'Tropical Storm',
            subtropicalStormNom: 'Subtropical Storm',
            stat: 'Named Storms',
            cName: 'Storm'
        },
        {
            threshold: 48,
            color: '$STS',
            subtropicalColor: '$SSS',
            symbol: 'STS',
            subtropicalSymbol: 'SSS',
            stormNom: 'Severe Tropical Storm',
            subtropicalStormNom: 'Severe Subtropical Storm',
            stat: 'Severe',
            cName: 'Severe'
        },
        {
            threshold: 64,
            color: '$TY',
            symbol: 'TY',
            stormNom: 'Typhoon',
            stat: 'Typhoons',
            cName: 'Strong Typhoon'
        },
        {
            threshold: 85,
            color: '$VSTY',
            symbol: 'VSTY',
            stat: 'Very Strong Typhoons',
            cName: 'Very Strong Typhoon'
        },
        {
            threshold: 105,
            color: '$C5',
            symbol: 'VTY',
            stat: 'Violent Typhoons',
            cName: 'Violent Typhoon'
        }
    ]
});

Scale.IMD = new Scale({
    measure: SCALE_MEASURE_TEN_MIN_KNOTS,   // technically should be 3-minute, but I didn't bother making a conversion for that
    displayName: 'India Meteorological Dept.',
    flavorDisplayNames: ['Cyclone'],
    namingThreshold: 2,
    classifications: [
        {
            threshold: 17,
            color: '$TDi',
            subtropicalColor: '$SDi',
            symbol: 'D',
            arms: 0,
            stormNom: 'Depression',
            stat: 'Depressions',
            cName: 'Depression'
        },
        {
            threshold: 28,
            color: '$TD',
            subtropicalColor: '$SD',
            symbol: 'DD',
            arms: 0,
            stormNom: 'Deep Depression',
            stat: 'Deep Depressions',
            cName: 'Deep Depression'
        },
        {
            threshold: 34,
            color: '$TS',
            subtropicalColor: '$SS',
            symbol: 'CS',
            subtropicalSymbol: 'SS',
            stormNom: 'Cyclonic Storm',
            stat: 'Cyclonic Storms',
            cName: 'Cyclonic Storm'
        },
        {
            threshold: 48,
            color: '$STS',
            subtropicalColor: '$SSS',
            symbol: 'SCS',
            subtropicalSymbol: 'SSS',
            stormNom: 'Severe Cyclonic Storm',
            stat: 'Severe',
            cName: 'Severe Cyclonic Storm'
        },
        {
            threshold: 64,
            color: '$C1',
            symbol: 'VSCS',
            subtropicalSymbol: 'VSSS',
            stormNom: 'Very Severe Cyclonic Storm',
            stat: 'Very Severe',
            cName: 'Very Severe Cyclonic Storm'
        },
        {
            threshold: 90,
            color: '$C3',
            symbol: 'ESCS',
            subtropicalSymbol: 'ESSS',
            stormNom: 'Extremely Severe Cyclonic Storm',
            stat: 'Extremely Severe',
            cName: 'Extremely Severe Cyclonic Storm'
        },
        {
            threshold: 120,
            color: '$C5',
            symbol: 'SUCS',
            subtropicalSymbol: 'SUSS',
            stormNom: 'Super Cyclonic Storm',
            stat: 'Super',
            cName: 'Super Cyclonic Storm'
        }
    ]
});

Scale.southwestIndianOcean = new Scale({
    measure: SCALE_MEASURE_TEN_MIN_KNOTS,
    displayName: 'Southwest Indian Ocean',
    flavorDisplayNames: ['Cyclone'],
    namingThreshold: 2,
    classifications: [
        {
            threshold: 0,
            color: '$TDi',
            subtropicalColor: '$SDi',
            symbol: 'Di',
            arms: 0,
            stormNom: 'Tropical Disturbance',
            subtropicalStormNom: 'Subtropical Disturbance',
            stat: 'Disturbances',
            cName: 'Disturbance'
        },
        {
            threshold: 28,
            color: '$TD',
            subtropicalColor: '$SD',
            symbol: 'D',
            arms: 0,
            stormNom: 'Tropical Depression',
            stat: 'Depressions',
            cName: 'Depression'
        },
        {
            threshold: 34,
            color: '$TS',
            subtropicalColor: '$SS',
            symbol: 'MTS',
            subtropicalSymbol: 'MSS',
            stormNom: 'Moderate Tropical Storm',
            subtropicalStormNom: 'Moderate Subtropical Storm',
            stat: 'Named Storms',
            cName: 'Moderate Tropical Storm'
        },
        {
            threshold: 48,
            color: '$STS',
            subtropicalColor: '$SSS',
            symbol: 'STS',
            subtropicalSymbol: 'SSS',
            stormNom: 'Severe Tropical Storm',
            subtropicalStormNom: 'Severe Subtropical Storm',
            stat: 'Severe',
            cName: 'Severe Tropical Storm'
        },
        {
            threshold: 64,
            color: '$C1',
            symbol: 'TC',
            subtropicalSymbol: 'SC',
            stormNom: 'Tropical Cyclone',
            subtropicalStormNom: 'Subtropical Cyclone',
            stat: 'Cyclones',
            cName: 'Tropical Cyclone'
        },
        {
            threshold: 90,
            color: '$C3',
            symbol: 'ITC',
            subtropicalSymbol: 'ISC',
            stormNom: 'Intense Tropical Cyclone',
            subtropicalStormNom: 'Intense Subtropical Cyclone',
            stat: 'Intense',
            cName: 'Intense Tropical Cyclone'
        },
        {
            threshold: 115,
            color: '$C5',
            symbol: 'VITC',
            subtropicalSymbol: 'VISC',
            stormNom: 'Very Intense Tropical Cyclone',
            subtropicalStormNom: 'Very Intense Subtropical Cyclone',
            stat: 'Very Intense',
            cName: 'Very Intense Tropical Cyclone'
        }
    ]
});

Scale.presetScales = [
    Scale.saffirSimpson,
    Scale.extendedSaffirSimpson,
    Scale.australian,
    Scale.JMA,
    Scale.IMD,
    Scale.southwestIndianOcean
];

// -- Color Schemes -- //

const COLOR_SCHEMES = [
    {
        name: 'Classic',
        values: {
            'TDi': 'rgb(75,75,245)',
            'SDi': 'rgb(95,95,235)',
            'TD': 'rgb(20,20,230)',
            'SD': 'rgb(60,60,220)',
            'TS': 'rgb(20,230,20)',
            'SS': 'rgb(60,220,60)',
            'STS': 'rgb(180,230,20)',
            'SSS': 'rgb(180,220,85)',
            'TY': 'rgb(230,230,20)',
            'VSTY': 'rgb(240,20,20)',
            'C1': 'rgb(230,230,20)',
            'C2': 'rgb(240,170,20)',
            'C3': 'rgb(240,20,20)',
            'C4': 'rgb(250,40,250)',
            'C5': 'rgb(250,140,250)',
            'C6': 'rgb(250,200,250)',
            'C7': 'rgb(240,90,90)',
            'C8': 'rgb(190,60,60)',
            'C9': 'rgb(130,10,10)',
            'C10': 'rgb(120,10,120)',
            'HYC': 'rgb(20,0,140)'
        }
    },
    {
        name: 'Wiki',
        values: {
            'TDi': '#1591DE',
            'SDi': '#1591DE',
            'TD': '#6EC1EA',
            'SD': '#6EC1EA',
            'TS': '#4DFFFF',
            'SS': '#4DFFFF',
            'STS': '#C0FFC0',
            'SSS': '#C0FFC0',
            'TY': '#FFD98C',
            'VSTY': '#FF738A',
            'C1': '#FFFFD9',
            'C2': '#FFD98C',
            'C3': '#FF9E59',
            'C4': '#FF738A',
            'C5': '#A188FC',
            'C6': '#A188FC',
            'C7': '#A188FC',
            'C8': '#A188FC',
            'C9': '#A188FC',
            'C10': '#A188FC',
            'HYC': '#A188FC'
        }
    },
    {
        name: 'Wiki (Pre-2023/HHW)',
        values: {
            'TDi': '#80ccff',
            'SDi': '#80ccff',
            'TD': '#5ebaff',
            'SD': '#5ebaff',
            'TS': '#00faf4',
            'SS': '#00faf4',
            'STS': '#ccffff',
            'SSS': '#ccffff',
            'TY': '#fdaf9a',
            'VSTY': '#fe887d',
            'C1': '#ffffcc',
            'C2': '#ffe775',
            'C3': '#ffc140',
            'C4': '#ff8f20',
            'C5': '#ff6060',
            'C6': '#8b0000',
            'C7': '#cc0033',
            'C8': '#cc0066',
            'C9': '#9B30FF',
            'C10': '#F9A7B0',
            'HYC': '#ff99ff'
        }
    }
];

// --- START OF FILE: coordinate.ts ---

class Coordinate{
    constructor(longitude, latitude){
        this.set(longitude, latitude);
    }

    set(long, lat){
        this.longitude = ((long + 180) % 360 + 360) % 360 - 180;
        this.latitude = constrain(lat, -90, 90);
    }

    add(long, lat){
        if(long instanceof Coordinate){
            lat = long.latitude;
            long = long.longitude;
        }
        this.set(this.longitude + long, this.latitude + lat);
    }

    // for simplicity, returns the equirectangular map projection distance in "Pythagorean degrees" rather than true spherical distance, which is good enough for tropical cyclones far from the poles
    dist(long, lat){
        if(long instanceof Coordinate){
            lat = long.latitude;
            long = long.longitude;
        }
        let long_dist = abs(this.longitude - long);
        long_dist = min(long_dist, 360 - long_dist);
        let lat_dist = abs(this.latitude - lat);
        return Math.hypot(long_dist, lat_dist);
    }

    static convertFromXY(mapType, x, y){
        if(x instanceof p5.Vector)
            ({x, y} = x);
        let west, east, north, south;
        if(MAP_TYPES[mapType].form === 'earth')
            ({west, east, north, south} = MAP_TYPES[mapType]);
        else
            ({west, east, north, south} = MAP_TYPES[6]); // default to Atlantic
        if(east < west)
            east += 360;
        let long = map(x, 0, WIDTH, west, east, true);
        let lat = map(y, 0, HEIGHT, north, south, true);
        return new Coordinate(long, lat);
    }

    static convertToXY(mapType, long, lat){
        if(long instanceof Coordinate){
            lat = long.latitude;
            long = long.longitude;
        }
        let west, east, north, south;
        if(MAP_TYPES[mapType].form === 'earth')
            ({west, east, north, south} = MAP_TYPES[mapType]);
        else
            ({west, east, north, south} = MAP_TYPES[6]); // default to Atlantic
        let x, y;
        if(east < west){
            if(long > west)
                x = map(long, west, east + 360, 0, WIDTH, true);
            else
                x = map(long, west - 360, east, 0, WIDTH, true);
        }else
            x = map(long, west, east, 0, WIDTH, true);
        y = map(lat, north, south, 0, HEIGHT, true);
        return createVector(x, y);
    }
}

// --- START OF FILE: misc.ts ---

function refreshTracks(force){
    if(simSettings.trackMode===2 && !force) return;
    tracks.clear();
    forecastTracks.clear();
    if(selectedStorm) selectedStorm.renderTrack();
    else if(simSettings.trackMode===2){
        let target = UI.viewBasin.getSeason(viewTick);
        let valid = sys=>(sys.inBasinTC && (UI.viewBasin.getSeason(sys.enterTime)===target || UI.viewBasin.getSeason(sys.enterTime)<target && (sys.exitTime===undefined || UI.viewBasin.getSeason(sys.exitTime-1)>=target)));
        for(let s of UI.viewBasin.fetchSeason(viewTick,true,true).forSystems()) if(valid(s)) s.renderTrack();
    }else if(UI.viewBasin.viewingPresent()) for(let s of UI.viewBasin.activeSystems) s.fetchStorm().renderTrack();
    else for(let s of UI.viewBasin.fetchSeason(viewTick,true,true).forSystems()) s.renderTrack();
}

function createBuffer(w,h,alwaysFull,noScale){
    w = w || WIDTH;
    h = h || HEIGHT;
    let b = createGraphics(w,h);
    let metadata = {
        baseWidth: w,
        baseHeight: h,
        alwaysFull,
        noScale
    };
    buffers.set(b,metadata);
    return b;
}

function rescaleCanvases(s){
    for(let [buffer, metadata] of buffers){
        if(!metadata.alwaysFull){
            buffer.resizeCanvas(floor(metadata.baseWidth*s),floor(metadata.baseHeight*s));
            if(!metadata.noScale) buffer.scale(s);
        }
    }
    resizeCanvas(floor(WIDTH*s),floor(HEIGHT*s));
}

function toggleFullscreen(){
    if(document.fullscreenElement===canvas || deviceOrientation===PORTRAIT) document.exitFullscreen();
    else{
        canvas.requestFullscreen().then(function(){
            scaler = displayWidth/WIDTH;
            rescaleCanvases(scaler);
            if(UI.viewBasin){
                refreshTracks(true);
                UI.viewBasin.env.displayLayer();
            }
        });
    }
}

function fullDimensions(){
    let fullW = deviceOrientation===PORTRAIT ? displayHeight : displayWidth;
    let fullH = fullW*HEIGHT/WIDTH;
    return {fullW, fullH};
}

function drawBuffer(b){
    image(b,0,0,WIDTH,HEIGHT);
}

function getScreenMouseX(){
    return floor(mouseX/scaler);
}

function getScreenMouseY(){
    return floor(mouseY/scaler);
}

function getMapMouseX(){
    return floor(((mouseX/scaler) - mapPanX) / mapZoom);
}

function getMapMouseY(){
    return floor(((mouseY/scaler) - mapPanY) / mapZoom);
}

function getMouseX(){
    return getMapMouseX();
}

function getMouseY(){
    return getMapMouseY();
}

function coordinateInCanvas(x,y,isPixelCoordinate){
    if(isPixelCoordinate) return x >= 0 && x < width && y >= 0 && y < height;
    return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
}

function cbrt(n){   // Cubed root function since p5 doesn't have one nor does pow(n,1/3) work for negative numbers
    return n<0 ? -pow(abs(n),1/3) : pow(n,1/3);
}

function zeroPad(n,d){
    n = parseFloat(n);
    if(!Number.isNaN(n)){
        let str;
        let int = parseInt(n);
        if(int<0){
            int = int.toString().slice(1);
            str = '-' + int.padStart(d,'0');
        }else{
            int = int.toString();
            str = int.padStart(d,'0');
        }
        str = str.slice(0,-int.length);
        str += abs(n).toString();
        return str;
    }
}

function hashCode(str){
    let hash = 0;
    if(str.length === 0) return hash;
    for(let i = 0; i < str.length; i++){
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function loadImg(path){     // wrap p5.loadImage in a promise
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            loadImage(path,resolve,reject);
        });
    });
}

// waitForAsyncProcess allows the simulator to wait for things to load; unneeded for saving
function waitForAsyncProcess(func,desc,...args){  // add .then() callbacks inside of func before returning the promise, but add .catch() to the returned promise of waitForAsyncProcess
    waitingFor++;
    if(waitingFor<2)
        waitingTCSymbolSHem = random()<0.5;
    let descIndex = waitingDescs.lowestAvailable;
    if(descIndex > waitingDescs.maxIndex)
        waitingDescs.maxIndex = descIndex;
    for(let i=descIndex+1;i<=waitingDescs.maxIndex+1;i++){
        if(!waitingDescs[i]){
            waitingDescs.lowestAvailable = i;
            break;
        }
    }
    waitingDescs[descIndex] = desc;
    let endWait = ()=>{
        waitingFor--;
        waitingDescs[descIndex] = undefined;
        if(descIndex < waitingDescs.lowestAvailable)
            waitingDescs.lowestAvailable = descIndex;
        if(descIndex >= waitingDescs.maxIndex){
            for(let i=descIndex;i>=-1;i--){
                if(i<0 || waitingDescs[i]){
                    waitingDescs.maxIndex = i;
                    break;
                }
            }
        }
    };
    let p = func(...args);
    if(p instanceof Promise || p instanceof Dexie.Promise){
        return p.then(v=>{
            endWait();
            return v;
        }).catch(e=>{
            endWait();
            throw e;
        });
    }
    endWait();
    return Promise.resolve(p);
}

function makeAsyncProcess(func,...args){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            try{
                resolve(func(...args));
            }catch(err){
                reject(err);
            }
        });
    });
}

function upgradeLegacySaves(){
    return waitForAsyncProcess(()=>{
        return makeAsyncProcess(()=>{
            // Rename saved basin keys for save slot 0 from versions v20190217a and prior

            let oldPrefix = LOCALSTORAGE_KEY_PREFIX + '0-';
            let newPrefix = LOCALSTORAGE_KEY_PREFIX + LOCALSTORAGE_KEY_SAVEDBASIN + '0-';
            let f = LOCALSTORAGE_KEY_FORMAT;
            let b = LOCALSTORAGE_KEY_BASIN;
            let n = LOCALSTORAGE_KEY_NAMES;
            if(localStorage.getItem(oldPrefix+f)){
                localStorage.setItem(newPrefix+f,localStorage.getItem(oldPrefix+f));
                localStorage.removeItem(oldPrefix+f);
                localStorage.setItem(newPrefix+b,localStorage.getItem(oldPrefix+b));
                localStorage.removeItem(oldPrefix+b);
                localStorage.setItem(newPrefix+n,localStorage.getItem(oldPrefix+n));
                localStorage.removeItem(oldPrefix+n);
            }
        }).then(()=>{
            // Transfer localStorage saves to indexedDB

            return db.transaction('rw',db.saves,db.seasons,()=>{
                for(let i=0;i<localStorage.length;i++){
                    let k = localStorage.key(i);
                    if(k.startsWith(LOCALSTORAGE_KEY_PREFIX + LOCALSTORAGE_KEY_SAVEDBASIN)){
                        let s = k.slice((LOCALSTORAGE_KEY_PREFIX+LOCALSTORAGE_KEY_SAVEDBASIN).length);
                        s = s.split('-');
                        let name = parseInt(s[0]);
                        if(name===0) name = AUTOSAVE_SAVE_NAME;
                        else name = LEGACY_SAVE_NAME_PREFIX + name;
                        let pre = LOCALSTORAGE_KEY_PREFIX+LOCALSTORAGE_KEY_SAVEDBASIN+s[0]+'-';
                        if(s[1]===LOCALSTORAGE_KEY_FORMAT){
                            let obj = {};
                            obj.format = parseInt(localStorage.getItem(k),SAVING_RADIX);
                            obj.value = {};
                            obj.value.str = localStorage.getItem(pre+LOCALSTORAGE_KEY_BASIN);
                            obj.value.names = localStorage.getItem(pre+LOCALSTORAGE_KEY_NAMES);
                            db.saves.where(':id').equals(name).count().then(c=>{
                                if(c<1) db.saves.put(obj,name);
                            });
                        }else if(s[1]+'-'===LOCALSTORAGE_KEY_SEASON){
                            let y;
                            if(s[2]==='') y = -parseInt(s[3]);
                            else y = parseInt(s[2]);
                            let obj = {};
                            obj.format = FORMAT_WITH_SAVED_SEASONS;
                            obj.saveName = name;
                            obj.season = y;
                            obj.value = localStorage.getItem(k);
                            db.seasons.where('[saveName+season]').equals([name,y]).count().then(c=>{
                                if(c<1) db.seasons.put(obj);
                            });
                        }
                    }
                }
            }).then(()=>{
                for(let i=localStorage.length-1;i>=0;i--){
                    let k = localStorage.key(i);
                    if(k.startsWith(LOCALSTORAGE_KEY_PREFIX + LOCALSTORAGE_KEY_SAVEDBASIN)) localStorage.removeItem(k);
                }
            });
        });
    },'Upgrading...').catch(e=>{
        console.error(e);
    });
}

document.onfullscreenchange = function(){
    if(document.fullscreenElement===null){
        scaler = 1;
        rescaleCanvases(scaler);
        if(UI.viewBasin){
            refreshTracks(true);
            UI.viewBasin.env.displayLayer();
        }
    }
};

// --- START OF FILE: worker.ts ---

const WORKER_PATH = 'worker.js';

onmessage = function(e){
    let task = e.data.task;
    let id = e.data.id;
    let input = e.data.input;
    let output;
    let error;
    try{
        // test tasks
        if(task==='addfive') output = input + 5;
        else if(task==='saderror') throw 'a sad error';
        else if(task==='loopy'){
            output = 3;
            for(let i=0;i<input;i++) output *= 1.2;
        }
        else output = input;
    }catch(err){
        error = err;
        output = null;
    }
    postMessage({task, id, error, output});
};

class CSWorker{
    constructor(){
        this.worker = new Worker(WORKER_PATH);
        this.promiseHandlers = {};
        this.lowestFreeHandlerSlot = 0;
        this.busy = 0;
        this.worker.onmessage = e=>{
            let id = e.data.id;
            if(e.data.error) this.promiseHandlers[id].reject(e.data.error);
            else this.promiseHandlers[id].resolve(e.data.output);
            this.promiseHandlers[id] = undefined;
            if(id<this.lowestFreeHandlerSlot) this.lowestFreeHandlerSlot = id;
            this.busy--;
        };
    }

    run(task,input){
        return new Promise((resolve,reject)=>{
            let id = this.lowestFreeHandlerSlot;
            this.promiseHandlers[id] = {resolve,reject};
            while(this.promiseHandlers[this.lowestFreeHandlerSlot]!==undefined) this.lowestFreeHandlerSlot++;
            this.busy++;
            this.worker.postMessage({
                task,
                id,
                input
            });
        });
    }
}

// --- START OF FILE: sketch.ts ---

var paused,
    land,
    // landWorker,
    waitingFor,
    waitingDescs,
    waitingTCSymbolSHem,
    simSettings,
    // textInput,
    buffers,
    scaler,
    tracks,
    stormIcons,
    forecastTracks,
    landBuffer,
    outBasinBuffer,
    landShadows,
    coastLine,
    envLayer,
    magnifyingGlass,
    snow,
    simSpeed,
    lastUpdateTimestamp,
    keyRepeatFrameCounter,
    viewTick,
    selectedStorm,
    renderToDo,
    oldMouseX,
    oldMouseY,
    seasonCurve;

function setup(){
    setVersion(TITLE + " v",VERSION_NUMBER);
    document.title = TITLE;

    setupDatabase();

    createCanvas(WIDTH,HEIGHT);
    defineColors(); // Set the values of COLORS since color() can't be used before setup()
    background(COLORS.bg);
    paused = false;
    waitingFor = 0;
    waitingDescs = {};
    waitingDescs.lowestAvailable = 0;
    waitingDescs.maxIndex = -1;
    waitingTCSymbolSHem = false; // yes seriously, a global var for this
    simSettings = new Settings();

    // textInput = document.createElement("input");
    // textInput.type = "text";
    // document.body.appendChild(textInput);
    // textInput.style.position = "absolute";
    // textInput.style.left = "-500px";
    // textInput.onblur = ()=>{
    //     if(UI.focusedInput) UI.focusedInput.value = textInput.value;
    //     UI.focusedInput = undefined;
    // };

    // landWorker = new CSWorker();

    buffers = new Map();
    scaler = 1;

    let {fullW, fullH} = fullDimensions();
    tracks = createBuffer();
    tracks.strokeWeight(2);
    stormIcons = createBuffer();
    stormIcons.strokeWeight(3);
    forecastTracks = createBuffer();
    // forecastTracks.strokeWeight(2);
    // forecastTracks.stroke(240,240,0);
    // forecastTracks.noFill();
    forecastTracks.noStroke();
    forecastTracks.fill(255);
    landBuffer = createImage(fullW,fullH);
    landBuffer.loadPixels();
    // landBuffer.noStroke();
    outBasinBuffer = createImage(fullW,fullH);
    outBasinBuffer.loadPixels();
    // outBasinBuffer.noStroke();
    // outBasinBuffer.fill(COLORS.outBasin);
    landShadows = createImage(fullW,fullH);
    landShadows.loadPixels();
    // landShadows.noStroke();
    coastLine = createImage(fullW,fullH);
    coastLine.loadPixels();
    // coastLine.fill(0);
    // coastLine.noStroke();
    envLayer = createBuffer(WIDTH,HEIGHT,false,true);
    envLayer.colorMode(HSB);
    envLayer.strokeWeight(2);
    envLayer.noStroke();
    magnifyingGlass = createBuffer(ENV_LAYER_TILE_SIZE*4,ENV_LAYER_TILE_SIZE*4,false,true);
    magnifyingGlass.colorMode(HSB);
    magnifyingGlass.strokeWeight(2);
    magnifyingGlass.noStroke();
    snow = [];
    for(let i=0;i<MAX_SNOW_LAYERS;i++){
        snow[i] = createImage(fullW,fullH);
        snow[i].loadPixels();
        // snow[i].noStroke();
        // snow[i].fill(COLORS.snow);
    }

    simSpeed = 0; // The exponent for the simulation speed (0 is full-speed, 1 is half-speed, etc.)
    lastUpdateTimestamp = performance.now(); // Keeps track of how much time has passed since the last simulation step to control the simulation at varying speeds
    keyRepeatFrameCounter = 0;

    upgradeLegacySaves();
    UI.init();
}

function draw(){
    try{
        scale(scaler);
        background(COLORS.bg);
        if(waitingFor<1){   // waitingFor applies to asynchronous processes such as saving and loading
            if(UI.viewBasin instanceof Basin){
                if(renderToDo){     // renderToDo applies to synchronous single-threaded rendering functions
                    let t = renderToDo.next();
                    if(t.done){
                        renderToDo = undefined;
                        return;
                    }
                    push();
                    textSize(48);
                    textAlign(CENTER,CENTER);
                    text(t.value,WIDTH/2,HEIGHT/2);
                    pop();
                    return;
                }
                stormIcons.clear();
                if(!paused){
                    const step = STEP / Math.pow(2, simSpeed);
                    let delta = Math.floor((performance.now() - lastUpdateTimestamp) / step);
                    UI.viewBasin.advanceSim(delta);
                    lastUpdateTimestamp += delta * step;
                }
                if((mouseX!==oldMouseX || mouseY!==oldMouseY) && simSettings.showMagGlass) UI.viewBasin.env.updateMagGlass();
            }

            keyRepeatFrameCounter++;
            if(keyIsPressed /* && document.activeElement!==textInput */ && (keyRepeatFrameCounter>=KEY_REPEAT_COOLDOWN || keyRepeatFrameCounter===0) && keyRepeatFrameCounter%KEY_REPEATER===0)
                keyRepeat();
        
            UI.updateMouseOver();
            UI.renderAll();
        }else{
            let d = 100;
            push();
            translate(WIDTH/2,HEIGHT/2);
            push();
            noStroke();
            fill(COLORS.UI.loadingSymbol);
            ellipse(0,0,d);
            if(waitingTCSymbolSHem) scale(1,-1);
            rotate(millis()*-PI/500);
            beginShape();
            vertex(d*5/8,-d);
            bezierVertex(d*5/8,-d,-d*1/2,-d*7/8,-d*1/2,0);
            vertex(0,0);
            bezierVertex(-d*1/4,-d*5/8,d*5/8,-d,d*5/8,-d);
            endShape();
            rotate(PI);
            beginShape();
            vertex(d*5/8,-d);
            bezierVertex(d*5/8,-d,-d*1/2,-d*7/8,-d*1/2,0);
            vertex(0,0);
            bezierVertex(-d*1/4,-d*5/8,d*5/8,-d,d*5/8,-d);
            endShape();
            pop();
            textSize(48);
            textAlign(CENTER,CENTER);
            let desc = '';
            for(let i=0;i<=waitingDescs.maxIndex;i++){
                if(waitingDescs[i]){
                    if(desc !== '')
                        desc += '\n';
                    desc += waitingDescs[i];
                }
            }
            text(desc,0,0);
            pop();
        }
        oldMouseX = mouseX;
        oldMouseY = mouseY;
    }catch(err){            // BSOD
        resetMatrix();
        colorMode(RGB);
        background(15,15,200);
        fill(255);
        textSize(24);
        textAlign(LEFT,TOP);
        text("The program has committed a crime and will now cease to exist. :(",width/16,height/8);
        textSize(15);
        text(err.stack,width/16,height/4);
        console.error(err);
        noLoop();
    }
}

class Settings{
    constructor(){
        const order = Settings.order();
        const defaults = Settings.defaults();
        waitForAsyncProcess(()=>{
            return db.settings.get(DB_KEY_SETTINGS);
        },'Retrieving Settings...').catch(err=>{
            console.error(err);
        }).then(result=>{
            let v = result;
            if(!v){
                let lsKey = LOCALSTORAGE_KEY_PREFIX + LOCALSTORAGE_KEY_SETTINGS;
                v = localStorage.getItem(lsKey);
                if(v){
                    v = decodeB36StringArray(v);
                    db.settings.put(v,DB_KEY_SETTINGS).then(()=>{
                        localStorage.removeItem(lsKey);
                    }).catch(err=>{
                        console.error(err);
                    });
                }else v = [];
            }
            for(let i=order.length-1;i>=0;i--){
                if(v.length>0) this[order[i]] = v.pop();
                else this[order[i]] = defaults[i];
            }
            let sf = (k)=>{
                return (v,v2)=>{
                    this.set(k,v,v2);
                };
            };
            for(let i=0;i<order.length;i++){
                let n = "set" + order[i].charAt(0).toUpperCase() + order[i].slice(1);
                this[n] = sf(order[i]);
            }
        });
    }

    static order(){
        return ["colorScheme","speedUnit","smoothLandColor","showMagGlass","snowLayers","useShadows","trackMode","showStrength","doAutosave"];    // add new settings to the beginning of this array
    }

    static defaults(){
        return [0,0,true,false,2,false,0,false,true];  // add new defaults to the beginning of this array
    }

    save(){
        const order = Settings.order();
        let v = [];
        for(let i=0;i<order.length;i++){
            v.push(this[order[i]]);
        }
        db.settings.put(v,DB_KEY_SETTINGS).catch(err=>{
            console.error(err);
        });
    }

    set(k,v,v2){
        if(v==="toggle") this[k] = !this[k];
        else if(v==="incmod"){
            this[k]++;
            this[k] %= v2;
        }else this[k] = v;
        this.save();
    }

    get(k){         // accessing the property directly also works (only for getting)
        return this[k];
    }
}


// --- START OF FILE: version.ts ---

// Declare globally on window so they can be accessed from other files if needed
let versionLink = document.getElementById("version");
let Version: any = {};

Version.number = "0.0";
Version.prefix = "v";

function versionLinkUpdate(){
	if (versionLink) {
		versionLink.innerHTML = Version.prefix + Version.number;
	}
}

function versionNumber(val){
	Version.number = val;
	versionLinkUpdate();
}

function versionPrefix(val){
	Version.prefix = val;
	versionLinkUpdate();
}

function setVersion(p,n){
	Version.prefix = p;
	Version.number = n;
	versionLinkUpdate();
}

if(versionLink && versionLink.tagName === "A"){
	versionLink.setAttribute("href","./changelog.txt");
}

versionLinkUpdate();

// Expose globally
Object.assign(window, {
	versionLink,
	Version,
	versionLinkUpdate,
	versionNumber,
	versionPrefix,
	setVersion
});


// Expose p5-style lifecycle and input callbacks from the ES module.
Object.assign(window, {
  setup,
  draw,
  mouseClicked,
  keyPressed,
  keyTyped,
  keyReleased,
  seasonalSine,
  spookySeasonCurve
});
