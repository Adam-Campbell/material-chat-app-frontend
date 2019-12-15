export const padNum = num => num < 10 ? `0${num}` : num;

export const formatDate = dateObj => {
    const date = padNum( dateObj.getUTCDate() );
    const month = padNum( dateObj.getUTCMonth() + 1 );
    const year = dateObj.getUTCFullYear();
    return `${date}/${month}/${year}`;
};
