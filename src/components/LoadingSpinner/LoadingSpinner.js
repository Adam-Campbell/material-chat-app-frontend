import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
    spinner: {
        position: 'absolute',
        top: ({ size }) => `calc(50% - ${size / 2}px)`,
        left: ({ size }) => `calc(50% - ${size / 2}px)`
    }
});

const LoadingSpinner = ({ size = 80 }) => {

    const { spinner } = useStyles({ size });

    return (
        <CircularProgress size={size} className={spinner} />
    );
}

LoadingSpinner.propTypes = {
    size: PropTypes.number
};

export default LoadingSpinner;
