import { ref, unref } from 'vue'; 
import {
  Element,
  ElementData,
  ImageData,
  TextData,
  createElement,
  createEllipse,
  createImage,
  createRect,
  createText
} from "../elements";

export const serializeChart = (elements: Element[]): string => {
  // This is a hack to unwrap the nested refs
  const _elements = ref(elements);
  return JSON.stringify(unref(_elements));
};

export const deserializeChart = (elements: string): Element[] => {
  const elementData = JSON.parse(elements) as Array<ElementData>;

  return elementData.map((data) => {
    switch(data.type) {
      case 'Ellipse':
        return createEllipse(data);
      case 'Rectangle':
        return createRect(data);
      case 'Image':
        return createImage(data as ImageData);
      case 'Text':
        return createText(data as TextData);
      default:
        return createElement(data);
    }
  });
};