<template>
  <g class="tools-panel">
    <foreignObject
      ref="toolsPanelRef"
      :x="toolsPanelPosition.x"
      :y="toolsPanelPosition.y"
      :width="toolsPanelPosition.width"
      :height="toolsPanelPosition.height"
      overflow="visible"
    >
      <div class="tools-panel-content">
        <div class="tools-panel-item">
          <div class="icon-button" title="清空" @click="clear">
            <GradientSvgIcon
              class="icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="clear"
            />
          </div>
        </div>
        <div class="tools-panel-item" v-if="boardArea && !isAnimationMode">
          <div class="icon-button" title="截图" @click="captureScreenshot(boardArea)">
            <GradientSvgIcon
              class="icon screenshot-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="screenshot"
            />
          </div>
        </div>

        <div class="tools-panel-item" v-if="!isFullscreen && !globalStore.deviceInfo.isIOS">
          <div class="icon-button" title="全屏" @click="fullscreen">
            <GradientSvgIcon
              class="icon full-screen-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="full-screen"
            />
          </div>
        </div>
        <div class="tools-panel-item" v-if="isFullscreen && !globalStore.deviceInfo.isIOS">
          <div class="icon-button" title="退出全屏" @click="exitFullscreen">
            <GradientSvgIcon
              class="icon exit-full-screen-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="exit-full-screen"
            />
          </div>
        </div>

        <div class="animation-controls" v-if="isAnimationMode">
          <div class="tools-panel-item">
            <div class="frame-counter">
              <input type="number" v-model="frameInput" @change="switchFrameIndex" class="frame-input" />
              <span class="frame-counter-slash">/</span>
              <span>{{ currentAnimationFrameCount }}</span>
            </div>
          </div>
          <div class="tools-panel-item">
            <div class="icon-button" @click="addFrame" title="添加帧">
              <GradientSvgIcon
                class="icon control-icon"
                :startColor="gradientColor.startColor"
                :endColor="gradientColor.endColor"
                name="add"
              />
            </div>
          </div>
          <div class="tools-panel-item">
            <div class="icon-button" @click="deleteLastFrame" title="删除帧">
              <GradientSvgIcon
                class="icon control-icon"
                :startColor="gradientColor.startColor"
                :endColor="gradientColor.endColor"
                name="delete"
              />
            </div>
          </div>

          <div class="tools-panel-item" v-show="!isPlaying">
            <div class="icon-button" @click="togglePlayback" title="播放">
              <GradientSvgIcon
                class="icon play-icon"
                :startColor="gradientColor.startColor"
                :endColor="gradientColor.endColor"
                name="play"
              />
            </div>
          </div>
          <div class="tools-panel-item" v-show="isPlaying">
            <div class="icon-button" @click="togglePlayback" title="停止">
              <GradientSvgIcon
                class="icon play-icon"
                :startColor="gradientColor.startColor"
                :endColor="gradientColor.endColor"
                name="stop"
              />
            </div>
          </div>
        </div>

        <div class="tools-panel-item" v-if="!isAnimationMode">
          <div class="icon-button" @click="openAnimation" title="动画">
            <GradientSvgIcon
              class="icon animation-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="animation"
            />
          </div>
        </div>

        <div class="tools-panel-item" v-else>
          <div class="icon-button" @click="exitAnimation" title="退出动画模式">
            <GradientSvgIcon
              class="icon back-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="back"
            />
          </div>
        </div>

        <div class="tools-panel-item" v-if="!isAnimationMode">
          <div class="icon-button" @click="handleUndo" title="撤销" :class="{ disabled: !canUndo }">
            <GradientSvgIcon
              class="icon undo-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="undo"
            />
          </div>
        </div>

        <div class="tools-panel-item" v-if="!isAnimationMode">
          <div class="icon-button" @click="handleRedo" title="重做" :class="{ disabled: !canRedo }">
            <GradientSvgIcon
              class="icon redo-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="redo"
            />
          </div>
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref, watch, computed } from "vue";
import { captureScreenshot } from "../utils/index";
import { useItemStore } from "../stores/itemStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";
import { useDrawStore } from "../stores/drawStore";
import GradientSvgIcon from "./common/GradientSvgIcon.vue";
import { gradientColor } from "../constants";
import { useAnimationStore } from "../stores/animationStore";
import { useHistory } from "../composables/useHistory";

const globalStore = useGlobalStore();
const itemStore = useItemStore();
const boardStore = useBoardStore();
const drawStore = useDrawStore();
const animationStore = useAnimationStore();
const { handleUndo, handleRedo, canUndo, canRedo, pushHistory } = useHistory();

// 方法可以直接解构
const { toggleFullscreen } = globalStore;
const { clearElements } = itemStore;
const { clearDrawings } = drawStore;
const { isAnimationMode, currentFrameIndex, isPlaying, currentAnimationFrameCount } = storeToRefs(animationStore);
const { openAnimation, exitAnimation, switchFrame, togglePlayback } = animationStore;

