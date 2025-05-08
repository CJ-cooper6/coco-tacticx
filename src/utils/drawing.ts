import type { renderRoughDrawingvaVriable, renderRoughDrawingConfig } from "@/types/drawing";

// 获取矩形的基本参数
export function getRectangleParams(vriable: renderRoughDrawingvaVriable) {
  const width = Math.abs(vriable.endX! - vriable.startX!);
  const height = Math.abs(vriable.endY! - vriable.startY!);
  const x = Math.min(vriable.startX!, vriable.endX!);
  const y = Math.min(vriable.startY!, vriable.endY!);
  return { x, y, width, height };
}

// 获取椭圆的基本参数
export function getEllipseParams(vriable: renderRoughDrawingvaVriable) {
  const width = vriable.endX! - vriable.startX!;
  const height = vriable.endY! - vriable.startY!;
  const centerX = vriable.startX! + width / 2;
  const centerY = vriable.startY! + height / 2;
  return { centerX, centerY, width, height };
}

// 获取通用的图形样式配置
export function getShapeStyle(cfg: renderRoughDrawingConfig) {
  return {
    roughness: 2,
    stroke: cfg.strokeColor,
    fill: cfg.backgroundColor,
    strokeWidth: cfg.size,
    fillWeight: 2,
    hachureGap: 8,
    seed: 1,
  };
}

export function renderArrow(rc: any, vriable: renderRoughDrawingvaVriable, styleConfig: renderRoughDrawingConfig) {
  // 使用 rough.js 生成线条
  const line = rc.line(vriable.startX, vriable.startY, vriable.endX, vriable.endY, getShapeStyle(styleConfig));

  // 创建箭头
  const angle = Math.atan2(vriable.endY - vriable.startY, vriable.endX - vriable.startX);
  const arrowLength = Math.max(styleConfig.size * 5, 15);
  const arrowX1 = vriable.endX - arrowLength * Math.cos(angle - Math.PI / 6);
  const arrowY1 = vriable.endY - arrowLength * Math.sin(angle - Math.PI / 6);
  const arrowX2 = vriable.endX - arrowLength * Math.cos(angle + Math.PI / 6);
  const arrowY2 = vriable.endY - arrowLength * Math.sin(angle + Math.PI / 6);

  const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrowPath.setAttribute(
    "d",
    `M${vriable.endX},${vriable.endY} L${arrowX1},${arrowY1} M${vriable.endX},${vriable.endY} L${arrowX2},${arrowY2}`
  );
  arrowPath.setAttribute("stroke", styleConfig.strokeColor);
  arrowPath.setAttribute("stroke-width", styleConfig.size.toString());

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.appendChild(line);
  group.appendChild(arrowPath);
  return group;
}

export function renderShape(
  rc: any, // rough.js 实例
  type: string,
  vriable: renderRoughDrawingvaVriable,
  styleConfig: renderRoughDrawingConfig
) {
  const style = getShapeStyle(styleConfig);

  switch (type) {
    case "rectangle": {
      const { x, y, width, height } = getRectangleParams(vriable);
      return rc.rectangle(x, y, width, height, style);
    }
    case "ellipse": {
      const { centerX, centerY, width, height } = getEllipseParams(vriable);
      return rc.ellipse(centerX, centerY, Math.abs(width), Math.abs(height), style);
    }
    case "arrow":
      return renderArrow(rc, vriable, styleConfig);
    case "line":
      return rc.line(vriable.startX, vriable.startY, vriable.endX, vriable.endY, style);
    default:
      return null;
  }
}
