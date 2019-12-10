import React, { useMemo, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import AddMessageForm from './AddMessageForm';
import { CurrentUserContext } from '../CurrentUserContext';
import { ConversationContext } from './ConversationContext';
import { List, AutoSizer, CellMeasurerCache } from 'react-virtualized';
import Container from '@material-ui/core/Container'


/*

Bug to fix:

When the seen-by text beneath the messages updates (gets added to or removed from a message)
the actual height that the Grid assumes for that message does not update. There should be a way
to force the Grid to update and the sizes to update accordingly. Have already tried to use the
forceUpdateGrid method but it doesn't seem to be working, perhaps I am not using it correctly. 

In the very worst case I can simply update the styling such that the space that would be 
occupied by the seen-by text will still be used up whether the text is there or not. This would
fix it for all cases except the case where the seen-by text goes onto a second line, which should
only happen very rarely. 



*/


const useStyles = makeStyles(theme => ({
    messageStreamContainer: {
        // display: 'flex',
        // flexDirection: 'column'
        height: 'calc(100vh - 184px)'
    },
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

const compareLastViewed = (lastViewed, previousLastViewed, currentUserId) => {
    //console.log(lastViewed, previousLastViewed);
    const filteredNew = lastViewed.filter(el => el.user._id !== currentUserId);
    const filteredOld = previousLastViewed.filter(el => el.user._id !== currentUserId);
    //console.log(filteredNew, filteredOld);
    let hasChanged = false;
    for (let lvObject of filteredNew) {
        const counterpart = filteredOld.find(oldLvObject => oldLvObject.user._id === lvObject.user._id);
        //console.log('counterpart: ', counterpart);
        if (!counterpart || lvObject.lastViewed !== counterpart.lastViewed) {
            hasChanged = true;
            break;
        }
    }
    return hasChanged;
}

const Conversation = ({ conversation }) => {

    const { messageStreamContainer, conversationContainer } = useStyles();
    
    const { currentUserId } = useContext(CurrentUserContext);

    const messagesListRef = useRef(null);
    const isInitialMount = useRef(true);
    const visibleSliceEnd = useRef(0);
    const previousLastViewed = useRef([]);

    const forceRecompute = (startIdx = 0) => {
        if (messagesListRef.current) {
            messagesListRef.current.recomputeRowHeights(startIdx);
        }
    };

    const forceUpdateGrid = () => {
        if (messagesListRef.current) {
            messagesListRef.current.forceUpdateGrid();
        }
    }

    const scrollToRow = (rowNumber = 0) => {
        if (messagesListRef.current) {
            messagesListRef.current.scrollToRow(rowNumber);
        }
    };

    const handleRowsRendered = ({ stopIndex }) => {
        visibleSliceEnd.current = stopIndex;
        console.log(stopIndex);
    } 

    useEffect(() => {
        if (isInitialMount.current) return;
        const len = conversation.messages.length;
        if (visibleSliceEnd.current >= len - 2) {
            forceRecompute(len - 1);
            setTimeout(() => {
                scrollToRow(len - 1);
            }, 0)     
        } else {
            console.log('A new message arrived!');
        }
    
    }, [ conversation.messages.length, isInitialMount, visibleSliceEnd ]);

    useEffect(() => {
        if (isInitialMount.current) return;
        const hasChanged = compareLastViewed(
            conversation.participantsLastViewed,
            previousLastViewed.current,
            currentUserId
        );
        previousLastViewed.current = conversation.participantsLastViewed;
        if (hasChanged) {
            console.log('We actually made it into the condition')
            forceUpdateGrid();
            setTimeout(() => {
                //forceRecompute();
            }, 0);
        }
    }, [ conversation.participantsLastViewed, isInitialMount, currentUserId ]);

    useEffect(() => {
        if (isInitialMount.current) {
            window.listRef = messagesListRef.current;
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
                    <AutoSizer>
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
                                onRowsRendered={handleRowsRendered}
                            />
                        )}
                    </AutoSizer>
                </div>
                <AddMessageForm 
                    conversationId={conversation._id}
                />
            </ConversationContext.Provider>
        </>
    );
}

/*

{conversation.messages.map((msg, idx, arr) => (
                    <Message 
                        key={msg._id} 
                        text={msg.body} 
                        author={msg.author}
                        username={msg.author.username}
                        createdAt={msg.createdAt}
                        previousCreatedAt={idx > 0 ? arr[idx-1].createdAt : null}
                        otherParticipantsLastViewed={otherParticipantsLastViewed}
                    />
                ))}


*/

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
    }).isRequired
};

export default Conversation;