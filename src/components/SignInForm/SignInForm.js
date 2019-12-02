import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { CurrentUserContext } from '../CurrentUserContext';
import { signIn } from '../../Api';

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

const SignInForm = () => {
    const { styledForm, textInput, submitButton, accountIcon } = useStyles();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const [ error, setError ] = useState(null);

    const { isSignedIn, storeUser } = useContext(CurrentUserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`
            username: ${username}
            password: ${password}
        `);
        if (!username || !password) {
            return setError('You must fill out all required fields');
        }
        try {
            const response = await signIn(username, password);
            const { user } = response.data;
            storeUser(user.username, user._id);
        } catch (err) {
            console.log(err);
            if (err.response) {
                setError(err.response.data.error);
            } else {
                console.log('This error should be managed globally');
            }
        }

    }

    return isSignedIn ? (
        <Redirect to="/conversations" />
    ) : (
        <form className={styledForm} onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <AccountIcon className={accountIcon} fontSize="large" color="secondary"/>
            <Typography component="h1" variant="h4" paragraph align="center">Sign In</Typography>
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
            <Button className={submitButton} variant="contained" color="primary" type="submit">Sign In</Button>
            <Link align="right" component={ComposedLink} to="/sign-up">Don't have an account? Sign up!</Link>
        </form>
    );
}

export default SignInForm;
