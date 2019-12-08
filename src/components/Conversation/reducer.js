export const actionTypes = {
    fetchConversation: 'fetchConversation',
    storeConversation: 'storeConversation',
    addMessage: 'addMessage',
    updateLastViewed: 'updateLastViewed'
};


export const initialState = {
    isLoading: false,
    conversation: null
}

const formatMessage = (message, currentUserId) => ({
    ...message, 
    isOwnMessage: message.author._id === currentUserId
});

const formatMessages = (messages, currentUserId) => {
    return messages.map(message => formatMessage(message, currentUserId));
}

const updateLastViewedArr = (lastViewedArr, userId, timestamp) => {
    return lastViewedArr.map(record => userId === record.user._id ? {
        ...record,
        lastViewed: timestamp
    } : record);
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
                isLoading: false,
                conversation: {
                    ...action.payload.conversation,
                    messages: formatMessages(
                        action.payload.conversation.messages, 
                        action.payload.currentUserId
                    )
                }
            }

        case actionTypes.addMessage:
            return action.payload.conversationId === action.payload.currentConversationId ? {
                ...state,
                conversation: {
                    ...state.conversation,
                    messages: [
                        ...state.conversation.messages,
                        formatMessage(
                            action.payload.message,
                            action.payload.currentUserId
                        )
                    ]
                }
            } : state;

        case actionTypes.updateLastViewed:
            return action.payload.conversationId === action.payload.currentConversationId ? {
                ...state,
                conversation: {
                    ...state.conversation,
                    participantsLastViewed: action.payload.lastViewed
                }
            } : state;

        default:
            return state;
    }
}