export type RainbowPointer = {
  x: number;
  y: number;
  active: boolean;
};

export type RainbowArcShape = 'line' | 'circle';
export type RainbowLineCap = 'round' | 'square';

export type RainbowArcConfig = {
  lineWidth: number;
  lineLength: number;
  density: number;
  numOfRows: number;
  linecap: RainbowLineCap;
  shape: RainbowArcShape;
};

/** Defaults from Josh W. Comeau's live rainbow configurator */
export const RAINBOW_ARC_DEFAULTS: RainbowArcConfig = {
  lineWidth: 0,
  lineLength: 0.25,
  density: 55,
  numOfRows: 10,
  linecap: 'round',
  shape: 'line',
};

export type DrawRainbowArcOptions = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  colors: string[];
  mountAt: number;
  timeMs: number;
  pointer: RainbowPointer;
  mouseEnabledRatio: number;
  isAnimated: boolean;
  opacity: number;
  config?: Partial<RainbowArcConfig>;
};

const TAU = Math.PI * 2;

function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  if (inMax === inMin) {
    return outMin;
  }

  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function clampAngle(angle: number) {
  let result = angle;

  while (result < -Math.PI) {
    result += TAU;
  }

  while (result > Math.PI) {
    result -= TAU;
  }

  return result;
}

function smoothstep(value: number) {
  const t = Math.min(Math.max(value, 0), 1);
  return t * t * (3 - 2 * t);
}

const ARC_START = Math.PI;
const ARC_END = TAU;
const ARC_EDGE_FADE = 0.2;

function getArcEdgeFalloff(angle: number) {
  const progress = mapRange(angle, ARC_START, ARC_END, 0, 1);

  if (progress <= ARC_EDGE_FADE) {
    return smoothstep(progress / ARC_EDGE_FADE);
  }

  if (progress >= 1 - ARC_EDGE_FADE) {
    return smoothstep((1 - progress) / ARC_EDGE_FADE);
  }

  return 1;
}

const BASELINE_FADE = 0.38;

function getBaselineFalloff(segmentY: number, canvasHeight: number) {
  const distanceAboveBottom = canvasHeight - segmentY;

  if (distanceAboveBottom >= canvasHeight * BASELINE_FADE) {
    return 1;
  }

  return smoothstep(distanceAboveBottom / (canvasHeight * BASELINE_FADE));
}

function blendAngles(
  segmentAngle: number,
  mouseAngle: number,
  ratio: number,
) {
  const segmentMapped = mapRange(segmentAngle, -Math.PI, Math.PI, 0, 100);
  const mouseMapped = mapRange(mouseAngle, -Math.PI, Math.PI, 0, 100);
  const blended = segmentMapped * (1 - ratio) + mouseMapped * ratio;

  return mapRange(blended, 0, 100, -Math.PI, Math.PI);
}

export function getRainbowStripeColors(shell: HTMLElement | null) {
  if (!shell) {
    return [];
  }

  const style = getComputedStyle(shell);
  return Array.from({ length: 12 }, (_, index) =>
    style.getPropertyValue(`--rainbow-stripe-${index + 1}`).trim(),
  ).filter(Boolean);
}

export function getRainbowThemeOpacity() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 0.96
    : 0.94;
}

function getRowColor(
  rowIndex: number,
  numOfRows: number,
  colors: string[],
) {
  const paletteSpan = numOfRows === 8 ? 8 : 10;
  const colorIndex = Math.floor(
    mapRange(rowIndex, 0, numOfRows, 0, paletteSpan),
  );

  return colors[colorIndex % colors.length] ?? colors[0];
}

function drawSegmentLine(
  ctx: CanvasRenderingContext2D,
  segmentX: number,
  segmentY: number,
  segmentAngle: number,
  mouseX: number,
  mouseY: number,
  segmentLength: number,
  mouseEnabledRatio: number,
) {
  const tangentAngle = clampAngle(segmentAngle + Math.PI / 2);
  const deltaX = mouseX - segmentX;
  let mouseAngle = Math.atan2(mouseY - segmentY, deltaX);

  if (deltaX > 0) {
    mouseAngle -= Math.PI;
  }

  mouseAngle = clampAngle(mouseAngle - Math.PI);
  const drawAngle = blendAngles(tangentAngle, mouseAngle, mouseEnabledRatio);
  const halfLength = segmentLength * 0.5;
  const offsetX = halfLength * Math.cos(drawAngle);
  const offsetY = halfLength * Math.sin(drawAngle);

  ctx.beginPath();
  ctx.moveTo(segmentX - offsetX, segmentY - offsetY);
  ctx.lineTo(segmentX + offsetX, segmentY + offsetY);
  ctx.stroke();
}

