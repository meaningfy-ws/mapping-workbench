import { useContext } from 'react';
import {GlobalStateContext} from "../contexts/globalState";

export const useGlobalState = () => useContext(GlobalStateContext);
