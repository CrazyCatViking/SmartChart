import { Ref, ref } from "vue";
import { ElementPosition, ElementSize } from "../types";
import { v4 as uuidv4 } from 'uuid';

type ElementType = 'Image' | 'Rectangle' | 'Ellipse' | 'Text';

export interface Element {
  id: Readonly<string>;
  type: Readonly<ElementType>;
  position: Ref<ElementPosition>;
  size: Ref<ElementSize>;
  isSelected: Ref<boolean>;

  render: (ctx: CanvasRenderingContext2D) => Promise<void> | void;
}

export const createElement = (position: ElementPosition, size: ElementSize, type: ElementType): Element => {
  const _id = uuidv4();
  const _type = type;
  const _position = ref(position);
  const _size = ref(size);
  const _isSelected = ref(false);

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
  }
}