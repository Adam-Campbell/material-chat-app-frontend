import { padNum } from './formatDate';

export const formatTime = dateObj => {
    const minutes = padNum( dateObj.getUTCMinutes() );
    const hours = dateObj.getUTCHours();
    return `${hours}:${minutes}`;
};
