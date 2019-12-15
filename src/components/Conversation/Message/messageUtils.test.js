import { getDateMarkerString, getLastViewedString } from './messageUtils';

describe('getDateMarkerString', () => {
    it('parses the dates from the two ISO strings supplied and returns false if they are the same', () => {
        const createdAt = '2019-07-03T20:38:10.893Z';
        const previousCreatedAt = '2019-07-03T16:08:12.893Z';
        expect(getDateMarkerString(createdAt, previousCreatedAt)).toBe(false);
    });
    it('returns the date parsed from the createdAt ISO string when the two dates are not the same', () => {
        const createdAt = '2019-07-03T20:38:10.893Z';
        const previousCreatedAt = '2019-07-02T16:08:12.893Z';
        expect(getDateMarkerString(createdAt, previousCreatedAt)).toBe('03/07/2019');
    });
});

/*
3 matching, 2 nonmatching

*/
describe('getLastViewedString', () => {
    const createdAt = '2019-07-03T20:38:10.893Z';
    const currentUserId = '0';
    const currentUserPlv = {
        _id: '10',
        lastViewed: '2019-07-03T20:38:10.893Z',
        user: { _id: '0', username: 'user1' }
    };
    const matchingPlv1 = {
        _id: '11',
        lastViewed: '2019-07-03T20:38:10.893Z',
        user: { _id: '1', username: 'user2' }
    };
    const matchingPlv2 = {
        _id: '12',
        lastViewed: '2019-07-03T20:38:10.893Z',
        user: { _id: '2', username: 'user3' }
    };
    const matchingPlv3 = {
        _id: '13',
        lastViewed: '2019-07-03T20:38:10.893Z',
        user: { _id: '3', username: 'user4' }
    };
    const nonMatchingPlv1 = {
        _id: '14',
        lastViewed: '2019-07-03T20:36:10.893Z',
        user: { _id: '4', username: 'user5' }
    };
    const nonMatchingPlv2 = {
        _id: '15',
        lastViewed: '2019-07-03T20:36:10.893Z',
        user: { _id: '5', username: 'user6' }
    };

    it('returns false if there are no matching other participants', () => {
        expect(getLastViewedString([
            currentUserPlv,
            nonMatchingPlv1
        ], currentUserId, createdAt))
        .toBe(false);
    });
    it(`returns the correct string if there is one matching other participant and only one
    total other participant`, () => {
        expect(getLastViewedString([
            currentUserPlv,
            matchingPlv1
        ], currentUserId, createdAt))
        .toBe('Seen');
    });
    it(`returns the correct string if there is one matching other participant but there are
    more than one total other participants`, () => {
        expect(getLastViewedString([
            currentUserPlv,
            matchingPlv1,
            nonMatchingPlv1
        ], currentUserId, createdAt))
        .toBe(`Seen by ${matchingPlv1.user.username}`);
    });
    it('returns the correct string if there are multiple other participants and they all match', () => {
        expect(getLastViewedString([
            currentUserPlv,
            matchingPlv1,
            matchingPlv2,
            matchingPlv3
        ], currentUserId, createdAt))
        .toBe('Seen by everyone');
    });
    it(`returns the correct string if there are two matching other participants but more than
    two total other participants`, () => {
        expect(getLastViewedString([
            currentUserPlv,
            matchingPlv1,
            matchingPlv2,
            nonMatchingPlv1
        ], currentUserId, createdAt))
        .toBe(`Seen by ${matchingPlv1.user.username} and ${matchingPlv2.user.username}`);
    });
    it(`returns the correct string if there are more than two matching other participants but still
    a greater amount of total other participants`, () => {
        expect(getLastViewedString([
            currentUserPlv,
            matchingPlv1,
            matchingPlv2,
            matchingPlv3,
            nonMatchingPlv1,
            nonMatchingPlv2
        ], currentUserId, createdAt))
        .toBe(`Seen by ${matchingPlv1.user.username} and 2 others`);
    });
});
