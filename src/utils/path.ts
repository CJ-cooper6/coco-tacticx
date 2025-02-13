// Catmull-Rom 样条曲线计算函数
// export function catmullRomSpline(points: Array<{ x: number; y: number }>, numPoints = 50) {
//   const result = [];
//   for (let i = 0; i < points.length - 1; i++) {
//     const p0 = i === 0 ? points[i] : points[i - 1];
//     const p1 = points[i];
//     const p2 = points[i + 1];
//     const p3 = points[i + 2] || points[i + 1];

//     for (let t = 0; t < numPoints; t++) {
//       const t0 = t / numPoints;
//       const t1 = t0 * t0;
//       const t2 = t1 * t0;

//       const x =
//         0.5 *
//         (2 * p1.x +
//           (-p0.x + p2.x) * t0 +
//           (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t1 +
//           (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2);

//       const y =
//         0.5 *
//         (2 * p1.y +
//           (-p0.y + p2.y) * t0 +
//           (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t1 +
//           (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2);

//       result.push({ x, y });
//     }
//   }
//   return result;
// }
// // 生成路径数据字符串
// export function getCatmullRomPath(points: Array<{ x: number; y: number }>) {
//   const splinePoints = catmullRomSpline(points);
//   return splinePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
// }

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
