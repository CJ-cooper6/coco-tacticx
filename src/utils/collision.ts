import type { Drawing } from "@/types/drawing";

// 检查点是否在圆内
export function isPointInCircle(x: number, y: number, centerX: number, centerY: number, radius: number): boolean {
  const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  return distance <= radius;
}

// 检查橡皮擦（圆形）与线段的碰撞
export function isCircleIntersectLine(
  centerX: number,
  centerY: number,
  radius: number,
  lineStartX: number,
  lineStartY: number,
  lineEndX: number,
  lineEndY: number
): boolean {
  // 计算线段到圆心的距离
  const A = centerX - lineStartX;
  const B = centerY - lineStartY;
  const C = lineEndX - lineStartX;
  const D = lineEndY - lineStartY;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  if (lenSq === 0) {
    // 线段是一个点
    return isPointInCircle(lineStartX, lineStartY, centerX, centerY, radius);
  }

  const param = dot / lenSq;

  let xx: number;
  let yy: number;

  if (param < 0) {
    xx = lineStartX;
    yy = lineStartY;
  } else if (param > 1) {
    xx = lineEndX;
    yy = lineEndY;
  } else {
    xx = lineStartX + param * C;
    yy = lineStartY + param * D;
  }

  return isPointInCircle(xx, yy, centerX, centerY, radius);
}

// 检查橡皮擦（圆形）与路径的碰撞
export function isCircleIntersectPath(
  centerX: number,
  centerY: number,
  radius: number,
  pathPoints: [number, number][]
): boolean {
  if (pathPoints.length < 2) return false;

  // 检查是否有任何点在圆内
  const hasPointInCircle = pathPoints.some(([x, y]) => isPointInCircle(x, y, centerX, centerY, radius));
  if (hasPointInCircle) {
    return true;
  }

  // 检查是否有任何线段与圆相交
  const hasLineIntersection = pathPoints.some((_, i) => {
    if (i >= pathPoints.length - 1) return false;
    const [x1, y1] = pathPoints[i];
    const [x2, y2] = pathPoints[i + 1];
    return isCircleIntersectLine(centerX, centerY, radius, x1, y1, x2, y2);
  });

  return hasLineIntersection;
}

// 矩形边框可以分解成 4 条线段，直接复用 isCircleIntersectLine
export function isCircleTouchRectBorder(
  centerX: number,
  centerY: number,
  radius: number,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number
): boolean {
  const x1 = rectX;
  const y1 = rectY;
  const x2 = rectX + rectWidth;
  const y2 = rectY;
  const x3 = rectX + rectWidth;
  const y3 = rectY + rectHeight;
  const x4 = rectX;
  const y4 = rectY + rectHeight;

  return (
    isCircleIntersectLine(centerX, centerY, radius, x1, y1, x2, y2) || // 上边
    isCircleIntersectLine(centerX, centerY, radius, x2, y2, x3, y3) || // 右边
    isCircleIntersectLine(centerX, centerY, radius, x3, y3, x4, y4) || // 下边
    isCircleIntersectLine(centerX, centerY, radius, x4, y4, x1, y1) // 左边
  );
}

// 检查橡皮擦（圆形）与椭圆的碰撞
export function isCircleTouchEllipseBorder(
  centerX: number,
  centerY: number,
  radius: number,
  ellipseCenterX: number,
  ellipseCenterY: number,
  ellipseWidth: number,
  ellipseHeight: number
): boolean {
  const rx = Math.abs(ellipseWidth) / 2;
  const ry = Math.abs(ellipseHeight) / 2;
  const segments = 72; // 精细程度
  const points: [number, number][] = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = ellipseCenterX + rx * Math.cos(theta);
    const y = ellipseCenterY + ry * Math.sin(theta);
    points.push([x, y]);
  }

  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    if (isCircleIntersectLine(centerX, centerY, radius, x1, y1, x2, y2)) {
      return true;
    }
  }
  return false;
}

// 主要的碰撞检测函数
export function isEraserIntersectDrawing(
  eraserX: number,
  eraserY: number,
  eraserRadius: number,
  drawing: Drawing
): boolean {
  switch (drawing.drawingType) {
    case "rectangle": {
      const rectX = Math.min(drawing.startX, drawing.endX);
      const rectY = Math.min(drawing.startY, drawing.endY);
      const rectWidth = Math.abs(drawing.endX - drawing.startX);
      const rectHeight = Math.abs(drawing.endY - drawing.startY);
      return isCircleTouchRectBorder(eraserX, eraserY, eraserRadius, rectX, rectY, rectWidth, rectHeight);
    }
    case "ellipse": {
      const ellipseCenterX = drawing.startX + (drawing.endX - drawing.startX) / 2;
      const ellipseCenterY = drawing.startY + (drawing.endY - drawing.startY) / 2;
      const ellipseWidth = drawing.endX - drawing.startX;
      const ellipseHeight = drawing.endY - drawing.startY;
      return isCircleTouchEllipseBorder(
        eraserX,
        eraserY,
        eraserRadius,
        ellipseCenterX,
        ellipseCenterY,
        ellipseWidth,
        ellipseHeight
      );
    }
    case "line":
    case "arrow":
      return isCircleIntersectLine(
        eraserX,
        eraserY,
        eraserRadius,
        drawing.startX,
        drawing.startY,
        drawing.endX,
        drawing.endY
      );
    case "pen":
      if (!drawing.pathPoints || drawing.pathPoints.length === 0) return false;
      return isCircleIntersectPath(eraserX, eraserY, eraserRadius, drawing.pathPoints);
    default:
      return false;
  }
}
