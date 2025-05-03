import { storeToRefs } from "pinia";
import { GAME_CONSTANTS } from "../constants";
import { useBoardStore } from "../stores/boardStore";
import pinia from "../stores/index.js";

const boardStore = useBoardStore(pinia);
const { boardAreaBBox } = storeToRefs(boardStore);

