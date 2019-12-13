import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';

const useStyles = makeStyles(theme => ({
    styledForm: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 90,
        display: 'flex',
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        }
    },
    messageInput: {
        flexGrow: 1,
        marginRight: theme.spacing(2)
    }
}));

const AddMessageForm = ({ conversationId, addOptimisticMessagePlaceholder }) => {

    const { styledForm, messageInput } = useStyles();

    const [ message, setMessage ] = useState('');

    const { emit } = useContext(SocketContext);

    const handleSubmit = e => {
        e.preventDefault();
        const messageText = message;
        setMessage('');
        addOptimisticMessagePlaceholder(messageText);
        emit(socketActions.sendMessage, { conversationId, messageText });
    }

    return (
        <form className={styledForm} onSubmit={handleSubmit}>
            <TextField 
                className={messageInput}
                label="Send a message"
                type="text"
                required={true}
                value={message}
                onChange={e => setMessage(e.target.value)}
                variant="outlined"
            />
            <Button 
                type="submit" 
                disabled={message === ''} 
                variant="contained"
            >Send</Button>
        </form>
    );
}

AddMessageForm.propTypes = {
    conversationId: PropTypes.string.isRequired,
    addOptimisticMessagePlaceholder: PropTypes.func.isRequired
};

export default AddMessageForm;
