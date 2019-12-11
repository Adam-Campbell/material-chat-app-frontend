import React, { useContext, useEffect, useReducer, useCallback } from 'react';

import { CurrentUserContext } from '../CurrentUserContext';
import { Redirect } from 'react-router-dom';
import { getUsersConversations } from '../../Api';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';
import { actionTypes, reducer, initialState } from './reducer';
import ConversationsList from './ConversationsList';
import LoadingSpinner from '../LoadingSpinner';



const ConversationsListContainer = (props) => {

    const { isSignedIn, currentUserId } = useContext(CurrentUserContext);
    const { emit, on } = useContext(SocketContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);

    const storeConversations = useCallback((conversations) => {
        dispatch({
            type: actionTypes.storeConversations,
            payload: { conversations, currentUserId }
        });
    }, [ isSignedIn, currentUserId ]);

    const storeOneConversation = useCallback((conversation) => {
        dispatch({
            type: actionTypes.storeOneConversation,
            payload: { conversation, currentUserId }
        });
    }, [ isSignedIn, currentUserId ]);

    const updateConversationActivity = useCallback((conversationId, latestActivity) => {
        dispatch({
            type: actionTypes.updateConversationActivity,
            payload: { conversationId, latestActivity, currentUserId }
        });
    }, [ isSignedIn, currentUserId ])

    

    useEffect(() => {
        if (isSignedIn) {
            emit(socketActions.getCurrentUsersConversationsRequest);
            dispatch({ type: actionTypes.fetchConversations });
            const off = on(socketActions.getCurrentUsersConversationsResponse, data => {
                console.log(data);
                const { conversations } = data;
                storeConversations(conversations);
            });
            return off;
        }  
    }, [ isSignedIn, currentUserId ]);

    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushConversation, data => {
                console.log(data);
                const { conversation } = data;
                storeOneConversation(conversation);
            });
            return off;
        }
    }, [ isSignedIn, currentUserId ]);

    useEffect(() => {
        if (isSignedIn) {
            const off = on(socketActions.pushMessage, data => {
                const { message, conversationId } = data;
                console.log(data);
                updateConversationActivity(conversationId, message.createdAt)
            });
            return off;
        }
    }, [ isSignedIn, currentUserId ]);

    if (!isSignedIn) {
        return <Redirect to="/sign-in" />
    } else if (state.isLoading || !state.hasLoaded) {
        return <LoadingSpinner />
    } else {
        return <ConversationsList conversations={state.conversations} />
    }
}

export default ConversationsListContainer;





/*

return !isSignedIn ? (
        <Redirect to="/sign-in" />
    ) : (
        <>
            <Typography className={heading} color="textPrimary" component="h1" variant="h4">Conversations</Typography>
            <List>
                {conversations.map(conversation => (
                    <ConversationListItem 
                        key={conversation._id}
                        id={conversation._id} 
                        otherParticipants={conversation.otherParticipants}
                        latestActivity={conversation.latestActivity}
                        hasUnreadMessages={conversation.hasUnreadMessages}
                    />
                ))}
            </List>
        </>
    );


*/