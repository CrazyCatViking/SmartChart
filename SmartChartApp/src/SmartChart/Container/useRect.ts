import { ref, computed, provide, InjectionKey, Ref } from "vue";
import { ElementPosition, ElementSize, RectBaseCoordinates, RectVertices } from "../types";
import { Vector, createVector } from "./vector";
import { Element } from "../elements";

export const useRect = (element: Element) => {
  const rect = createRect(element);
  provide(rectInjectionToken, rect);

  return rect;
}

export const rectInjectionToken: InjectionKey<Rect> = Symbol('rect-injection-token');

interface Rect {
  rectPosition: Ref<ElementPosition>;
  rectSize: Ref<ElementSize>;

  rotateRect: (pageX: number, pageY: number) => void;
  moveRect: (clientX: number, clientY: number) => void;

  resizeRectTopRight: (newTopRight: Vector) => void;
  resizeRectTopLeft: (newTopLeft: Vector) => void;
  resizeRectBottomRight: (newBottomRight: Vector) => void;
  resizeRectBottomLeft: (newBottomLeft: Vector) => void;
}

const createRect = (element: Element): Rect => {
  // I have managed to create some complicated mess with all these
  // nested refs. Refactoring is needed to remove some of the refs
  const internalElement = ref(element);
  const rectPosition = ref(internalElement.value.position);
  const rectSize = ref(internalElement.value.size);

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

  const getRectVertices = ({ x1, x2, y1, y2 }: RectBaseCoordinates): RectVertices => ({
    a: createVector(x1, y1),
    b: createVector(x2, y1),
    c: createVector(x2, y2),
    d: createVector(x1, y2),
  });

  const rotateRect = (pageX: number, pageY: number) => {
    const rectCenter = createVector(
      rectPosition.value.x + rectSize.value.width / 2,
      rectPosition.value.y + rectSize.value.height / 2,
    );

    const mousePosition = createVector(pageX, pageY);

    internalElement.value.rotate(mousePosition, rectCenter);
  }

  const moveRect = (deltaX: number, deltaY: number) => {
    internalElement.value.move(deltaX, deltaY);
  }

  const resizeRectTopRight = (newTopRight: Vector) => {
    const originalVertices = rectVertices.value;
    const angle = rectPosition.value.rotation;
  
    const { d } = originalVertices;
    const newCenter = d.getCenter(newTopRight);
  
    const { x: x2, y: y1 } = newTopRight.rotate(-angle, newCenter);
    const { x: x1, y: y2 } = d.rotate(-angle, newCenter);
  
    element.resize(createVector(x1, y1), createVector(x2, y2));
  };

  const resizeRectTopLeft = (newTopLeft: Vector) => {
    const originalVertices = rectVertices.value;
    const rotation = rectPosition.value.rotation;
  
    const { c } = originalVertices;
    const newCenter = c.getCenter(newTopLeft);
  
    const { x: x1, y: y1 } = newTopLeft.rotate(-rotation, newCenter);
    const { x: x2, y: y2 } = c.rotate(-rotation, newCenter);

    element.resize(createVector(x1, y1), createVector(x2, y2));
  };

  const resizeRectBottomRight = (newBottomRight: Vector) => {
    const originalVertices = rectVertices.value;
    const rotation = rectPosition.value.rotation;
  
    const { a } = originalVertices;
    const newCenter = a.getCenter(newBottomRight);
  
    const { x: x2, y: y2 } = newBottomRight.rotate(-rotation, newCenter);
    const { x: x1, y: y1 } = a.rotate(-rotation, newCenter);

    element.resize(createVector(x1, y1), createVector(x2, y2));
  };

  const resizeRectBottomLeft = (newBottomLeft: Vector) => {
    const originalVertices = rectVertices.value;
    const rotation = rectPosition.value.rotation;
  
    const { b } = originalVertices;
    const newCenter = b.getCenter(newBottomLeft);

    const { x: x1, y: y2 } = newBottomLeft.rotate(-rotation, newCenter);
    const { x: x2, y: y1 } = b.rotate(-rotation, newCenter);

    element.resize(createVector(x1, y1), createVector(x2, y2));
  };

  return {
    rectPosition,
    rectSize,

    rotateRect,
    moveRect,

    resizeRectTopRight,
    resizeRectTopLeft,
    resizeRectBottomRight,
    resizeRectBottomLeft,
  };
};

const rotateVertices = (vertices: RectVertices, rotation: number): RectVertices => {
  const rectPosition = vertices.a;
  const rectSize = getElementSize(vertices.a, vertices.c);

  const rotationCenter = getRectCenter(rectPosition, rectSize);

  return {
    a: vertices.a.rotate(rotation, rotationCenter),
    b: vertices.b.rotate(rotation, rotationCenter),
    c: vertices.c.rotate(rotation, rotationCenter),
    d: vertices.d.rotate(rotation, rotationCenter),
  }
};

const getRectCenter = (rectPosition: Vector, rectSize: ElementSize): Vector => {
  const { x, y } = rectPosition;
  const { width, height } = rectSize;

  var vector = {
    x: x + width / 2,
    y: y + height / 2,
  }

  return createVector(vector.x, vector.y);
};

const getElementSize = (a: Vector, c: Vector): ElementSize => ({
  width: c.x - a.x,
  height: c.y - a.y
});
