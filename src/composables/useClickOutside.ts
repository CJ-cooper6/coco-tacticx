import { onMounted, onUnmounted, type Ref } from "vue";

interface UseClickOutsideOptions {
  targetRef: Ref<HTMLElement | null>;
  excludeRefs?: Ref<HTMLElement | null>[];
  onClickOutside: () => void;
}

export function useClickOutside({ targetRef, excludeRefs = [], onClickOutside }: UseClickOutsideOptions) {
  const handleClickOutside = (event: MouseEvent) => {
    const target = targetRef.value;
    if (!target) return;

    // 检查点击是否在目标元素外部
    const isClickOutside = !target.contains(event.target as Node);

    // 检查点击是否在排除元素内
    const isClickInExcluded = excludeRefs.some((ref) => ref.value?.contains(event.target as Node));

    // console.log("isClickOutside", isClickOutside);
    // console.log("isClickInExcluded", isClickInExcluded);
    if (isClickOutside && !isClickInExcluded) {
      onClickOutside();
    }
  };

  onMounted(() => {
    document.addEventListener("pointerdown", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("pointerdown", handleClickOutside);
  });
}
