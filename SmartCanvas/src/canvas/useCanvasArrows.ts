import { InjectionKey } from "vue";
import { injectOrProvide } from "../utility/injectOrProvide";
import { Chart } from "./chart";
import { Anchor, ArrowElement, createArrow } from "../elements";

export interface CanvasArrows {
  startDrawingArrow: (originAnchor: Anchor, targetAnchor: Anchor) => void;
  setTargetAnchor: (targetAnchor: Anchor) => void;
  endDrawingArrow: () => void;
}

const canvasArrowsInjectionKey: InjectionKey<CanvasArrows> =
  Symbol("canvas-arrows-key");

export const useCanvasArrows = (chart?: Chart) => {
  const factory = () => {
    if (!chart) throw new Error();
    return createCavnasArrows(chart);
  };

  return injectOrProvide(canvasArrowsInjectionKey, factory);
};

export const createCavnasArrows = (chart: Chart): CanvasArrows => {
  let _isDrawingArrow = false;
  let _arrow: ArrowElement | undefined = undefined;

  const startDrawingArrow = (originAnchor: Anchor, targetAnchor: Anchor) => {
    _isDrawingArrow = true;

    const arrow = createArrow({
      originAnchor,
      targetAnchor,
      position: { x: 0, y: 0, z: 0, rotation: 0 },
      size: { width: 0, height: 0 },
    });

    chart.addElements(arrow);
    _arrow = arrow;
  };

  const setTargetAnchor = (targetAnchor: Anchor) => {
    if (!_arrow) return;
    _arrow.tragetAnchor.value = targetAnchor;
  };

  const endDrawingArrow = () => {
    _isDrawingArrow = false;
    _arrow = undefined;

    chart.commitChanges();
  };

  return {
    startDrawingArrow,
    setTargetAnchor,
    endDrawingArrow,
  };
};
