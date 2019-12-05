import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { CurrentUserContext } from '../CurrentUserContext';
import { getInitials } from '../../utils';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
        maxWidth: '90%',
        marginLeft: ({ isOwnMessage }) => isOwnMessage ? 'auto' : 0,
        marginRight: ({ isOwnMessage }) => isOwnMessage ? 0 : 'auto',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
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
    }
}));

const Message = ({ text, username, isOwnMessage }) => {

    const { container, userInitials } = useStyles({ isOwnMessage });

    const initials = useMemo(() => {
        return getInitials(username);
    }, [ username ]);
    
    return (
        <div className={container}>
            <Typography component="p" variant="body1" color="inherit">{text}</Typography>
            <Avatar className={userInitials}>{initials}</Avatar>
        </div>
    );
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired
};

export default Message;