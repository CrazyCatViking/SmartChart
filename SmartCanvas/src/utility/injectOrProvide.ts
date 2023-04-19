import { InjectionKey, inject, provide } from "vue";

export const injectOrProvide = <T>(
  injectionKey: InjectionKey<T>,
  instanceFactory: () => T
): T => {
  const injectedInstance = inject(injectionKey);
  if (injectedInstance !== undefined) return injectedInstance;

  const newInstance = instanceFactory();
  provide(injectionKey, newInstance);

  return newInstance;
};
