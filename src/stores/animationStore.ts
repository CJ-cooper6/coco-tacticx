/* eslint-disable no-use-before-define */
import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue";
import { AnimationFrame, AnimationAction, Animation } from "../types/animation";
import { Item } from "../types/item";
import { getDefaultControlPoint } from "../utils/index";

export const useAnimationStore = defineStore("animation", () => {
  // 基础状态
  let nextAnimationId = 1;
  const isAnimationMode = ref(false);
  const animations = ref<Animation[]>([]);
  const currentAnimationId = ref<number | null>(null);
  const currentAnimation = ref<Animation | null>(null);
  const isPlaying = ref(false);
  const currentFrameIndex = ref(0);
  let playbackTimer: number | null = null;
  const frameTime = ref(3); // 帧时间s

  // 若当前帧存在动画行为的元素，返回上一帧的这些元素
  const haveActionPrevFrameElements = computed(() => {
    if (currentFrameIndex.value <= 0) return [];

    // 当前帧存在的动画行为的元素
    const haveActionsElements = currentAnimation.value?.actions.filter(
      (a) => a.startFrame === currentFrameIndex.value - 1
    );
    if (!haveActionsElements) return [];

    const haveActionsElementIds = haveActionsElements.map((a) => a.elementId);

    const animationFrames = currentAnimation.value?.frames;
    if (!animationFrames || !haveActionsElementIds) return [];
    const prevFrame = animationFrames[currentFrameIndex.value - 1];
    return prevFrame.elements.filter((el) => {
      if (el.id) {
        return haveActionsElementIds.includes(el.id);
      }
      return false;
    });
  });

  const currentFrameElements = computed(() => {
    const animationFrames = currentAnimation.value?.frames;
    if (!animationFrames) return [];
    return animationFrames[currentFrameIndex.value].elements;
  });

  const currentFrameElementsIds = computed(() => currentFrameElements.value.map((el) => el.id));

  // 总帧数
  const totalFrames = computed(() => currentAnimation.value?.frames.length || 0);

  // 开启动画
  const openAnimation = () => {
    const animation = new Animation(nextAnimationId++, [{ elements: [] }], []);
    animations.value.push(animation);
    currentAnimationId.value = animation.id;
    isAnimationMode.value = true;
    isPlaying.value = false;
    currentAnimation.value = animation;
  };

  // 退出动画
  const exitAnimation = () => {
    if (isAnimationMode.value) {
      isAnimationMode.value = false;
      currentAnimationId.value = null;
      currentAnimation.value = null;
    }
  };

  // 切换帧
  const switchFrame = (frameIndex: number) => {
    const animationFrames = currentAnimation.value?.frames;
    if (!animationFrames) return;
    if (frameIndex >= 0 && frameIndex < animationFrames.length) {
      currentFrameIndex.value = frameIndex;
    }
  };

  // 获取某一帧的元素
  const getFrameElements = (frameIndex: number) => {
    const animationFrames = currentAnimation.value?.frames;
    if (!animationFrames) return [];
    return animationFrames[frameIndex].elements;
  };

  // 获取某一帧的某个元素
  const getElementInFrame = (elementId: any, frameIndex: number) => {
    const animationFrames = currentAnimation.value?.frames;
    if (!animationFrames) return null;
    if (frameIndex < 0 || frameIndex >= animationFrames.length) {
      return null;
    }
    const frame = animationFrames[frameIndex];
    return frame.elements.find((el) => el.id === elementId);
  };

  // 元素位置更新触发函数
  const updateElementPosition = (id: number, x?: number, y?: number) => {
    const animationFrames = currentAnimation.value?.frames;
    if (!animationFrames) return;
    const frame = animationFrames[currentFrameIndex.value];
    if (!frame) return;
    const element = frame.elements.find((el) => el.id === id);

    if (element) {
      element.x = x ?? element.x;
      element.y = y ?? element.y;
      // 判断上一帧是否存在元素,存在才能创建动画行为
      if (currentFrameIndex.value > 0 && getElementInFrame(element.id, currentFrameIndex.value - 1)) {
        updateAnimationAction(element.id);
      }
    }
  };

  // 添加新元素
  const addElement = (item: Item) => {
    const frame = currentAnimation.value?.frames[currentFrameIndex.value];
    if (!frame) return;
    frame.elements.push(Item.clone(item));
  };

  // 生成/更新动画行为
  const updateAnimationAction = (elementId: any) => {
    if (currentFrameIndex.value <= 0) return;
    const currentElement = getElementInFrame(elementId, currentFrameIndex.value);
    const prevElement = getElementInFrame(elementId, currentFrameIndex.value - 1);
    if (!currentElement || !prevElement) return;

    const controlPoint = getDefaultControlPoint(prevElement.x, prevElement.y, currentElement.x, currentElement.y);
    // 先查看是否存在动画行为
    const action = currentAnimation.value?.actions.find(
      (a) => a.elementId === elementId && a.startFrame === currentFrameIndex.value - 1
    );

    if (action) {
      action.controlPoint = controlPoint;
    } else {
      const newAction: AnimationAction = new AnimationAction(elementId, currentFrameIndex.value - 1, controlPoint);
      currentAnimation.value?.actions.push(newAction);
    }
  };
  // 添加新帧
  const addFrame = () => {
    const animationFrames = currentAnimation.value?.frames;
    if (!animationFrames) return;
    const lastFrame = animationFrames[animationFrames.length - 1];
    // 复制上一帧的元素到新帧
    const newFrame: AnimationFrame = {
      elements: lastFrame.elements.map((el) => Item.clone(el)),
    };
    animationFrames.push(newFrame);
    currentFrameIndex.value = animationFrames.length - 1;
  };

  // 播放控制
  const togglePlayback = () => {
    // 如果只有1帧，不允许播放
    if (totalFrames.value <= 1) {
      return;
    }

    isPlaying.value = !isPlaying.value;
    if (isPlaying.value) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  };

  // 获取某一帧元素的动画行为
  const getElementAnimationAction = (elementId: any, frameIndex: number) => {
    const actions = currentAnimation.value?.actions;
    if (!actions) return null;
    const action = actions.find((a) => a.elementId === elementId && a.startFrame === frameIndex - 1);
    if (!action) return null;
    return action;
  };

  const prevFrameElement = (item: Item) => {
    if (!currentAnimation.value) return null;
    const frames = currentAnimation.value.frames;
    if (!frames) return null;
    const prevFrame = frames[currentFrameIndex.value - 1];
    if (!prevFrame) return null;
    return prevFrame.elements.find((el) => el.id === item.id);
  };

  // 添加自动播放相关的方法
  const playNextFrame = () => {
    if (!isPlaying.value || !currentAnimation.value) return;

    const nextFrameIndex = currentFrameIndex.value + 1;
    if (nextFrameIndex < currentAnimation.value.frames.length) {
      currentFrameIndex.value = nextFrameIndex;
    } else {
      // 到达最后一帧时停止播放
      isPlaying.value = false;
      currentFrameIndex.value = 0; // 重置到第一帧
    }
  };

  const startAutoPlay = () => {
    if (playbackTimer) return;

    // 第0帧没有动画，直接跳到第1帧
    if (currentFrameIndex.value === 0) {
      currentFrameIndex.value = 1;
    }

    playbackTimer = window.setInterval(() => {
      if (!isPlaying.value) {
        stopAutoPlay();
        return;
      }

      const nextFrameIndex = currentFrameIndex.value + 1;
      if (nextFrameIndex < (currentAnimation.value?.frames.length || 0)) {
        currentFrameIndex.value = nextFrameIndex;
      } else {
        // 循环播放：回到第0帧，然后立即跳到第1帧
        currentFrameIndex.value = 0;
        // 确保状态更新后再跳转到第1帧
        nextTick(() => {
          if (isPlaying.value) {
            currentFrameIndex.value = 1;
          }
        });
      }
    }, frameTime.value * 1000);
  };

  const stopAutoPlay = () => {
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
  };

  return {
    // 状态
    isAnimationMode,
    currentFrameIndex,
    animations,
    currentAnimationId,
    currentAnimation,
    isPlaying,
    frameTime,
    // 方法
    openAnimation,
    exitAnimation,
    switchFrame,
    addFrame,
    togglePlayback,
    updateElementPosition,
    getElementAnimationAction,
    prevFrameElement,
    addElement,
    getElementInFrame,
    startAutoPlay,
    stopAutoPlay,
    getFrameElements,

    // 计算属性
    haveActionPrevFrameElements,
    playNextFrame,
    currentFrameElements,
    currentFrameElementsIds,
  };
});
