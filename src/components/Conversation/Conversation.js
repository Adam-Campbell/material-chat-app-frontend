import React, { useContext, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import AddMessageForm from './AddMessageForm';
import { CurrentUserContext } from '../CurrentUserContext';
import { ConversationContext } from './ConversationContext';
import { List, AutoSizer, CellMeasurerCache } from 'react-virtualized';
import AlertSnackbar from '../AlertSnackbar';

const useStyles = makeStyles(theme => ({
    conversationContainer: {
        marginTop: 56,
        height: 'calc(100vh - 146px)',
        [theme.breakpoints.up('sm')]: {
            marginTop: 64,
            height: 'calc(100vh - 154px)'
        }
    }
}));

const rowRenderer = ({ key, index, isScrolling, isVisible, style, parent }) => {
    return (
        <Message index={index} style={style} key={key} parent={parent} />
    );
}

const cache = new CellMeasurerCache({
    defaultHeight: 200,
    fixedWidth: true
});


const Conversation = ({ conversation, isShowingSnackbar, showSnackbar, hideSnackbar }) => {

    const { conversationContainer } = useStyles();
    
    const { currentUserId } = useContext(CurrentUserContext);

    const messagesListRef = useRef(null);
    const isInitialMount = useRef(true);
    const visibleSliceEnd = useRef(0);

    const forceRecompute = useCallback((startIdx = 0) => {
        if (messagesListRef.current) {
            messagesListRef.current.recomputeRowHeights(startIdx);
        }
    }, []);

    const scrollToRow = useCallback((rowNumber = 0) => {
        if (messagesListRef.current) {
            messagesListRef.current.scrollToRow(rowNumber);
        }
    }, []);

    const handleSnackbarActionClick = useCallback(() => {
        forceRecompute(0);
        setTimeout(() => {
            scrollToRow(conversation.messages.length - 1);
        }, 0);
        hideSnackbar();
    }, [ forceRecompute, scrollToRow, hideSnackbar, conversation.messages.length ]);

    const updateVisibleSliceOnRowsRendered = useCallback(({ stopIndex }) => {
        visibleSliceEnd.current = stopIndex;
    }, []);

    // Runs every time the length of conversation.messages array changes (every time a new) 
    // message is received) but does not run on initial render. Either scrolls down to the 
    // bottom of the conversation or triggers an alert depending on which part of the
    // conversation is currently being rendered. 
    useEffect(() => {
        if (isInitialMount.current) return;
        const len = conversation.messages.length;
        if (visibleSliceEnd.current >= len - 2) {
            forceRecompute(len - 1);
            setTimeout(() => {
                scrollToRow(len - 1);
            }, 0)     
        } else {
            showSnackbar();
        }
    
    }, [ conversation.messages.length, isInitialMount, visibleSliceEnd ]);

    // Runs only on initial render, responsible for scrolling down to the bottom of the 
    // conversation (the most recent message).
    useEffect(() => {
        if (isInitialMount.current) {
            forceRecompute(0);
            setTimeout(() => {
                scrollToRow(conversation.messages.length - 1);
            }, 0)
            isInitialMount.current = false;
        }
    }, [ conversation.messages.length, isInitialMount ]);
    
    return (
        <>  
            <ConversationContext.Provider value={{ conversation, cache }}>
                <div className={conversationContainer}>
                    <AutoSizer onResize={() => cache.clearAll()}>
                        {({ width, height }) => (
                            <List 
                                ref={messagesListRef}
                                width={width}
                                height={height}
                                rowCount={conversation.messages.length}
                                rowHeight={cache.rowHeight}
                                rowRenderer={rowRenderer}
                                deferredMeasurementCache={cache}
                                estimatedRowSize={200}
                                onRowsRendered={updateVisibleSliceOnRowsRendered}
                            />
                        )}
                    </AutoSizer>
                </div>
                <AddMessageForm 
                    conversationId={conversation._id}
                />
                <AlertSnackbar 
                    message="View new message"
                    isOpen={isShowingSnackbar}
                    handleClose={hideSnackbar}
                    handleActionClick={handleSnackbarActionClick}
                    bottomDistance={96}
                />
            </ConversationContext.Provider>
        </>
    );
}

Conversation.propTypes = {
    conversation: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        messages: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            author: PropTypes.shape({
                username: PropTypes.string.isRequired,
                _id: PropTypes.string.isRequired
            }).isRequired,
            body: PropTypes.string.isRequired,
        })).isRequired,
        participants: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    isShowingSnackbar: PropTypes.bool.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    hideSnackbar: PropTypes.func.isRequired
};

export default Conversation;
