<template>
  <div class="size-container">
    <div class="size-group">
      <div
        v-for="(size, index) in sizes"
        :key="size"
        class="size-item"
        :class="{ active: drawingConfig.size === size }"
        @click="chooseSize(size)"
      >
        <SvgIcon :name="`stroke-size-${index + 1}`" class="svg-icon"></SvgIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDrawStore } from "@/stores/drawStore";
import SvgIcon from "@/components/common/SvgIcon.vue";

const drawStore = useDrawStore();
const { drawingConfig } = storeToRefs(drawStore);
const sizes = [2, 5, 10];

const chooseSize = (size: number) => {
  drawingConfig.value.size = size;
};
</script>

<style lang="scss" scoped>
.size-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .size-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
  }

  .size-item {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--text-dark-color);
    box-shadow:
      5px 7px 8px rgba(0, 0, 0, 0.08),
      1px 2px 4px rgba(0, 0, 0, 0.1);
    border: 1.5px solid var(--primary-color);

    &:hover {
      background: var(--primary-hover-color);
    }

    .svg-icon {
      width: 1rem;
      height: 1rem;
    }

    &.active {
      background: var(--primary-hover-color);
    }
  }
}
</style>
