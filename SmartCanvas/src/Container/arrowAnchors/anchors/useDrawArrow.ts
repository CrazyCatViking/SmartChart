import { inject, ref } from "vue";
import { useCanvasArrows } from "../../../canvas/useCanvasArrows";
import { useCanvasCoordinates } from "../../../canvas/useCanvasCoordinates";
import { createVector } from "../../../utility/vector";
import { Anchor, AnchorPoint } from "../../../elements";
import { rectInjectionToken } from "../../useRect";

export const useDrawArrow = (anchorPoint: AnchorPoint) => {
  const {
    startDrawingArrow,
    setTargetAnchor,
    endDrawingArrow,
    cancelDrawingArrow,
  } = useCanvasArrows();
  
  const { getCanvasCoordinates } = useCanvasCoordinates();
  
  const { element } = inject(rectInjectionToken)!;
  
  const isOrigin = ref(false);
  
  const onMouseDown = (e: MouseEvent) => {
    const { clientX, clientY } = e;
  
    const mousePos = createVector(clientX, clientY);
    const mouseCanvasPos = getCanvasCoordinates(mousePos);
  
    isOrigin.value = true;
  
    const targetAnchor: Anchor = {
      anchorCoordinates: mouseCanvasPos,
    };
  
    const originAnchor: Anchor = {
      element,
      anchorPoint,
      anchorCoordinates: createVector(0, 0),
    };
  
    startDrawingArrow(originAnchor, targetAnchor);
  };
  
  const onMouseMove = (e: MouseEvent) => {
    const targetAnchor = getTargetFromMouse(e);
    setTargetAnchor(targetAnchor);
  }
  
  const onMouseUp = (e: MouseEvent) => {
    if (isOrigin.value) {
      cancelDrawingArrow();
      isOrigin.value = false;

      return;
    }
    
    const targetAnchor: Anchor = {
      element,
      anchorPoint,
      anchorCoordinates: createVector(0, 0),
    };
  
    setTargetAnchor(targetAnchor);
    endDrawingArrow();
  
    isOrigin.value = false;
  }
  
  const getTargetFromMouse = (e: MouseEvent) => {
    const { clientX, clientY } = e;
  
    const mousePos = createVector(clientX, clientY);
    const mouseCanvasPos = getCanvasCoordinates(mousePos);
  
    const targetAnchor: Anchor = {
      anchorCoordinates: mouseCanvasPos,
    };
  
    return targetAnchor;
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,

    isOrigin,
  };
}