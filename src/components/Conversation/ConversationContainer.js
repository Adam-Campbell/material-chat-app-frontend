import React, { useEffect, useCallback, useContext, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import Conversation from './Conversation';
import LoadingSpinner from '../LoadingSpinner';
import { Redirect } from 'react-router-dom';
import socketActions from '../../socketActions';
import { actionTypes, initialState, reducer } from './reducer';

const ConversationContainer = () => {

    const { id } = useParams();
    const { isSignedIn } = useContext(CurrentUserContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const { emit, on } = useContext(SocketContext);

    const showSnackbar = useCallback(() => {
        dispatch({ type: actionTypes.showSnackbar });
    }, []);

    const hideSnackbar = useCallback(() => {
        dispatch({ type: actionTypes.hideSnackbar });
    }, []);

    // Fetch the conversation once ready
    useEffect(() => {
        if (isSignedIn) {
            emit(socketActions.getConversationRequest, { conversationId: id });
            dispatch({ type: actionTypes.fetchConversation })
        }
    }, [ isSignedIn, id, emit ]);

    // Set up the subscription to react to the conversation being pushed to the client
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.getConversationResponse, ({ conversation }) => {
                dispatch({
                    type: actionTypes.storeConversation,
                    payload: { conversation }
                });
                const timestamp = conversation.latestActivity;
                emit(socketActions.sendLastViewed, { conversationId: id, timestamp });
            });
            return off;
        }
    }, [ isSignedIn, id, on, emit ]);

    // Set up subscription to react to lastViewed status being pushed to client
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushLastViewed, data => {
                const { timestamp, userId, conversationId } = data;
                dispatch({
                    type: actionTypes.updateLastViewed,
                    payload: {
                        timestamp,
                        userId,
                        conversationId,
                        currentConversationId: id
                    }
                });
            });
            return off;
        }
    }, [ isSignedIn, id, on ]);

    // set up subscription to react to new message being pushed to client
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushMessage, data => {
                const { message, conversationId } = data;
                dispatch({
                    type: actionTypes.addMessage,
                    payload: {
                        conversationId,
                        currentConversationId: id, 
                        message
                    }
                });
                const timestamp = message.createdAt;
                emit(socketActions.sendLastViewed, { conversationId: id, timestamp });
            });
            return off;
        }
    }, [ isSignedIn, id, on, emit ]);

    if (!isSignedIn) {
        return <Redirect to="/sign-in" />
    } else if (state.isLoading || !state.conversation) {
        return <LoadingSpinner />
    } else {
        return (
            <Conversation
                conversation={state.conversation}
                isShowingSnackbar={state.isShowingSnackbar}
                showSnackbar={showSnackbar}
                hideSnackbar={hideSnackbar}
            />
        );
    }
    
}

export default ConversationContainer;
