import {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import {defaultSettings, initialState, SettingsContext} from './settings-context';
import {APP_SETTINGS_KEY, sessionApi} from "../../api/session";
import {useAuth} from "../../hooks/use-auth";

const STORAGE_KEY = APP_SETTINGS_KEY;

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

export const SettingsProvider = (props) => {
    const {children} = props;
    const [state, setState] = useState(initialState);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const restored = restoreSettings(isAuthenticated);

        if (restored) {
            setState((prevState) => ({
                ...prevState,
                ...restored,
                isInitialized: true
            }));
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

    const handleDrawerOpen = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            openDrawer: true
        }));
    }, []);

    const handleDrawerClose = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            openDrawer: false
        }));
    }, []);

    const isCustom = useMemo(() => {
        return !isEqual(defaultSettings, {
            colorPreset: state.colorPreset,
            contrast: state.contrast,
            direction: state.direction,
            layout: state.layout,
            navColor: state.navColor,
            paletteMode: state.paletteMode,
            responsiveFontSizes: state.responsiveFontSizes,
            stretch: state.stretch
        });
    }, [state]);

    return (
        <SettingsContext.Provider
            value={{
                ...state,
                handleDrawerClose,
                handleDrawerOpen,
                handleReset,
                handleUpdate,
                isCustom
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired
};
