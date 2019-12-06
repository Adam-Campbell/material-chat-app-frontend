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
            emit(socketActions.getConversationRequest, id);
            dispatch({ type: actionTypes.fetchConversation })
        }
    }, [ isSignedIn, id ]);

    // Set up the subscription to react to the conversation being pushed to the client
    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.getConversationResponse, data => {
                console.log(data);
                const { conversation } = data;
                dispatch({
                    type: actionTypes.storeConversation,
                    payload: { 
                        conversation,
                        currentUserId
                    }
                });
                const timestamp = conversation.latestActivity;
                emit(socketActions.sendConversationViewedAtRequest, id, timestamp);
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
                emit(socketActions.sendConversationViewedAtRequest, id, timestamp);
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



























const _ConversationContainer = () => {

    const { id } = useParams();
    const { isSignedIn, currentUserId } = useContext(CurrentUserContext);
    const [ conversation, setConversation ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const { emit, on } = useContext(SocketContext);

    const updateConversation = useCallback((conversation) => {
        const formattedConversation = {
            ...conversation,
            messages: conversation.messages.map(msg => ({
                ...msg,
                isOwnMessage: msg.author._id === currentUserId
            }))
        };
        setConversation(formattedConversation);
    }, [ currentUserId ]);

    // Data fetching
    useEffect(() => {
        if (isSignedIn) {
            emit(socketActions.getConversationRequest, id);
            const off = on(socketActions.getConversationResponse, data => {
                console.log(data);
                const { conversation } = data;
                updateConversation(conversation);
                const timestamp = conversation.latestActivity;
                emit(socketActions.sendConversationViewedAtRequest, id, timestamp);
            });
            return off;
        }
    }, [ isSignedIn, id ]);

    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushLastViewed, data => {
                console.log(data);
            });
            return off;
        }
    }, [ isSignedIn, id ]);

    // Update after this client has sent a message
    useEffect(() => {
        const off = on(socketActions.sendMessageResponse, data => {
            // const { conversation } = data;
            // updateConversation(conversation);
            // emit(socketActions.sendConversationViewedAtRequest, id, conversation.latestActivity);
        });
        return off;
    }, [ isSignedIn, id ]);

    // Update after this conversation has been pushed to this client 
    // (can happen for a number of reasons).
    useEffect(() => {
        const off = on(socketActions.pushConversation, data => {
            // console.log(data);
            // const { conversation } = data;
            // if (conversation._id === id) {
            //     updateConversation(conversation);
            //     emit(socketActions.sendConversationViewedAtRequest, id, conversation.latestActivity);
            // }
        });
        return off;
    }, [ isSignedIn, id ]);

    useEffect(() => {
        const off = on(socketActions.pushMessage, data => {
            console.log(data);
        })
    }, [ isSignedIn, id ]);

    // React to the response we receive after specifically this client sends a
    // sendConversationViewedAtRequest
    useEffect(() => {
        const off = on(socketActions.sendConversationViewedAtResponse, data => {
            const { conversation } = data;
            updateConversation(conversation);
        });
        return off;
    }, [ isSignedIn, id ]);

    if (!isSignedIn) {
        return <Redirect to="/sign-in" />
    } else if (isLoading || !conversation) {
        return <LoadingSpinner />
    } else {
        return <Conversation
            conversation={conversation}
            updateConversation={updateConversation}
        />
    }
    
}