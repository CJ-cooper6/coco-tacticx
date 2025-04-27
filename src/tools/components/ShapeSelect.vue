<template>
  <div class="shape-container">
    <div class="shape-group">
      <div
        v-for="shape in shapes"
        :key="shape"
        class="shape-item"
        :class="{ active: drawingConfig.type === shape }"
        @click="chooseShape(shape)"
      >
        <SvgIcon :name="shape" class="svg-icon"></SvgIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDrawStore } from "@/stores/drawStore";
import SvgIcon from "@/components/SvgIcon.vue";

const drawStore = useDrawStore();

const { drawingConfig } = storeToRefs(drawStore);

const shapes = ["pen", "rectangle", "ellipse"];

const emit = defineEmits(["changedShape"]);

const chooseShape = (shape: string) => {
  drawingConfig.value.type = shape;
  emit("changedShape", shape);
};
</script>

<style lang="scss" scoped>
.shape-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .shape-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
  }

  .shape-item {
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
