import { Ref, ref, provide, InjectionKey, ComputedRef, computed } from "vue";
import { saveAs } from 'file-saver';
import { Element } from "./elements/element";
import { HotKeyState } from "./hotKeyState";
import { CanvasState } from "./canvasState";

interface Chart {
  elements: Readonly<Ref<Element[]>>;
  selectedElements: Readonly<Ref<string[]>>;

  addElement: (element: Element) => void;
  removeElement: (id: string) => void; 

  convertToImage: () => void;

  selectElement: (id: string) => void;
  resetSelection: () => void;
  getIsSelected: (id: string) => ComputedRef<boolean>;
  deleteSelected: () => void;
}

export const useChart = (canvasState: CanvasState, hotKeyState: HotKeyState): Chart => {
  const chart = createChart(canvasState, hotKeyState);
  provide(chartInjectionKey, chart);

  return chart;
};

export const chartInjectionKey: InjectionKey<Chart> = Symbol('chart-injection-key');

const createChart = (canvasState: CanvasState, hotKeyState: HotKeyState): Chart => {
  const _elements: Ref<Element[]> = ref([]);
  const _selectedElements: Ref<string[]> = ref([]);

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
  };

  const selectElement = (id: string) => {
    if (hotKeyState.ctrlPressed.value) {
      _selectedElements.value.push(id);
      return;
    }

    _selectedElements.value = [ id ];
  };

  const resetSelection = () => {
    _selectedElements.value = [];
  };

  const getIsSelected = (id: string) => computed(() => _selectedElements.value.includes(id));

  const deleteSelected = () => {
    console.log('test');
    _elements.value = _elements.value.filter((element) => !_selectedElements.value.includes(element.id));
    _selectedElements.value = [];
  };

  return {
    get elements() { return _elements; },
    get selectedElements() { return _selectedElements; },

    addElement,
    removeElement,

    convertToImage,

    selectElement,
    resetSelection,
    getIsSelected,
    deleteSelected,
  }
}