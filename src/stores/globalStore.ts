import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { isMobile, isTablet, isBrowser, isIOS } from "mobile-device-detect";
import { debounce } from "lodash";

export const useGlobalStore = defineStore("global", () => {
  // 设备信息
  const deviceInfo = {
    isIOS,
    isMobile, // 是否为手机
    isTablet, // 是否为平板
    isBrowser, // 是否为浏览器
  };
  const isFullscreen = ref(false);
  const windowSize = ref({ width: window.innerWidth, height: window.innerHeight });
  const isDrawing = ref(false);
  // 屏幕方向 portrait 竖屏 landscape 横屏
  const orientation = ref<"portrait" | "landscape">(window.innerHeight > window.innerWidth ? "portrait" : "landscape");
  const currentTool = ref("select");

  // getters
  const deviceType = computed(() => {
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    return "desktop";
  });

  // 是否为移动设备（手机或平板）
  const isMobileDevice = computed(() => deviceInfo.isMobile || deviceInfo.isTablet);

  // actions
  // 切换全屏
  const toggleFullscreen = (force?: boolean) => {
    isFullscreen.value = force ?? !isFullscreen.value;
  };

  // 设置绘制状态
  const setDrawStatus = (status: boolean) => {
    isDrawing.value = status;
  };

  const updateOrientation = debounce(() => {
    orientation.value = window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  }, 150);

  const setCurrentTool = (tool: string) => {
    currentTool.value = tool;
  };

  return {
    isFullscreen,
    windowSize,
    toggleFullscreen,
    isDrawing,
    setDrawStatus,
    isMobileDevice,
    deviceInfo,
    orientation,
    updateOrientation,
    deviceType,
    currentTool,
    setCurrentTool,
  };
});
