import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import useHover from '../useHover';
import { getInitials, getFormattedTimestamp } from '../../utils';
import NewMessagesIcon from '@material-ui/icons/NewReleases';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles(theme => ({
    container: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        textDecoration: 'none',
        cursor: 'pointer',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        color: theme.palette.text.primary
    },
    participantsText: {
        marginLeft: 'auto'
    },
    timestamp: {
        marginLeft: 'auto'
    },
    newMessagesIcon: {
        marginRight: theme.spacing(2)
    }
}));

const ConversationListItem = ({ otherParticipants, id, latestActivity, hasUnreadMessages }) => {

    const { container, link, timestamp, participantsText, newMessagesIcon } = useStyles();

    const { isHovered, containerProps } = useHover();

    const initials = useMemo(() => {
        return getInitials( otherParticipants[0] );
    }, [ otherParticipants[0] ]);

    const primaryText = useMemo(() => {
        return otherParticipants.slice(0,2).join(', ');
    }, [ otherParticipants ]);

    const secondaryText = useMemo(() => {
        const remaining = otherParticipants.length - 2;
        return remaining > 0 ? `plus ${remaining} more` : null;
    }, [ otherParticipants ]);

    const formattedTimestamp = useMemo(() => {
        return getFormattedTimestamp(latestActivity);
    }, [ latestActivity ]);

    return (
        <ListItem className={container} divider={true} selected={isHovered}>
            <Link className={link} to={`/conversation/${id}`} {...containerProps}>
                <ListItemAvatar>
                    <Avatar>{initials}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                    className={participantsText}
                    primary={primaryText}
                    secondary={secondaryText}
                />
                {hasUnreadMessages && <NewMessagesIcon className={newMessagesIcon} color="secondary" />}
                <Typography variant="subtitle2" component="p">{formattedTimestamp}</Typography>
            </Link>
        </ListItem>
    );
}

ConversationListItem.propTypes = {
    otherParticipants: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    latestActivity: PropTypes.string.isRequired,
    hasUnreadMessages: PropTypes.bool.isRequired
};

export default ConversationListItem;
