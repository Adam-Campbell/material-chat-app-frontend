import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import useHover from '../useHover';

const useStyles = makeStyles(theme => ({
    container: {
        //border: 'solid green 1px',
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
    }
}));

const ConversationListItem = ({ otherParticipants, id }) => {

    const { container, link } = useStyles();

    const { isHovered, containerProps } = useHover();

    const initials = useMemo(() => {
        return otherParticipants[0].split(' ')
            .filter(el => el !== '')
            .slice(0,2)
            .map(el => el.slice(0,1))
            .join('')
            .toUpperCase();
    }, [ otherParticipants[0] ]);

    const primaryText = useMemo(() => {
        return otherParticipants.slice(0,2).join(', ');
    }, [ otherParticipants ]);

    const secondaryText = useMemo(() => {
        const remaining = otherParticipants.length - 2;
        return remaining > 0 ? `plus ${remaining} more` : null;
    }, [ otherParticipants ]);

    return (
        <ListItem className={container} divider={true} selected={isHovered}>
            <Link className={link} to={`/conversation/${id}`} {...containerProps}>
                <ListItemAvatar>
                    <Avatar>{initials}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                    primary={primaryText}
                    secondary={secondaryText}
                />
            </Link>
        </ListItem>
    );
}

/*

{otherParticipants.map((username, idx) => (
                    <ParticipantSummary username={'bruce wayne, adam campbell'} key={idx} remaining={3} />
                ))}

*/

ConversationListItem.propTypes = {
    otherParticipants: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired
};

export default ConversationListItem;
