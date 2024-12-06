const defaultConfig = { debug: false };

export let config: typeof defaultConfig = defaultConfig;

export const setConfig = (newConfig: any) => {
  config = newConfig;
  return newConfig;
};
