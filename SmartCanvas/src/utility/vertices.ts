import { Vector, createVector } from "./vector";
import { ElementPosition, ElementSize } from "../canvas/types";

export interface Vertices {
  a: Readonly<Vector>;
  b: Readonly<Vector>;
  c: Readonly<Vector>;
  d: Readonly<Vector>;

  getBaseCoordinates: () => { topLeft: Vector, bottomRight: Vector };

  rotate: (angle: number, rotationCenter: Vector) => Vertices;
  translate: (x: number, y: number) => Vertices;
  scale: (scaleFactor: number) => Vertices;
}

export const createVertices = (vertices: { a: Vector, b: Vector, c: Vector, d: Vector }): Vertices => {
  const _a = vertices.a;
  const _b = vertices.b;
  const _c = vertices.c;
  const _d = vertices.d;

  const getBaseCoordinates = () => {
    const x1 = Math.min(_a.x, _b.x, _c.x, _d.x);
    const x2 = Math.max(_a.x, _b.x, _c.x, _d.x);
    const y1 = Math.min(_a.y, _b.y, _c.y, _d.y);
    const y2 = Math.max(_a.y, _b.y, _c.y, _d.y);

    return {
      topLeft: createVector(x1, y1),
      bottomRight: createVector(x2, y2),
    };
  };

  const rotate = (angle: number, rotationCenter: Vector): Vertices => createVertices({
    a: _a.rotate(angle, rotationCenter),
    b: _b.rotate(angle, rotationCenter),
    c: _c.rotate(angle, rotationCenter),
    d: _d.rotate(angle, rotationCenter),
  });

  const translate = (x: number, y: number): Vertices => createVertices({
    a: _a.translate(x, y),
    b: _b.translate(x, y),
    c: _c.translate(x, y),
    d: _d.translate(x, y),
  });

  const scale = (scaleFactor: number): Vertices => createVertices({
    a: _a.scale(scaleFactor),
    b: _b.scale(scaleFactor),
    c: _c.scale(scaleFactor),
    d: _d.scale(scaleFactor),
  });

  return {
    get a() { return _a; },
    get b() { return _b; },
    get c() { return _c; },
    get d() { return _d; },

    getBaseCoordinates,

    rotate,
    translate,
    scale,
  }
} 
