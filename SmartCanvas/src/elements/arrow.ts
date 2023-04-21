import { Ref, computed, shallowRef } from "vue";
import { ElementData, Element, createElement } from "./element";
import { Vector } from "../utility/vector";

export type Anchor = {
  element?: Element;
  anchorPoint?: AnchorPoint;
  anchorCoordinates: Vector;
};
export type AnchorPoint = "Left" | "Top" | "Bottom" | "Right";

export interface ArrowElement extends Element {
  originAnchor: Ref<Anchor | undefined>;
  targetAnchor: Ref<Anchor | undefined>;
  lines: Ref<Array<{ origin: Vector; target: Vector }>>;
  strokeWidth: number;
}

export interface ArrowData extends ElementData {
  originAnchor: Anchor;
  targetAnchor: Anchor;
  strokeWidth?: number;
}

export const createArrow = (data: ArrowData): ArrowElement => {
  const element = createElement({ ...data, type: "Arrow" });

  const _originAnchor = shallowRef(data.originAnchor);
  const _targetAnchor = shallowRef(data.targetAnchor);

  const _strokeWidth = 3;

  const originCoordinate = computed(() =>
    _originAnchor.value.element && _originAnchor.value.anchorPoint
      ? getAnchorPointCoordinates(
          _originAnchor.value.element,
          _originAnchor.value.anchorPoint
        )
      : _originAnchor.value.anchorCoordinates
  );

  const targetCoordinate = computed(() =>
    _targetAnchor.value.element && _targetAnchor.value.anchorPoint
      ? getAnchorPointCoordinates(
          _targetAnchor.value.element,
          _targetAnchor.value.anchorPoint
        )
      : _targetAnchor.value.anchorCoordinates
  );

  const positionAndSize = computed(() => {
    const { x: x1, y: y1 } = originCoordinate.value;
    const { x: x2, y: y2 } = targetCoordinate.value;

    const x = (x1 < x2 ? x1 : x2) - _strokeWidth / 2;
    const y = (y1 < y2 ? y1 : y2) - _strokeWidth / 2;

    const width = Math.abs(x2 - x1) + _strokeWidth;
    const height = Math.abs(y2 - y1) + _strokeWidth;

    return {
      position: { x, y, z: 0, rotation: 0 },
      size: { width, height },
    };
  });

  const _position = computed(() => positionAndSize.value.position);
  const _size = computed(() => positionAndSize.value.size);

  const lines = computed(() => {
    const { x, y } = _position.value;

    return [
      {
        origin: originCoordinate.value.translate(-x, -y),
        target: targetCoordinate.value.translate(-x, -y),
      },
    ];
  });

  const render = (ctx: CanvasRenderingContext2D) => {
    const origin = originCoordinate.value;
    const target = targetCoordinate.value;

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(target.x, target.y);
    ctx.lineWidth = _strokeWidth;
    ctx.stroke();
  };

  return {
    ...element,

    originAnchor: _originAnchor,
    targetAnchor: _targetAnchor,
    lines,

    position: _position,
    size: _size,
    strokeWidth: _strokeWidth,

    render,
  };
};

const getAnchorPointCoordinates = (
  element: Element,
  anchorPoint: AnchorPoint
): Vector => {
  const elementRotation = element.position.value.rotation;

  const vertices = element.getVertices();

  const verticeCenter = vertices.a.getCenter(vertices.c);
  const { a, b, c, d } = vertices.rotate(elementRotation, verticeCenter);

  switch (anchorPoint) {
    case "Left":
      return d.getCenter(a);
    case "Right":
      return c.getCenter(b);
    case "Top":
      return a.getCenter(b);
    case "Bottom":
      return d.getCenter(c);
  }
};
