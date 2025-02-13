import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { isMobile, isTablet, isBrowser, isIOS } from "mobile-device-detect";

export const useGlobalStore = defineStore("global", () => {
  const isFullscreen = ref(false);
  const windowSize = ref({ width: window.innerWidth, height: window.innerHeight });
  const isDrawing = ref(false);

  // 设备信息
  const deviceInfo = {
    isIOS,
    isMobile, // 是否为手机
    isTablet, // 是否为平板
    isBrowser, // 是否为浏览器
  };

  // getters

  // 是否为移动设备（手机或平板）
  const isMobileDevice = computed(() => deviceInfo.isMobile || deviceInfo.isTablet);

  // actions

  // 更新窗口大小
  const updateWindowSize = (width: number, height: number) => {
    windowSize.value = { width, height };
  };

  // 切换全屏
  const toggleFullscreen = (force?: boolean) => {
    isFullscreen.value = force ?? !isFullscreen.value;
  };

  // 设置绘制状态
  const setDrawStatus = (status: boolean) => {
    isDrawing.value = status;
  };

  return {
    isFullscreen,
    windowSize,
    updateWindowSize,
    toggleFullscreen,
    isDrawing,
    setDrawStatus,
    isMobileDevice,
    deviceInfo,
  };
});
