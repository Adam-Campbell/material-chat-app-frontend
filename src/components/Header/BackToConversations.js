import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import ButtonLink from './ButtonLink';

const useStyles = makeStyles(theme => ({
    backIcon: {
        marginRight: theme.spacing(1)
    }
}));

const conversationRouteRegex = /^\/conversation\/\w+$/i;

const BackToConversations = () => {

    const { backIcon } = useStyles();

    const { pathname } = useLocation();

    return conversationRouteRegex.test(pathname) ? (
        <Button 
            data-testid="back-to-conversations-link" 
            color="inherit" 
            component={ButtonLink} 
            to="/conversations"
        >
            <BackIcon className={backIcon} fontSize="small" />
            All
        </Button>
    ) : null;

};

export default BackToConversations;