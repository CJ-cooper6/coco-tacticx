import { storeToRefs } from "pinia";
import { useAnimationStore } from "../stores/animationStore";
import { FieldElement } from "../types/fieldElement";
import { getCatmullRomPath } from "../utils/path";
import { getDefaultControlPoint } from "../utils";

export function usePath() {
  const animationStore = useAnimationStore();
  const { currentAnimation, currentFrameIndex } = storeToRefs(animationStore);

  const showPath = (item: FieldElement) => {
    if (!currentAnimation.value) return false;
    const actions = currentAnimation.value.actions;
    if (!actions) return false;
    return actions.some((a) => a.elementId === item.id && a.startFrame === currentFrameIndex.value - 1);
  };

  const elementAction = (item: FieldElement) => {
    const currentFrameActions = currentAnimation.value?.actions;
    if (!currentFrameActions) return null;
    return currentFrameActions.find((a) => a.elementId === item.id && a.startFrame === currentFrameIndex.value - 1);
  };

  const pathData = (item: FieldElement) => {
    const element = animationStore.prevFrameElement(item);
    if (!element) return "";
    const action = elementAction(item);
    if (!action) return "";
    const points = [{ x: element.x, y: element.y }, action.controlPoint, { x: item.x, y: item.y }];
    return getCatmullRomPath(points);
  };

  const pathControlPoint = (item: FieldElement) => {
    const currentFrameActions = currentAnimation.value?.actions;
    const element = animationStore.prevFrameElement(item);
    if (!element) return null;

    if (!currentFrameActions) {
      return getDefaultControlPoint(element.x, element.y, item.x, item.y);
    }
    const action = elementAction(item);
    return action ? action.controlPoint : getDefaultControlPoint(element.x, element.y, item.x, item.y);
  };

  const startDragControlPoint = (item: FieldElement, event: PointerEvent) => {
    const svg = (event.currentTarget as SVGElement).closest("svg");
    if (!svg) return;
    const action = elementAction(item);
    if (!action) return;

    const moveControlPoint = (moveEvent: PointerEvent) => {
      const point = svg.createSVGPoint();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
      action.controlPoint = {
        x: svgPoint.x,
        y: svgPoint.y,
      };
    };

    const stopDrag = () => {
      svg.removeEventListener("pointermove", moveControlPoint);
      svg.removeEventListener("pointerup", stopDrag);
      svg.removeEventListener("pointercancel", stopDrag);
    };

    svg.addEventListener("pointermove", moveControlPoint);
    svg.addEventListener("pointerup", stopDrag);
    svg.addEventListener("pointercancel", stopDrag);
  };

  return {
    showPath,
    pathData,
    pathControlPoint,
    startDragControlPoint,
  };
}
