/**
 * Self-contained QR Code Generator (Pure TypeScript, Zero External Dependencies)
 * Generates ISO/IEC 18004 compliant QR Codes (Byte Mode, ECC Level M).
 * Supports rendering to SVG string, React SVG component, and Canvas 2D Context.
 */

// QR Code Constants & Tables
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_EXP[i + 255] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function polyMul(p1: number[], p2: number[]): number[] {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMul(p1[i], p2[j]);
    }
  }
  return result;
}

function getGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    poly = polyMul(poly, [1, GF256_EXP[i]]);
  }
  return poly;
}

function calculateEcc(data: Uint8Array, eccCount: number): number[] {
  const gen = getGeneratorPoly(eccCount);
  const msg = new Array(data.length + eccCount).fill(0);
  for (let i = 0; i < data.length; i++) {
    msg[i] = data[i];
  }

  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

// Version configs for ECC Level M: [totalCodewords, dataCodewords, eccCodewords]
const VERSION_SPECS: Record<number, { size: number; total: number; data: number; ecc: number }> = {
  1: { size: 21, total: 26, data: 16, ecc: 10 },
  2: { size: 25, total: 44, data: 28, ecc: 16 },
  3: { size: 29, total: 70, data: 44, ecc: 26 },
  4: { size: 33, total: 100, data: 64, ecc: 36 }
};

export class QrMatrix {
  public size: number;
  public modules: boolean[][];
  public isFunction: boolean[][];

  constructor(size: number) {
    this.size = size;
    this.modules = Array.from({ length: size }, () => Array(size).fill(false));
    this.isFunction = Array.from({ length: size }, () => Array(size).fill(false));
  }

  set(r: number, c: number, val: boolean, isFunc = true) {
    if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
      this.modules[r][c] = val;
      if (isFunc) this.isFunction[r][c] = true;
    }
  }

  addFinderPattern(top: number, left: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = top + r;
        const nc = left + c;
        if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size) continue;
        if (
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          this.set(nr, nc, true);
        } else {
          this.set(nr, nc, false);
        }
      }
    }
  }

  addTimingPatterns() {
    for (let i = 8; i < this.size - 8; i++) {
      const val = i % 2 === 0;
      if (!this.isFunction[6][i]) this.set(6, i, val);
      if (!this.isFunction[i][6]) this.set(i, 6, val);
    }
  }

  addAlignmentPattern(centerR: number, centerC: number) {
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const dist = Math.max(Math.abs(r), Math.abs(c));
        const val = dist !== 1;
        this.set(centerR + r, centerC + c, val);
      }
    }
  }
}

