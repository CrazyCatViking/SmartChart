import { Ref, ref } from "vue";
import { ElementPosition, ElementSize } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { Vector } from "../Container/vector";

type ElementType = 'Image' | 'Rectangle' | 'Ellipse' | 'Text' | 'Group';

export interface Element {
  id: Readonly<string>;
  type: Readonly<ElementType>;
  position: Ref<ElementPosition>;
  size: Ref<ElementSize>;
  isSelected: Ref<boolean>;

  render: (ctx: CanvasRenderingContext2D) => Promise<void> | void;

  rotate: (mousePosition: Vector, rotationCenter: Vector) => void;
  move: (clientX: number, clientY: number) => void;
  resize: (topLeft: Vector, bottomRight: Vector) => void;
}

export const createElement = (position: ElementPosition, size: ElementSize, type: ElementType): Element => {
  const _id = uuidv4();
  const _type = type;
  const _position = ref(position);
  const _size = ref(size);
  const _isSelected = ref(false);

  const rotate = ({ x, y }: Vector, { x: cx, y: cy }: Vector) => {
    const rotation = Math.atan2(x - cx, - (y - cy));
    _position.value.rotation = rotation;
  };

  const move = (deltaX: number, deltaY: number) => {
    _position.value.x += deltaX;
    _position.value.y += deltaY;
  };

  const resize = ({ x: x1, y: y1 }: Vector, { x: x2, y: y2 }: Vector) => {
    _position.value.x = x1;
    _position.value.y = y1;
    _size.value.width = x2 - x1;
    _size.value.height = y2 - y1;
  };

  const throwRenderNotImplemented = () => {
    throw new Error(`Render function not implemented for ${type}`); 
  };

  return {
    get id() { return _id; },
    get type() { return _type; },

    position: _position,
    size: _size,
    isSelected: _isSelected,

    render: throwRenderNotImplemented,
    rotate,
    move,
    resize,
  }
}