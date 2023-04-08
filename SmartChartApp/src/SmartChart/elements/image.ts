import { createVector } from "../utility/vector";
import { ElementPosition, ElementSize } from "../types";
import { Element, createElement } from "./element";

export interface Image extends Element {
  url: string;
}

export const createImage = (position: ElementPosition, size: ElementSize, url: string): Image => {
  const element = createElement(position, size, 'Image');

  const render = async (ctx: CanvasRenderingContext2D) => {
    const { x, y, rotation } = element.position.value;
    const { width, height } = element.size.value;

    const res = await fetch(url);
    const blob = await res.blob();

    const image = new Image();

    await new Promise<void>(resolve => {
      image.onload = () => {
        const topLeft = createVector(x, y);
        const bottomRight = createVector(x + width, y + height);
    
        const { x: cx, y: cy } = topLeft.getCenter(bottomRight);
    
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.translate(-cx, -cy);

        ctx.drawImage(image, x, y, width, height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        resolve();
      };

      image.src = URL.createObjectURL(blob);
    });
  };

  return {
    ...element,

    url,
    render,
  };
};