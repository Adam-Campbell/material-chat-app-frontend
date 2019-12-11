import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import lightBlue from '@material-ui/core/colors/lightBlue';
import IconButton from '@material-ui/core/IconButton';
import ArrowIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles(theme => ({
    snackbarContainer: {
        bottom: 96
    },
    contentContainer: {
        background: lightBlue[600],
        color: theme.palette.common.white
    }
}));

const NewMessagesSnackbar = ({ isOpen, handleClose, handleActionClick }) => {

    const { snackbarContainer, contentContainer } = useStyles();

    return (
        <Snackbar className={snackbarContainer} open={isOpen} onClose={handleClose}>
            <SnackbarContent 
                className={contentContainer}
                message="View new message"
                action={<IconButton color="inherit" onClick={handleActionClick}><ArrowIcon /></IconButton>}
            />
        </Snackbar>
    );
}

NewMessagesSnackbar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleActionClick: PropTypes.func.isRequired
};

export default NewMessagesSnackbar;
