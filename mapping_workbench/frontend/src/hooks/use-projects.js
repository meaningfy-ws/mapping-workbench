import { useContext } from 'react';
import {ProjectsContext} from "../contexts/projects";

export const useProjects = () => useContext(ProjectsContext);
