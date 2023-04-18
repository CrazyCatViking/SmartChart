import { InjectionKey, Ref, ref, provide } from "vue";

export interface CanvasState {
  isAddingElement: Readonly<Ref<boolean>>;

  startAddElement: () => void;
  endAddElement: () => void;
}

export const useCanvasState = (): CanvasState => {
  const canvasState = createCanvasState();
  provide(canvasStateInjectionKey, canvasState);

  return canvasState;
}

export const canvasStateInjectionKey: InjectionKey<CanvasState> = Symbol('canvas-state-injection-key');

const createCanvasState = (): CanvasState => {
  const _isAddingElement = ref(false);

  const startAddElement = () => {
    _isAddingElement.value = true;
  };

  const endAddElement = () => {
    _isAddingElement.value = false;
  };

  return {
    get isAddingElement() { return _isAddingElement; },

    startAddElement,
    endAddElement,
  }
};