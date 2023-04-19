import {
  Ref,
  ref,
  provide,
  InjectionKey,
  ComputedRef,
  computed,
  watch,
  shallowRef
} from "vue";
import { Element } from "../elements/element";
import { HotKeyState } from "./hotKeyState";
import { CanvasState } from "./canvasState";
import { ElementGroup, createGroup } from "../elements/elementGroup";
import { ChartHistory, createChartHistory } from "./chartHistory";

export interface Chart {
  elements: Readonly<Ref<Element[]>>;
  selectedElements: Readonly<Ref<string[]>>;

  addElements: (...elements: Element[]) => void;
  removeElement: (id: string) => void;

  commitChanges: () => void;
  undoChanges: () => void;
  redoChanges: () => void;

  convertToImage: () => void;

  selectElements: (...ids: string[]) => void;
  resetSelection: () => void;
  getIsSelected: (id: string) => ComputedRef<boolean>;
  deleteSelected: () => void;
}

export const useChart = (canvasState: CanvasState, hotKeyState: HotKeyState, chartHistory: ChartHistory): Chart => {
  const chart = createChart(canvasState, hotKeyState, chartHistory);
  provide(chartInjectionKey, chart);

  return chart;
};

export const chartInjectionKey: InjectionKey<Chart> = Symbol('chart-injection-key');

const createChart = (canvasState: CanvasState, hotKeyState: HotKeyState, chartHistory: ChartHistory): Chart => {
  const _elements: Ref<Element[]> = shallowRef([]);
  const _selectedElements: Ref<string[]> = ref([]);

  const {
    commitChanges,
    undoChanges,
    redoChanges,

    checkCanRedo,
    checkCanUndo,
  } = chartHistory;

  const selectionGroupId = ref<string>();

  const addElements = (...elements: Element[]) => {
    _elements.value = [ ..._elements.value, ...elements ];
  }

  const removeElement = (id: string) => {
    _elements.value = _elements.value.filter((element) => element.id !== id);
  };

  const convertToImage = async (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const elementsToRender = _elements.value.filter((element) => element.type !== 'Group');

    for (const element of elementsToRender) {
      await element.render(ctx);
    }

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob));
    });
  };

  const selectElements = (...ids: string[]) => {
    if (ids.some(id => id === selectionGroupId.value)) return;

    if (hotKeyState.ctrlPressed.value) {
      _selectedElements.value.push(...ids);
      return;
    }

    _selectedElements.value = [ ...ids ];
  };

  const resetSelection = () => {
    _selectedElements.value = [];
  };

  const getIsSelected = (id: string) => computed(() => {
    if (_selectedElements.value.length === 1) {
      return _selectedElements.value.includes(id);
    }

    const element = _elements.value.find((element) => element.id === id);
    
    if (element?.type !== 'Group') return false;

    const group = element as ElementGroup;

    return group.children.every((child) => _selectedElements.value.includes(child.id));
  });

  const deleteSelected = () => {
    _elements.value = _elements.value.filter((element) => !_selectedElements.value.includes(element.id));
    _selectedElements.value = [];
  };

  const _commitChanges = () => {
    commitChanges(_elements.value);
  };

  const _undoChanges = () => {
    if (!checkCanUndo()) return;
    _elements.value = undoChanges();
  };

  const _redoChanges = () => {
    if (!checkCanRedo()) return;
    _elements.value = redoChanges();
  };

  watch(_selectedElements, (value) => {
    if (selectionGroupId.value) {
      removeElement(selectionGroupId.value);
      selectionGroupId.value = undefined;
    }

    if (value.length <= 1) return;

    const elements = _elements.value
      .filter((element) => value.includes(element.id) && element.type !== 'Connector');

    const groupElement = createGroup(elements);

    selectionGroupId.value = groupElement.id;
    addElements(groupElement);
  }, { deep: true });

  return {
    get elements() { return _elements; },
    get selectedElements() { return _selectedElements; },

    addElements,
    removeElement,

    commitChanges: _commitChanges,
    undoChanges: _undoChanges,
    redoChanges: _redoChanges,

    convertToImage,

    selectElements,
    resetSelection,
    getIsSelected,
    deleteSelected,
  }
}