import { InjectionKey, Ref, ref } from "vue";
import { Vector } from "../utility/vector";
import { injectOrProvide } from "../utility/injectOrProvide";

export interface CanvasCoordinates {
  getCanvasCoordinates: (coordinates: Vector) => Vector;
  setCanvasRef: (canvasHtmlElement: Ref<HTMLElement | undefined>) => void;
}

export const useCanvasCoordinates = (): CanvasCoordinates => {
  const factory = () => createCanvasCoordinates();
  return injectOrProvide(canvasCoordinatesInjectionKey, factory);
};

const canvasCoordinatesInjectionKey: InjectionKey<CanvasCoordinates> = Symbol(
  "canvas-coordinates-key"
);

const createCanvasCoordinates = (): CanvasCoordinates => {
  let _canvasHtmlElement = ref<HTMLElement | undefined>();

  const getCanvasCoordinates = (coordinates: Vector) => {
    if (!_canvasHtmlElement.value) return coordinates;

    const { top, left } = _canvasHtmlElement.value.getBoundingClientRect();
    return coordinates.translate(-left, -top);
  };

  const setCanvasRef = (canvasHtmlElement: Ref<HTMLElement | undefined>) => {
    _canvasHtmlElement = canvasHtmlElement;
  };

  return {
    getCanvasCoordinates,
    setCanvasRef,
  };
};
