import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ConversationListItem from './ConversationListItem';

const useStyles = makeStyles(theme => ({

}));

const conversations = [
    { username: 'adamcampbell', id: 0 },
    { username: 'joe bloggs', id: 1 },
    { username: 'jane doe', id: 2 },
    { username: 'madeup', id: 3 },
    { username: 'just here to pad it out', id: 4 },
    { username: 'and some more', id: 5 }
];

const ConversationsList = (props) => {
    const classes = useStyles();
    return (
        <>
            <Typography color="textPrimary" component="h1" variant="h4">Conversations</Typography>
            <List>
                {conversations.map(conversation => (
                    <ConversationListItem 
                        key={conversation.id}
                        id={conversation.id} 
                        username={conversation.username} 
                    />
                ))}
            </List>
        </>
    );
}

export default ConversationsList;
