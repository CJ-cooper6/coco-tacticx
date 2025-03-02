import { ref, computed } from "vue";
import { defineStore } from "pinia";
import rough from "roughjs";

export const useBoardStore = defineStore("board", () => {
  const boardArea = ref<SVGGraphicsElement | null>(null); // 展示区域
  const svgElement = ref<SVGSVGElement | null>(null); // 整个战术板svg元素
  const fieldArea = ref<SVGGraphicsElement | null>(null); // 球场区域
  const roughSvg = ref<any>(null); // roughjs实例
  const drawingLayer = ref<any>(null); // 正在创建的新元素层
  const setBoardArea = (area: SVGGraphicsElement) => {
    boardArea.value = area;
  };

  const setSvgElement = (element: SVGSVGElement) => {
    svgElement.value = element;
    roughSvg.value = rough.svg(svgElement.value);
    drawingLayer.value = document.getElementById("drawingLayer");
  };

  const setFieldArea = (area: SVGGraphicsElement) => {
    fieldArea.value = area;
  };

  // 获取展示区域坐标
  const boardAreaBBox = computed(() => {
    if (boardArea.value) {
      const svgBBox = boardArea.value.getBBox();
      return {
        left: svgBBox.x,
        right: svgBBox.x + svgBBox.width,
        top: svgBBox.y,
        bottom: svgBBox.y + svgBBox.height,
      };
    }
    return null;
  });

  // 获取球场区域坐标
  const fieldAreaBBox = computed(() => {
    if (fieldArea.value) {
      const svgBBox = fieldArea.value.getBBox();
      return {
        left: svgBBox.x,
        right: svgBBox.x + svgBBox.width,
        top: svgBBox.y,
        bottom: svgBBox.y + svgBBox.height,
      };
    }
    return null;
  });

  // 判断是否超出展示区域
  const isOutOfBoardArea = (x: number, y: number) => {
    // 先转换为svg坐标系，再判断是否超出球场区域
    if (!boardAreaBBox.value || !svgElement.value) return false;
    const point = svgElement.value.createSVGPoint();
    point.x = x;
    point.y = y;
    const svgPoint = point.matrixTransform(svgElement.value.getScreenCTM()?.inverse());
    const svgRect = boardAreaBBox.value;
    return (
      svgPoint.x < svgRect.left || svgPoint.x > svgRect.right || svgPoint.y < svgRect.top || svgPoint.y > svgRect.bottom
    );
  };

  // 获取svg坐标系下的坐标
  const getSvgPosition = (e: PointerEvent) => {
    if (!svgElement.value) return { x: 0, y: 0 };
    const point = svgElement.value.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    return point.matrixTransform(svgElement.value.getScreenCTM()?.inverse());
  };

  return {
    boardArea,
    setBoardArea,
    boardAreaBBox,
    isOutOfBoardArea,
    svgElement,
    setSvgElement,
    setFieldArea,
    fieldArea,
    getSvgPosition,
    roughSvg,
    drawingLayer,
  };
});
