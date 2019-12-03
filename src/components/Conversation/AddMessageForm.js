import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { postMessage } from '../../Api';
import { SocketContext } from '../SocketContext';

const useStyles = makeStyles(theme => ({
    styledForm: {
        marginTop: 'auto',
        //border: 'solid blue 1px',
        display: 'flex',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    messageInput: {
        flexGrow: 1,
        marginRight: theme.spacing(2)
    }
}));

const AddMessageForm = ({ conversationId, updateConversation }) => {

    const { styledForm, messageInput } = useStyles();

    const [ message, setMessage ] = useState('');

    const { emit } = useContext(SocketContext);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log(message);
    //     try {
    //         const response = await postMessage(conversationId, message);
    //         console.log(response.data.conversation);
    //         updateConversation(response.data.conversation);
    //         setMessage('');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const handleSubmit = e => {
        e.preventDefault();
        emit('sendMessage', conversationId, message);
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
                multiline={true}
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
    updateConversation: PropTypes.func.isRequired
};

export default AddMessageForm;
