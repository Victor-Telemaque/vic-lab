export type DeliveryPoint = {
  x: number;
  y: number;
};

export type DeliveryChartPalette = {
  stripes: string[];
  ink: string;
  surface: string;
  muted: string;
};

export type DrawDeliveryChartOptions = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  palette: DeliveryChartPalette;
  progress: number;
  timeMs: number;
  pointer: { x: number; y: number; active: boolean };
  isAnimated: boolean;
};

const CURVE_POINTS: DeliveryPoint[] = [
  { x: 0.07, y: 0.84 },
  { x: 0.19, y: 0.78 },
  { x: 0.31, y: 0.66 },
  { x: 0.45, y: 0.53 },
  { x: 0.59, y: 0.39 },
  { x: 0.73, y: 0.25 },
  { x: 0.9, y: 0.13 },
];

const TAU = Math.PI * 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function toHsla(color: string, alpha: number) {
  const modern = color.match(/hsl\(\s*([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%\s*\)/i);
  if (modern) {
    return `hsla(${modern[1]}, ${modern[2]}%, ${modern[3]}%, ${alpha})`;
  }

  const legacy = color.match(/hsl\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%\s*\)/i);
  if (legacy) {
    return `hsla(${legacy[1]}, ${legacy[2]}%, ${legacy[3]}%, ${alpha})`;
  }

  return color;
}

function withAlpha(ctx: CanvasRenderingContext2D, color: string, alpha: number, draw: () => void) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  draw();
  ctx.restore();
}

function sampleSpline(points: DeliveryPoint[], samplesPerSegment = 28): DeliveryPoint[] {
  if (points.length < 2) {
    return points;
  }

  const result: DeliveryPoint[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(index - 1, 0)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(index + 2, points.length - 1)];

    for (let step = 0; step < samplesPerSegment; step += 1) {
      const t = step / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;

      result.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }

  result.push(points[points.length - 1]);
  return result;
}

function toCanvasPoint(
  point: DeliveryPoint,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  parallax: DeliveryPoint,
): DeliveryPoint {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  return {
    x: padding.left + (point.x + parallax.x) * chartWidth,
    y: padding.top + (point.y + parallax.y) * chartHeight,
  };
}

function buildCurve(
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  parallax: DeliveryPoint,
) {
  return sampleSpline(CURVE_POINTS).map((point) =>
    toCanvasPoint(point, width, height, padding, parallax),
  );
}

function trimCurve(curve: DeliveryPoint[], progress: number) {
  const eased = smoothstep(progress);
  if (eased <= 0.001) {
    return [];
  }

  const count = Math.max(2, Math.floor(curve.length * eased));
  return curve.slice(0, count);
}

function strokeCurve(ctx: CanvasRenderingContext2D, curve: DeliveryPoint[]) {
  if (curve.length < 2) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(curve[0].x, curve[0].y);

  for (let index = 1; index < curve.length; index += 1) {
    ctx.lineTo(curve[index].x, curve[index].y);
  }

  ctx.stroke();
}

function fillArea(
  ctx: CanvasRenderingContext2D,
  curve: DeliveryPoint[],
  baselineY: number,
) {
  if (curve.length < 2) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(curve[0].x, baselineY);
  ctx.lineTo(curve[0].x, curve[0].y);

  for (let index = 1; index < curve.length; index += 1) {
    ctx.lineTo(curve[index].x, curve[index].y);
  }

  const last = curve[curve.length - 1];
  ctx.lineTo(last.x, baselineY);
  ctx.closePath();
  ctx.fill();
}

function drawDotField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  ink: string,
  reveal: number,
) {
  const spacing = Math.max(16, Math.round(width / 26));
  const radius = clamp(width / 520, 0.55, 0.95);

  for (let x = spacing * 0.6; x < width; x += spacing) {
    for (let y = spacing * 0.8; y < height; y += spacing) {
      const wave =
        0.55 +
        0.45 *
          Math.sin(x * 0.035 + y * 0.028);
      const alpha = reveal * (0.035 + wave * 0.03);

      withAlpha(ctx, ink, alpha, () => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
      });
    }
  }
}

