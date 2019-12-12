import React, { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ConversationListItem from './ConversationListItem';
import { List, AutoSizer, CellMeasurerCache } from 'react-virtualized';
import { ConversationsListContext } from './ConversationsListContext';
import AlertSnackbar from '../AlertSnackbar';


const useStyles = makeStyles(theme => ({
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

const ConversationsList = ({ conversations, isShowingSnackbar, showSnackbar, hideSnackbar }) => {

    const { titleContainer, listContainer } = useStyles();

    const conversationsListRef = useRef(null);
    const visibleSliceStart = useRef(0);


    const forceRecompute = useCallback((startIdx = 0) => {
        if (conversationsListRef.current) {
            conversationsListRef.current.recomputeRowHeights(startIdx);
        }
    }, []);

    const scrollToRow = useCallback((rowNumber = 0) => {
        if (conversationsListRef.current) {
            conversationsListRef.current.scrollToRow(rowNumber);
        }
    }, []);

    const updateVisibleSliceOnRowsRendered = useCallback(({ startIndex }) => {
        visibleSliceStart.current = startIndex;
    }, []);

    const handleSnackbarActionClick = useCallback(() => {
        scrollToRow(0);
        hideSnackbar();
    }, [ hideSnackbar, scrollToRow, ]);

    // Ensures that the row heights adjust when the underlying conversations data updates.
    useLayoutEffect(() => {
        cache.clearAll();
        forceRecompute();
    }, [ conversations, forceRecompute ]);

    // Shows the snackbar if a new message is received and the user is not already viewing
    // the start of the list. 
    useEffect(() => {
        if (visibleSliceStart.current > 0) {
            showSnackbar();
        }
    }, [ conversations, visibleSliceStart, showSnackbar ]);

    return (
        <ConversationsListContext.Provider value={{ conversations, cache }}>
            <div className={titleContainer}>
                <Typography 
                    color="textPrimary" 
                    component="h1" 
                    variant="h4"
                >Conversations</Typography>
            </div>
            <div className={listContainer}>
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
                            onRowsRendered={updateVisibleSliceOnRowsRendered}
                        />
                    )}
                </AutoSizer>
            </div>
            <AlertSnackbar 
                message="New message received"
                isOpen={isShowingSnackbar}
                handleClose={hideSnackbar}
                handleActionClick={handleSnackbarActionClick}
                isPointingUp={true}
            />
        </ConversationsListContext.Provider>
    );
}

ConversationsList.propTypes = {
    conversations: PropTypes.arrayOf(PropTypes.object).isRequired,
    isShowingSnackbar: PropTypes.bool.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    hideSnackbar: PropTypes.func.isRequired
};

export default ConversationsList;