// 使用 storeToRefs 保持响应性
const { isFullscreen } = storeToRefs(globalStore);
const { boardArea } = storeToRefs(boardStore);

const frameInput = ref(1);
frameInput.value = currentFrameIndex.value + 1;

const toolsPanelPosition = computed(() => {
  if (globalStore.orientation === "landscape") {
    return { x: 1250, y: 0, width: 115, height: 800 };
  }
  return { x: 0, y: -120, width: 1250, height: 115 };
});

const fullscreen = () => {
  const de = document.documentElement;
  if (de.requestFullscreen) {
    de.requestFullscreen();
    // @ts-ignore
  } else if (de.mozRequestFullScreen) {
    // @ts-ignore
    de.mozRequestFullScreen();
    // @ts-ignore
  } else if (de.webkitRequestFullScreen) {
    // @ts-ignore
    de.webkitRequestFullScreen();
  }
  toggleFullscreen(true);
};

const exitFullscreen = () => {
  const de = document;
  if (de.exitFullscreen) {
    de.exitFullscreen();
    // @ts-ignore
  } else if (de.mozCancelFullScreen) {
    // @ts-ignore
    de.mozCancelFullScreen();
    // @ts-ignore
  } else if (de.webkitCancelFullScreen) {
    // @ts-ignore
    de.webkitCancelFullScreen();
  }
  toggleFullscreen(false);
};

const switchFrameIndex = () => {
  if (frameInput.value < 1) {
    frameInput.value = 1;
  }
  if (frameInput.value >= currentAnimationFrameCount.value + 1) {
    frameInput.value = currentAnimationFrameCount.value;
  }
  switchFrame(frameInput.value - 1);
};

const addFrame = () => {
  animationStore.addFrame();
  frameInput.value = currentFrameIndex.value + 1;
};

const deleteLastFrame = () => {
  animationStore.deleteLastFrame();
  if (frameInput.value >= currentAnimationFrameCount.value + 1) {
    frameInput.value = currentAnimationFrameCount.value;
  }
};

const clear = () => {
  pushHistory();
  clearElements();
  clearDrawings();
};

watch(currentFrameIndex, (newVal) => {
  if (isPlaying.value) {
    frameInput.value = currentFrameIndex.value + 1;
  }
});

// 添加组件卸载时的清理逻辑
onBeforeUnmount(() => {
  if (isPlaying.value) {
    animationStore.stopAutoPlay();
  }
});
</script>

<style lang="scss" scoped>
.icon {
  width: 45px;
  height: 45px;
}

.tools-panel-content {
  height: 100%;
  width: 100%;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding-top: 10px;

  .tools-panel-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
  }
}

.select-icon {
  width: 35px;
  height: 35px;
}

.exit-full-screen-icon,
.full-screen-icon {
  width: 30px;
  height: 30px;
}

.play-icon,
.back-icon,
.screenshot-icon {
  width: 33px;
  height: 33px;
}

.animation-icon {
  width: 40px;
  height: 40px;
}

.redo-icon,
.undo-icon {
  width: 35px;
  height: 35px;
}

circle {
  cursor: pointer;
  transition: r 0.2s ease;
}

.animation-controls {
  display: flex;
  align-items: center;
  gap: 12px;

  .control-icon {
    width: 30px;
    height: 30px;
  }

  .icon-button {
    background: white;
  }

  .frame-counter {
    display: flex;
    width: 80px;
    height: 40px;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #ffffff;
    border-radius: 8px;
    padding: 4px 8px;
  }

  .frame-input {
    width: 32px;
    border: none;
    outline: none;
    text-align: center;
    font-size: 16px;
    color: #333;
    background: transparent;
    padding: 2px 4px;
    border-radius: 4px;
    border-color: #aedbda;
    box-shadow: 0 0 0 2px #aedbda;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      // border: 1px solid #64a7a5;
      border: none;
    }
  }

  .frame-counter-slash {
    margin: 0 10px;
    font-size: 16px;
    color: #333;
  }
}
</style>

<style lang="scss">
.orientation-landscape {
  .tools-panel-content,
  .animation-controls {
    flex-direction: column;
  }

  .tools-panel-content {
    gap: 20px;
  }
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: color 0.3s;
  border-radius: 50%;
  background: #ffffff;
  box-shadow:
    18px 26px 13px rgba(0, 0, 0, 0.01),
    10px 15px 11px rgba(0, 0, 0, 0.05),
    5px 7px 8px rgba(0, 0, 0, 0.09),
    1px 2px 4px rgba(0, 0, 0, 0.1);

  &.is-active,
  &:hover {
    background: #c2f4f2;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: #ffffff;
    }
  }
}
</style>
