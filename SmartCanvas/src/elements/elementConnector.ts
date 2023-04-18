import { Ref, computed } from "vue";
import { createElement } from "./element";
import { ElementData } from "./element";
import { Element } from "./element";
import { Vector } from "../utility/vector";
import { Vertices } from "../utility/vertices";

export interface ConnectorData extends ElementData {
  originElement: Element;
  targetElement: Element;
}

export interface ElementConnector extends Element {
  originElement: Readonly<Element>;
  targetElement: Readonly<Element>;
  lines: Ref<Array<{ origin: Vector, target: Vector }>>;
  strokeWidth: number;
}

export const createConnector  = (data: ConnectorData): ElementConnector => {
  const _strokeWidth = 3;

  const coordinates = computed(() => {
    const { position: originPos } = data.originElement;
    const { position: targetPos } = data.targetElement;

    const originRotation = originPos.value.rotation;
    const targetRotation = targetPos.value.rotation;

    const originVertices = data.originElement.getVertices();
    const targetVertices = data.targetElement.getVertices();

    const originRotationCenter = originVertices.a.getCenter(originVertices.c);
    const targetRotationCenter = targetVertices.a.getCenter(targetVertices.c);

    const rotatedOriginVertices = originVertices.rotate(originRotation, originRotationCenter);
    const rotatedTargetVertices = targetVertices.rotate(targetRotation, targetRotationCenter);

    const originCenters = getVerticeCenters(rotatedOriginVertices);
    const targetCenters = getVerticeCenters(rotatedTargetVertices);

    const { origin, target } = getClosestOriginAndTarget(originCenters, targetCenters);

    return {
      origin,
      target,
    };
  });

  const positionAndSize = computed(() => {
    const { origin, target } = coordinates.value;
    const { x: x1, y: y1 } = origin;
    const { x: x2, y: y2 } = target;
    
    const x = (x1 < x2 ? x1 : x2) - _strokeWidth / 2;
    const y = (y1 < y2 ? y1 : y2) - _strokeWidth / 2;
    
    const width = Math.abs(x2 - x1) + _strokeWidth;
    const height = Math.abs(y2 - y1) + _strokeWidth;

    return {
      position: { x, y, z: 0, rotation: 0 },
      size: { width, height },
    };
  })

  const _position = computed(() => positionAndSize.value.position);
  const _size = computed(() => positionAndSize.value.size);

  const element = createElement({ ...data, type: 'Connector' });

  const lines = computed(() => {
    const { x, y } = _position.value;
    const { origin, target } = coordinates.value;

    return [
      {
        origin: origin.translate(-x, -y),
        target: target.translate(-x, -y),
      },
    ];
  });

  const render = (ctx: CanvasRenderingContext2D) => {
    const { origin, target } = coordinates.value;

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(target.x, target.y);
    ctx.lineWidth = _strokeWidth;
    ctx.stroke();
  };

  return {
    ...element,
    position: _position,
    size: _size,
    strokeWidth: _strokeWidth,
    lines,

    get originElement() { return data.originElement },
    get targetElement() { return data.targetElement },

    render,
  }
};

const getVerticeCenters = (vertices: Vertices): Vector[] => {
  const { a, b, c, d } = vertices;

  return [
    a.getCenter(b),
    b.getCenter(c),
    c.getCenter(d),
    d.getCenter(a),
  ];
}

const getClosestOriginAndTarget = (originCenters: Vector[], targetCenters: Vector[]) => {
  const distanceAndVectors = originCenters.flatMap((origin) => targetCenters.map((target) => {
    const distance = origin.getDistance(target);
    return { distance, origin, target };
  }));

  const distances = distanceAndVectors.map((item) => item.distance);
  const minDistance = Math.min(...distances);

  const closestOriginAndTarget = distanceAndVectors
    .find((item) => item.distance === minDistance);

  if (!closestOriginAndTarget) throw new Error();

  const { origin, target } = closestOriginAndTarget;

  return {
    origin,
    target,
  };
};
