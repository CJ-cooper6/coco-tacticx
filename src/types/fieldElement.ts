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
}

export class FieldElementCollection {
  private items: FieldElement[] = [];

  add(element: FieldElement): void {
    this.items.push(element);
  }

  move(x: number, y: number, identifier?: number | string) {
    const element =
      typeof identifier === "number"
        ? this.items.find((p) => p.id === identifier)
        : this.items.find((p) => p.uuid === identifier);
    if (element) {
      element.move(x, y);
    }
  }

  deleteById(id: number): void {
    this.items = this.items.filter((element) => element.id !== id);
  }

  deleteByUuid(uuid: string): void {
    this.items = this.items.filter((element) => element.uuid !== uuid);
  }

  clear(): void {
    this.items = [];
  }

  getItems(): FieldElement[] {
    return this.items;
  }

  findById(id: number): FieldElement | undefined {
    return this.items.find((element) => element.id === id);
  }

  findByUuid(uuid: string): FieldElement | undefined {
    return this.items.find((element) => element.uuid === uuid);
  }

  findByCreationMode(creationMode: string) {
    return this.items.filter((element) => element.creationMode === creationMode);
  }
}
