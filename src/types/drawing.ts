export class Drawing {
  id?: number;

  type: string;

  startX: number;

  startY: number;

  endX: number;

  endY: number;

  state: string = "temporary"; // temporary(临时), saved(已保存), stored(已存储)

  color: string;

  size: number;

  constructor(
    type: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    state: string,
    color: string,
    size: number,
    id?: number
  ) {
    this.id = id;
    this.type = type;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.state = state;
    this.color = color;
    this.size = size;
  }
}
