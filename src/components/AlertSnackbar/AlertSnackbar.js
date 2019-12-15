import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import lightBlue from '@material-ui/core/colors/lightBlue';
import IconButton from '@material-ui/core/IconButton';
import DownArrowIcon from '@material-ui/icons/ArrowDownward';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';


const useStyles = makeStyles(theme => ({
    snackbarContainer: {
        bottom: ({ bottomDistance }) => bottomDistance
    },
    contentContainer: {
        background: lightBlue[600],
        color: theme.palette.common.white
    }
}));

const AlertSnackbar = ({ 
    message, 
    isOpen, 
    handleClose, 
    handleActionClick, 
    bottomDistance = 24, 
    isPointingUp 
}) => {
    
    const { snackbarContainer, contentContainer } = useStyles({ bottomDistance });

    return (
        <Snackbar 
            className={snackbarContainer} 
            open={isOpen} 
            onClose={handleClose}
        >
            <SnackbarContent 
                className={contentContainer}
                message={message}
                action={<IconButton data-testid="snackbar-action-button" color="inherit" onClick={handleActionClick}>
                    {isPointingUp ? <UpArrowIcon /> : <DownArrowIcon />}
                </IconButton>}
            />
        </Snackbar>
    );
};

AlertSnackbar.propTypes = {
    message: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleActionClick: PropTypes.func.isRequired,
    bottomDistance: PropTypes.number,
    isPointingUp: PropTypes.bool
};

export default AlertSnackbar;
