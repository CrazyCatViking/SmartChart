import { InjectionKey, Ref, inject, provide, ref, unref } from "vue";
import { Vector, createVector } from "../utility/vector";
import { chartInjectionKey } from "../chart";
import { hotKeyStateInjectionKey } from "../hotKeyState";

export interface DragSelectState {
  isSelecting: Readonly<Ref<boolean>>;
  initialPosition: Readonly<Ref<Vector>>;

  beginSelection: (initialPosition: Vector) => void;
  endSelection: (finalPosition: Vector) => void;
}

export const useDragSelect = (): DragSelectState => {
  const dragSelectState = createDragSelectState();
  provide(dragSelectStateKey, dragSelectState);

  return dragSelectState;
}

export const dragSelectStateKey: InjectionKey<DragSelectState> = Symbol('drag-select-state-key');

const createDragSelectState = (): DragSelectState => {
  const { elements, selectElements, resetSelection } = inject(chartInjectionKey)!;
  const { ctrlPressed } = inject(hotKeyStateInjectionKey)!;

  const _isSelecting = ref(false);
  const _initialPosition = ref<Vector>(createVector(0, 0));

  const beginSelection = (initialPosition: Vector) => {
    if (!ctrlPressed) resetSelection();

    _initialPosition.value = initialPosition;
    _isSelecting.value = true;
  };

  const endSelection = (finalPosition: Vector) => {
    const { x: initialX, y: initialY } = _initialPosition.value;
    const { x: finalX, y: finalY } = finalPosition;

    const width = Math.abs(finalX - initialX);
    const height = Math.abs(finalY - initialY);
  
    const x1 = initialX < finalX ? initialX : finalX;
    const y1 = initialY < finalY ? initialY : finalY;
    const x2 = x1 + width;
    const y2 = y1 + height;

    const elementsToSelect = elements.value
      .filter((element) => {
        const { x, y } = unref(element.position);
        const { width: elWidth, height: elHeight } = unref(element.size);

        return !((x > x2) || (y > y2) || (x + elWidth < x1) || (y + elHeight < y1));
      })
      .map((element) => element.id);

    selectElements(...elementsToSelect);
    _isSelecting.value = false;
  };

  return {
    get isSelecting() { return _isSelecting; },
    get initialPosition() { return _initialPosition; },

    beginSelection,
    endSelection,
  }
}