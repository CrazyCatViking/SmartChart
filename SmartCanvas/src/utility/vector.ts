export interface Vector {
  x: Readonly<number>;
  y: Readonly<number>;

  rotate: (angle: number, rotationCenter?: Vector) => Vector;
  translate: (dx: number, dy: number) => Vector;
  scale: (scaleFactor: number) => Vector;
  getCenter: (vectorB: Vector) => Vector;
  getSize: () => number;
  getDistance: (vectorB: Vector) => number;
};

export const createVector = (x: number, y: number) => {
  const _x = x;
  const _y = y;

  const rotate = (angle: number, rotationCenter?: Vector): Vector => {
    const cx = rotationCenter?.x ?? 0;
    const cy = rotationCenter?.y ?? 0;

    const rotatedX = cx + (x - cx)*Math.cos(angle) - (y - cy)*Math.sin(angle);
    const rotatedY = cy + (x - cx)*Math.sin(angle) + (y - cy)*Math.cos(angle);

    return createVector(rotatedX, rotatedY);
  };

  const translate = (dx: number, dy: number): Vector => createVector(
    _x + dx,
    _y + dy,
  );

  const scale = (scaleFactor: number): Vector => createVector(
    _x * scaleFactor,
    _y * scaleFactor,
  );

  const getCenter = (vectorB: Vector): Vector => createVector(
    (_x + vectorB.x) / 2,
    (_y + vectorB.y) / 2,
  );

  const getSize = () => Math.sqrt(_x * _x + _y * _y);

  const getDistance = (vectorB: Vector) => {
    const dx = vectorB.x - _x;
    const dy = vectorB.y - _y;

    return Math.sqrt(dx * dx + dy * dy);
  };

  return {
    get x() { return _x },
    get y() { return _y },

    rotate,
    translate,
    scale,
    getCenter,
    getSize,
    getDistance,
  }
}