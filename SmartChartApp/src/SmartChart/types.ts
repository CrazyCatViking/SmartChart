import { Vector } from "./Container/vector";

export type RectVertices = { a: Vector, b: Vector, c: Vector, d: Vector };
export type RectBaseCoordinates = { x1: number, x2: number, y1: number, y2: number };
export type ElementPosition = { x: number, y: number, z: number, rotation: number };
export type ElementSize = { height: number, width: number };
export type Element = { position: ElementPosition, size: ElementSize }
export type ElementGroup = { elements: Element[] }