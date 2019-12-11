import React, { useReducer, useEffect, useCallback, useContext } from 'react';
import { checkForSession } from '../../Api';
import { SocketContext } from '../SocketContext';

export const CurrentUserContext = React.createContext();

const initialState = {
    hasCheckedForSession: false,
    isSignedIn: null,
    currentUserName: null,
    currentUserId: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'STORE_USER':
            return {
                hasCheckedForSession: true,
                isSignedIn: true,
                currentUserName: action.payload.currentUserName,
                currentUserId: action.payload.currentUserId
            };
        case 'CLEAR_USER':
            return {
                hasCheckedForSession: true,
                isSignedIn: false,
                currentUserName: null,
                currentUserId: null
            };
        default:
            return state;
    }
}

export const CurrentUserContextProvider = ({ children }) => {

    const [ state, dispatch ] = useReducer(reducer, initialState);

    const { connect } = useContext(SocketContext);

    const storeUser = useCallback((currentUserName, currentUserId) => {
        dispatch({
            type: 'STORE_USER',
            payload: {
                currentUserName,
                currentUserId
            }
        });
    }, []);

    const clearUser = useCallback(() => {
        dispatch({ type: 'CLEAR_USER' });
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await checkForSession();
                const { hasSession, user, socketToken } = response.data;
                if (hasSession) {
                    //console.log(socketToken);
                    connect(socketToken, () => {
                        storeUser(user.username, user._id);
                    });
                } else {
                    clearUser();
                }
            } catch (error) {
                //console.log(error);
            }
        })();
    }, []);

    return (
        <CurrentUserContext.Provider value={{
            ...state,
            storeUser,
            clearUser
        }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
