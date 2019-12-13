import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { getInitials } from '../../../utils';
import { CurrentUserContext } from '../../CurrentUserContext';

const useStyles = makeStyles(theme => ({
    participantsText: {
        marginLeft: 'auto'
    }
}))

const Participants = ({ participants }) => {

    const { participantsText } = useStyles();

    const { currentUserId } = useContext(CurrentUserContext);

    const otherParticipants = useMemo(() => {
        return participants
        .filter(user => user._id !== currentUserId)
        .map(user => user.username);
    }, [ participants, currentUserId ]);

    const initials = useMemo(() => {
        return getInitials( otherParticipants[0] );
    }, [ otherParticipants ]);

    const primaryText = useMemo(() => {
        return otherParticipants.slice(0,2).join(', ');
    }, [ otherParticipants ]);

    const secondaryText = useMemo(() => {
        const remaining = otherParticipants.length - 2;
        return remaining > 0 ? `plus ${remaining} more` : null;
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