import { Ref } from "vue";
import { ElementPosition, ElementSize, RectVertices, Vertex } from "./types";

export const useRect = (elPosition: Ref<ElementPosition>, elSize: Ref<ElementSize>) => {
  const { x, y } = elPosition.value;
  const { width, height } = elSize.value;
  
  let x1 = x;
  let y1 = y;
  let x2 = x1 + width;
  let y2 = y1 + height;

  const getVertices = (): RectVertices => ({
    a: { x: x1, y: y1 },
    b: { x: x2, y: y1 },
    c: { x: x2, y: y2 },
    d: { x: x1, y: y2 },
  });

  const updateElement = () => {
    const vertices = getVertices();
    const size = getElementSize(vertices);

    elPosition.value.x = vertices.a.x;
    elPosition.value.y = vertices.a.y;
    elSize.value.height = size.height;
    elSize.value.width = size.width;
  }

  return {
    getVerticeA: (): Vertex => ({ x: x1, y: y1 }),
    getVerticeB: (): Vertex => ({ x: x2, y: y1 }),
    getVerticeC: (): Vertex => ({ x: x2, y: y2 }),
    getVerticeD: (): Vertex => ({ x: x1, y: y2 }),

    setX1: (value: number) => x1 = value,
    setX2: (value: number) => x2 = value,
    setY1: (value: number) => y1 = value,
    setY2: (value: number) => y2 = value,

    getVertices,
    updateElement,
  };
};

const getElementSize = ({ a, c }: RectVertices) => ({ width: c.x - a.x, height: c.y - a.y });
