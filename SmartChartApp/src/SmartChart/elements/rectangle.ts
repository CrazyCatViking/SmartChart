import { Ref } from "vue";
import { ElementPosition, ElementSize } from "../types";
import { Element, ElementData, createElement } from "./element";

export interface Rectangle extends Element {
  color: string;
  strokeWidth: number;
}

export interface RectangleData extends ElementData {
  color?: string;
  strokeWidth?: number;
}

export const createRect = (data: RectangleData): Rectangle => {
  const element = createElement({ ...data, type: 'Rectangle' });

  const _strokeWidth = 3;

  const render = (ctx: CanvasRenderingContext2D) => {
    const { x, y, rotation } = element.position.value;
    const { width, height } = element.size.value;

    const cx = x + width / 2;
    const cy = y + height / 2;

    ctx.beginPath();

    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);

    ctx.rect(x, y, width, height);
    ctx.lineWidth = _strokeWidth;
    ctx.stroke();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  return {
    ...element,
    color: 'black',
    strokeWidth: _strokeWidth,

    render,
  };
};