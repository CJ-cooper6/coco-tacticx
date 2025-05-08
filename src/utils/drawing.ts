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
