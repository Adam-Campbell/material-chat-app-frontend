import React, { useRef, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import AddMessageForm from './AddMessageForm';
import { ConversationContext } from './ConversationContext';
import { CurrentUserContext } from '../CurrentUserContext';
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


const Conversation = ({ 
    conversation, 
    isShowingSnackbar, 
    showSnackbar, 
    hideSnackbar, 
    addOptimisticMessagePlaceholder 
}) => {

    const { conversationContainer } = useStyles();
    const { currentUserId } = useContext(CurrentUserContext);
    const messagesListRef = useRef(null);
    const isInitialMount = useRef(true);
    const visibleSliceEnd = useRef(0);
    const previousMessagesLength = useRef(0);

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

    // Performs its logic everytime the a new message is received, but does not run on initial
    // render. If the user was already viewing the most recent message it updates the scroll
    // so that the new message comes into view. If the user was not viewing the most recent
    // message then it triggers a snackbar alert if the new message is not from the current
    // user, or does nothing if it is from the current user.  
    useEffect(() => {
        if (isInitialMount.current) return;
    
        const len = conversation.messages.length;
        const prevLen = previousMessagesLength.current;
        previousMessagesLength.current = len;
        // Only perform the actual logic if the length of the messages array has changed
        // since the last render. 
        if (len !== prevLen) {
            if (visibleSliceEnd.current >= len - 2) {
                forceRecompute(len - 1);
                setTimeout(() => {
                    scrollToRow(len - 1);
                }, 0)     
            } else {
                const lastMsg = conversation.messages[conversation.messages.length-1];
                if (lastMsg.author._id !== currentUserId) {
                    showSnackbar();
                }
            }
        }
    
    }, [ 
        conversation.messages, 
        isInitialMount, 
        visibleSliceEnd, 
        forceRecompute, 
        scrollToRow, 
        showSnackbar, 
        previousMessagesLength,
        currentUserId
    ]);

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
    }, [ conversation.messages.length, isInitialMount, forceRecompute, scrollToRow ]);
    
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
                    addOptimisticMessagePlaceholder={addOptimisticMessagePlaceholder}
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
    hideSnackbar: PropTypes.func.isRequired,
    addOptimisticMessagePlaceholder: PropTypes.func.isRequired
};

export default Conversation;