function drawSegmentCircle(
  ctx: CanvasRenderingContext2D,
  segmentX: number,
  segmentY: number,
  segmentAngle: number,
  mouseX: number,
  mouseY: number,
  segmentLength: number,
  mouseEnabledRatio: number,
) {
  const pointerX = mapRange(mouseEnabledRatio, 0, 1, segmentX * 0.4, mouseX);
  const pointerY = mapRange(
    mouseEnabledRatio,
    0,
    1,
    segmentY * 0.5,
    mouseY,
  );

  const deltaX = segmentX - pointerX;
  const deltaY = segmentY - pointerY;
  const distance = Math.hypot(deltaX, deltaY);
  const halfLength = segmentLength * 0.5;

  let startX: number;
  let startY: number;
  let endX: number;
  let endY: number;

  if (distance <= 300) {
    const falloff = mapRange(distance, 0, 300, 1, 0);
    const scale = halfLength / Math.max(distance, 0.001);
    const pushX = deltaX * scale * falloff;
    const pushY = deltaY * scale * falloff;
    startX = segmentX - pushX;
    startY = segmentY - pushY;
    endX = segmentX + pushX;
    endY = segmentY + pushY;
  } else {
    const wiggleX = 0.01 * Math.cos(segmentAngle);
    const wiggleY = 0.01 * Math.sin(segmentAngle);
    startX = segmentX - wiggleX;
    startY = segmentY - wiggleY;
    endX = segmentX + wiggleX;
    endY = segmentY + wiggleY;
  }

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

export function drawRainbowArc({
  ctx,
  width,
  height,
  colors,
  mountAt,
  timeMs,
  pointer,
  mouseEnabledRatio,
  isAnimated,
  opacity,
  config,
}: DrawRainbowArcOptions) {
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  if (colors.length === 0 || width <= 0 || height <= 0) {
    return;
  }

  const settings = { ...RAINBOW_ARC_DEFAULTS, ...config };
  const {
    lineWidth,
    lineLength,
    density,
    numOfRows,
    linecap,
    shape,
  } = settings;

  const angularDensity = mapRange(density, 0, 100, 450, 115);
  const pivotMultiplier = mapRange(numOfRows, 3, 10, 1.2, 1.325);
  const centerX = width * 0.5;
  const pivotY = height * pivotMultiplier;
  const baseRadius = width * 0.4;
  const strokeWidth = mapRange(
    lineWidth,
    -1,
    1,
    shape === 'line' ? 18 : 25,
    2,
  );
  const segmentLength = mapRange(lineLength, -1, 1, 4, 40);
  const elapsed = isAnimated ? timeMs - (mountAt + 200) : 10_000;
  const isEntering = elapsed < 2000;
  const enterProgress = mapRange(elapsed, 0, 2000, 0, 1);

  const mouseX = pointer.x * width;
  const mouseY = pointer.y * height;

  ctx.lineWidth = strokeWidth;
  ctx.lineCap = linecap;

  for (let row = 0; row < numOfRows; row += 1) {
    const radius = baseRadius + 100 * row * 0.1575;
    const angleStep = angularDensity / (TAU * radius);
    const rowColor = getRowColor(row, numOfRows, colors);
    const rowDepth = row / Math.max(numOfRows - 1, 1);

    ctx.strokeStyle = rowColor;

    for (let angle = ARC_START; angle < ARC_END; angle += angleStep) {
      if (
        isEntering &&
        mapRange(angle, ARC_START, ARC_END, 0, 1) > enterProgress
      ) {
        continue;
      }

      const edgeFalloff = getArcEdgeFalloff(angle);

      const segmentX = centerX + radius * Math.cos(angle);
      const segmentY = pivotY + radius * Math.sin(angle);
      const baselineFalloff = getBaselineFalloff(segmentY, height);
      const combinedFalloff = edgeFalloff * baselineFalloff;

      if (combinedFalloff <= 0.02) {
        continue;
      }

      const taperedLength =
        segmentLength *
        (0.35 + 0.65 * combinedFalloff) *
        (0.92 + rowDepth * 0.08);
      const segmentAlpha = opacity * combinedFalloff;

      ctx.save();
      ctx.globalAlpha = segmentAlpha;

      if (shape === 'circle') {
        drawSegmentCircle(
          ctx,
          segmentX,
          segmentY,
          angle,
          mouseX,
          mouseY,
          taperedLength,
          mouseEnabledRatio,
        );
      } else {
        drawSegmentLine(
          ctx,
          segmentX,
          segmentY,
          angle,
          mouseX,
          mouseY,
          taperedLength,
          mouseEnabledRatio,
        );
      }

      ctx.restore();
    }
  }
}
