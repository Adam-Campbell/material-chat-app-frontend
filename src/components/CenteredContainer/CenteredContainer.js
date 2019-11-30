import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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

const CenteredContainer = ({ children }) => {

    const { container } = useStyles();

    return (
        <Container className={container}>
            {children}
        </Container>
    ); 
}

export default CenteredContainer;