import { createContext } from 'react';

export const initialState = {
  isInitialized: false,
  selectedProject: '',
  projects: []
};

export const ProjectsContext = createContext({
  ...initialState
});
