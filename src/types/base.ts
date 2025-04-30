/* eslint-disable lines-between-class-members */
import { nanoid } from "nanoid";

export interface IBaseElementProps {
  id?: number | string;
  x: number;
  y: number;
  color: string;
  isDragging: boolean;
  creationMode: string; // 元素创建模式, 目前只有两种: 1. 普通元素 normal 2. 动画模式下创建的元素 animation
  type: string; // 1.球员 player  2.绘制图案 drawing
  state: string; // 存储状态   1.temporary(临时) 2.saved(已保存) 3.stored(已存储)
}

export class BaseElement implements IBaseElementProps {
  id?: number | string;
  x: number;
  y: number;
  color: string;
  isDragging: boolean;
  creationMode: string;
  type: string;
  state: string;

  constructor(props: Partial<IBaseElementProps> = {}) {
    this.id = props.id || this.generateUuid();
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.color = props.color || "black";
    this.isDragging = props.isDragging || false;
    this.creationMode = props.creationMode || "normal";
    this.type = props.type || "player";
    this.state = props.state || "temporary";
  }

  move(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  generateUuid(): string {
    return nanoid();
  }
}
