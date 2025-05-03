/* eslint-disable no-param-reassign */
import { storeToRefs } from "pinia";
import { useItemStore } from "../stores/itemStore";
import { useAnimationStore } from "../stores/animationStore";
import { FieldElement } from "../types/fieldElement";
import { useBoardStore } from "../stores/boardStore";

export function useDraggable() {
  const itemStore = useItemStore();
  const animationStore = useAnimationStore();
  const boardStore = useBoardStore();
  let hasDragged = false; // 内部状态，用于判断是否发生了真实拖动

  const { isAnimationMode } = storeToRefs(animationStore);
  const { moveElement } = itemStore;
  const { svgElement } = storeToRefs(boardStore);

  const startDrag = (
    item: FieldElement,
    event: PointerEvent,
    callbacks: {
      onDragMove?: (x: number, y: number) => void;
      onDragEnd?: () => void;
      onClick?: () => void;
    }
  ) => {
    const svg = svgElement.value;
    if (!svg) return;

    hasDragged = false;
    const startX = event.clientX;
    const startY = event.clientY;
    const dragThreshold = 4; // 拖动阈值

    const handleMoveItem = (moveEvent: PointerEvent) => {
      if (!hasDragged) {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= dragThreshold) return;

        hasDragged = true;
        item.isDragging = true;
      }

      const svgPoint = boardStore.getSvgPosition(moveEvent);
      const { x, y } = boardStore.clampPosition(svgPoint.x, svgPoint.y);

      if (item.id !== undefined) {
        if (isAnimationMode.value) {
          animationStore.updateElementPosition(item.id, x, y);
        } else {
          moveElement(item.id, x, y);
        }
      }

      if (callbacks.onDragMove) {
        callbacks.onDragMove(x, y);
      }
    };

    const stopDrag = () => {
      if (item.id !== undefined) {
        item.isDragging = false;
      }

      // 触发拖动结束回调
      if (hasDragged && callbacks.onDragEnd) {
        callbacks.onDragEnd();
      }

      // 触发点击回调
      if (!hasDragged && callbacks.onClick) {
        callbacks.onClick();
      }

      svg.removeEventListener("pointermove", handleMoveItem);
      svg.removeEventListener("pointerup", stopDrag);
      svg.removeEventListener("pointercancel", stopDrag);
    };

    svg.addEventListener("pointermove", handleMoveItem);
    svg.addEventListener("pointerup", stopDrag);
    svg.addEventListener("pointercancel", stopDrag);
  };
  return {
    startDrag,
  };
}
