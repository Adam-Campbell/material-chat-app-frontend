import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
        color: theme.palette.common.white
    }
}));

const Message = ({ text, isOwnMessage }) => {
    const { container } = useStyles({ isOwnMessage });
    
    return (
        <div className={container}>
            <Typography component="p" variant="body1" color="inherit">{text}</Typography>
        </div>
    );
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired
};

export default Message;