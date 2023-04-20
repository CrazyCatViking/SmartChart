import { ref, unref } from 'vue'; 
import { v4 as uuidV4 } from 'uuid';
import {
  Anchor,
  ArrowData,
  ConnectorData,
  Element,
  ElementData,
  ImageData,
  TextData,
  createArrow,
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

  const compositElementTypes = ['Group', 'Connector', 'Arrow'];

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
      case 'Arrow':
        const arrowData = data as ArrowData;

        const originAnchor: Anchor = {
          anchorCoordinates: arrowData.originAnchor.anchorCoordinates,
          anchorPoint: arrowData.originAnchor.anchorPoint,
          element: arrowData.originAnchor.element
            ? regularElements.find((element) => element.id === idMapping[arrowData.originAnchor.element!.id])
            : undefined,
        };

        const targetAnchor: Anchor = {
          anchorCoordinates: arrowData.targetAnchor.anchorCoordinates,
          anchorPoint: arrowData.targetAnchor.anchorPoint,
          element: arrowData.targetAnchor.element
            ? regularElements.find((element) => element.id === idMapping[arrowData.targetAnchor.element!.id])
            : undefined,
        };

        return createArrow({ ...arrowData, originAnchor, targetAnchor });
      default:
        return createElement(data);
    }
  });

  return [ ...regularElements, ...compositElements ];
};