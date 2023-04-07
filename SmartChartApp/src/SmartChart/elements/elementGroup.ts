import { unref } from "vue";
import { Vector, createVector } from "../Container/vector";
import { ElementPosition, ElementSize, RectVertices } from "../types";
import { Element, createElement } from "./element";
import { createVertices } from "../utility/vertices";

export interface ElementGroup extends Element {
  children: Readonly<Element[]>;
}

export const createGroup = (children: Element[]): ElementGroup => {
  const _children = children;

  const { position, size } = getGroupPositionAndSize(children);
  
  const element = createElement(position, size, 'Group');
  const { position: _position, size: _size } = element;

  const rotate = (mousePosition: Vector, rotationCenter: Vector) => {
    const { x, y } = mousePosition;
    const { x: cx, y: cy } = rotationCenter;

    const angle = Math.atan2(x - cx, - (y - cy));
    const dRotation = angle - _position.value.rotation;

    _children.forEach((child) => {
      const childPos = unref(child.position); // Realy need to figure out this mess with refs!!
      const vertices = getElementVertices(child);

      const oldChildCenter = vertices.a.getCenter(vertices.c);
      const newChildCenter = oldChildCenter.rotate(dRotation, rotationCenter);

      const dx = newChildCenter.x - oldChildCenter.x;
      const dy = newChildCenter.y - oldChildCenter.y;

      const { a } = vertices.translate(dx, dy);
      
      childPos.rotation += dRotation;
      childPos.x = a.x;
      childPos.y = a.y;
    });

    _position.value.rotation = angle;
  };

  const move = (deltaX: number, deltaY: number) => {
    _children.forEach((child) => {
      child.move(deltaX, deltaY);
    });

    _position.value.x += deltaX;
    _position.value.y += deltaY;
  };

  const resize = ({ x: x1, y: y1 }: Vector, { x: x2, y: y2 }: Vector) => {
    _position.value.x = x1;
    _position.value.y = y1;
    _size.value.width = x2 - x1;
    _size.value.height = y2 - y1;
  };

  const render = (ctx: CanvasRenderingContext2D) => { };

  return {
    ...element,

    get children() { return _children },

    render,
    rotate,
    move,
    resize,
  };
};

const getGroupPositionAndSize = (children: Element[]) => {
  const childrenVertices = children.map((child) => {
    const { rotation } = unref(child.position);
    const vertices = getElementVertices(child);
    const rotationCenter = vertices.a.getCenter(vertices.c);

    return vertices.rotate(rotation, rotationCenter);
  });

  const childrenXValues = childrenVertices.flatMap((child) => [
    child.a.x,
    child.b.x,
    child.c.x,
    child.d.x,
  ]);

  const childrenYValues = childrenVertices.flatMap((child) => [
    child.a.y,
    child.b.y,
    child.c.y,
    child.d.y,
  ]);

  const childrenZValues = children.map((child) => unref(child.position).z);

  const minX = Math.min(...childrenXValues);
  const maxX = Math.max(...childrenXValues);
  const minY = Math.min(...childrenYValues);
  const maxY = Math.max(...childrenYValues);
  const z = Math.max(...childrenZValues) + 1;

  const position: ElementPosition = { x: minX, y: minY, z, rotation: 0 };
  const size: ElementSize = { width: maxX - minX, height: maxY - minY };

  return { position, size };
}

const getElementVertices = (element: Element) => {
  const { x, y } = unref(element.position);
  const { width, height } = unref(element.size);

  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  return createVertices({
    a: createVector(x1, y1),
    b: createVector(x2, y1),
    c: createVector(x2, y2),
    d: createVector(x1, y2),
  });
};