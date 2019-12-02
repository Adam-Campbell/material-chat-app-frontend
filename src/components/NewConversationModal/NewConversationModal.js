import React, { useState } from 'react';
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

const useStyles = makeStyles(theme => ({
    modalPaper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: theme.spacing(2),
        width: 'calc(100% - 64px)',
        maxWidth: 450
    }
}));

const options = [
    'adam',
    'jamie',
    'sarah',
    'sam',
    'emma',
    'dave'
]

const NewConversationModal = ({ isShowingModal, closeModal }) => {

    const { modalPaper } = useStyles();

    const history= useHistory();

    const [ userSearchValue, setUserSearchValue ] = useState({});
    const [ messageValue, setMessageValue ] = useState('');
    const [ error, setError ] = useState(null);

    const closeAndReset = () => {
        setUserSearchValue({});
        setMessageValue('');
        closeModal();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userSearchValue._id || !messageValue) {
            return setError('You must fill out all of the required fields');
        }
        try {
            console.log(userSearchValue._id);
            const response = await postConversation(
                userSearchValue._id,
                messageValue
            );
            console.log(response);
            closeAndReset();
            history.push(`/conversation/${response.data.conversation._id}`); 
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Modal open={isShowingModal} onClose={closeAndReset}>
            <Paper className={modalPaper}>
                {error && <p>{error}</p>}
                <Typography gutterBottom component="h2" variant="h5">New conversation</Typography>
                <form onSubmit={handleSubmit}>
                    <UserSearch 
                        value={userSearchValue}
                        setValue={setUserSearchValue}
                    />
                    <TextField 
                        type="text"
                        label="Write a message"
                        variant="outlined"
                        value={messageValue}
                        onChange={e => setMessageValue(e.target.value)}
                    />
                    <Button variant="contained" color="primary" type="submit">Send</Button>
                    <Button variant="contained" color="secondary" onClick={closeAndReset}>Cancel</Button>
                </form>
            </Paper>
        </Modal>
    )
}

export default NewConversationModal;
