import { InjectionKey, Ref } from "vue";
import { Vector } from "../utility/vector";
import { injectOrProvide } from "../utility/injectOrProvide";

export interface CanvasCoordinates {
  getCanvasCoordinates: (coordinates: Vector) => Vector;
}

export const useCanvasCoordinates = (
  canvasHtmlElement?: Ref<HTMLElement | undefined>
): CanvasCoordinates => {
  const factory = () => createCanvasCoordinates(canvasHtmlElement);
  return injectOrProvide(canvasCoordinatesInjectionKey, factory);
};

const canvasCoordinatesInjectionKey: InjectionKey<CanvasCoordinates> = Symbol(
  "canvas-coordinates-key"
);

const createCanvasCoordinates = (
  canvasHtmlElement?: Ref<HTMLElement | undefined>
): CanvasCoordinates => {
  const getCanvasCoordinates = (coordinates: Vector) => {
    if (!canvasHtmlElement?.value) return coordinates;

    const { top, left } = canvasHtmlElement.value.getBoundingClientRect();
    return coordinates.translate(-left, -top);
  };

  return {
    getCanvasCoordinates,
  };
};
