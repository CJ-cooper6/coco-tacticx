import { storeToRefs } from "pinia";
import { useItemStore } from "../stores/itemStore";
import { useAnimationStore } from "../stores/animationStore";
import { Item } from "../types/item";
import { clampPosition } from "../utils";
import { useBoardStore } from "../stores/boardStore";

export function useDraggable() {
  const itemStore = useItemStore();
  const animationStore = useAnimationStore();
  const boardStore = useBoardStore();

  const { isAnimationMode, currentFrameElements } = storeToRefs(animationStore);
  const { setItemProperty, moveItem } = itemStore;
  const { svgElement } = storeToRefs(boardStore);

  const startDrag = (item: Item, event: PointerEvent) => {
    const svg = svgElement.value;
    if (!svg) return;

    // 将点击的元素移动到最后，层级最高
    if (isAnimationMode.value) {
      // 动画模式下，元素数组是计算属性，将元素移动到当前帧的元素数组中的最后可实现层级最高
      const items = currentFrameElements.value;
      const index = items.findIndex((a) => a.id === item.id);
      if (index !== -1) {
        // 将项目移到数组末尾
        const tmp = items.splice(index, 1)[0];
        items.push(tmp);
      }
    } else {
      // 非动画模式下，直接将元素移动到最后
      const itemElement = document.getElementById(`item-${item.id}`);
      if (itemElement) {
        const parent = itemElement.parentElement;
        if (parent) {
          parent.appendChild(itemElement);
        }
      }
    }

    let dragTimeout: number | null = null;

    const handleMoveItem = (moveEvent: PointerEvent) => {
      const point = svg.createSVGPoint();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
      const { x, y } = clampPosition(svgPoint.x, svgPoint.y);

      if (item.id !== undefined) {
        if (isAnimationMode.value) {
          animationStore.updateElementPosition(item.id, x, y);
        } else {
          moveItem({ id: item.id, x, y });
        }
      }
    };

    const stopDrag = () => {
      if (item.id !== undefined) {
        setItemProperty(item.id, "isDragging", false);
      }
      if (dragTimeout !== null) {
        clearTimeout(dragTimeout);
        dragTimeout = null;
      }
      svg.removeEventListener("pointermove", handleMoveItem);
      svg.removeEventListener("pointerup", stopDrag);
      svg.removeEventListener("pointercancel", stopDrag);
    };

    // 延迟开始拖拽事件
    dragTimeout = window.setTimeout(() => {
      if (item.id !== undefined) {
        setItemProperty(item.id, "isDragging", true);
      }
      svg.addEventListener("pointermove", handleMoveItem);
    }, 100);

    svg.addEventListener("pointerup", stopDrag);
    svg.addEventListener("pointercancel", stopDrag);
  };

  return {
    startDrag,
  };
}
