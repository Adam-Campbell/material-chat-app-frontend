import { formatDate } from './formatDate';
import { formatTime } from './formatTime';

const isToday = timestamp => timestamp.toDateString() === new Date().toDateString();

export const getFormattedTimestamp = timestamp => {
    const dateObj = new Date(timestamp);
    return isToday(dateObj) ? formatTime(dateObj) : formatDate(dateObj);
};
