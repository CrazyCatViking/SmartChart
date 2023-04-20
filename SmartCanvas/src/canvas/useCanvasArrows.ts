import { InjectionKey, Ref, ref } from "vue";
import { injectOrProvide } from "../utility/injectOrProvide";
import { Chart } from "./chart";
import { Anchor, ArrowElement, createArrow } from "../elements";

export interface CanvasArrows {
  showAnchorPoints: Ref<boolean>;

  startDrawingArrow: (originAnchor: Anchor, targetAnchor: Anchor) => void;
  setTargetAnchor: (targetAnchor: Anchor) => void;
  endDrawingArrow: () => void;
  cancelDrawingArrow: () => void;
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
  const showAnchorPoints = ref(false);

  let _arrow: ArrowElement | undefined = undefined;

  const startDrawingArrow = (originAnchor: Anchor, targetAnchor: Anchor) => {
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
    _arrow.targetAnchor.value = targetAnchor;
  };

  const endDrawingArrow = () => {
    _arrow = undefined;
    chart.commitChanges();
  };

  const cancelDrawingArrow = () => {
    if (!_arrow) return;
    chart.removeElement(_arrow.id);
    _arrow = undefined;
  }

  return {
    showAnchorPoints,

    startDrawingArrow,
    setTargetAnchor,
    endDrawingArrow,
    cancelDrawingArrow,
  };
};