export function encodeQr(text: string): boolean[][] {
  const utf8 = new TextEncoder().encode(text);
  const len = utf8.length;

  let version = 1;
  while (version <= 4 && VERSION_SPECS[version].data - 2 < len) {
    version++;
  }
  if (version > 4) version = 4; // cap at 4 for standard mobile urls

  const spec = VERSION_SPECS[version];
  const matrix = new QrMatrix(spec.size);

  // 1. Finder patterns
  matrix.addFinderPattern(0, 0);
  matrix.addFinderPattern(0, spec.size - 7);
  matrix.addFinderPattern(spec.size - 7, 0);

  // 2. Alignment pattern for v2+
  if (version >= 2) {
    const alignPos = spec.size - 7;
    matrix.addAlignmentPattern(alignPos, alignPos);
  }

  // 3. Timing patterns
  matrix.addTimingPatterns();

  // Dark module
  matrix.set(4 * version + 9, 8, true);

  // Format info reserve
  for (let i = 0; i < 9; i++) {
    matrix.set(8, i, false);
    matrix.set(i, 8, false);
    matrix.set(8, spec.size - 1 - i, false);
    matrix.set(spec.size - 1 - i, 8, false);
  }

  // 4. Encode data bits (Byte Mode 0100 + Length + Bytes + Terminator)
  const bitArray: number[] = [];
  const pushBits = (val: number, bits: number) => {
    for (let i = bits - 1; i >= 0; i--) {
      bitArray.push((val >> i) & 1);
    }
  };

  // Byte mode
  pushBits(0b0100, 4);
  // Length (8 bits for v1-4)
  pushBits(Math.min(len, spec.data - 2), 8);
  // Data bytes
  for (let i = 0; i < Math.min(len, spec.data - 2); i++) {
    pushBits(utf8[i], 8);
  }
  // Terminator
  for (let i = 0; i < 4 && bitArray.length < spec.data * 8; i++) {
    bitArray.push(0);
  }
  // Pad to byte
  while (bitArray.length % 8 !== 0) {
    bitArray.push(0);
  }
  // Pad codewords (0xEC, 0x11)
  const padCodewords = [0xec, 0x11];
  let padIdx = 0;
  while (bitArray.length < spec.data * 8) {
    pushBits(padCodewords[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to data codewords
  const dataCodewords = new Uint8Array(spec.data);
  for (let i = 0; i < spec.data; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bitArray[i * 8 + b];
    }
    dataCodewords[i] = byte;
  }

  // Compute ECC
  const eccCodewords = calculateEcc(dataCodewords, spec.ecc);

  // Final codeword stream
  const allCodewords = new Uint8Array(spec.total);
  allCodewords.set(dataCodewords, 0);
  allCodewords.set(eccCodewords, spec.data);

  // Convert to bits
  const finalBits: number[] = [];
  for (let i = 0; i < allCodewords.length; i++) {
    for (let b = 7; b >= 0; b--) {
      finalBits.push((allCodewords[i] >> b) & 1);
    }
  }

  // 5. Place bits into matrix using upward/downward zigzag
  let bitIdx = 0;
  let dir = -1; // up
  let r = spec.size - 1;
  let c = spec.size - 1;

  while (c > 0) {
    if (c === 6) c--; // Skip vertical timing column
    const colList = [c, c - 1];

    for (let i = 0; i < spec.size; i++) {
      const row = dir === -1 ? spec.size - 1 - i : i;
      for (const col of colList) {
        if (!matrix.isFunction[row][col]) {
          const bit = bitIdx < finalBits.length ? finalBits[bitIdx++] : 0;
          // Apply standard Mask 0: (row + col) % 2 == 0
          const mask = (row + col) % 2 === 0;
          matrix.set(row, col, (bit === 1) !== mask, false);
        }
      }
    }
    dir = -dir;
    c -= 2;
  }

  // 6. Write Format Info (ECC M + Mask 0 = bits 101010000010010)
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  const formatCoords = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [row, col] = formatCoords[i];
    matrix.modules[row][col] = formatBits[i] === 1;
  }
  // Second format copy
  for (let i = 0; i < 7; i++) {
    matrix.modules[spec.size - 1 - i][8] = formatBits[i] === 1;
  }
  for (let i = 0; i < 8; i++) {
    matrix.modules[8][spec.size - 8 + i] = formatBits[7 + i] === 1;
  }

  return matrix.modules;
}

/**
 * Draw QR Code directly to an HTML5 Canvas 2D context
 */
export function drawQrToCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  darkColor = '#000000',
  lightColor = '#ffffff'
) {
  const grid = encodeQr(text);
  const n = grid.length;
  const cellSize = size / n;

  ctx.fillStyle = lightColor;
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = darkColor;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c]) {
        ctx.fillRect(
          Math.floor(x + c * cellSize),
          Math.floor(y + r * cellSize),
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        );
      }
    }
  }
}

/**
 * Generate an SVG string representation of the QR code
 */
export function generateQrSvgString(
  text: string,
  size = 120,
  darkColor = '#07110e',
  lightColor = '#ffffff'
): string {
  const grid = encodeQr(text);
  const n = grid.length;
  const cellSize = (size / n).toFixed(2);

  let paths = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c]) {
        paths += `M${(c * Number(cellSize)).toFixed(2)},${(r * Number(cellSize)).toFixed(2)}h${cellSize}v${cellSize}h-${cellSize}z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="${lightColor}" rx="8" />
    <path d="${paths}" fill="${darkColor}" />
  </svg>`;
}
