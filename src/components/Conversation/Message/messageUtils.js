import { formatDate } from '../../../utils';

/**
 * Determines whether a message should include a DateMarker value based off of its createdAt
 * string and the createdAt string of the previous message. Either returns the formatted value
 * to use for the DateMarker, or false if there should be no DateMarker. 
 * @param {String} createdAt - an ISO string representing the creation date/time of the current message.
 * @param {String} previousCreatedAt  - an ISO string representing the creation date/time of the previous
 * message.
 * @returns - either a formatted date string or false.
 */
export const getDateMarkerString = (createdAt, previousCreatedAt) => {
    if (!previousCreatedAt) {
        return formatDate( new Date(createdAt) );
    } else {
        const createdDate = formatDate( new Date(createdAt) );
        const previousCreatedDate = formatDate( new Date(previousCreatedAt) );
        return createdDate === previousCreatedDate ?
            false :
            createdDate
    }
};

/**
 * Determines the `Seen by` string that should be associated with a given message, if one
 * should be associated with it at all. Chooses from a number of possible formats for the
 * `Seen by` string based on how many participants in the conversation have seen the message
 * and how many participants there are in total.
 * @param {Array} participantsLastViewed - data for each participant in the conversation detailing
 * the creation time of the most recent message in the conversation they have viewed.
 * @param {String} currentUserId - the id for the currently logged in user. 
 * @param {String} createdAt - an ISO string for the creation date/time of the message that the
 * `Seen by` string is being generated for.
 * @returns - either the generated `Seen by` string, or false if no such string should be generated.
 */
export const getSeenByString = (participantsLastViewed, currentUserId, createdAt) => {
    // Subtract 1 because original participantsLastViewed include the currrent user.
    const totalOtherParticipants = participantsLastViewed.length - 1;
    const matchingPlvs = participantsLastViewed.filter(plv => {
        return plv.lastViewed === createdAt && plv.user._id !== currentUserId
    })
    .map(plv => plv.user.username);
    
    if (matchingPlvs.length === 0) {
        return false;
    }
    if (matchingPlvs.length === 1) {
        return totalOtherParticipants === 1 ? 'Seen' : `Seen by ${matchingPlvs[0]}`;
    }
    if (matchingPlvs.length > 1) {
        if (matchingPlvs.length === totalOtherParticipants) {
            return 'Seen by everyone';
        } else {
            return matchingPlvs.length === 2 ?
                `Seen by ${matchingPlvs[0]} and ${matchingPlvs[1]}` :
                `Seen by ${matchingPlvs[0]} and ${matchingPlvs.length - 1} others`
        }
    }
};
