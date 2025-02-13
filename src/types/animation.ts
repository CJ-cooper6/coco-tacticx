import { Item } from "./item";

// 关键帧 - 记录某一时刻所有元素的状态
export class AnimationFrame {
  elements: Item[];

  constructor(elements: Item[] = []) {
    this.elements = elements;
  }
}

// 动画行为 - 描述元素如何从一帧移动到下一帧
export class AnimationAction {
  elementId: number; // 执行动画的元素ID

  startFrame: number; // 起始帧

  controlPoint: { x: number; y: number }; // 曲线控制点

  constructor(elementId: number, startFrame: number, controlPoint: { x: number; y: number }) {
    this.elementId = elementId;
    this.startFrame = startFrame;
    this.controlPoint = controlPoint;
  }
}

// 动画 - 包含关键帧和动画行为
export class Animation {
  id: number;

  frames: AnimationFrame[];

  actions: AnimationAction[];

  constructor(id: number, frames: AnimationFrame[] = [], actions: AnimationAction[] = []) {
    this.id = id;
    this.frames = frames;
    this.actions = actions;
  }
}
