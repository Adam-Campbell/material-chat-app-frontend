import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ConversationListItem from './ConversationListItem';
import { CurrentUserContext } from '../CurrentUserContext';
import { Redirect } from 'react-router-dom';
import { getUsersConversations } from '../../Api';

const useStyles = makeStyles(theme => ({
    heading: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2)
    }
}));

// const conversations = [
//     { username: 'adamcampbell', id: 0 },
//     { username: 'joe bloggs', id: 1 },
//     { username: 'jane doe', id: 2 },
//     { username: 'madeup', id: 3 },
//     { username: 'just here to pad it out', id: 4 },
//     { username: 'and some more', id: 5 }
// ];

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

    useEffect(() => {
        if (!isSignedIn) return;
        (async () => {
            try {
                const response = await getUsersConversations();
                const { conversations } = response.data;
                const formattedConversations = formatConversations(conversations, currentUserId);
                setConversations(formattedConversations);
            } catch (error) {
                console.log(error);
            }
        })();
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
