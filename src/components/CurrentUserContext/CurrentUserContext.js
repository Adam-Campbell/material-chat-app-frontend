import React, { useReducer, useEffect, useCallback } from 'react';
import { getProfile, signUserIn, signUserOut, signUserUp } from '../../Api';

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
        const checkForSession = async () => {
            try {
                const response = await getProfile();
                const { username, _id } = response;
                storeUser(username, _id);
                // dispatch({
                //     type: 'STORE_USER',
                //     payload: {
                //         currentUserName: username,
                //         currentUserId: _id
                //     }
                // });
            } catch (error) {
                clearUser();
                //dispatch({ type: 'CLEAR_USER' });
                console.log(error);
            }
        };
        checkForSession();
    }, []);

    const signIn = useCallback(async (username, password) => {
        try {
            const response = await signUserIn(username, password);
            //const { username, _id } = response.user;
            storeUser(response.user.username, response.user._id);
            // dispatch({
            //     type: 'STORE_USER',
            //     payload: {
            //         currentUserName: response.user.username,
            //         currentUserId: response.user._id
            //     }
            // });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            const response = await signUserOut();
            //dispatch({ type: 'CLEAR_USER' });
            clearUser();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const signUp = useCallback(async (username, password) => {
        try {
            const response = await signUserUp(username, password);
            //const { username, _id } = response.user;
            storeUser(response.user.username, response.user._id);
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <CurrentUserContext.Provider value={{
            ...state,
            signIn,
            signOut,
            signUp
        }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
