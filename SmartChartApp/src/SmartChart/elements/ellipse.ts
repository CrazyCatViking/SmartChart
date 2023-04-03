import { ElementPosition, ElementSize } from "../types";
import { Element, createElement } from "./element";

export interface Ellipse extends Element {
  color: string;
}

export const createEllipse = (position: ElementPosition, size: ElementSize): Ellipse => {
  const element = createElement(position, size, 'Ellipse');

  const render = (ctx: CanvasRenderingContext2D) => {
    const { x, y, rotation } = element.position.value;
    const { width, height } = element.size.value;

    const cx = x + width / 2;
    const cy = y + height / 2;

    ctx.beginPath();
    ctx.ellipse(cx, cy, width / 2, height / 2, rotation, 0, 2*Math.PI);
    ctx.stroke();
  };

  return {
    ...element,

    color: 'black',
    render,
  };
};