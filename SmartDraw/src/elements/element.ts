import { Ref, ref } from "vue";
import { ElementPosition, ElementSize } from "../canvas/types";
import { v4 as uuidv4 } from 'uuid';
import { Vector, createVector } from "../utility/vector";
import { Vertices, createVertices } from "../utility/vertices";

export type ElementType = 'Image' | 'Rectangle' | 'Ellipse' | 'Text' | 'Group' | 'Connector';

export interface ElementData {
  position: ElementPosition;
  size: ElementSize;
  type?: ElementType;
  id?: string;
};

export interface Element {
  id: Readonly<string>;
  type?: Readonly<ElementType>;
  position: Ref<ElementPosition>;
  size: Ref<ElementSize>;

  render: (ctx: CanvasRenderingContext2D) => Promise<void> | void;

  rotate: (mousePosition: Vector, rotationCenter: Vector) => void;
  move: (clientX: number, clientY: number) => void;
  resize: (mousePosition: Vector, anchorPosition: Vector) => void;
  scale: (scaleFactor: number, anchorPosition: Vector) => void;
  getVertices: () => Vertices;
}

export const createElement = ({ position, size, type, id }: ElementData): Element => {
  const _id = id ?? uuidv4();
  const _type = type;

  const _position = ref(position);
  const _size = ref(size);

  const rotate = ({ x, y }: Vector, { x: cx, y: cy }: Vector) => {
    const rotation = Math.atan2(x - cx, - (y - cy));
    _position.value.rotation = rotation;
  };

  const move = (deltaX: number, deltaY: number) => {
    _position.value.x += deltaX;
    _position.value.y += deltaY;
  };

  const resize = (mousePosition: Vector, anchorPosition: Vector) => {
    const angle = _position.value.rotation;

    const newCenter = anchorPosition.getCenter(mousePosition);

    const { x, y } = anchorPosition.rotate(-angle, newCenter);
    const { x: clientX, y: clientY } = mousePosition.rotate(-angle, newCenter);

    const newX = x < clientX ? x : clientX;
    const newY = y < clientY ? y : clientY;

    const width = Math.abs(clientX - x);
    const height = Math.abs(clientY - y);

    _position.value.x = newX;
    _position.value.y = newY;
    _size.value.width = width;
    _size.value.height = height;
  };

  const scale = (scaleFactor: number, { x: anchorX, y: anchorY }: Vector) => {
    const transformedVertices = getVertices()
      .translate(-anchorX, -anchorY)
      .scale(scaleFactor)
      .translate(anchorX, anchorY)

    const { a, c } = transformedVertices;

    _position.value.x = a.x;
    _position.value.y = a.y;
    _size.value.width = c.x - a.x;
    _size.value.height = c.y - a.y;
  }

  const getVertices = () => {
    const { x, y } = _position.value;
    const { width, height } = _size.value;

    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    return createVertices({
      a: createVector(x1, y1),
      b: createVector(x2, y1),
      c: createVector(x2, y2),
      d: createVector(x1, y2),
    });
  }

  const throwRenderNotImplemented = () => {
    throw new Error(`Render function not implemented for ${type}`); 
  };

  return {
    get id() { return _id; },
    get type() { return _type; },

    position: _position,
    size: _size,

    render: throwRenderNotImplemented,
    rotate,
    move,
    resize,
    scale,
    getVertices,
  }
};