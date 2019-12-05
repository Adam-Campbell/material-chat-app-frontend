export const actionTypes = {
    storeConversations: 'storeConversations',
    storeOneConversation: 'storeOneConversation'
};

const formatConversations = (conversations, currentUserId) => {
    return conversations.map(conversation => {
        //const otherParticipant = conversation.participants.find(user => user._id !== currentUserId);
        const otherParticipants = conversation.participants
            .filter(user => user._id !== currentUserId)
            .map(user => user.username);
        const lastViewed = conversation.participantsLastViewed.find(p => p.user === currentUserId).lastViewed || 0;
        const hasUnreadMessages = new Date(lastViewed) < new Date(conversation.latestActivity); 
        return {
            ...conversation, 
            otherParticipants,
            hasUnreadMessages
        }
    });
}



export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.storeConversations:
            return formatConversations(
                action.payload.conversations, 
                action.payload.currentUserId
            );

        // technically the sorting operation below should be redundant, leaving for now however.
        case actionTypes.storeOneConversation:
            return formatConversations(
                [ 
                    action.payload.conversation,
                    ...state.filter(c => c._id !== action.payload.conversation._id), 
                ],
                action.payload.currentUserId
            ).sort((a,b) => {
                const dateA = new Date(a.latestActivity);
                const dateB = new Date(b.latestActivity);
                if (dateA < dateB) {
                    return 1;
                } else if (dateA > dateB) {
                    return -1;
                } else {
                    return 0;
                }
            });

        default:
            return state;
    }
}