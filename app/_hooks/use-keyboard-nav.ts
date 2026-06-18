import { useCallback, useEffect, useState } from "react";

/**
 * 键盘导航 hook - 支持上下键切换、Enter 确认
 */
export function useKeyboardNav(
  itemCount: number,
  onSelect: (index: number) => void
) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (itemCount === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        event.preventDefault();
        onSelect(focusedIndex);
      }
    },
    [itemCount, focusedIndex, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { focusedIndex, setFocusedIndex };
}