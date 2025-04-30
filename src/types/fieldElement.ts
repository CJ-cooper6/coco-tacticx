/* eslint-disable lines-between-class-members */
import { GAME_CONSTANTS } from "@/constants";
import type { IBaseElementProps } from "./base";
import { BaseElement } from "./base";

// 球场元素
interface IFieldElementProps extends IBaseElementProps {
  r: number;
  text: string;
  elementType: string; // 1.球员 player  2.球 ball
  number?: number;
  playerPosition?: string; // 球员场上位置
}

export class FieldElement extends BaseElement implements IFieldElementProps {
  r: number;
  text: string;
  elementType: string;
  number?: number;
  playerPosition?: string;

  constructor(props: Partial<IFieldElementProps> = {}) {
    super(props);
    this.r = props.r || GAME_CONSTANTS.DefaultItemRadius;
    this.text = props.text || "";
    this.elementType = props.elementType || "player";
    this.number = props.number;
    this.playerPosition = props.playerPosition;
  }

  clone() {
    return new FieldElement({
      x: this.x,
      y: this.y,
      color: this.color,
      isDragging: this.isDragging,
      creationMode: this.creationMode,
      type: this.type,
      state: this.state,
      r: this.r,
      text: this.text,
      elementType: this.elementType,
      number: this.number,
      playerPosition: this.playerPosition,
    });
  }

  cloneIncludingId() {
    return new FieldElement({
      id: this.id,
      x: this.x,
      y: this.y,
      color: this.color,
      isDragging: this.isDragging,
      creationMode: this.creationMode,
      type: this.type,
      state: this.state,
      r: this.r,
      text: this.text,
      elementType: this.elementType,
      number: this.number,
      playerPosition: this.playerPosition,
    });
  }
}

export class FieldElementCollection {
  private items: FieldElement[] = [];

  add(element: FieldElement): void {
    this.items.push(element);
  }

  move(x: number, y: number, identifier?: number | string) {
    const element = this.items.find((p) => p.id === identifier);
    if (element) {
      element.move(x, y);
    }
  }

  deleteById(id: number | string): void {
    this.items = this.items.filter((element) => element.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getItems(): FieldElement[] {
    return this.items;
  }

  findById(id: number | string): FieldElement | undefined {
    return this.items.find((element) => element.id === id);
  }

  findByCreationMode(creationMode: string) {
    return this.items.filter((element) => element.creationMode === creationMode);
  }
}
