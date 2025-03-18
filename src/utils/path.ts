// 获取两点之间默认控制点坐标
export const getDefaultControlPoint = (startX: number, startY: number, endX: number, endY: number) => ({
  x: (startX + endX) / 2,
  y: (startY + endY) / 2,
});

// Catmull-Rom 样条曲线的简化版本，使用贝塞尔曲线来近似表示
export function getCatmullRomPath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return `M ${points[0]?.x},${points[0]?.y}`;

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const cp1 = {
      x: p1.x + (p2.x - p0.x) / 6,
      y: p1.y + (p2.y - p0.y) / 6,
    };
    const cp2 = {
      x: p2.x - (p3.x - p1.x) / 6,
      y: p2.y - (p3.y - p1.y) / 6,
    };

    path += ` C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p2.x},${p2.y}`;
  }
  return path;
}
