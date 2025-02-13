import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useBoardStore = defineStore("board", () => {
  const boardArea = ref<SVGGraphicsElement | null>(null); // 展示区域
  const svgElement = ref<SVGSVGElement | null>(null); // 整个战术板svg元素
  const fieldArea = ref<SVGGraphicsElement | null>(null); // 球场区域

  const setBoardArea = (area: SVGGraphicsElement) => {
    boardArea.value = area;
  };

  const setSvgElement = (element: SVGSVGElement) => {
    svgElement.value = element;
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

  return {
    boardArea,
    setBoardArea,
    boardAreaBBox,
    isOutOfBoardArea,
    svgElement,
    setSvgElement,
    setFieldArea,
    fieldArea,
  };
});
