import React, { useContext } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../Header';
import ConversationsList from '../ConversationsList';
import Conversation from '../Conversation';
import CenteredContainer from '../CenteredContainer';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import SignInForm from '../SignInForm';
import SignUpForm from '../SignUpForm';
import LoadingSpinner from '../LoadingSpinner';
import { CurrentUserContext } from '../CurrentUserContext';


const App = () => {

    const { isSignedIn, hasCheckedForSession } = useContext(CurrentUserContext);

    return !hasCheckedForSession ? (
        <LoadingSpinner />
    ) : (
        <>
            <CssBaseline />
            <BrowserRouter>
                <Header isLoggedIn={isSignedIn} />
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
                            <Redirect to={isSignedIn ? '/conversations' : '/sign-in'} />
                        </Route>
                    </Switch>
                </CenteredContainer>
            </BrowserRouter>
        </>
    );
};

export default App;