import { combineReducers } from '@reduxjs/toolkit';

import { reducer as defaultReducer } from 'src/slices/default';

export const rootReducer = combineReducers({
  default: defaultReducer
});
