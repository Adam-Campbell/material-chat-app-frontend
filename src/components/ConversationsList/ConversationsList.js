import React, { useContext, useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ConversationListItem from './ConversationListItem';
import { CurrentUserContext } from '../CurrentUserContext';
import { Redirect } from 'react-router-dom';
import { getUsersConversations } from '../../Api';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';
import { actionTypes, reducer } from './reducer';

const useStyles = makeStyles(theme => ({
    heading: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2)
    },
    snackbar: {
        bottom: 96
    }
}));

const ConversationsList = (props) => {

    const { heading, snackbar } = useStyles();
    const { isSignedIn, currentUserId } = useContext(CurrentUserContext);
    const { emit, on } = useContext(SocketContext);
    const [ conversations, dispatch ] = useReducer(reducer, []);

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
    }, [ isSignedIn, currentUserId ])

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
}

export default ConversationsList;
