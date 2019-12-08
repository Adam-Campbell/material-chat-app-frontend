import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import AddMessageForm from './AddMessageForm';
import { CurrentUserContext } from '../CurrentUserContext';

const useStyles = makeStyles(theme => ({
    messageStreamContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const Conversation = ({ conversation }) => {

    const { messageStreamContainer } = useStyles();

    const { currentUserId } = useContext(CurrentUserContext);

    const otherParticipantsLastViewed = useMemo(() => {
        return conversation.participantsLastViewed.filter(plv => plv.user._id !== currentUserId)
        .map(plv => ({
            lastViewed: plv.lastViewed,
            username: plv.user.username
        }))
    }, [ conversation.participantsLastViewed, currentUserId ]);
    
    return (
        <>
            <div className={messageStreamContainer}>
                {conversation.messages.map((msg, idx, arr) => (
                    <Message 
                        key={msg._id} 
                        text={msg.body} 
                        isOwnMessage={msg.isOwnMessage} 
                        username={msg.author.username}
                        createdAt={msg.createdAt}
                        previousCreatedAt={idx > 0 ? arr[idx-1].createdAt : null}
                        otherParticipantsLastViewed={otherParticipantsLastViewed}
                    />
                ))}
            </div>
            <AddMessageForm 
                conversationId={conversation._id}
            />
        </>
    );
}

Conversation.propTypes = {
    conversation: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        messages: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            author: PropTypes.shape({
                username: PropTypes.string.isRequired,
                _id: PropTypes.string.isRequired
            }).isRequired,
            body: PropTypes.string.isRequired,
            isOwnMessage: PropTypes.bool.isRequired
        })).isRequired,
        participants: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        })).isRequired
    }).isRequired
};

export default Conversation;