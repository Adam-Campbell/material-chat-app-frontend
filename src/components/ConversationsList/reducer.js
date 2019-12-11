export const actionTypes = {
    fetchConversations: 'fetchConversations',
    storeConversations: 'storeConversations',
    storeOneConversation: 'storeOneConversation',
    updateConversationActivity: 'updateConversationActivity'
};

const formatConversations = (conversations, currentUserId) => {
    return conversations.map(conversation => {
        const otherParticipants = conversation.participants
            .filter(user => user._id !== currentUserId)
            .map(user => user.username);
        const lastViewed = conversation.participantsLastViewed.find(p => p.user._id === currentUserId).lastViewed || 0;
        const hasUnreadMessages = new Date(lastViewed) < new Date(conversation.latestActivity); 
        return {
            ...conversation, 
            otherParticipants,
            hasUnreadMessages
        }
    });
}

const updateLatestActivity = (conversations, conversationId, latestActivity) => {
    const cloned = [ ...conversations ];
    const idx = cloned.findIndex(c => c._id === conversationId);
    if (idx > -1) {
        cloned[idx].latestActivity = latestActivity;
    }
    return cloned;
}

const conversationSorter = (a, b) => {
    const dateA = new Date(a.latestActivity);
    const dateB = new Date(b.latestActivity);
    if (dateA < dateB) {
        return 1;
    } else if (dateA > dateB) {
        return -1;
    } else {
        return 0;
    }
}

export const initialState = {
    isLoading: false,
    hasLoaded: false,
    conversations: []
};


export const reducer = (state, action) => {
    
    switch (action.type) {

        case actionTypes.fetchConversations:
            return {
                ...state,
                isLoading: true
            };

        case actionTypes.storeConversations:
            return {
                ...state,
                isLoading: false,
                hasLoaded: true, 
                conversations: formatConversations(
                    action.payload.conversations,
                    action.payload.currentUserId
                )
            };

        // technically the sorting operation below should be redundant, leaving for now however.
        case actionTypes.storeOneConversation:
            return {
                ...state,
                conversations: formatConversations(
                    [ 
                        action.payload.conversation,
                        ...state.conversations.filter(c => c._id !== action.payload.conversation._id), 
                    ],
                    action.payload.currentUserId
                ).sort(conversationSorter)
            };
            

        case actionTypes.updateConversationActivity:
            return {
                ...state,
                conversations: formatConversations(
                    updateLatestActivity(
                        state.conversations, 
                        action.payload.conversationId, 
                        action.payload.latestActivity
                    ),
                    action.payload.currentUserId
                ).sort(conversationSorter)
            };

        default:
            return state;
    }
}
