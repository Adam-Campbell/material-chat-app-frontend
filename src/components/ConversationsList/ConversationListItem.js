import React, { useMemo, useContext } from 'react';
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
import { ConversationsListContext } from './ConversationsListContext';
import { CellMeasurer } from 'react-virtualized';

const useStyles = makeStyles(theme => ({
    outerContainer: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        }
    },
    listItem: {
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
    newMessagesIcon: {
        marginRight: theme.spacing(2)
    }
}));

const ConversationListItem = ({ index, style, parent }) => {

    const { outerContainer, listItem, link, participantsText, newMessagesIcon } = useStyles();
    const { conversations, cache } = useContext(ConversationsListContext);
    const { otherParticipants, latestActivity, hasUnreadMessages, _id } = conversations[index];
    const { isHovered, containerProps } = useHover();

    const firstParticipant = otherParticipants[0];

    const initials = useMemo(() => {
        return getInitials(firstParticipant);
    }, [ firstParticipant ]);

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
        <CellMeasurer
            cache={cache}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            <div style={style} className={outerContainer}>
                <ListItem className={listItem} component="div" divider={true} selected={isHovered}>
                    <Link className={link} to={`/conversation/${_id}`} {...containerProps}>
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
            </div>
        </CellMeasurer>
    );
}

ConversationListItem.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    parent: PropTypes.any
};

export default ConversationListItem;
