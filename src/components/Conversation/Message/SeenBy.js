import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getSeenByString } from './messageUtils';

const useStyles = makeStyles(theme => ({
    statusContainer: {
        marginLeft: ({ isOwnMessage }) => isOwnMessage ? 'auto' : 0,
        marginRight: ({ isOwnMessage }) => isOwnMessage ? 0 : 'auto',
        minHeight: 24,
    },
    statusText: {
        fontSize: 14
    }
}));


const SeenBy = ({ participantsLastViewed, currentUserId, createdAt, isOwnMessage }) => {

    const { statusContainer, statusText } = useStyles({ isOwnMessage })

    const seenByString = useMemo(() => {
        return getSeenByString(participantsLastViewed, currentUserId, createdAt);
    }, [ participantsLastViewed, currentUserId, createdAt ]);

    return seenByString ? (
        <div className={statusContainer}>
            <Typography 
                className={statusText} 
                component="p" 
                variant="body1" 
                color="textSecondary"
            >{seenByString}</Typography>
        </div>
    ) : <span className={statusContainer} data-testid="seenby-placeholder-element"></span>;
};

SeenBy.propTypes = {
    participantsLastViewed: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentUserId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired
};

export default SeenBy;
