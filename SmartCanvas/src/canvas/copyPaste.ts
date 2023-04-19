import { inject } from "vue";
import { Chart, chartInjectionKey } from "./chart";
import { deserializeChart, serializeChart } from "../utility/chartSerializer";
import { customElementFactoryInjectionKey } from "./customFactories";

export interface CopyPaste {
  copySelected: () => Promise<void>;
  cutSelected: () => Promise<void>;

  paste: () => Promise<void>;
}

type ClipBoardEntry = { type: 'smartchart/clipboard', data: string };

export const useCopyPaste = (chart?: Chart): CopyPaste => {
  const {
    elements,
    selectedElements,
    deleteSelected,
    addElements,
    commitChanges,
  } = chart ?? inject(chartInjectionKey)!;

  const customElementFactory = inject(customElementFactoryInjectionKey);

  const copySelected = () => {
    const elementIds = selectedElements.value;
    const elementsToSerialize = elements.value.filter(element => elementIds.includes(element.id));
    const serializedElements = serializeChart(elementsToSerialize);

    const clipBoardEntry: ClipBoardEntry = {
      type: 'smartchart/clipboard',
      data: serializedElements, 
    };

    return navigator.clipboard.writeText(JSON.stringify(clipBoardEntry));
  };

  const cutSelected = async () => {
    await copySelected();
    deleteSelected();
    commitChanges();
  };

  const paste = async () => {
    const dataFromClipBoard = await navigator.clipboard.readText();
    
    try {
      const deserializedData = JSON.parse(dataFromClipBoard) as ClipBoardEntry;
      
      if (deserializedData.type !== "smartchart/clipboard") return;

      const elements = deserializeChart(deserializedData.data, { noPersistId: true, customFactory: customElementFactory });
      addElements(...elements);
      commitChanges();
    } catch {
      console.log('Invalid clipboard data type');
      return;
    }
  };

  return {
    copySelected,
    cutSelected,
    paste,
  };
}