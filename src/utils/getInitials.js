/**
 * Username is a string of one or more words. This function takes the first letters of, at most, the first
 * two words, joins them together and capitalizes the result. 
 * `myUsername` becomes `M`
 * `my username` becomes `MU`
 * `my really long username` becomes `MR`
 * @param {String} username - the username to derive initials from.
 * @return {String} - the derived initials
 */
export const getInitials = username => {
    return username.split(' ')
        .filter(el => el !== '')
        .slice(0,2)
        .map(el => el.slice(0,1))
        .join('')
        .toUpperCase()
};
