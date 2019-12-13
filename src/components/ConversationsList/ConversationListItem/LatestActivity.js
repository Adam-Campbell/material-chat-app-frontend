import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import NewMessagesIcon from '@material-ui/icons/NewReleases';
import Typography from '@material-ui/core/Typography';
import { getFormattedTimestamp } from '../../../utils';
import { CurrentUserContext } from '../../CurrentUserContext';

const useStyles = makeStyles(theme => ({
    newMessagesIcon: {
        marginRight: theme.spacing(2)
    }
}));

const LatestActivity = ({ participantsLastViewed, latestActivity }) => {
    
    const { newMessagesIcon } = useStyles();

    const { currentUserId } = useContext(CurrentUserContext);

    const hasUnreadMessages = useMemo(() => {
        const currentUserPLV = participantsLastViewed.find(p => p.user._id === currentUserId);
        const lastViewed = (currentUserPLV && currentUserPLV.lastViewed) ? currentUserPLV.lastViewed : 0; 
        const hasUnreadMessages = new Date(lastViewed) < new Date(latestActivity); 
        return hasUnreadMessages;
    }, [ currentUserId, participantsLastViewed, latestActivity ]);

    const formattedTimestamp = useMemo(() => {
        return getFormattedTimestamp(latestActivity);
    }, [ latestActivity ]);

    return (
        <>
            {hasUnreadMessages && <NewMessagesIcon className={newMessagesIcon} color="secondary" />}
            <Typography variant="subtitle2" component="p">{formattedTimestamp}</Typography>
        </>
    );
}

LatestActivity.propTypes = {
    participantsLastViewed: PropTypes.arrayOf(PropTypes.object).isRequired,
    latestActivity: PropTypes.string.isRequired
};

export default LatestActivity;