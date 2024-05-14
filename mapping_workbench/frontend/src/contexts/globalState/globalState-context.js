import { createContext } from 'react';

export const initialState = {
  timeSetting: 'local',
};

export const GlobalStateContext = createContext({
  ...initialState,
  handleGlobalStateUpdate: () => {},
  getGlobalState: () => {}
});
