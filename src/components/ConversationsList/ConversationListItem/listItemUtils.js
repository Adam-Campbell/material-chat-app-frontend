export const getOtherParticipants = (participants, currentUserId) => {
    return participants.filter(user => user._id !== currentUserId)
        .map(user => user.username);
};

export const getPrimaryText = (otherParticipants) => {
    return otherParticipants.slice(0,2).join(', ');
};

export const getSecondaryText = (otherParticipants) => {
    const remaining = otherParticipants.length - 2;
    return remaining > 0 ? `plus ${remaining} more` : null;
};

export const getHasUnreadMessages = (participantsLastViewed, latestActivity, currentUserId) => {
    const currentUserPLV = participantsLastViewed.find(p => p.user._id === currentUserId);
    const lastViewed = (currentUserPLV && currentUserPLV.lastViewed) ? currentUserPLV.lastViewed : 0; 
    const hasUnreadMessages = new Date(lastViewed) < new Date(latestActivity);
    return hasUnreadMessages;
};

