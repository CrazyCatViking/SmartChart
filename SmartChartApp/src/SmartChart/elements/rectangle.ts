import { ElementPosition, ElementSize } from "../types";
import { Element, createElement } from "./element";

export interface Rectangle extends Element {
  color: string;
}

export const createRect = (position: ElementPosition, size: ElementSize): Rectangle => {
  const element = createElement(position, size, 'Rectangle');

  return {
    ...element,
    color: 'black',
  };
};