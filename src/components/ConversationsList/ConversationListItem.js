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

const ConversationListItem = ({ username, id }) => {

    const { container, link } = useStyles();

    const { isHovered, containerProps } = useHover();

    const initials = useMemo(() => {
        return username.split(' ')
            .filter(el => el !== '')
            .slice(0,2)
            .map(el => el.slice(0,1))
            .join('')
            .toUpperCase();
    }, [ username ]);

    return (
        <ListItem className={container} divider={true} selected={isHovered}>
            <Link className={link} to={`/conversation/${id}`} {...containerProps}>
                <ListItemAvatar>
                    <Avatar>{initials}</Avatar>
                </ListItemAvatar>
                <ListItemText>{username}</ListItemText>
            </Link>
        </ListItem>
    );
}

ConversationListItem.propTypes = {
    username: PropTypes.string.isRequired
};

export default ConversationListItem;
