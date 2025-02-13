<template>
  <g class="tools-panel">
    <foreignObject ref="toolsPanelRef" x="143" y="33" width="1296" height="115" overflow="visible">
      <div class="tools-panel-content">
        <div
          class="icon-button"
          title="选择"
          :class="{ select: currentTool === 'select' }"
          @click="setCurrentTool('select')"
        >
          <GradientSvgIcon
            class="icon select-icon"
            :startColor="gradientColor.startColor"
            :endColor="gradientColor.endColor"
            name="select"
          />
        </div>
        <Shape></Shape>
        {{ globalStore.deviceInfo }}
        <div class="icon-button" title="清空" @click="clearItems">
          <GradientSvgIcon
            class="icon"
            :startColor="gradientColor.startColor"
            :endColor="gradientColor.endColor"
            name="clear"
          />
        </div>

        <div class="icon-button" title="全屏" @click="fullscreen" v-if="!isFullscreen && !globalStore.deviceInfo.isIOS">
          <GradientSvgIcon
            class="icon full-screen-icon"
            :startColor="gradientColor.startColor"
            :endColor="gradientColor.endColor"
            name="full-screen"
          />
        </div>

        <div
          class="icon-button"
          title="退出全屏"
          @click="exitFullscreen"
          v-if="isFullscreen && !globalStore.deviceInfo.isIOS"
        >
          <GradientSvgIcon
            class="icon exit-full-screen-icon"
            :startColor="gradientColor.startColor"
            :endColor="gradientColor.endColor"
            name="exit-full-screen"
          />
        </div>

        <div class="icon-button" title="截图" v-if="boardArea" @click="captureScreenshot(boardArea)">
          <GradientSvgIcon
            class="icon screenshot-icon"
            :startColor="gradientColor.startColor"
            :endColor="gradientColor.endColor"
            name="screenshot"
          />
        </div>

        <div class="animation-controls" v-if="isAnimationMode">
          <div class="icon-button" @click="switchFrame(Math.max(0, currentFrameIndex - 1))" title="上一帧">
            <span>←</span>
          </div>
          <div class="frame-info">帧 {{ currentFrameIndex }}</div>
          <div class="icon-button" @click="addFrame" title="下一帧">
            <span>→</span>
          </div>
          <div class="icon-button" @click="togglePlayback" title="播放/暂停">
            <span>{{ isPlaying ? "⏸" : "▶" }}</span>
          </div>
        </div>

        <div class="icon-button" v-if="!isAnimationMode" @click="openAnimation" title="动画模式">
          <span>创建动画</span>
        </div>
        <div class="icon-button" v-else @click="exitAnimation" title="退出动画模式">
          <span>退出动画</span>
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeUnmount } from "vue";
import { captureScreenshot } from "../utils/index";
import { useItemStore } from "../stores/itemStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";
import { useDrawStore } from "../stores/drawStore";
import GradientSvgIcon from "./GradientSvgIcon.vue";
import { gradientColor } from "../constants";
import Shape from "../tools/Shape.vue";
import { useAnimationStore } from "../stores/animationStore";

const globalStore = useGlobalStore();
const itemStore = useItemStore();
const boardStore = useBoardStore();
const drawStore = useDrawStore();
const animationStore = useAnimationStore();
// 方法可以直接解构
const { toggleFullscreen } = globalStore;
const { clearItems } = itemStore;
const { setCurrentTool } = drawStore;
const { isAnimationMode, currentFrameIndex, isPlaying } = storeToRefs(animationStore);
const { openAnimation, exitAnimation, switchFrame, addFrame, togglePlayback } = animationStore;

// 使用 storeToRefs 保持响应性
const { isFullscreen } = storeToRefs(globalStore);
const { boardArea } = storeToRefs(boardStore);
const { currentTool } = storeToRefs(drawStore);

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

// 添加组件卸载时的清理逻辑
onBeforeUnmount(() => {
  if (isPlaying.value) {
    animationStore.stopAutoPlay();
  }
});
</script>

<style lang="scss">
.icon {
  width: 45px;
  height: 45px;
}
.tools-panel-content {
  height: 100%;
  width: 100%;
  display: flex;
  gap: 80px;
  align-items: center;
  justify-content: center;

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

    &:hover,
    &.select {
      background: #c2f4f2;
    }

    // 会导致移动端弹窗无法弹出
    // &:hover {
    //   transform: scale(0.95);
    // }
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

.screenshot-icon {
  width: 33px;
  height: 33px;
}

circle {
  cursor: pointer;
  transition: r 0.2s ease;
}

.animation-controls {
  display: flex;
  align-items: center;
  gap: 10px;

  .frame-info {
    color: #333;
    font-size: 14px;
    padding: 0 10px;
  }
}
</style>
