import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CurrentUserContext } from '../CurrentUserContext';
import { formatTime } from '../../utils';

const useStyles = makeStyles(theme => ({
    outerContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column'
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

function getLastViewedString(otherParticipantsLastViewed, createdAt) {
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

const Message = ({ text, username, isOwnMessage, createdAt, otherParticipantsLastViewed }) => {

    const { 
        outerContainer, 
        messageContainer, 
        infoContainer, 
        usernameText, 
        timeCreatedText,
        statusContainer,
        statusText
    } = useStyles({ isOwnMessage });

    const timeCreated = useMemo(() => {
        console.log('timeCreated recalculated')
        return formatTime( new Date( createdAt ) );
    }, [ createdAt ]);

    const lastViewedString = getLastViewedString(otherParticipantsLastViewed, createdAt);
    
    return (
        <div className={outerContainer}>
            <div className={infoContainer}>
                <Typography className={usernameText} component="p" variant="body1" color="textPrimary">{username}</Typography>
                <Typography className={timeCreatedText} component="p" variant="body1" color="textSecondary">{timeCreated}</Typography>
            </div>
            <div className={messageContainer}>
                <Typography component="p" variant="body1" color="inherit">{text}</Typography>
            </div>
            {lastViewedString && (
                <div className={statusContainer}>
                    <Typography className={statusText} component="p" variant="body1" color="textSecondary">{lastViewedString}</Typography>
                </div>
            )}
        </div>
    );
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    otherParticipantsLastViewed: PropTypes.arrayOf(PropTypes.shape({
        lastViewed: PropTypes.string,
        username: PropTypes.string.isRequired
    })).isRequired
};

export default Message;