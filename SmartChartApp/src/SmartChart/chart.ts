import { Ref, ref, provide, InjectionKey } from "vue";
import { Element } from "./element";

interface Chart {
  elements: Readonly<Ref<Element[]>>;

  addElement: (element: Element) => void;
  removeElement: (id: string) => void; 
}

export const useChart = (): Chart => {
  const chart = createChart();
  provide(chartInjectionKey, chart);

  return chart;
};

export const chartInjectionKey: InjectionKey<Chart> = Symbol('chart-injection-key');

const createChart = (): Chart => {
  const _elements: Ref<Element[]> = ref([]);

  const addElement = (element: Element) => {
    _elements.value.push(element);
  };

  const removeElement = (id: string) => {
    _elements.value = _elements.value.filter((element) => element.id !== id);
  };

  return {
    get elements() { return _elements; },

    addElement,
    removeElement,
  }
}