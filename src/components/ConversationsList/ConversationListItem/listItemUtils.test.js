import { 
    getOtherParticipants, 
    getParticipantsNamesString, 
    getRemainingParticipantsString,
    getHasUnreadMessages 
} from './listItemUtils';

const user1 = {
    _id: '0',
    username: 'joe bloggs'
};
const user2 = {
    _id: '1',
    username: 'jane doe',
};
const user3 = {
    _id: '2',
    username: 'john smith'
};
const user4 = {
    _id: '3',
    username: 'alice'
};
const participantsLastViewed = [
    {
        _id: '10',
        lastViewed: '2019-07-03T20:38:10.893Z',
        user: user1
    },
    {
        _id: '11',
        lastViewed: '2019-07-03T16:38:10.893Z',
        user: user2
    },
    {
        _id: '12',
        lastViewed: '2019-07-03T19:38:10.893Z',
        user: user3
    }
];

describe('getOtherParticipants', () => {
    it('filters out the current user and returns an array of usernames', () => {
        expect(getOtherParticipants(
            [ user1, user2, user3, user4 ],
            user1._id
        ))
        .toEqual([
            user2.username,
            user3.username,
            user4.username
        ]);
    });
});

describe('getParticipantsNamesString', () => {
    it('returns a string composed of the usernames of, at most, the first two users', () => {
        expect(getParticipantsNamesString([ user2.username ])).toEqual('jane doe');
        expect(getParticipantsNamesString([ 
            user2.username, 
            user3.username, 
            user4.username 
        ])).toBe('jane doe, john smith');
    });
});

describe('getRemainingParticipantsString', () => {
    it('returns null if there are no remaining users not accounted for in the primary text', () => {
        expect(getRemainingParticipantsString([ 
            user2.username, 
            user3.username 
        ])).toBe(null);
    });
    it('returns a string indicating the number of unaccounted for users if there are any', () => {
        expect(getRemainingParticipantsString([ 
            user2.username, 
            user3.username, 
            user4.username 
        ])).toEqual('plus 1 more');
    });
});

describe('getHasUnreadMessages', () => {
    it(`returns true if the current users lastViewed is older than the conversations latest activity
    else returns false`, () => {
        expect(getHasUnreadMessages(
            participantsLastViewed, 
            '2019-07-03T20:38:10.893Z', 
            user1._id
        ))
        .toBe(false);
        expect(getHasUnreadMessages(
            participantsLastViewed, 
            '2019-07-03T21:38:10.893Z', 
            user1._id
        ))
        .toBe(true);
    });
});