/**
 * Creates a list of the usernames of all participants in a conversation except for the current user.
 * @param {Array} participants - array of data objects for the conversations participants. 
 * @param {String} currentUserId - id of the current user.
 * @returns {Array} - an array of usernames.
 */
export const getOtherParticipants = (participants, currentUserId) => {
    return participants.filter(user => user._id !== currentUserId)
        .map(user => user.username);
};

/**
 * Takes a list of usernames, and creates a comma separated string of the first two usernames in the
 * list (if there are two).
 * @param {Array} otherParticipants - array of usernames.
 * @returns {String} - the string derived from the usernames list.
 */
export const getParticipantsNamesString = (otherParticipants) => {
    return otherParticipants.slice(0,2).join(', ');
};

/**
 * Used in conjunction with getParticipantsNamesString, produces a string detailing how many additional
 * users there are not accounted for by the string produced by the aforementioned function, returning
 * null if there are no users unaccounted for. 
 * @param {Array} otherParticipants - array of usernames.
 * @returns - either the derived string or null.
 */
export const getRemainingParticipantsString = (otherParticipants) => {
    const remaining = otherParticipants.length - 2;
    return remaining > 0 ? `plus ${remaining} more` : null;
};

/**
 * Determines whether a conversation has messages that have not yet been viewed by the current
 * user, returning true if there are messages that have not yet been viewed, otherwise false.
 * @param {Array} participantsLastViewed - an array of data objects detailing the timestamp of the
 * last message in the conversation that each of its participants viewed.
 * @param {String} latestActivity - an ISO string representing the creation time/date for the most 
 * recent message in the conversation.  
 * @param {String} currentUserId - the id for the current user. 
 * @returns {Boolean} - whether there are unread messages. 
 */
export const getHasUnreadMessages = (participantsLastViewed, latestActivity, currentUserId) => {
    const currentUserPLV = participantsLastViewed.find(p => p.user._id === currentUserId);
    const lastViewed = (currentUserPLV && currentUserPLV.lastViewed) ? currentUserPLV.lastViewed : 0; 
    const hasUnreadMessages = new Date(lastViewed) < new Date(latestActivity);
    return hasUnreadMessages;
};

