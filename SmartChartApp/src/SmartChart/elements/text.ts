import { Ref, ref } from "vue";
import { createVector } from "../Container/vector";
import { ElementPosition, ElementSize } from "../types";
import { Element, createElement } from "./element";

export interface TextElement extends Element {
  color: string;
  text: Ref<string>;
  font: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

export const createText = (position: ElementPosition, size: ElementSize): TextElement => {
  const element = createElement(position, size, 'Text');

  const _text = ref("Test");
  const _font = 'Times New Roman';
  const _fontSize = 16;
  const _fontWeight = 200;
  const _lineHeight = 16;

  const render = async (ctx: CanvasRenderingContext2D) => {
    const { x, y, rotation } = element.position.value;
    const { width, height } = element.size.value;

    const topLeft = createVector(x, y);
    const bottomRight = createVector(x + width, y + height);

    const { x: cx, y: cy } = topLeft.getCenter(bottomRight);

    const lines = _text.value.split(/\r?\n|\r|\n/g);

    lines
      .filter((_, index) => (index + 1)*_lineHeight < height)
      .forEach((line, index) => {
        const ly = y + index * _lineHeight;

        ctx.font = `${_fontSize}px ${_font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'black';

        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.translate(-cx, -cy);

        ctx.fillText(line, cx, ly);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

    console.log(_text.value);
  };

  return {
    ...element,

    text: _text,
    color: 'black',
    font: _font,
    fontSize: _fontSize,
    fontWeight: _fontWeight,
    lineHeight: _lineHeight,

    render,
  };
};