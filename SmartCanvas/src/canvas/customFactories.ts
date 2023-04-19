import { Component, InjectionKey, provide } from "vue";
import { Element, ElementData } from "../elements";

export type CustomPrimitiveFactory = (type: string) => Component;
export type CustomElementFactory = (type: ElementData) => Element;

export type CreateFactoryInput = {
  primitiveFactory?: CustomPrimitiveFactory;
  elementFactory?: CustomElementFactory;
};

export const createCustomPrimitiveFactory = ({
  primitiveFactory,
  elementFactory,
}: CreateFactoryInput) => {
  provide(customPrimitiveFactoryInjectionKey, primitiveFactory);
  provide(customElementFactoryInjectionKey, elementFactory);

  return { primitiveFactory, elementFactory };
};

export const customPrimitiveFactoryInjectionKey: InjectionKey<CustomPrimitiveFactory> =
  Symbol("custom-primitive-factory");
export const customElementFactoryInjectionKey: InjectionKey<CustomElementFactory> =
  Symbol("custom-element-factory");
