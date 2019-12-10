import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    statusContainer: {
        marginLeft: ({ isOwnMessage }) => isOwnMessage ? 'auto' : 0,
        marginRight: ({ isOwnMessage }) => isOwnMessage ? 0 : 'auto'
    },
    statusText: {
        fontSize: 14
    }
}));

const getLastViewedString = (participantsLastViewed, currentUserId, createdAt) => {
    // Minus one because there is no need to include current user in this
    const totalOtherParticipants = participantsLastViewed.length - 1;
    const matchingPlvs = participantsLastViewed.filter(plv => {
        return plv.lastViewed === createdAt && plv.user._id !== currentUserId
    })
    .map(plv => plv.user.username);
    
    if (matchingPlvs.length === 0) {
        return false;
    }
    if (matchingPlvs.length === 1) {
        return totalOtherParticipants === 1 ? 'Seen' : `Seen by ${matchingPlvs[0]}`;
    }
    if (matchingPlvs.length > 1) {
        if (matchingPlvs.length === totalOtherParticipants) {
            return 'Seen by everyone';
        } else {
            return matchingPlvs.length === 2 ?
                `Seen by ${matchingPlvs[0]} and ${matchingPlvs[1]}` :
                `Seen by ${matchingPlvs[0]} and ${matchingPlvs.length - 1} ${matchingPlvs.length > 2 ? 'others' : 'other'}`
        }
    }
}

const SeenBy = ({ participantsLastViewed, currentUserId, createdAt, isOwnMessage }) => {

    const { statusContainer, statusText } = useStyles({ isOwnMessage })

    const seenByString = useMemo(() => {
        return getLastViewedString(participantsLastViewed, currentUserId, createdAt);
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
    ) : null;
};

SeenBy.propTypes = {
    participantsLastViewed: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentUserId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired
};

export default SeenBy;
