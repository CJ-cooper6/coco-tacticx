<template>
  <el-popover placement="bottom" popper-class="shape-popover" trigger="click" ref="popoverRef">
    <template #reference>
      <div
        class="icon-button"
        ref="buttonRef"
        title="形状"
        :class="{ select: currentTool === 'shape' }"
        @click="handleClick()"
      >
        <GradientSvgIcon
          class="icon shape-icon"
          :startColor="gradientColor.startColor"
          :endColor="gradientColor.endColor"
          name="shape"
        />
      </div>
    </template>
    <div class="shape-select-container" ref="popoverContainerRef">
      <ShapeSelect></ShapeSelect>
      <ColorSelect></ColorSelect>
      <SizeSelect></SizeSelect>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useDrawStore } from "../stores/drawStore";
import { gradientColor } from "../constants";
import GradientSvgIcon from "@/components/GradientSvgIcon.vue";
import ShapeSelect from "./components/ShapeSelect.vue";
import ColorSelect from "./components/ColorSelect.vue";
import SizeSelect from "./components/SizeSelect.vue";
import { useClickOutside } from "@/composables/useClickOutside";

const drawStore = useDrawStore();
const { setCurrentTool } = drawStore;

const { currentTool } = storeToRefs(drawStore);

const popoverVisible = ref(false);

const popoverRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const popoverContainerRef = ref<HTMLElement | null>(null);
const closePopover = () => {
  // @ts-ignore
  popoverRef.value?.hide();
};

const handleClick = () => {
  setCurrentTool("shape");
  popoverVisible.value = !popoverVisible.value;
};

useClickOutside({
  targetRef: popoverContainerRef,
  excludeRefs: [buttonRef],
  onClickOutside: closePopover,
});

watch(currentTool, (newTool) => {
  if (newTool !== "shape") {
    closePopover();
  }
});
</script>

<style lang="scss">
.shape-icon {
  width: 32px !important;
  height: 32px !important;
}

.el-popover {
  font-size: inherit !important;
}

.shape-popover {
  width: 12.5rem !important;
}
</style>

<style lang="scss" scoped>
.shape-select-container {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}
</style>
