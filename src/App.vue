<template>
  <div class="wrapper">
    <div class="board">
      <Field :items="items" class="field" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import Field from "./components/Field.vue";
import { useItemStore } from "./stores/itemStore";

const itemStore = useItemStore();
// 使用 storeToRefs 保持响应性
const { items } = storeToRefs(itemStore);
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;

  .header {
    position: relative;
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    padding: 0 25px;
    background-color: #738554;
  }

  .board {
    display: flex;
    flex-direction: column;
    background-color: var(--color-primary-color);
    position: relative;
    margin: auto;
    width: 70%;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    /* 禁用移动端的长按菜单 */
    -webkit-touch-callout: none;
    -webkit-user-drag: none;

    .field {
      width: 100%;
      height: auto;
    }
  }

  @media (orientation: portrait) {
    .board {
      width: 100%; /* 竖屏时使用更大的宽度 */
    }
  }
}
</style>
