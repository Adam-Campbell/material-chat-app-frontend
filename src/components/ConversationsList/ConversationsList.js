import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MaterialList from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ConversationListItem from './ConversationListItem';
import { List, AutoSizer, CellMeasurerCache } from 'react-virtualized';
import { ConversationsListContext } from './ConversationsListContext';

/*

Todo:

- incorporate List
- construct rowRenderer function
- construct CellMeasurerCache instance
- create context for sharing item data
- rework ConversationListItem to use the context to access data, and to use 
CellMeasurer to measure itself.


*/

const useStyles = makeStyles(theme => ({
    heading: {
        //marginTop: theme.spacing(4),
        //marginBottom: theme.spacing(2)
    },
    titleContainer: {
        height: 80,
        display: 'flex',
        alignItems: 'center',
        marginTop: 56,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            marginTop: 64,
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        }
    },
    listContainer: {
        height: 'calc(100vh - 136px)',
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100vh - 144px)'
        }
    }
}));

const rowRenderer = ({ key, index, isScrolling, isVisible, style, parent }) => {
    return (
        <ConversationListItem index={index} style={style} key={key} parent={parent} />
    );
}

const cache = new CellMeasurerCache({
    defaultHeight: 120,
    fixedWidth: true
});

const ConversationsList = ({ conversations }) => {

    const { heading, titleContainer, listContainer } = useStyles();

    const conversationsListRef = useRef(null);
    
    console.log(conversations);
    return (
        <ConversationsListContext.Provider value={{ conversations, cache }}>
            <div className={titleContainer}>
                <Typography 
                    className={heading} 
                    color="textPrimary" 
                    component="h1" 
                    variant="h4"
                >Conversations</Typography>
            </div>
            <div className={listContainer}>
                {/* <MaterialList> */}
                    <AutoSizer>
                        {({ width, height }) => (
                            <List 
                                ref={conversationsListRef}
                                width={width}
                                height={height}
                                rowCount={conversations.length}
                                rowHeight={cache.rowHeight}
                                rowRenderer={rowRenderer}
                                deferredMeasurementCache={cache}
                                estimatedRowSize={120}
                            />
                        )}
                    </AutoSizer>
                {/* </MaterialList> */}
            </div>
        </ConversationsListContext.Provider>
    );
}

ConversationsList.propTypes = {
    conversations: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ConversationsList;


/*

{conversations.map(conversation => (
                    <ConversationListItem 
                        key={conversation._id}
                        id={conversation._id} 
                        otherParticipants={conversation.otherParticipants}
                        latestActivity={conversation.latestActivity}
                        hasUnreadMessages={conversation.hasUnreadMessages}
                    />
                ))}


*/