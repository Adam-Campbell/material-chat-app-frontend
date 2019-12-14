import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { getDateMarkerString } from './messageUtils';

const useStyles = makeStyles(theme => ({
    dateContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
    dateContainerDivider: {
        flexGrow: 1
    },
    dateContainerText: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
}));

const DateMarker = ({ createdAt, previousCreatedAt }) => {

    const { dateContainer, dateContainerDivider, dateContainerText } = useStyles();

    const dateMarkerString = useMemo(() => {
        return getDateMarkerString(createdAt, previousCreatedAt);
    }, [ createdAt, previousCreatedAt ]);

    return dateMarkerString ? (
        <div className={dateContainer} data-testid="date-marker-container">
            <Divider className={dateContainerDivider} component="span" light={true} />
                <Typography 
                    className={dateContainerText} 
                    component="p" 
                    variant="body1" 
                    color="textSecondary"
                >{dateMarkerString}</Typography>
            <Divider className={dateContainerDivider} component="span" light={true} />
        </div>
    ) : null;
};

DateMarker.propTypes = {
    createdAt: PropTypes.string.isRequired,
    previousCreatedAt: PropTypes.string
};

export default DateMarker;