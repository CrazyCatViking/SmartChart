import { Element } from "../elements";
import { deserializeChart, serializeChart } from "../utility/chartSerializer";
import { CustomElementFactory } from "./customFactories";

export interface ChartHistory {
  checkCanUndo: () => boolean;
  checkCanRedo: () => boolean;

  commitChanges: (elements: Element[]) => void;
  undoChanges: () => Element[];
  redoChanges: () => Element[];
}

export const createChartHistory = (
  elements: Element[],
  customElementFactory?: CustomElementFactory
): ChartHistory => {
  let _history: string[] = [serializeChart(elements)];
  let currentIndex: number = 0;

  const checkCanUndo = () =>
    _history.length > 1 && currentIndex !== _history.length - 1;
  const checkCanRedo = () => _history.length > 1 && currentIndex !== 0;

  const commitChanges = (elements: Element[]) => {
    const commit = serializeChart(elements);

    const history = [commit, ..._history.slice(currentIndex)];
    _history = history;

    currentIndex = 0;
  };

  const undoChanges = (): Element[] => {
    currentIndex += 1;
    return deserializeChart(_history[currentIndex], {
      customFactory: customElementFactory,
      noPersistId: true,
    });
  };

  const redoChanges = (): Element[] => {
    currentIndex -= 1;
    return deserializeChart(_history[currentIndex], {
      customFactory: customElementFactory,
      noPersistId: true,
    });
  };

  return {
    checkCanUndo,
    checkCanRedo,

    commitChanges,
    undoChanges,
    redoChanges,
  };
};
