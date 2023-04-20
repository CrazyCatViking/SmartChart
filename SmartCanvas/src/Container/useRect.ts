import { computed, provide, InjectionKey, Ref, ComputedRef, inject } from "vue";
import {
  ElementPosition,
  ElementSize,
  RectBaseCoordinates,
  RectVertices,
} from "../canvas/types";
import { Vector, createVector } from "../utility/vector";
import { Element } from "../elements";
import { hotKeyStateInjectionKey } from "../canvas/hotKeyState";

export const useRect = (element: Element) => {
  const rect = createRect(element);
  provide(rectInjectionToken, rect);

  return rect;
};

export const rectInjectionToken: InjectionKey<Rect> = Symbol(
  "rect-injection-token"
);

interface Rect {
  element: Element;
  rectPosition: Ref<ElementPosition>;
  rectSize: Ref<ElementSize>;
  rectVertices: ComputedRef<RectVertices>;

  rotateRect: (mousePosition: Vector) => void;
  moveRect: (clientX: number, clientY: number) => void;
  resizeRect: (mousePosition: Vector, anchorPosition: Vector) => void;
}

const createRect = (element: Element): Rect => {
  const { ctrlPressed } = inject(hotKeyStateInjectionKey)!;

  const rectPosition = element.position;
  const rectSize = element.size;

  const rectBaseCoordinates = computed<RectBaseCoordinates>(() => {
    const { x, y } = rectPosition.value;
    const { width, height } = rectSize.value;

    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    return { x1, x2, y1, y2 };
  });

  const rectVertices = computed<RectVertices>(() => {
    const coordinates = rectBaseCoordinates.value;
    const referenceVertices = getRectVertices(coordinates);

    return rotateVertices(referenceVertices, rectPosition.value.rotation);
  });

  const getRectVertices = ({
    x1,
    x2,
    y1,
    y2,
  }: RectBaseCoordinates): RectVertices => ({
    a: createVector(x1, y1),
    b: createVector(x2, y1),
    c: createVector(x2, y2),
    d: createVector(x1, y2),
  });

  const rotateRect = (mousePosition: Vector) => {
    const rectCenter = createVector(
      rectPosition.value.x + rectSize.value.width / 2,
      rectPosition.value.y + rectSize.value.height / 2
    );

    element.rotate(mousePosition, rectCenter);
  };

  const moveRect = (deltaX: number, deltaY: number) => {
    element.move(deltaX, deltaY);
  };

  const resizeRect = (mousePosition: Vector, anchorPosition: Vector) => {
    if (ctrlPressed.value) {
      scale(mousePosition, anchorPosition);
      return;
    }

    element.resize(mousePosition, anchorPosition);
  };

  const scale = (mousePosition: Vector, anchorPosition: Vector) => {
    const vertices = element.getVertices();

    const center = vertices.a.getCenter(vertices.c);

    const mouseDistance = mousePosition.getDistance(center);
    const aDistance = vertices.a.getDistance(center);

    const scaleFactor = mouseDistance / aDistance;

    element.scale(scaleFactor, anchorPosition);
  };

  return {
    element,
    rectPosition,
    rectSize,
    rectVertices,

    rotateRect,
    moveRect,
    resizeRect,
  };
};

const rotateVertices = (
  vertices: RectVertices,
  rotation: number
): RectVertices => {
  const rectPosition = vertices.a;
  const rectSize = getElementSize(vertices.a, vertices.c);

  const rotationCenter = getRectCenter(rectPosition, rectSize);

  return {
    a: vertices.a.rotate(rotation, rotationCenter),
    b: vertices.b.rotate(rotation, rotationCenter),
    c: vertices.c.rotate(rotation, rotationCenter),
    d: vertices.d.rotate(rotation, rotationCenter),
  };
};

const getRectCenter = (rectPosition: Vector, rectSize: ElementSize): Vector => {
  const { x, y } = rectPosition;
  const { width, height } = rectSize;

  var vector = {
    x: x + width / 2,
    y: y + height / 2,
  };

  return createVector(vector.x, vector.y);
};

const getElementSize = (a: Vector, c: Vector): ElementSize => ({
  width: c.x - a.x,
  height: c.y - a.y,
});
