import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import NewMessagesIcon from '@material-ui/icons/NewReleases';
import Typography from '@material-ui/core/Typography';
import { getFormattedTimestamp } from '../../../utils';
import { CurrentUserContext } from '../../CurrentUserContext';
import { getHasUnreadMessages } from './listItemUtils';

const useStyles = makeStyles(theme => ({
    newMessagesIcon: {
        marginRight: theme.spacing(2)
    }
}));

const LatestActivity = ({ participantsLastViewed, latestActivity }) => {
    
    const { newMessagesIcon } = useStyles();

    const { currentUserId } = useContext(CurrentUserContext);

    const hasUnreadMessages = useMemo(() => {
        return getHasUnreadMessages(participantsLastViewed, latestActivity, currentUserId);
    }, [ participantsLastViewed, latestActivity, currentUserId ]);

    const formattedTimestamp = useMemo(() => {
        return getFormattedTimestamp(latestActivity);
    }, [ latestActivity ]);

    return (
        <>
            {hasUnreadMessages && <NewMessagesIcon 
                data-testid="new-messages-icon" 
                className={newMessagesIcon} 
                color="secondary" 
            />}
            <Typography variant="subtitle2" component="p">{formattedTimestamp}</Typography>
        </>
    );
}

LatestActivity.propTypes = {
    participantsLastViewed: PropTypes.arrayOf(PropTypes.object).isRequired,
    latestActivity: PropTypes.string.isRequired
};

export default LatestActivity;