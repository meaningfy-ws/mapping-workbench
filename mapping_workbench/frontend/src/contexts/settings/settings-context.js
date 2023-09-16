import { createContext } from 'react';

export const defaultSettings = {
  colorPreset: 'blue',
  contrast: 'high',
  direction: 'ltr',
  layout: 'vertical',
  navColor: 'evident',
  paletteMode: 'dark',
  responsiveFontSizes: true,
  stretch: true
};

export const initialState = {
  ...defaultSettings,
  isInitialized: false,
  openDrawer: false
};

export const SettingsContext = createContext({
  ...initialState,
  handleDrawerClose: () => { },
  handleDrawerOpen: () => { },
  handleReset: () => { },
  handleUpdate: () => { },
  isCustom: false
});
