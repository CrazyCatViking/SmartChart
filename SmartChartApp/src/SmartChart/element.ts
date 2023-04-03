import { Ref, ref } from "vue";
import { ElementPosition, ElementSize } from "./types";
import { v4 as uuidv4 } from 'uuid';

type ElementType = 'Image' | 'Rectangle' | 'Ellipse'; 

export interface Element {
  id: Readonly<string>;
  type: Readonly<ElementType>;
  position: Ref<ElementPosition>;
  size: Ref<ElementSize>;
}

export interface Rectangle extends Element {
  color: string;
}

export interface Ellipse extends Element {
  color: string;
}

export interface Image extends Element {
  url: string;
}

export const createRect = (position: ElementPosition, size: ElementSize): Rectangle => {
  const element = createElement(position, size, 'Rectangle');

  return {
    ...element,
    color: 'black',
  };
};

export const createEllipse = (position: ElementPosition, size: ElementSize): Ellipse => {
  const element = createElement(position, size, 'Ellipse');

  return {
    ...element,
    color: 'black',
  };
};

export const createImage = (position: ElementPosition, size: ElementSize, url: string): Image => {
  const element = createElement(position, size, 'Image');

  return {
    ...element,
    url,
  };
};

const createElement = (position: ElementPosition, size: ElementSize, type: ElementType): Element => {
  const _id = uuidv4();
  const _type = type;
  const _position = ref(position);
  const _size = ref(size);

  return {
    get id() { return _id; },
    get type() { return _type; },

    position: _position,
    size: _size,
  }
}