/* eslint-disable lines-between-class-members */
import type { IBaseElementProps } from "./base";
import { BaseElement } from "./base";
import { DEFAULT_TOOL_CONFIG } from "@/constants";

// 绘制图案
interface IDrawingProps extends IBaseElementProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeColor?: string; // 描边颜色
  backgroundColor?: string; // 背景颜色
  size: number;
  pathPoints?: [number, number][]; // 绘画路径数据
  drawingType: string; // 绘画图案类型
}

export class Drawing extends BaseElement implements IDrawingProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeColor?: string; // 描边颜色
  backgroundColor?: string; // 背景颜色
  size: number;
  pathPoints?: [number, number][]; // 绘画路径数据
  drawingType: string; // 绘画图案类型

  constructor(props: Partial<IDrawingProps> = {}) {
    super(props);
    this.startX = props.startX || 0;
    this.startY = props.startY || 0;
    this.endX = props.endX || 0;
    this.endY = props.endY || 0;
    this.strokeColor = props.strokeColor;
    this.backgroundColor = props.backgroundColor;
    this.size = props.size || DEFAULT_TOOL_CONFIG.SHAPES.size;
    this.pathPoints = props.pathPoints;
    this.drawingType = props.drawingType || DEFAULT_TOOL_CONFIG.SHAPES.shape;
  }
}

export class DrawingCollection {
  private drawings: Drawing[] = [];

  add(drawing: Drawing) {
    this.drawings.push(drawing);
  }

  clear() {
    this.drawings = [];
  }

  getDrawings(): Drawing[] {
    return this.drawings;
  }
}

export interface renderRoughDrawingvaVriable {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  pathPoints?: [number, number][];
}

export interface renderRoughDrawingConfig {
  strokeColor: string;
  backgroundColor: string;
  size: number;
}
