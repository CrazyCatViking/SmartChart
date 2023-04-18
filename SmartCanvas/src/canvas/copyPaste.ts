import { inject } from "vue";
import { chartInjectionKey } from "./chart";
import { deserializeChart, serializeChart } from "../utility/chartSerializer";

export interface CopyPaste {
  copySelected: () => Promise<void>;
  cutSelected: () => Promise<void>;

  paste: () => Promise<void>;
}

type ClipBoardEntry = { type: 'smartchart/clipboard', data: string };

export const useCopyPaste = (): CopyPaste => {
  const {
    elements,
    selectedElements,
    deleteSelected,
    addElements,
    commitChanges,
  } = inject(chartInjectionKey)!;

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

      const elements = deserializeChart(deserializedData.data, { noPersistId: true });
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