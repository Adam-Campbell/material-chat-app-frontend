export const actionTypes = {
    fetchConversations: 'fetchConversations',
    storeConversations: 'storeConversations',
    storeOneConversation: 'storeOneConversation',
    updateConversationActivity: 'updateConversationActivity',
    showSnackbar: 'showSnackbar',
    hideSnackbar: 'hideSnackbar'
};

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
    isShowingSnackbar: false,
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
                conversations: action.payload.conversations
            };

        case actionTypes.storeOneConversation:
            return {
                ...state,
                conversations: [
                    action.payload.conversation,
                    ...state.conversations.filter(c => c._id !== action.payload.conversation._id)
                ].sort(conversationSorter)
            };
            

        case actionTypes.updateConversationActivity:
            return {
                ...state,
                conversations: updateLatestActivity(
                    state.conversations,
                    action.payload.conversationId,
                    action.payload.latestActivity
                ).sort(conversationSorter)
            };

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
