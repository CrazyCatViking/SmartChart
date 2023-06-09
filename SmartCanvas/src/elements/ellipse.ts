import { Element, ElementData, createElement } from "./element";

export interface Ellipse extends Element {
  color: string;
  strokeWidth: number;
}

export interface EllipseData extends ElementData {
  color?: string;
  strokeWidth?: number;
} 

export const createEllipse = (data: EllipseData): Ellipse => {
  const element = createElement({ ...data, type: 'Ellipse' });

  const _strokeWidth = 3;

  const render = (ctx: CanvasRenderingContext2D) => {
    const { x, y, rotation } = element.position.value;
    const { width, height } = element.size.value;

    const cx = x + width / 2;
    const cy = y + height / 2;

    ctx.beginPath();
    ctx.ellipse(cx, cy, width / 2, height / 2, rotation, 0, 2*Math.PI);
    ctx.lineWidth = _strokeWidth;
    ctx.stroke();
  };

  return {
    ...element,

    color: 'black',
    strokeWidth: _strokeWidth,
    render,
  };
};