import { ref, unref } from 'vue'; 
import { v4 as uuidV4 } from 'uuid';
import {
  ConnectorData,
  Element,
  ElementData,
  ImageData,
  TextData,
  createConnector,
  createElement,
  createEllipse,
  createImage,
  createRect,
  createText
} from "../elements";
import { CustomElementFactory } from '../canvas/customFactories';

type SerializerOptions = { noPersistId?: boolean, customFactory?: CustomElementFactory };

export const serializeChart = (elements: Element[]): string => {
  // This is a hack to unwrap the nested refs
  const _elements = ref(elements.filter((element) => element.type !== 'Group'));
  return JSON.stringify(unref(_elements));
};

export const deserializeChart = (elements: string, options?: SerializerOptions): Element[] => {
  const elementData = JSON.parse(elements) as Array<ElementData>;

  const compositElementTypes = ['Group', 'Connector'];

  const regularElementData = elementData.filter((data) => !compositElementTypes.includes(data.type ?? ''));
  const compositElementData = elementData.filter((data) => compositElementTypes.includes(data.type ?? ''));

  // There is probably a better way of handling this when we are not persisting ids.
  const idMapping: Record<string, string> = {};
  elementData.forEach((data) => {
    const oldId = data.id!;

    if (options?.noPersistId) {
      data.id = uuidV4();
    }

    idMapping[oldId] = data.id!;
  });

  const regularElements = regularElementData.map((data) => {
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
        return options?.customFactory ? options.customFactory(data) : createElement(data);
    }
  });

  const compositElements = compositElementData.map((data) => {
    switch(data.type) {
      case 'Connector':
        const connectorData = data as ConnectorData;

        const originElement = regularElements.find((element) => element.id === idMapping[connectorData.originElement.id]);
        const targetElement = regularElements.find((element) => element.id === idMapping[connectorData.targetElement.id]);

        if (!originElement || !targetElement) throw new Error();

        return createConnector({ ...connectorData, originElement, targetElement });
      default:
        return createElement(data);
    }
  });

  return [ ...regularElements, ...compositElements ];
};