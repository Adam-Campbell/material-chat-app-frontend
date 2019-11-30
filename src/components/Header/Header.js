import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import BackIcon from '@material-ui/icons/ArrowBack';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles(theme => ({
    pushRightButton: {
        marginLeft: 'auto'
    },
    backIcon: {
        marginRight: theme.spacing(1)
    }
}));

const ButtonLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

const Header = ({ isLoggedIn }) => {
    const { pushRightButton, backIcon } = useStyles();
    return (
        <AppBar>
            <ToolBar>
                {isLoggedIn ? (
                    <>
                        <Button color="inherit" component={ButtonLink} to="/conversations">
                            <BackIcon className={backIcon} fontSize="small" />
                            All
                        </Button> 
                        <IconButton color="inherit" className={pushRightButton}>
                            <CreateIcon />
                        </IconButton>
                        <Button color="inherit">Sign Out</Button>
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

Header.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
};

export default Header;