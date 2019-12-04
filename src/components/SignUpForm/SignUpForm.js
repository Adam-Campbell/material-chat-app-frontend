import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import { signUp } from '../../Api';

const useStyles = makeStyles(theme => ({
    styledForm: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 500
    },
    textInput: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    submitButton: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    },
    accountIcon: {
        alignSelf: 'center'
    }
}));

const ComposedLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const SignUpForm = () => {
    const { styledForm, textInput, submitButton, accountIcon } = useStyles();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const [ error, setError ] = useState(null);

    const { isSignedIn, storeUser } = useContext(CurrentUserContext);

    const { connect } = useContext(SocketContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`
            username: ${username}
            password: ${password}
            confirmPassword: ${confirmPassword}
        `);
        if (!username || !password || !confirmPassword) {
            return setError('You must fill out all required fields');
        } else if (password !== confirmPassword) {
            return setError('Your password confirmation does not match');
        }
        try {
            const response = await signUp(username, password);
            const { user, socketToken } = response.data;
            connect(socketToken, () => {
                storeUser(user.username, user._id);
            });
        } catch (error) {
            console.log(error);
            if (error.response) {
                setError(error.response.data.error);
            } else {
                console.log('This error should be handled globally');
            }
        }
    }

    return isSignedIn ? (
        <Redirect to="/conversations" />
    ) : (
        <form className={styledForm} onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <AccountIcon className={accountIcon} fontSize="large" color="secondary"/>
            <Typography component="h1" variant="h4" paragraph align="center">Sign Up</Typography>
            <TextField 
                type="text"
                className={textInput}
                autoFocus={true}
                variant="outlined"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <TextField 
                type="password"
                className={textInput}
                variant="outlined"
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <TextField 
                type="password"
                className={textInput}
                variant="outlined"
                label="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
            <Button className={submitButton} variant="contained" color="primary" type="submit">Sign Up</Button>
            <Link align="right" component={ComposedLink} to="/sign-in">Already have an account? Sign in.</Link>
        </form>
    );
}

export default SignUpForm;
