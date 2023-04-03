export interface Vector {
  x: Readonly<number>;
  y: Readonly<number>;

  rotate: (angle: number, rotationCenter?: Vector) => Vector;
  getCenter: (vectorB: Vector) => Vector;
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

  const getCenter = (vectorB: Vector): Vector => createVector(
    (_x + vectorB.x) / 2,
    (_y + vectorB.y) / 2,
  );

  return {
    get x() { return _x },
    get y() { return _y },

    rotate,
    getCenter,
  }
}