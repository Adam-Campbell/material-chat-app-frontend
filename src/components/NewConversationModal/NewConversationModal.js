import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import UserSearch from './UserSearch';
import { useHistory } from 'react-router-dom';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

    const history = useHistory();

    const { emit, on } = useContext(SocketContext);

    const fk = useFormik({
        initialValues: {
            users: [],
            message: ''
        },
        validationSchema: Yup.object({
            users: Yup.array().required('You must select at least one user'),
            message: Yup.string().required('Message required')
        }),
        onSubmit: async (values, actions) => {
            const { users, message } = values;
            try {
                const userIds = users.map(user => user._id);
                emit(socketActions.sendConversation, { userIds, messageText: message });
                closeAndReset();
            } catch (err) {
                console.log(err);
            }
        }
    });

    const closeAndReset = () => {
        fk.handleReset();
        closeModal();
    }

    // Set up subscription to react to the sendConversation success message by
    // redirecting to the conversation page.
    useEffect(() => {
        const off = on(socketActions.sendConversationSuccess, data => {
            const { conversationId } = data;
            history.push(`/conversation/${conversationId}`);
        });
        return off;
    }, [ history, on ]);

    return (
        <Modal open={isShowingModal} onClose={closeAndReset}>
            <Paper className={modalPaper}>
                <Typography 
                    className={formHeading} 
                    component="h2" 
                    variant="h5"
                >New conversation</Typography>
                <form onSubmit={fk.handleSubmit} data-testid="new-conversation-form" className={styledForm}>
                    <UserSearch 
                        value={fk.values.users || fk.initialValues.users}
                        setValue={val => {
                            fk.setFieldTouched('users');
                            fk.setFieldValue('users', val);
                        }}
                        hasError={Boolean(fk.touched.users && fk.errors.users)}
                        errorText={(fk.touched.users && fk.errors.users) ? fk.errors.users : null}
                    />
                    <TextField
                        className={styledInput}
                        type="text"
                        label="Write a message"
                        variant="outlined"
                        name="message"
                        value={fk.values.message}
                        onChange={e => {
                            fk.setFieldTouched('message');
                            fk.handleChange(e);
                        }}
                        onBlur={fk.handleBlur}
                        error={Boolean(fk.touched.message && fk.errors.message)}
                        helperText={(fk.touched.message && fk.errors.message) ? fk.errors.message : null}
                    />
                    <Button 
                        className={submitButton} 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        disabled={!fk.isValid || !fk.dirty || fk.isSubmitting}
                    >Send</Button>
                    <Button 
                        className={cancelButton} 
                        variant="contained" 
                        color="secondary" 
                        onClick={closeAndReset}
                    >Cancel</Button>
                </form>
            </Paper>
        </Modal>
    )
}

NewConversationModal.propTypes = {
    isShowingModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

export default NewConversationModal;
