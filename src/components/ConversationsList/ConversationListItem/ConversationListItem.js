import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';
import useHover from '../../useHover';
import { ConversationsListContext } from '../ConversationsListContext';
import { CellMeasurer } from 'react-virtualized';
import Participants from './Participants';
import LatestActivity from './LatestActivity';

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
}));

const ConversationListItem = ({ index, style, parent }) => {

    const { outerContainer, listItem, link } = useStyles();
    const { conversations, cache } = useContext(ConversationsListContext);
    const { latestActivity, participants, participantsLastViewed, _id } = conversations[index];
    const { isHovered, containerProps } = useHover();

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
                        <Participants participants={participants} />
                        <LatestActivity 
                            participantsLastViewed={participantsLastViewed}
                            latestActivity={latestActivity}
                        />
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
