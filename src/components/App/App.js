import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Header from '../Header';
//import Container from '@material-ui/core/Container';
import ConversationsList from '../ConversationsList';
import Conversation from '../Conversation';
import CenteredContainer from '../CenteredContainer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignInForm from '../SignInForm';
import SignUpForm from '../SignUpForm';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: 56,
        //border: 'solid red 1px',
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
            marginTop: 64,
            minHeight: 'calc(100vh - 64px)'
        }
    }
}));


const App = () => {
    const { container } = useStyles();
    return (
        <>
            <CssBaseline />
            <BrowserRouter>
                <Header isLoggedIn={true} />
                <CenteredContainer>
                    <Switch>
                        <Route path="/sign-up">
                            <SignUpForm />
                        </Route>
                        <Route path="/sign-in">
                            <SignInForm />
                        </Route>
                        <Route path="/conversations">
                            <ConversationsList />
                        </Route>
                        <Route path="/conversation/:id">
                            <Conversation />
                        </Route>
                        <Route path="/">
                            <div>Placeholder</div>
                        </Route>
                    </Switch>
                </CenteredContainer>
            </BrowserRouter>
        </>
    );
};

export default App;