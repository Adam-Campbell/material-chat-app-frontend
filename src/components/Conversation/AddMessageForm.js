import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { postMessage } from '../../Api';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';

const useStyles = makeStyles(theme => ({
    styledForm: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        //marginTop: 'auto',
        //border: 'solid blue 1px',
        //borderTop: 'solid 1px #e0e0e0',
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

const AddMessageForm = ({ conversationId }) => {

    const { styledForm, messageInput } = useStyles();

    const [ message, setMessage ] = useState('');

    const { emit } = useContext(SocketContext);

    const handleSubmit = e => {
        e.preventDefault();
        emit(socketActions.sendMessage, { conversationId, messageText: message });
        setMessage('');
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
    conversationId: PropTypes.string.isRequired
};

export default AddMessageForm;
