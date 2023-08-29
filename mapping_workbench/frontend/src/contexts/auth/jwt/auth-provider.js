import { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { authApi } from 'src/api/auth';
import { Issuer } from 'src/utils/auth';
import { AuthContext, initialState } from './auth-context';
import {SESSION_PROJECT_KEY} from "../../../api/projects";
import {sessionApi} from "../../../api/session";

export const STORAGE_KEY = 'accessToken';

var ActionType;
(function (ActionType) {
  ActionType['INITIALIZE'] = 'INITIALIZE';
  ActionType['SIGN_IN'] = 'SIGN_IN';
  ActionType['SIGN_UP'] = 'SIGN_UP';
  ActionType['SIGN_OUT'] = 'SIGN_OUT';
})(ActionType || (ActionType = {}));

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  SIGN_IN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_UP: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_OUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionApi.getStorage().getItem(STORAGE_KEY);

      if (accessToken) {
        const user = await authApi.me({ accessToken });

        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const signIn = useCallback(async (username, password) => {
    const { accessToken } = await authApi.signIn({ username, password });
    const user = await authApi.me({ accessToken });
    sessionApi.getStorage().setItem(STORAGE_KEY, accessToken);
    sessionApi.getStorage().setItem(SESSION_PROJECT_KEY, user.settings.session.project);

    dispatch({
      type: ActionType.SIGN_IN,
      payload: {
        user
      }
    });
  }, [dispatch]);

  const signUp = useCallback(async (username, name, password) => {
    const { accessToken } = await authApi.signUp({ username, name, password });
    const user = await authApi.me({ accessToken });

    sessionApi.getStorage().setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: ActionType.SIGN_UP,
      payload: {
        user
      }
    });
  }, [dispatch]);

  const signOut = useCallback(async () => {
    sessionApi.getStorage().removeItem(STORAGE_KEY);

    dispatch({ type: ActionType.SIGN_OUT });
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
