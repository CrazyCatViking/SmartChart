import { useCanvasState } from "./canvasState";
import { useChart } from "./chart";
import { createChartHistory } from "./chartHistory";
import { useCopyPaste } from "./copyPaste";
import {
  CustomElementFactory,
  CustomPrimitiveFactory,
  createCustomPrimitiveFactory,
} from "./customFactories";
import { useHotKeyState } from "./hotKeyState";

export interface CanvasOptions {
  customPrimitiveFactory?: CustomPrimitiveFactory;
  customElementFactory?: CustomElementFactory;
}

// This currently uses a lot of dependency injection with vue inject
// so the order these are created in is important.
// I might want to consider standardizing all these in a "container" file
export const useCanvas = (options?: CanvasOptions) => {
  const canvasState = useCanvasState();
  const hotKeyState = useHotKeyState();

  createCustomPrimitiveFactory({
    primitiveFactory: options?.customPrimitiveFactory,
    elementFactory: options?.customElementFactory,
  });

  const chartHistory = createChartHistory([], options?.customElementFactory);

  const chart = useChart(canvasState, hotKeyState, chartHistory);

  return {
    canvasState,
    hotKeyState,
    chart,
  };
};
