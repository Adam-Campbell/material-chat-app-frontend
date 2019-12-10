import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CurrentUserContext } from '../../CurrentUserContext';
import { ConversationContext } from '../ConversationContext';
import { CellMeasurer } from 'react-virtualized';
import DateMarker from './DateMarker';
import SeenBy from './SeenBy';
import InfoRow from './InfoRow';
import MessageBody from './MessageBody';

const useStyles = makeStyles(theme => ({
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        },
    }
}));

const Message = ({ index, style, parent }) => {

    const { currentUserId } = useContext(CurrentUserContext);
    const { conversation, cache } = useContext(ConversationContext);
    const { body, author, createdAt } = conversation.messages[index];
    const previousCreatedAt = index > 0 ? 
        conversation.messages[index-1].createdAt :
        null;
    const isOwnMessage = author._id === currentUserId;

    const { messageContainer } = useStyles({ isOwnMessage });

    return (
        <CellMeasurer
            cache={cache}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            <div className={messageContainer} style={style}>
                <DateMarker
                    createdAt={createdAt} 
                    previousCreatedAt={previousCreatedAt} 
                />
                <InfoRow 
                    username={author.username}
                    createdAt={createdAt}
                    isOwnMessage={isOwnMessage}
                />
                <MessageBody 
                    body={body}
                    isOwnMessage={isOwnMessage}
                />
                <SeenBy 
                    participantsLastViewed={conversation.participantsLastViewed}
                    currentUserId={currentUserId}
                    createdAt={createdAt}
                    isOwnMessage={isOwnMessage}
                />
            </div>
        </CellMeasurer>
    );
}

Message.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.any,
    parent: PropTypes.any
};

export default Message;
