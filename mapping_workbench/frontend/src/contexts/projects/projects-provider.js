import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {initialState, ProjectsContext} from './projects-context';
import {sessionApi} from "../../api/session";
import {useAuth} from "../../hooks/use-auth";
import {projectsApi as sectionApi} from "../../api/projects";
import {toastError, toastLoad, toastSuccess} from "../../components/app-toast";
import {paths} from "../../paths";
import {useRouter} from "next/router";

export const ProjectsProvider = ({children}) => {
    const [state, setState] = useState(initialState);
    const { isAuthenticated } = useAuth();
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            getProjects()
            getSessionProject()
        }
    }, [isAuthenticated]);


    const getProjects = () => {
        sectionApi.getItems({rowsPerPage: -1})
            .then(res => {
                    setState(prevState => ({
                        ...prevState,
                        items: res.items,
                        itemsCount: res.count
                    }))
                }
            )
            .catch(err =>
                console.error(err)
            )
    }
    const getSessionProject = () => {
        setState(prevState => ({...prevState, sessionProject: sessionApi.getSessionProject()}))
    }

    const handleSessionProjectChange = (id) => {
            const toastId = toastLoad('Selecting project...');
            sessionApi.setSessionProject(id)
                .then(res => {
                    setState(prevState => ({...prevState, sessionProject: id}))
                    toastSuccess('Project Selected', toastId);
                })
                .finally(() => window.location.replace(paths.index))
    }

    const handleProjectCleanup = (id) => {
        if (id) {
            const toastId = toastLoad('Cleaning Up project...');
            sectionApi.cleanupProject(id)
                .then(res => {
                    toastSuccess(`${res.task_name} successfully started.`, toastId)
                    // router.reload()
                })
                .catch(err => toastError(`Cleaning Up project failed: ${err.message}.`, toastId))
        }
    }

    const handleDeleteProject = (id) => {
        const toastId = toastLoad('Deleting project...');
        sectionApi.deleteItem(id)
            .then(res => {
                sessionApi.removeLocalSessionProject()
                getProjects()
                toastSuccess('Project Deleted', toastId)
            })
    }


    return (
        <ProjectsContext.Provider
            value={{
                ...state,
                handleSessionProjectChange,
                handleProjectCleanup,
                handleDeleteProject,
                getProjects
            }}
        >
            {children}
        </ProjectsContext.Provider>
    );
};

ProjectsProvider.propTypes = {
    children: PropTypes.node.isRequired
};
