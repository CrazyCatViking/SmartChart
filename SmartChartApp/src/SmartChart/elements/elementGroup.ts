import { unref } from "vue";
import { Vector } from "../utility/vector";
import { ElementPosition, ElementSize } from "../types";
import { Element, createElement } from "./element";

export interface ElementGroup extends Element {
  children: Readonly<Element[]>;
}

export const createGroup = (children: Element[]): ElementGroup => {
  const _children = children;

  const { position, size } = getGroupPositionAndSize(children);
  
  const element = createElement({ position, size, type: 'Group' });
  const { position: _position, size: _size } = element;

  const rotate = (mousePosition: Vector, rotationCenter: Vector) => {
    const { x, y } = mousePosition;
    const { x: cx, y: cy } = rotationCenter;

    const angle = Math.atan2(x - cx, - (y - cy));
    const dRotation = angle - _position.value.rotation;

    _children.forEach((child) => {
      const childPos = unref(child.position); // Realy need to figure out this mess with refs!!
      const vertices = child.getVertices();

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

  const resize = (mousePosition: Vector, anchorPosition: Vector) => {
    const vertices = element.getVertices();

    const center = vertices.a.getCenter(vertices.c);
    
    const mouseDistance = mousePosition.getDistance(center);
    const aDistance = vertices.a.getDistance(center);

    const scaleFactor = mouseDistance / aDistance;

    scale(scaleFactor, anchorPosition);
  };

  const scale = (scaleFactor: number, anchorPosition: Vector) => {
    _children.forEach((child) => {
      child.scale(scaleFactor, anchorPosition)
    });

    element.scale(scaleFactor, anchorPosition);
  }

  return {
    ...element,

    get children() { return _children },

    rotate,
    move,
    resize,
    scale,
  };
};

const getGroupPositionAndSize = (children: Element[]) => {
  const childrenVertices = children.map((child) => {
    const { rotation } = unref(child.position);
    const vertices = child.getVertices();

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
};