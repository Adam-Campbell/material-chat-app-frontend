import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CurrentUserContext } from '../CurrentUserContext';
import { ConversationContext } from './ConversationContext';
import { formatTime, formatDate } from '../../utils';
import Divider from '@material-ui/core/Divider';
import { CellMeasurer } from 'react-virtualized';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
    outerContainer: {
        //marginTop: theme.spacing(2),
        //marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        //paddingLeft: theme.spacing(2),
        //paddingRight: theme.spacing(2),
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        },
    },
    dateContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
    dateContainerDivider: {
        flexGrow: 1
    },
    dateContainerText: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    messageContainer: {
        padding: theme.spacing(2),
        maxWidth: '90%',
        marginLeft: ({ isOwnMessage }) => isOwnMessage ? 'auto' : 0,
        marginRight: ({ isOwnMessage }) => isOwnMessage ? 0 : 'auto',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        background: ({ isOwnMessage }) => isOwnMessage ? theme.palette.primary.main : theme.palette.secondary.main,
        color: theme.palette.common.white,
        position: 'relative'
    },
    userInitials: {
        width: 30,
        height: 30,
        fontSize: 12,
        position: 'absolute',
        left: ({ isOwnMessage }) => isOwnMessage ? 0 : '100%',
        bottom: 0,
        transform: 'translate(-50%, 50%)'
    },
    infoContainer: {
        display: 'flex',
        marginLeft: ({ isOwnMessage }) => isOwnMessage ? 'auto' : 0,
        marginRight: ({ isOwnMessage }) => isOwnMessage ? 0 : 'auto'
    },
    usernameText: {
        fontSize: 14,
        marginRight: theme.spacing(1),
    },
    timeCreatedText: {
        fontSize: 14
    },
    statusContainer: {
        marginLeft: ({ isOwnMessage }) => isOwnMessage ? 'auto' : 0,
        marginRight: ({ isOwnMessage }) => isOwnMessage ? 0 : 'auto'
    },
    statusText: {
        fontSize: 14
    }
}));

const getLastViewedString = (otherParticipantsLastViewed, createdAt) => {
    const totalOtherParticipants = otherParticipantsLastViewed.length;
    const matchingPlvs = otherParticipantsLastViewed.filter(plv => plv.lastViewed === createdAt)
    .map(plv => plv.username);
    
    if (matchingPlvs.length === 0) {
        return false;
    }
    if (matchingPlvs.length === 1) {
        return totalOtherParticipants === 1 ? 'Seen' : `Seen by ${matchingPlvs[0]}`;
    }
    if (matchingPlvs.length > 1) {
        if (matchingPlvs.length === totalOtherParticipants) {
            return 'Seen by everyone';
        } else {
            return matchingPlvs.length === 2 ?
                `Seen by ${matchingPlvs[0]} and ${matchingPlvs[1]}` :
                `Seen by ${matchingPlvs[0]} and ${matchingPlvs.length - 1} ${matchingPlvs.length > 2 ? 'others' : 'other'}`
        }
    }
}

const getDateMarkerString = (createdAt, previousCreatedAt) => {
    if (!previousCreatedAt) {
        return formatDate( new Date(createdAt) );
    } else {
        const createdDate = formatDate( new Date(createdAt) );
        const previousCreatedDate = formatDate( new Date(previousCreatedAt) );
        return createdDate === previousCreatedDate ?
            false :
            createdDate
    }
}

const Message = ({ 
    // text, 
    // username,
    // author,
    // createdAt, 
    // previousCreatedAt, 
    // otherParticipantsLastViewed
    index,
    style,
    parent
}) => {

    const { currentUserId } = useContext(CurrentUserContext);
    const { conversation, cache } = useContext(ConversationContext)
    //const isOwnMessage = conversation.author._id === currentUserId;
    const { body, author, createdAt } = conversation.messages[index];
    const previousCreatedAt = index > 0 ? 
        conversation.messages[index-1].createdAt :
        null;
    const isOwnMessage = author._id === currentUserId;
    const { 
        outerContainer, 
        dateContainer,
        dateContainerDivider,
        dateContainerText,
        messageContainer, 
        infoContainer, 
        usernameText, 
        timeCreatedText,
        statusContainer,
        statusText
    } = useStyles({ isOwnMessage });

    const timeCreated = useMemo(() => {
        return formatTime( new Date( createdAt ) );
    }, [ createdAt ]);

    const dateMarkerString = useMemo(() => {
        return getDateMarkerString(createdAt, previousCreatedAt);
    }, [ createdAt, previousCreatedAt ]);

    const lastViewedString = useMemo(() => {
        const othersLastViewed = conversation.participantsLastViewed
        .filter(plv => plv.user._id !== currentUserId)
        .map(plv => ({
            lastViewed: plv.lastViewed,
            username: plv.user.username
        }))
        return getLastViewedString(othersLastViewed, createdAt);
    }, [ conversation.participantsLastViewed, currentUserId, createdAt ]);

    
    return (
        <CellMeasurer
            cache={cache}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            <div className={outerContainer} style={style}>
                {dateMarkerString && (
                    <div className={dateContainer}>
                        <Divider className={dateContainerDivider} component="span" light={true} />
                        <Typography className={dateContainerText} component="p" variant="body1" color="textSecondary">{dateMarkerString}</Typography>
                        <Divider className={dateContainerDivider} component="span" light={true} />
                    </div>
                )}
                <div className={infoContainer}>
                    <Typography className={usernameText} component="p" variant="body1" color="textPrimary">{author.username}</Typography>
                    <Typography className={timeCreatedText} component="p" variant="body1" color="textSecondary">{timeCreated}</Typography>
                </div>
                <div className={messageContainer}>
                    <Typography component="p" variant="body1" color="inherit">{body}</Typography>
                </div>
                {lastViewedString && (
                    <div className={statusContainer}>
                        <Typography className={statusText} component="p" variant="body1" color="textSecondary">{lastViewedString}</Typography>
                    </div>
                )}
            </div>
        </CellMeasurer>
    );
}

Message.propTypes = {
    // text: PropTypes.string.isRequired,
    // username: PropTypes.string.isRequired,
    // author: PropTypes.shape({
    //     username: PropTypes.string.isRequired,
    //     _id: PropTypes.string.isRequired
    // }).isRequired,
    // createdAt: PropTypes.string.isRequired,
    // previousCreatedAt: PropTypes.string,
    // otherParticipantsLastViewed: PropTypes.arrayOf(PropTypes.shape({
    //     lastViewed: PropTypes.string,
    //     username: PropTypes.string.isRequired
    // })).isRequired
    index: PropTypes.number.isRequired
};

export default Message;