import React, { useContext } from 'react';
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
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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
    },
    signInLink: {
        alignSelf: 'flex-end'
    }
}));

const ComposedLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const SignUpForm = () => {
    const { styledForm, textInput, submitButton, accountIcon, signInLink } = useStyles();

    const { isSignedIn, storeUser } = useContext(CurrentUserContext);

    const { connect } = useContext(SocketContext);

    const handleSubmit = async (values, actions) => {
        const { setFieldError } = actions;
        const { username, password } = values;
        try {
            const response = await signUp(username, password);
            const { user, socketToken } = response.data;
            connect(socketToken, () => {
                storeUser(user.username, user._id);
            });
        } catch (err) {
            if (err.response) {
                const { error } = err.response.data;
                if (error === 'Username is taken') {
                    setFieldError('username', 'Username is taken');
                }
            } else {
                console.log(err);
            }
        }
    }

    return isSignedIn ? (
        <Redirect to="/conversations" />
    ) : (
        <Formik 
            initialValues={{
                username: '',
                password: '',
                confirmPassword: ''
            }}
            validationSchema={Yup.object({
                username: Yup.string().required('Username required'),
                password: Yup.string().required('Password required'),
                confirmPassword: Yup.string().required('Password confirmation required').test({
                    name: 'matchesPassword',
                    message: 'Password confirmation does not match password',
                    test: function(value) {
                        const password = this.resolve(Yup.ref('password'));
                        return value === password
                    }
                })
            })}
            onSubmit={handleSubmit}
        >
            {f => (
                <Form className={styledForm}>
                    <AccountIcon className={accountIcon} fontSize="large" color="secondary"/>
                    <Typography component="h1" variant="h4" paragraph align="center">Sign Up</Typography>
                    <Field name="username">
                        {({ field, form, meta }) => (
                            <TextField 
                                type="text"
                                className={textInput}
                                autoFocus={true}
                                variant="outlined"
                                label="Username"
                                {...field}
                                onChange={e => {
                                    form.setFieldTouched(field.name);
                                    field.onChange(e);
                                }}
                                error={Boolean(meta.touched && meta.error)}
                                helperText={meta.touched && meta.error ? meta.error : null}
                            />
                        )}
                    </Field>
                    <Field name="password">
                        {({ field, form, meta }) => (
                            <TextField 
                                type="password"
                                className={textInput}
                                variant="outlined"
                                label="Password"
                                {...field}
                                onChange={e => {
                                    form.setFieldTouched(field.name);
                                    field.onChange(e);
                                }}
                                error={Boolean(meta.touched && meta.error)}
                                helperText={meta.touched && meta.error ? meta.error : null}
                            />
                        )}
                    </Field>
                    <Field name="confirmPassword">
                        {({ field, form, meta }) => (
                            <TextField 
                                type="password"
                                className={textInput}
                                variant="outlined"
                                label="Confirm password"
                                {...field}
                                onChange={(e) => {
                                    form.setFieldTouched(field.name);
                                    field.onChange(e)
                                }}
                                error={Boolean(meta.touched && meta.error)}
                                helperText={meta.touched && meta.error ? meta.error : null}
                            />
                        )}
                    </Field>
                    <Button 
                        data-testid="submit-button"
                        className={submitButton} 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        disabled={!f.isValid || !f.dirty || f.isSubmitting}
                    >Sign Up</Button>
                    <Link 
                        className={signInLink} 
                        component={ComposedLink} 
                        to="/sign-in"
                    >Already have an account? Sign in.</Link>
                </Form>
            )}
        </Formik>
    );
}

export default SignUpForm;
