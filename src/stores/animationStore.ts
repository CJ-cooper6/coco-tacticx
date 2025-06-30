/* eslint-disable no-use-before-define */
import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue";
import { AnimationFrame, AnimationAction, Animation, SharedElementPool } from "../types/animation";
import { FieldElement } from "../types/fieldElement";
import { getDefaultControlPoint } from "../utils/index";
import { useBoardStore } from "./boardStore";

export const useAnimationStore = defineStore(
  "animation",
  () => {
    const boardStore = useBoardStore();

    // 基础状态
    const isAnimationMode = ref(false);
    const animations = ref<Animation[]>([]);
    const currentAnimationId = ref<number | string | null>(null);
    const currentAnimation = ref<Animation | null>(null);
    const isPlaying = ref(false); // 播放控制
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

      const haveActionsElementIds = haveActionsElements.map((a) => a.animationElementId);

      const prevFrameElements = currentAnimation.value?.getFrameElements(currentFrameIndex.value - 1);
      if (!prevFrameElements) return false;
      return prevFrameElements.filter((el) => {
        if (el.id) {
          return haveActionsElementIds.includes(el.id);
        }
        return false;
      });
    });

    // 当前帧元素
    const currentFrameElements = computed(() => {
      if (!currentAnimation.value) return [];
      return currentAnimation.value.getFrameElements(currentFrameIndex.value);
    });

    const currentFrameElementsIds = computed(() => currentFrameElements.value.map((el) => el.id));

    // 当前动画总帧数
    const currentAnimationFrameCount = computed(() => currentAnimation.value?.frameCount() || 0);

    // 开启动画
    const openAnimation = () => {
      if (animations.value.length > 0) {
        currentAnimationId.value = animations.value[animations.value.length - 1].id;
        isAnimationMode.value = true;
        isPlaying.value = false;
        currentAnimation.value = animations.value[animations.value.length - 1];
      } else {
        animations.value = [];
        const animation = new Animation("", [{ frameNumber: 0, elements: [] }], []);
        animations.value.push(animation);
        currentAnimationId.value = animation.id;
        isAnimationMode.value = true;
        isPlaying.value = false;
        currentAnimation.value = animation;
      }
      boardStore.resetSvgElement();
    };

    // 退出动画
    const exitAnimation = () => {
      if (isAnimationMode.value) {
        isAnimationMode.value = false;
        currentAnimationId.value = null;
        currentAnimation.value = null;
      }
      boardStore.resetSvgElement();
    };

    // 切换帧
    const switchFrame = (frameIndex: number) => {
      const animationFrames = currentAnimation.value?.frames;
      if (!animationFrames) return;
      if (frameIndex >= 0 && frameIndex < animationFrames.length) {
        currentFrameIndex.value = frameIndex;
      }
    };

    // 元素位置更新触发函数
    const updateElementPosition = (id: number | string, x?: number, y?: number) => {
      if (!currentAnimation.value) return;
      // 获取当前帧
      const frame = currentAnimation.value.frames[currentFrameIndex.value];
      if (!frame) return;

      // 查找帧中的元素引用
      const frameElement = frame.elements.find((el) => el.id === id);
      if (!frameElement) return;

      frameElement.x = x ?? frameElement.x;
      frameElement.y = y ?? frameElement.y;

      // 判断上一帧是否存在元素
      if (
        currentFrameIndex.value > 0 &&
        currentAnimation.value.getElementInFrame(frameElement.id!, currentFrameIndex.value - 1)
      ) {
        updateAnimationAction(frameElement.id);
      }
    };

    // 添加新元素
    const addElement = (item: FieldElement) => {
      if (!currentAnimation.value) return;
      const currentAnimationFrames = currentAnimation.value?.frames;
      if (!currentAnimationFrames) return;
      const frame = currentAnimationFrames[currentFrameIndex.value];
      if (!frame) return;
      // 1. 将元素添加到共享元素池
      currentAnimation.value.addSharedElement(item.id!, item);
      // 2. 在帧中添加元素引用（只存储ID和位置）
      frame.elements.push({
        id: item.id!,
        x: item.x,
        y: item.y,
      });
    };

    // 生成/更新动画行为
    const updateAnimationAction = (elementId: any) => {
      if (currentFrameIndex.value <= 0) return;
      const currentElement = currentAnimation.value?.getElementInFrame(elementId, currentFrameIndex.value);
      const prevElement = currentAnimation.value?.getElementInFrame(elementId, currentFrameIndex.value - 1);
      if (!currentElement || !prevElement) return;

      const controlPoint = getDefaultControlPoint(prevElement.x, prevElement.y, currentElement.x, currentElement.y);
      // 先查看是否存在动画行为
      const action = currentAnimation.value?.actions.find(
        (a) => a.animationElementId === elementId && a.startFrame === currentFrameIndex.value - 1
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
      if (!currentAnimation.value) {
        return;
      }
      const animationFrames = currentAnimation.value?.frames;

      if (!animationFrames) return;
      const lastFrame = animationFrames[animationFrames.length - 1];
      // 复制上一帧的元素到新帧，只复制元素引用（ID和位置）
      const newFrame: AnimationFrame = {
        frameNumber: currentAnimation.value.frameCount(),
        elements: lastFrame.elements.map(({ id, x, y }) => ({
          id,
          x,
          y,
        })),
      };
      animationFrames.push(newFrame);
      currentFrameIndex.value = animationFrames.length - 1;
    };

    // 播放控制
    const togglePlayback = () => {
      // 如果只有1帧，不允许播放
      if (currentAnimationFrameCount.value <= 1) {
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
      const action = actions.find((a) => a.animationElementId === elementId && a.startFrame === frameIndex - 1);
      if (!action) return null;
      return action;
    };

    const prevFrameElement = (item: FieldElement) => {
      if (!currentAnimation.value) return null;
      return currentAnimation.value.getElementInFrame(item.id!, currentFrameIndex.value - 1);
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

    const deleteLastFrame = () => {
      if (!currentAnimation.value) return;
      if (currentFrameIndex.value === 0) {
        currentAnimation.value.frames = [{ frameNumber: 0, elements: [] }];
      } else {
        currentAnimation.value.frames.pop();
      }
      if (currentFrameIndex.value >= currentAnimation.value.frames.length) {
        currentFrameIndex.value = currentAnimation.value.frames.length - 1;
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
      startAutoPlay,
      stopAutoPlay,
      deleteLastFrame,

      // 计算属性
      haveActionPrevFrameElements,
      playNextFrame,
      currentFrameElements,
      currentFrameElementsIds,
      currentAnimationFrameCount,
    };
  },
  {
    persist: {
      omit: ["isAnimationMode", "isPlaying"],
      // https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/limitations.html
      afterHydrate: (ctx) => {
        // 通用反序列化函数
        const deserializeAnimation = (data: any) => {
          const animation = new Animation(
            data.name,
            data.frames.map(
              (frame: any) =>
                new AnimationFrame(
                  frame.frameNumber,
                  frame.elements.map((element: any) => new FieldElement(element))
                )
            ),
            data.actions.map(
              (action: any) => new AnimationAction(action.animationElementId, action.startFrame, action.controlPoint)
            )
          );
          animation.sharedElementPool = SharedElementPool.fromJSON(data.sharedElementPool);
          return animation;
        };

        // 恢复 animations
        if (ctx.store.animations && Array.isArray(ctx.store.animations)) {
          ctx.store.animations = ctx.store.animations.map(deserializeAnimation);
        }

        // 恢复 currentAnimation
        if (ctx.store.currentAnimation) {
          ctx.store.currentAnimation = deserializeAnimation(ctx.store.currentAnimation);
        }

        ctx.store.currentFrameIndex = 0;
      },
    },
  }
);
