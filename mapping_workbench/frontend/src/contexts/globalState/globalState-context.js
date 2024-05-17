import { createContext } from 'react';
import moment from "moment-timezone";

export const initialState = {
  timeSetting: moment.tz.guess(),
};

export const GlobalStateContext = createContext({
  ...initialState,
  handleGlobalStateUpdate: () => {},
  getGlobalState: () => {}
});
