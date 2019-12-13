import React, { useContext, useEffect, useReducer, useCallback } from 'react';
import { CurrentUserContext } from '../CurrentUserContext';
import { Redirect } from 'react-router-dom';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';
import { actionTypes, reducer, initialState } from './reducer';
import ConversationsList from './ConversationsList';
import LoadingSpinner from '../LoadingSpinner';


const ConversationsListContainer = (props) => {

    const { isSignedIn } = useContext(CurrentUserContext);
    const { emit, on } = useContext(SocketContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);

    const storeConversations = useCallback((conversations) => {
        dispatch({
            type: actionTypes.storeConversations,
            payload: { conversations }
        });
    }, []);

    const storeOneConversation = useCallback((conversation) => {
        dispatch({
            type: actionTypes.storeOneConversation,
            payload: { conversation }
        });
    }, []);

    const updateConversationActivity = useCallback((conversationId, latestActivity) => {
        dispatch({
            type: actionTypes.updateConversationActivity,
            payload: { conversationId, latestActivity }
        });
    }, []);

    const showSnackbar = useCallback(() => {
        dispatch({ type: actionTypes.showSnackbar });
    }, []);

    const hideSnackbar = useCallback(() => {
        dispatch({ type: actionTypes.hideSnackbar });
    }, []);

    // Fetch the users conversations once ready
    useEffect(() => {
        if (isSignedIn) {
            emit(socketActions.getCurrentUsersConversationsRequest);
            dispatch({ type: actionTypes.fetchConversations });
        }  
    }, [ emit, isSignedIn ]);

    // Set up subscription to react to the conversations being pushed to the client.
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.getCurrentUsersConversationsResponse, data => {
                const { conversations } = data;
                storeConversations(conversations);
            });
            return off;
        }
    }, [ isSignedIn, on, storeConversations ]);

    // Set up subscription to react to new conversations being pushed to the client.
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushConversation, data => {
                const { conversation } = data;
                storeOneConversation(conversation);
            });
            return off;
        }
    }, [ isSignedIn, on, storeOneConversation ]);

    // Set up subscription to react to new messages being pushed to the client.
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushMessage, data => {
                const { message, conversationId } = data;
                updateConversationActivity(conversationId, message.createdAt)
            });
            return off;
        }
    }, [ isSignedIn, on, updateConversationActivity ]);

    if (!isSignedIn) {
        return <Redirect to="/sign-in" />
    } else if (state.isLoading || !state.hasLoaded) {
        return <LoadingSpinner />
    } else {
        return (
            <ConversationsList 
                conversations={state.conversations}
                isShowingSnackbar={state.isShowingSnackbar}
                showSnackbar={showSnackbar}
                hideSnackbar={hideSnackbar} 
            />
        )
    }
}

export default ConversationsListContainer;
