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

function brightness(c: Color | number): number {
  if (typeof c === 'number') return c;
  if (isHSBMode(c.mode)) return c.b;
  const hsb = rgbToHsb(c.r, c.g, c.b);
  return hsb[2];
}

function red(c: Color | number): number {
  if (typeof c === 'number') return c;
  if (isHSBMode(c.mode)) {
    const rgb = hsbToRgb(c.r, c.g, c.b);
    return rgb[0];
  }
  return c.r;
}

function green(c: Color | number): number {
  if (typeof c === 'number') return c;
  if (isHSBMode(c.mode)) {
    const rgb = hsbToRgb(c.r, c.g, c.b);
    return rgb[1];
  }
  return c.g;
}

function blue(c: Color | number): number {
  if (typeof c === 'number') return c;
  if (isHSBMode(c.mode)) {
    const rgb = hsbToRgb(c.r, c.g, c.b);
    return rgb[2];
  }
  return c.b;
}

function alpha(c: Color | number): number {
  if (typeof c === 'number') return 255;
  return Math.round(c.a * 255);
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

  textSize(s: number) {
    this.currentDrawingState.textSizeVal = s;
    this.ctx.font = `${s}px ${this.currentDrawingState.textFontVal}`;
  }

  textLeading(leading: number) {
    this.currentDrawingState.textLeadingVal = leading;
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

  textFont(f: string) {
    this.currentDrawingState.textFontVal = f;
    this.ctx.font = `${this.currentDrawingState.textSizeVal}px ${f}`;
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

  textLeading(leading: number) {
    // no-op
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
const textSize = (s: number) => mainCanvasBuffer.textSize(s);
const textAlign = (h: string, v?: string) => mainCanvasBuffer.textAlign(h, v);
const textFont = (f: string) => mainCanvasBuffer.textFont(f);
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

  canvas.addEventListener('mousemove', (e) => {
    updateMouse(e.clientX, e.clientY);
  });

  canvas.addEventListener('mousedown', (e) => {
    mouseIsPressed = true;
    updateMouse(e.clientX, e.clientY);
    if (typeof (window as any).mousePressed === 'function') {
      (window as any).mousePressed(e);
    }
  });

  window.addEventListener('mouseup', (e) => {
    mouseIsPressed = false;
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
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateMouse(touch.clientX, touch.clientY);
      if (typeof (window as any).touchMoved === 'function') {
        const res = (window as any).touchMoved(e);
        if (res === false) e.preventDefault();
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseIsPressed = true;
      updateMouse(touch.clientX, touch.clientY);
      if (typeof (window as any).touchStarted === 'function') {
        const res = (window as any).touchStarted(e);
        if (res === false) e.preventDefault();
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    mouseIsPressed = false;
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
const textLeading = (leading: number) => mainCanvasBuffer.textLeading(leading);
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
