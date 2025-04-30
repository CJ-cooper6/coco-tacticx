/* eslint-disable lines-between-class-members */
import { nanoid } from "nanoid";
import { FieldElement } from "./fieldElement";

// 关键帧
interface IAnimationFrame {
  frameNumber: number; // 帧数
  elements: FieldElement[]; // 当前帧的所有元素
}

// 动画行为 - 描述元素如何从一帧移动到下一帧
interface IAnimationAction {
  animationElementId: number | string; // 执行动画的元素ID
  startFrame: number; // 起始帧
  controlPoint: { x: number; y: number }; // 曲线控制点
}

// 动画 - 包含关键帧和动画行为
interface IAnimation {
  id: number | string;
  name: string;
  frames: IAnimationFrame[];
  actions: IAnimationAction[];
}

export class AnimationFrame implements IAnimationFrame {
  frameNumber: number;
  elements: FieldElement[];

  constructor(frameNumber: number, elements: FieldElement[] = []) {
    this.frameNumber = frameNumber;
    this.elements = elements;
  }
}

export class AnimationAction implements IAnimationAction {
  animationElementId: number | string;
  startFrame: number;
  controlPoint: { x: number; y: number };

  constructor(animationElementId: number, startFrame: number, controlPoint: { x: number; y: number }) {
    this.animationElementId = animationElementId;
    this.startFrame = startFrame;
    this.controlPoint = controlPoint;
  }
}

// 动画 - 包含关键帧和动画行为
export class Animation implements IAnimation {
  id: number | string;
  name: string;
  frames: AnimationFrame[];
  actions: AnimationAction[];

  constructor(
    name: string = "",
    frames: AnimationFrame[] = [{ frameNumber: 0, elements: [] }],
    actions: AnimationAction[] = []
  ) {
    this.id = nanoid();
    this.name = name;
    this.frames = frames;
    this.actions = actions;
  }

  // 获取指定帧的元素
  getFrameElements(frameIndex: number): FieldElement[] {
    if (frameIndex < 0 || frameIndex >= this.frames.length) return [];
    return this.frames[frameIndex].elements;
  }

  // 在指定帧中查找元素
  getElementInFrame(elementId: any, frameIndex: number): FieldElement | null {
    if (frameIndex < 0 || frameIndex >= this.frames.length) return null;
    return this.frames[frameIndex].elements.find((el) => el.id === elementId) || null;
  }

  // 获取总帧数
  frameCount(): number {
    return this.frames.length;
  }
}
