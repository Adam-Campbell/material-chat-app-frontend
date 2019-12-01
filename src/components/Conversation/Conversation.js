import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import AddMessageForm from './AddMessageForm';

const useStyles = makeStyles(theme => ({
    messageStreamContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const Conversation = ({ conversation, updateConversation }) => {

    const { messageStreamContainer } = useStyles();
    
    return (
        <>
            <div className={messageStreamContainer}>
                {conversation.messages.map(msg => (
                    <Message key={msg._id} text={msg.body} isOwnMessage={msg.isOwnMessage} />
                ))}
            </div>
            <AddMessageForm 
                conversationId={conversation._id}
                updateConversation={updateConversation}
            />
        </>
    );
}

Conversation.propTypes = {
    conversation: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        messages: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired,
            isOwnMessage: PropTypes.bool.isRequired
        })).isRequired,
        participants: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    updateConversation: PropTypes.func.isRequired
};

export default Conversation;