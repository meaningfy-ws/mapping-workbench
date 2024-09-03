import { createContext } from 'react';

export const initialState = {
  isInitialized: false,
  sessionProject: '',
  items: []
};

export const ProjectsContext = createContext({
  ...initialState,
  handleSessionProjectChange: () => {},
  handleProjectCleanup: () => {},
  handleDeleteProject: () => {},
  getProjects: () => {}
});
