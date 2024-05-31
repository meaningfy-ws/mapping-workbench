import { createContext } from 'react';
import moment from "moment";

export const initialState = {
  timeSetting: moment().utcOffset(),
};

export const GlobalStateContext = createContext({
  ...initialState,
  handleGlobalStateUpdate: () => {},
  getGlobalState: () => {}
});
