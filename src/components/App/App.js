import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Header from '../Header';
//import Container from '@material-ui/core/Container';
import ConversationsList from '../ConversationsList';
import Conversation from '../Conversation';
import CenteredContainer from '../CenteredContainer';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import SignInForm from '../SignInForm';
import SignUpForm from '../SignUpForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import LoadingSpinner from '../LoadingSpinner';
import { CurrentUserContext } from '../CurrentUserContext';
import { searchUsers } from '../../Api';

const useStyles = makeStyles(theme => ({
    
}));

async function startConversation() {
    try {
        const response = await fetch('http://localhost:5000/conversations', {
            credentials: 'include',
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: '5de4037d5c3bc02550e9d969',
                messageText: 'Hey there friend'
            })
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}


const App = () => {

    const classes = useStyles();

    const { isSignedIn, hasCheckedForSession } = useContext(CurrentUserContext);

    // useEffect(() => {
    //     const checkForSession = async () => {
    //         try {
    //             const response = await getProfile();
    //             console.log(response)
    //             const { username, _id } = response;
    //             storeUser(username, _id);
    //         } catch (error) {
    //             clearUser();
    //             console.log(error);
    //         }
    //     }
    //     checkForSession();
    // }, []);


    return !hasCheckedForSession ? (
        <LoadingSpinner />
    ) : (
        <>
            <CssBaseline />
            <BrowserRouter>
                <Header isLoggedIn={isSignedIn} />
                <CenteredContainer>
                    {/* <button onClick={() => searchUsers('A')}>Click me</button> */}
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