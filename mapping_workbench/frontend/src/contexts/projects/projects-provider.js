import {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import {defaultSettings, initialState, ProjectsContext} from './projects-context';
import {APP_SETTINGS_KEY, sessionApi} from "../../api/session";
import {useAuth} from "../../hooks/use-auth";
import {projectsApi as sectionApi} from "../../api/projects";

const STORAGE_KEY = APP_SETTINGS_KEY;


const getSelectedProject = () => {

}



const restoreSettings = (isAuthenticated) => {
    let value = null;

    try {
        const restored = window.localStorage.getItem(STORAGE_KEY);
        if (restored) {
            value = JSON.parse(restored);
        }
    } catch (err) {
        console.error(err);
        // If stored data is not a strigified JSON this will fail,
        // that's why we catch the error
    }

    return value;
};

const deleteSettings = (isAuthenticated) => {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.error(err);
    }
};

const storeSettings = async (value, isAuthenticated) => {
    try {
        await sessionApi.setAppSettings(value, isAuthenticated)
    } catch (err) {
        console.error(err);
    }
};

export const ProjectsProvider = (props) => {
    const {children} = props;
    const [state, setState] = useState(initialState);
    const { isAuthenticated } = useAuth();

   const getProjects = (isAuthenticated) => {
       sectionApi.getItems()
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

    useEffect(() => {
        getProjects()
    }, []);

    useEffect(() => {
        const restored = restoreSettings(isAuthenticated);

        if (restored) {
            setState((prevState) => ({
                ...prevState,
                ...restored,
                isInitialized: true
            }));
        } else {
            storeSettings(defaultSettings, isAuthenticated);
        }
    }, [isAuthenticated]);

    const handleReset = useCallback(() => {
        deleteSettings(isAuthenticated);
        setState((prevState) => ({
            ...prevState,
            ...defaultSettings
        }));
    }, [isAuthenticated]);

    const handleUpdate = useCallback((settings) => {
        setState((prevState) => {
            storeSettings({
                colorPreset: prevState.colorPreset,
                contrast: prevState.contrast,
                direction: prevState.direction,
                layout: prevState.layout,
                navColor: prevState.navColor,
                paletteMode: prevState.paletteMode,
                responsiveFontSizes: prevState.responsiveFontSizes,
                stretch: prevState.stretch,
                ...settings
            }, isAuthenticated);

            return {
                ...prevState,
                ...settings
            };
        });
    }, [isAuthenticated]);


    return (
        <ProjectsContext.Provider
            value={{ ...state }}
        >
            {children}
        </ProjectsContext.Provider>
    );
};

ProjectsProvider.propTypes = {
    children: PropTypes.node.isRequired
};
