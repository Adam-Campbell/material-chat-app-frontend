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

const Message = ({ text, username, isOwnMessage, createdAt }) => {

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
        return formatTime( new Date( createdAt ) );
    }, [ createdAt ]);
    
    return (
        <div className={outerContainer}>
            <div className={infoContainer}>
                <Typography className={usernameText} component="p" variant="body1" color="textPrimary">{username}</Typography>
                <Typography className={timeCreatedText} component="p" variant="body1" color="textSecondary">{timeCreated}</Typography>
            </div>
            <div className={messageContainer}>
                <Typography component="p" variant="body1" color="inherit">{text}</Typography>
            </div>
            <div className={statusContainer}>
                <Typography className={statusText} component="p" variant="body1" color="textSecondary">Seen by blah and blah</Typography>
            </div>
        </div>
    );
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
};

export default Message;