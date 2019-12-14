import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
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
            <ToolBar>
                {isSignedIn ? (
                    <>
                        <BackToConversations />
                        <IconButton 
                            color="inherit" 
                            className={pushRightButton} 
                            onClick={() => setIsShowingModal(prev => !prev)}
                        >
                            <CreateIcon />
                        </IconButton>
                        <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
                        <NewConversationModal 
                            isShowingModal={isShowingModal}
                            closeModal={() => setIsShowingModal(false)}
                        />
                    </>
                ) : (
                    <>
                        <Button className={pushRightButton} color="inherit" component={ButtonLink} to="/sign-in">Sign In</Button>
                        <Button color="inherit" component={ButtonLink} to="/sign-up">Sign Up</Button>
                    </>
                )}
            </ToolBar>
        </AppBar>
    );
}

export default Header;