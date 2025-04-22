export class Drawing {
  id?: number;

  type: string;

  startX: number;

  startY: number;

  endX: number;

  endY: number;

  state: string = "temporary"; // temporary(临时), saved(已保存), stored(已存储)

  strokeColor: string; // 描边颜色

  backgroundColor: string; // 背景颜色

  size: number;

  pathData?: string; // 绘画路径数据

  constructor(
    type: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    state: string,
    strokeColor: string,
    backgroundColor: string,
    size: number,
    id?: number,
    pathData?: string
  ) {
    this.id = id;
    this.type = type;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.state = state;
    this.strokeColor = strokeColor;
    this.backgroundColor = backgroundColor;
    this.size = size;
    this.pathData = pathData;
  }
}
