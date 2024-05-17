import {useState} from 'react';
import PropTypes from 'prop-types';
import {initialState, GlobalStateContext} from './globalState-context';

export const GlobalStateProvider = ({children}) => {
    const [state, setState] = useState(initialState);


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
