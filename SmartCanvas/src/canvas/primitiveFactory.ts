import { inject } from "vue";
import Ellipse from "../primitives/CanvasEllipse.vue";
import Rectangle from "../primitives/CanvasRectangle.vue";
import Image from "../primitives/CanvasImage.vue";
import TextElement from "../primitives/CanvasText.vue";
import Connector from "../primitives/CanvasConnector.vue";
import { customPrimitiveFactoryInjectionKey } from "./customFactories";

export const usePrimitiveFactory = () => {
  const customFactory = inject(customPrimitiveFactoryInjectionKey);

  const createPrimitive = (type: string) => {
    switch (type) {
      case "Rectangle":
        return Rectangle;
      case "Ellipse":
        return Ellipse;
      case "Image":
        return Image;
      case "Text":
        return TextElement;
      case "Connector":
        return Connector;
      default:
        return !!customFactory ? customFactory(type) : undefined;
    }
  };

  return { createPrimitive };
};
