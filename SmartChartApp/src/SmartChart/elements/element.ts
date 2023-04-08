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
  resize: (mousePosition: Vector, anchorPosition: Vector) => void;
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