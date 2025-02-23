<template>
  <div class="wrapper" :class="[`device-${deviceType}`, `orientation-${orientation}`]">
    <Debug v-if="isDev" />
    <div class="board">
      <Field :items="items" class="field" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";
import Field from "./components/Field.vue";
import { useItemStore } from "./stores/itemStore";
import { useGlobalStore } from "./stores/globalStore";
import Debug from "./components/Debug.vue";

const isDev = import.meta.env.DEV;

const itemStore = useItemStore();
const { items } = storeToRefs(itemStore);
const globalStore = useGlobalStore();
const { orientation, deviceType } = storeToRefs(globalStore);

onMounted(() => {
  window.addEventListener("resize", globalStore.updateOrientation);
});

onUnmounted(() => {
  window.removeEventListener("resize", globalStore.updateOrientation);
});
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
}
.device-mobile {
  .board {
    width: 80%;
  }
}
.orientation-portrait {
  .board {
    width: 100%;
  }
}

.device-mobile.orientation-landscape {
  .board {
    width: 65%;
  }
}
</style>
