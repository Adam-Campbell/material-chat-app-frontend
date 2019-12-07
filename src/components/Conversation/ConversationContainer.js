import React, { useState, useEffect, useCallback, useContext, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import { getConversation } from '../../Api';
import Conversation from './Conversation';
import LoadingSpinner from '../LoadingSpinner';
import { Redirect } from 'react-router-dom';
import socketActions from '../../socketActions';
import { actionTypes, initialState, reducer } from './reducer';


const ConversationContainer = () => {

    const { id } = useParams();
    const { isSignedIn, currentUserId } = useContext(CurrentUserContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const { emit, on } = useContext(SocketContext);

    // Fetch the conversation once ready
    useEffect(() => {
        if (isSignedIn) {
            emit(socketActions.getConversationRequest, { conversationId: id });
            dispatch({ type: actionTypes.fetchConversation })
        }
    }, [ isSignedIn, id ]);

    // Set up the subscription to react to the conversation being pushed to the client
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.getConversationResponse, ({ conversation }) => {
                console.log(conversation);
                dispatch({
                    type: actionTypes.storeConversation,
                    payload: { 
                        conversation,
                        currentUserId
                    }
                });
                const timestamp = conversation.latestActivity;
                emit(socketActions.sendLastViewed, { conversationId: id, timestamp });
            });
            return off;
        }
    }, [ isSignedIn, id, currentUserId ]);

    // Set up subscription to react to lastViewed status being pushed to client
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushLastViewed, data => {
                console.log(data);
                const { lastViewed, conversationId } = data;
                dispatch({
                    type: actionTypes.updateLastViewed,
                    payload: {
                        conversationId,
                        lastViewed, 
                        currentConversationId: id
                    }
                });
            });
            return off;
        }
    }, [ isSignedIn, id ]);

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
                        message,
                        currentUserId
                    }
                });
                const timestamp = message.createdAt;
                emit(socketActions.sendLastViewed, { conversationId: id, timestamp });
            });
            return off;
        }
    }, [ isSignedIn, id, currentUserId ]);

    if (!isSignedIn) {
        return <Redirect to="/sign-in" />
    } else if (state.isLoading || !state.conversation) {
        return <LoadingSpinner />
    } else {
        return <Conversation
            conversation={state.conversation}
        />
    }
    
}

export default ConversationContainer;
