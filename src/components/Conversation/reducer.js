export const actionTypes = {
    fetchConversation: 'fetchConversation',
    storeConversation: 'storeConversation',
    addMessage: 'addMessage',
    updateLastViewed: 'updateLastViewed',
    showSnackbar: 'showSnackbar',
    hideSnackbar: 'hideSnackbar',
    addOptimisticMessagePlaceholder: 'addOptimisticMessagePlaceholder',
    revertOptimisticMessagePlaceholder: 'revertOptimisticMessagePlaceholder'
};

export const optimisticMessagePlaceholderId = 'optimisticMessagePlaceholderId';

const updateLastViewed = (lastViewedArray, userId, timestamp) => {
    return lastViewedArray.map(lv => {
        return lv.user._id === userId ? ({
            ...lv,
            lastViewed: timestamp
        }) : lv
    });
}

export const initialState = {
    isLoading: false,
    conversation: null,
    isShowingSnackbar: false
}

const handleAddNewMessage = (messagesState, newMessage, isOwnMessage) => {
    const combined = [ ...messagesState, newMessage ];
    return isOwnMessage ? 
        combined.filter(msg => msg._id !== optimisticMessagePlaceholderId) :
        combined;
}

export const reducer = (state, action) => {
    
    switch (action.type) {

        case actionTypes.fetchConversation:
            return {
                ...state,
                isLoading: true
            };

        case actionTypes.storeConversation:
            return {
                ...state,
                isLoading: false,
                conversation: {
                    ...action.payload.conversation,
                }
            }

        case actionTypes.addMessage:
            return action.payload.conversationId === action.payload.currentConversationId ? {
                ...state,
                conversation: {
                    ...state.conversation,
                    messages: handleAddNewMessage(
                        state.conversation.messages,
                        action.payload.message,
                        action.payload.isOwnMessage
                    )
                }
            } : state;

        case actionTypes.addOptimisticMessagePlaceholder:
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    messages: [
                        ...state.conversation.messages,
                        action.payload.message
                    ]
                }
            };

        case actionTypes.revertOptimisticMessagePlaceholder:
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    messages: state.conversation.messages.filter(msg => {
                        return msg._id !== optimisticMessagePlaceholderId
                    })
                }
            };

        case actionTypes.updateLastViewed:
            return action.payload.conversationId === action.payload.currentConversationId ? {
                ...state,
                conversation: {
                    ...state.conversation,
                    participantsLastViewed: updateLastViewed(
                        state.conversation.participantsLastViewed,
                        action.payload.userId,
                        action.payload.timestamp
                    )
                }
            } : state;

        case actionTypes.showSnackbar:
            return {
                ...state,
                isShowingSnackbar: true
            };

        case actionTypes.hideSnackbar:
            return {
                ...state,
                isShowingSnackbar: false
            };

        default:
            return state;
    }
}
