import { Ref, ref, provide, InjectionKey, unref } from "vue";
import { saveAs } from 'file-saver';
import { Element } from "./elements/element";

interface Chart {
  elements: Readonly<Ref<Element[]>>;

  addElement: (element: Element) => void;
  removeElement: (id: string) => void; 

  convertToImage: () => void;
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

  const convertToImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const element of _elements.value) {
      await element.render(ctx);
    }

    canvas.toBlob((blob) => {
      if (blob == null) return;
      saveAs(blob, "chart.png");
    });
  }

  return {
    get elements() { return _elements; },

    addElement,
    removeElement,

    convertToImage,
  }
}