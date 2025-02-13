export class Item {
  id?: number;

  color: string;

  x: number;

  y: number;

  r: number;

  isDragging: boolean;

  type: string; // 元素类型, 目前只有两种: 1. 普通元素 normal 2. 动画元素 animation

  text: string;

  number?: number;

  shape?: string;

  constructor(
    color: string,
    x: number,
    y: number,
    r: number,
    id?: number,
    shape?: string,
    number?: number,
    type: string = "normal",
    text: string = "",
    isDragging: boolean = false
  ) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.r = r;
    this.id = id;
    this.isDragging = isDragging;
    this.type = type;
    this.shape = shape;
    this.text = text;
    this.number = number;
  }

  static clone(source: Item): Item {
    return new Item(
      source.color,
      source.x,
      source.y,
      source.r,
      source.id,
      source.shape,
      source.number,
      source.type,
      source.text,
      source.isDragging
    );
  }

  move(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }
}
