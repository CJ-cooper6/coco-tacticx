/* eslint-disable lines-between-class-members */
import { nanoid } from "nanoid";
import { FieldElement } from "./fieldElement";

// 表示关键帧中的元素，存储其位置（x, y）和引用的共享元素 ID
interface AnimationFrameSharedElement {
  id: string | number;
  x: number;
  y: number;
}

// 表示一个关键帧，包含帧编号和该帧的所有元素（仅包含位置和引用）
interface IAnimationFrame {
  frameNumber: number;
  elements: AnimationFrameSharedElement[];
}

// 动画行为，描述元素如何从一帧过渡到下一帧（可扩展支持贝塞尔曲线）
interface IAnimationAction {
  animationElementId: number | string;
  startFrame: number;
  controlPoint: { x: number; y: number };
}

// 动画对象，包含关键帧、行为和共享元素池
interface IAnimation {
  id: number | string;
  name: string;
  frames: IAnimationFrame[];
  actions: IAnimationAction[];
  sharedElementPool: SharedElementPool;
}

// 表示关键帧的实现类
export class AnimationFrame implements IAnimationFrame {
  frameNumber: number;
  elements: AnimationFrameSharedElement[];

  constructor(frameNumber: number, elements: AnimationFrameSharedElement[] = []) {
    this.frameNumber = frameNumber;
    this.elements = elements;
  }
}

// 表示动画行为的实现类
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

// 公共元素池：用于存储所有共享元素，只存一份完整数据，避免每帧重复
class SharedElementPool {
  private map = new Map<string | number, FieldElement>();

  get(id: string | number): FieldElement | null {
    return this.map.get(id) || null;
  }

  add(id: string | number, el: FieldElement): void {
    this.map.set(id, el);
  }

  has(id: string | number): boolean {
    return this.map.has(id);
  }
}

// 动画类，管理关键帧、动画行为和共享元素池
export class Animation implements IAnimation {
  id: number | string;
  name: string;
  frames: AnimationFrame[];
  actions: AnimationAction[];
  sharedElementPool: SharedElementPool = new SharedElementPool();

  constructor(
    name: string = "",
    frames: AnimationFrame[] = [{ frameNumber: 0, elements: [] }],
    actions: AnimationAction[] = []
  ) {
    this.id = nanoid();
    this.name = name;
    this.frames = frames;
    this.actions = actions;
    this.sharedElementPool = new SharedElementPool();
  }

  // 获取指定帧的完整元素列表（共享元素属性 + 当前帧位置）
  getFrameElements(frameIndex: number): FieldElement[] {
    if (frameIndex < 0 || frameIndex >= this.frames.length) return [];

    return this.frames[frameIndex].elements
      .map(({ id, x, y }) => {
        const shared = this.sharedElementPool.get(id);
        if (!shared) return null;
        return { ...shared, x, y }; // 合成一个完整元素：保留共享属性，覆盖位置信息
      })
      .filter(Boolean) as FieldElement[];
  }

  // 获取指定帧中某个元素（合并共享属性和帧位置）
  getElementInFrame(elementId: string | number, frameIndex: number): FieldElement | null {
    if (frameIndex < 0 || frameIndex >= this.frames.length) return null;

    const frameElement = this.frames[frameIndex].elements.find((el) => el.id === elementId);
    if (!frameElement) return null;

    const sharedElement = this.sharedElementPool.get(elementId);
    if (!sharedElement) return null;

    return { ...sharedElement, x: frameElement.x, y: frameElement.y } as FieldElement;
  }

  // 返回动画总帧数
  frameCount(): number {
    return this.frames.length;
  }

  // 获取指定 ID 的共享元素（完整定义）
  getSharedElement(id: string | number): FieldElement | null {
    return this.sharedElementPool.get(id) || null;
  }

  // 添加共享元素
  addSharedElement(id: string | number, element: FieldElement): void {
    this.sharedElementPool.add(id, element);
  }
}
