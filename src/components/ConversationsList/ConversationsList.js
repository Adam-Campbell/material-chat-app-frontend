import React, { useContext, useEffect, useState } from 'react';
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

const useStyles = makeStyles(theme => ({
    heading: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2)
    }
}));

const formatConversations = (conversations, currentUserId) => {
    return conversations.map(conversation => {
        const otherParticipant = conversation.participants.find(user => user._id !== currentUserId);
        return {
            ...conversation, 
            with: otherParticipant.username
        }
    });
}

const ConversationsList = (props) => {

    const { heading } = useStyles();
    const { isSignedIn, currentUserId } = useContext(CurrentUserContext);
    const [ conversations, setConversations ] = useState([]);

    const { emit, on } = useContext(SocketContext);

    useEffect(() => {
        if (isSignedIn) {
            emit(socketActions.getCurrentUsersConversationsRequest);
            const off = on(socketActions.getCurrentUsersConversationsResponse, data => {
                console.log(data);
                const { conversations } = data;
                const formattedConversations = formatConversations(conversations, currentUserId);
                setConversations(formattedConversations);
            });
            return off;
        }  
    }, [ isSignedIn, currentUserId ]);

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
                        username={conversation.with} 
                    />
                ))}
            </List>
        </>
    );
}

export default ConversationsList;
