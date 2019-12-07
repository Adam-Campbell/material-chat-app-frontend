import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import UserSearch from './UserSearch';
import { postConversation } from '../../Api';
import { useHistory } from 'react-router-dom';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';

const useStyles = makeStyles(theme => ({
    modalPaper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: theme.spacing(2),
        width: 'calc(100% - 64px)',
        maxWidth: 500
    },
    formHeading: {
        marginBottom: theme.spacing(2)
    },
    styledForm: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    styledInput: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    submitButton: {
        marginTop: theme.spacing(2),
        marginLeft: 'auto',
        marginRight: theme.spacing(1)
    },
    cancelButton: {
        marginTop: theme.spacing(2),
    }
}));


const NewConversationModal = ({ isShowingModal, closeModal }) => {

    const { modalPaper, formHeading, styledForm, styledInput, submitButton, cancelButton } = useStyles();

    const history= useHistory();

    const [ userSearchValue, setUserSearchValue ] = useState([]);
    const [ messageValue, setMessageValue ] = useState('');
    const [ error, setError ] = useState(null);
    const { emit, on } = useContext(SocketContext);

    const closeAndReset = () => {
        setUserSearchValue([]);
        setMessageValue('');
        closeModal();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userSearchValue.length || !messageValue) {
            return setError('You must fill out all of the required fields');
        }
        try {
            const userIds = userSearchValue.map(user => user._id);
            emit(socketActions.sendConversation, { userIds, messageText: messageValue });
            closeAndReset();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const off = on(socketActions.sendConversationSuccess, data => {
            const { conversationId } = data;
            history.push(`/conversation/${conversationId}`);
        });
        return off;
    }, []);

    return (
        <Modal open={isShowingModal} onClose={closeAndReset}>
            <Paper className={modalPaper}>
                {error && <p>{error}</p>}
                <Typography className={formHeading} component="h2" variant="h5">New conversation</Typography>
                <form onSubmit={handleSubmit} className={styledForm}>
                    <UserSearch 
                        value={userSearchValue}
                        setValue={setUserSearchValue}
                    />
                    <TextField
                        className={styledInput}
                        type="text"
                        label="Write a message"
                        variant="outlined"
                        value={messageValue}
                        onChange={e => setMessageValue(e.target.value)}
                    />
                    <Button className={submitButton} variant="contained" color="primary" type="submit">Send</Button>
                    <Button className={cancelButton} variant="contained" color="secondary" onClick={closeAndReset}>Cancel</Button>
                </form>
            </Paper>
        </Modal>
    )
}

export default NewConversationModal;
