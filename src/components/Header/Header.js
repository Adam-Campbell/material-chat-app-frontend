import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import Toolbar from '@material-ui/core/Toolbar';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import NewConversationModal from '../NewConversationModal';
import { signOut } from '../../Api';
import BackToConversations from './BackToConversations';
import ButtonLink from './ButtonLink';

const useStyles = makeStyles(theme => ({
    pushRightButton: {
        marginLeft: 'auto'
    }
}));

const Header = () => {

    const { pushRightButton } = useStyles();
    const { isSignedIn, clearUser } = useContext(CurrentUserContext);
    const { disconnect } = useContext(SocketContext);
    const [ isShowingModal, setIsShowingModal ] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            disconnect();
            clearUser();
        } catch (error) {  
            console.log(error);
        }
    }

    return (
        <AppBar>
            <Toolbar>
                {isSignedIn ? (
                    <>
                        <BackToConversations />
                        <IconButton
                            data-testid="open-modal-button" 
                            color="inherit" 
                            className={pushRightButton} 
                            onClick={() => setIsShowingModal(prev => !prev)}
                        >
                            <CreateIcon />
                        </IconButton>
                        <Button 
                            data-testid="sign-out-button" 
                            color="inherit" 
                            onClick={handleSignOut}
                        >Sign Out</Button>
                        <NewConversationModal 
                            isShowingModal={isShowingModal}
                            closeModal={() => setIsShowingModal(false)}
                        />
                    </>
                ) : (
                    <>
                        <Button
                            data-testid="sign-in-link" 
                            className={pushRightButton} 
                            color="inherit" 
                            component={ButtonLink} 
                            to="/sign-in"
                        >Sign In</Button>
                        <Button 
                            data-testid="sign-up-link"
                            color="inherit" 
                            component={ButtonLink} 
                            to="/sign-up"
                        >Sign Up</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;