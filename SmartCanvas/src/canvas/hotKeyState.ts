import { InjectionKey, Ref, provide, ref } from "vue";

export interface HotKeyState {
  ctrlPressed: Readonly<Ref<boolean>>;
}

export const useHotKeyState = (): HotKeyState => {
  const hotKeyState = createHotKeyState();
  provide(hotKeyStateInjectionKey, hotKeyState);

  return hotKeyState;
}

export const hotKeyStateInjectionKey: InjectionKey<HotKeyState> = Symbol('hot-key-state-injection-key');

const createHotKeyState = (): HotKeyState => {
  const _ctrlPressed = ref(false);

  return {
    get ctrlPressed() { return _ctrlPressed; },
  }
}