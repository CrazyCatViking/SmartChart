import { ref, computed, provide, InjectionKey, Ref } from "vue";
import { ElementPosition, ElementSize, RectBaseCoordinates, RectVertices } from "../types";
import { Vector, createVector } from "./vector";

export const useRect = (elPosition: ElementPosition, elSize: ElementSize) => {
  const rect = createRect(elPosition, elSize);
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

const createRect = (elPosition: ElementPosition, elSize: ElementSize): Rect => {
  const rectPosition = ref(elPosition);
  const rectSize = ref(elSize);

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
    const rectCenter = {
      x: rectPosition.value.x + rectSize.value.width / 2,
      y: rectPosition.value.y + rectSize.value.height / 2,
    };

    const rotation = Math.atan2(pageX - rectCenter.x, - (pageY - rectCenter.y));

    rectPosition.value.rotation = rotation;
  }

  const moveRect = (deltaX: number, deltaY: number) => {
    rectPosition.value.x += deltaX;
    rectPosition.value.y += deltaY;
  }

  const resizeRectTopRight = (newTopRight: Vector) => {
    const originalVertices = rectVertices.value;
    const angle = rectPosition.value.rotation;
  
    const { d } = originalVertices;
    const newCenter = d.getCenter(newTopRight);
  
    const { x: x2, y: y1 } = newTopRight.rotate(-angle, newCenter);
    const { x: x1, y: y2 } = d.rotate(-angle, newCenter);
  
    resizeRect(createVector(x1, y1), createVector(x2, y2));
  };

  const resizeRectTopLeft = (newTopLeft: Vector) => {
    const originalVertices = rectVertices.value;
    const rotation = rectPosition.value.rotation;
  
    const { c } = originalVertices;
    const newCenter = c.getCenter(newTopLeft);
  
    const { x: x1, y: y1 } = newTopLeft.rotate(-rotation, newCenter);
    const { x: x2, y: y2 } = c.rotate(-rotation, newCenter);

    resizeRect(createVector(x1, y1), createVector(x2, y2));
  };

  const resizeRectBottomRight = (newBottomRight: Vector) => {
    const originalVertices = rectVertices.value;
    const rotation = rectPosition.value.rotation;
  
    const { a } = originalVertices;
    const newCenter = a.getCenter(newBottomRight);
  
    const { x: x2, y: y2 } = newBottomRight.rotate(-rotation, newCenter);
    const { x: x1, y: y1 } = a.rotate(-rotation, newCenter);

    resizeRect(createVector(x1, y1), createVector(x2, y2));
  };

  const resizeRectBottomLeft = (newBottomLeft: Vector) => {
    const originalVertices = rectVertices.value;
    const rotation = rectPosition.value.rotation;
  
    const { b } = originalVertices;
    const newCenter = b.getCenter(newBottomLeft);

    const { x: x1, y: y2 } = newBottomLeft.rotate(-rotation, newCenter);
    const { x: x2, y: y1 } = b.rotate(-rotation, newCenter);

    resizeRect(createVector(x1, y1), createVector(x2, y2));
  };

  const resizeRect = ({ x: x1, y: y1 }: Vector, { x: x2, y: y2 }: Vector) => {
    rectPosition.value.x = x1;
    rectPosition.value.y = y1;
    rectSize.value.width = x2 - x1;
    rectSize.value.height = y2 - y1;
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
