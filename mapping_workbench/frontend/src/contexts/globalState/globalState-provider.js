import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {initialState, GlobalStateContext} from './globalState-context';
import {appConfigApi} from "../../api/app-config";
import {useAuth} from "../../hooks/use-auth";

export const GlobalStateProvider = ({children}) => {
    const [state, setState] = useState(initialState);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        isAuthenticated && appConfigApi.getSettings()
            .then(res => handleGlobalStateUpdate('version', res.version))
            .catch(err => console.error(err))
    }, [isAuthenticated])

    const handleGlobalStateUpdate = (item, value) => {
        setState(prevState => ({...prevState, [item]: value}))
    }

    const getGlobalState = () => state

    return (
        <GlobalStateContext.Provider
            value={{
                ...state,
                handleGlobalStateUpdate,
                getGlobalState
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

GlobalStateProvider.propTypes = {
    children: PropTypes.node.isRequired
};
