/* eslint-disable no-param-reassign */
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import rough from "roughjs";
import { ELEMENT_RADIUS_OBJECT } from "../constants";
import type { ElementType } from "@/types/fieldElement";

interface BBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

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

  // 获取svg坐标系下的坐标
  const getSvgPosition = (e: PointerEvent) => {
    if (!svgElement.value) return { x: 0, y: 0 };
    const point = svgElement.value.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    return point.matrixTransform(svgElement.value.getScreenCTM()?.inverse());
  };

  // 计算有效边界区域，返回元素中心点可移动的范围
  const calculateBounds = (areaBBox: BBox | null, radius: number) => {
    if (!areaBBox) return areaBBox;
    const { left, right, top, bottom } = areaBBox;
    return {
      left: left + radius,
      right: right - radius,
      top: top + radius,
      bottom: bottom - radius,
    };
  };

  // 判断元素是否超出某个区域，考虑元素的半径
  const isOutOfArea = (e: PointerEvent, areaBBox: BBox | null, elementRadius = 0) => {
    if (!svgElement.value) return false;

    // 先转换为svg坐标系，再判断是否超出区域
    const svgPoint = getSvgPosition(e);
    if (elementRadius) {
      areaBBox = calculateBounds(areaBBox, elementRadius);
    }

    if (!areaBBox) return false;

    return (
      svgPoint.x < areaBBox.left ||
      svgPoint.x > areaBBox.right ||
      svgPoint.y < areaBBox.top ||
      svgPoint.y > areaBBox.bottom
    );
  };

  const isOutOfBoardArea = (e: PointerEvent, elementRadius?: number) => {
    if (!boardAreaBBox.value) return true;
    const radius = elementRadius ?? ELEMENT_RADIUS_OBJECT.player;
    return isOutOfArea(e, boardAreaBBox.value, radius);
  };

  // 限制元素的移动在战术板内
  const clampPosition = (x: number, y: number, elementType: ElementType) => {
    const bounds = calculateBounds(boardAreaBBox.value, ELEMENT_RADIUS_OBJECT[elementType]);
    if (!bounds) {
      return { x, y };
    }
    const { left, right, top, bottom } = bounds;
    return {
      x: Math.max(left, Math.min(right, x)),
      y: Math.max(top, Math.min(bottom, y)),
    };
  };

  return {
    boardArea,
    setBoardArea,
    boardAreaBBox,
    svgElement,
    setSvgElement,
    setFieldArea,
    fieldArea,
    getSvgPosition,
    roughSvg,
    drawingLayer,
    isOutOfArea,
    isOutOfBoardArea,
    clampPosition,
  };
});
