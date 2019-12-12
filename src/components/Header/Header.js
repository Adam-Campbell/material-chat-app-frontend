import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Link, useLocation } from 'react-router-dom';
import BackIcon from '@material-ui/icons/ArrowBack';
import CreateIcon from '@material-ui/icons/Create';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import NewConversationModal from '../NewConversationModal';
import { signOut } from '../../Api';

const useStyles = makeStyles(theme => ({
    pushRightButton: {
        marginLeft: 'auto'
    },
    backIcon: {
        marginRight: theme.spacing(1)
    }
}));



const ButtonLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

const conversationRouteRegex = /^\/conversation\/\w+$/i;

const Header = () => {

    const { pushRightButton, backIcon } = useStyles();

    const { isSignedIn, clearUser } = useContext(CurrentUserContext);

    const { disconnect } = useContext(SocketContext);

    const [ isShowingModal, setIsShowingModal ] = useState(false);

    const { pathname } = useLocation();
    

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
                        {conversationRouteRegex.test(pathname) && (
                            <Button color="inherit" component={ButtonLink} to="/conversations">
                                <BackIcon className={backIcon} fontSize="small" />
                                All
                            </Button>
                        )}
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