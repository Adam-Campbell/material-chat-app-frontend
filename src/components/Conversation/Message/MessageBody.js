import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    bodyContainer: {
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
}));

const MessageBody = ({ body, isOwnMessage }) => {

    const { bodyContainer } = useStyles({ isOwnMessage });

    return (
        <div className={bodyContainer}>
            <Typography component="p" variant="body1" color="inherit">{body}</Typography>
        </div>
    );
}

MessageBody.propTypes = {
    body: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired
};

export default MessageBody;