function drawAmbient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: DeliveryChartPalette,
  reveal: number,
) {
  const blobs = [
    { x: width * 0.18, y: height * 0.72, radius: width * 0.24, color: palette.stripes[5] },
    { x: width * 0.72, y: height * 0.22, radius: width * 0.2, color: palette.stripes[2] },
    { x: width * 0.52, y: height * 0.42, radius: width * 0.16, color: palette.stripes[3] },
  ];

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (const blob of blobs) {
    const gradient = ctx.createRadialGradient(
      blob.x,
      blob.y,
      0,
      blob.x,
      blob.y,
      blob.radius,
    );
    gradient.addColorStop(0, toHsla(blob.color, reveal * 0.34));
    gradient.addColorStop(1, toHsla(blob.color, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, blob.radius, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawEndpoint(
  ctx: CanvasRenderingContext2D,
  point: DeliveryPoint,
  palette: DeliveryChartPalette,
  progress: number,
  timeMs: number,
  isAnimated: boolean,
) {
  const reveal = smoothstep((progress - 0.72) / 0.28);
  if (reveal <= 0) {
    return;
  }

  const pulse = isAnimated ? 0.5 + Math.sin(timeMs * 0.0035) * 0.5 : 0.65;
  const rings = [
    { radius: 26, alpha: 0.1 },
    { radius: 18, alpha: 0.16 },
    { radius: 11, alpha: 0.24 },
  ];

  for (const ring of rings) {
    withAlpha(
      ctx,
      palette.stripes[1] ?? palette.ink,
      ring.alpha * reveal * (0.75 + pulse * 0.25),
      () => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, ring.radius, 0, TAU);
        ctx.fill();
      },
    );
  }

  ctx.beginPath();
  ctx.fillStyle = palette.surface;
  ctx.arc(point.x, point.y, 7.5, 0, TAU);
  ctx.fill();

  ctx.lineWidth = 2.25;
  ctx.strokeStyle = palette.stripes[0] ?? palette.ink;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 7.5, 0, TAU);
  ctx.stroke();

  withAlpha(ctx, palette.stripes[0] ?? palette.ink, 0.78, () => {
    ctx.beginPath();
    ctx.arc(point.x - 1.4, point.y - 1.6, 2.2, 0, TAU);
    ctx.fill();
  });
}

export function getDeliveryChartPalette(shell: HTMLElement | null): DeliveryChartPalette {
  const target = shell ?? document.documentElement;
  const style = getComputedStyle(target);

  return {
    stripes: Array.from({ length: 12 }, (_, index) =>
      style.getPropertyValue(`--rainbow-stripe-${index + 1}`).trim(),
    ).filter(Boolean),
    ink: style.getPropertyValue('--color-text').trim() || '#111111',
    surface: style.getPropertyValue('--color-bg').trim() || '#ffffff',
    muted: style.getPropertyValue('--color-text-muted').trim() || '#5c5c5c',
  };
}

export function drawDeliveryChart({
  ctx,
  width,
  height,
  palette,
  progress,
  timeMs,
  pointer,
  isAnimated,
}: DrawDeliveryChartOptions) {
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const padding = {
    top: height * 0.12,
    right: width * 0.06,
    bottom: height * 0.16,
    left: width * 0.07,
  };

  const reveal = smoothstep(progress);
  const parallax = pointer.active
    ? {
        x: (pointer.x - 0.5) * 0.012,
        y: (pointer.y - 0.5) * 0.01,
      }
    : { x: 0, y: 0 };

  const fullCurve = buildCurve(width, height, padding, parallax);
  const curve = trimCurve(fullCurve, progress);
  const baselineY = height - padding.bottom;
  const stripes = palette.stripes.length > 0 ? palette.stripes : ['#ffc2db', '#b8e9ff', '#e2d4ff'];

  drawAmbient(ctx, width, height, palette, reveal);
  drawDotField(ctx, width, height, palette.ink, reveal * 0.9);

  if (curve.length > 1) {
    const areaGradient = ctx.createLinearGradient(0, padding.top, 0, baselineY);
    areaGradient.addColorStop(0, toHsla(stripes[1], 0.28));
    areaGradient.addColorStop(0.45, toHsla(stripes[3], 0.16));
    areaGradient.addColorStop(1, toHsla(stripes[5], 0.04));

    ctx.save();
    ctx.globalAlpha = reveal * 0.92;
    ctx.fillStyle = areaGradient;
    fillArea(ctx, curve, baselineY);
    ctx.restore();

    const lineGradient = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0);
    lineGradient.addColorStop(0, stripes[5] ?? stripes[0]);
    lineGradient.addColorStop(0.45, stripes[3] ?? stripes[1]);
    lineGradient.addColorStop(1, stripes[0] ?? stripes[2]);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = lineGradient;
    ctx.shadowColor = toHsla(stripes[2], 0.55);
    ctx.shadowBlur = 24;
    ctx.lineWidth = 9;
    strokeCurve(ctx, curve);
    ctx.restore();

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3.2;
    strokeCurve(ctx, curve);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = palette.surface;
    ctx.lineWidth = 1.1;
    ctx.translate(0, -1.1);
    strokeCurve(ctx, curve);
    ctx.restore();
  }

  const endpoint = fullCurve[fullCurve.length - 1];
  if (endpoint) {
    drawEndpoint(ctx, endpoint, palette, progress, timeMs, isAnimated);
  }

  ctx.save();
  ctx.globalAlpha = reveal * 0.55;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left - 8, baselineY);
  ctx.lineTo(width - padding.right + 10, baselineY);
  ctx.stroke();
  ctx.restore();
}
