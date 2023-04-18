import { useCanvasState } from "./canvasState";
import { useChart } from "./chart"
import { useHotKeyState } from "./hotKeyState";

export const useCanvas = () => {
  const canvasState = useCanvasState();
  const hotKeyState = useHotKeyState();
  const chart = useChart(canvasState, hotKeyState);

  return {
    canvasState,
    hotKeyState,
    chart,
  };
}