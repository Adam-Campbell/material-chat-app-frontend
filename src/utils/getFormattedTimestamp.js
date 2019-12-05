const isToday = timestamp => timestamp.toDateString() === new Date().toDateString();

const padNum = num => num < 10 ? `0${num}` : num;

const formatDate = timestamp => {
    const date = padNum( timestamp.getUTCDate() );
    const month = padNum( timestamp.getUTCMonth() + 1 );
    const year = timestamp.getUTCFullYear();
    return `${date}/${month}/${year}`;
};

const formatTime = timestamp => {
    const minutes = padNum( timestamp.getUTCMinutes() );
    const hours = timestamp.getUTCHours();
    return `${hours}:${minutes}`;
};

export const getFormattedTimestamp = timestamp => {
    const dateObj = new Date(timestamp);
    return isToday(dateObj) ? formatTime(dateObj) : formatDate(dateObj);
};




