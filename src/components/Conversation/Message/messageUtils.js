import { formatDate } from '../../../utils';

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
}

export const getLastViewedString = (participantsLastViewed, currentUserId, createdAt) => {
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
}
