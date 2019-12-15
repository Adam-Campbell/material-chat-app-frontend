import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { getInitials } from '../../../utils';
import { CurrentUserContext } from '../../CurrentUserContext';
import { 
    getOtherParticipants, 
    getPrimaryText, 
    getSecondaryText 
} from './listItemUtils';

const useStyles = makeStyles(theme => ({
    participantsText: {
        marginLeft: 'auto'
    }
}));

const Participants = ({ participants }) => {

    const { participantsText } = useStyles();

    const { currentUserId } = useContext(CurrentUserContext);

    const otherParticipants = useMemo(() => {
        return getOtherParticipants(participants, currentUserId);
    }, [ participants, currentUserId ]);

    const initials = useMemo(() => {
        return getInitials( otherParticipants[0] );
    }, [ otherParticipants ]);

    const primaryText = useMemo(() => {
        return getPrimaryText(otherParticipants);
    }, [ otherParticipants ]);

    const secondaryText = useMemo(() => {
        return getSecondaryText(otherParticipants);
    }, [ otherParticipants ]);

    return (
        <>
            <ListItemAvatar>
                <Avatar>{initials}</Avatar>
            </ListItemAvatar>
            <ListItemText 
                className={participantsText}
                primary={primaryText}
                secondary={secondaryText}
            />
        </>
    );
}

Participants.propTypes = {
    participants: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
    })).isRequired
};

export default Participants;