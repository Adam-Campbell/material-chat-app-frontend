export const user1 = {
    _id: '0',
    username: 'joe bloggs'
};

export const user2 = {
    _id: '1',
    username: 'jane doe'
};

export const user3 = {
    _id: '2',
    username: 'jane bloggs'
};

export const fullConversation = {
    _id: '10',
    participants: [ user1, user2 ],
    messages: [
        {
            _id: '20',
            author: user1,
            body: 'The first message',
            createdAt: '2019-12-13T13:07:47.115Z'
        },
        {
            _id: '21',
            author: user2,
            body: 'A reply',
            createdAt: '2019-12-13T13:08:47.115Z'
        }
    ],
    participantsLastViewed: [
        {
            _id: '30',
            user: user1,
            lastViewed: '2019-12-13T13:08:47.115Z',
        },
        {
            _id: '31',
            user: user2,
            lastViewed: '2019-12-13T13:08:47.115Z',
        }
    ],
    latestActivity: '2019-12-13T13:08:47.115Z'
};

export const conversationSummary1 = {
    _id: '10',
    participants: [ user1, user2 ],
    participantsLastViewed: [
        {
            _id: '30',
            user: user1,
            lastViewed: '2019-12-13T13:08:47.115Z',
        },
        {
            _id: '31',
            user: user2,
            lastViewed: '2019-12-13T13:08:47.115Z',
        }
    ],
    latestActivity: '2019-12-13T13:08:47.115Z'
};

export const conversationSummary2 = {
    _id: '11',
    participants: [ user1, user2, user3 ],
    participantsLastViewed: [
        {
            _id: '32',
            user: user1,
            lastViewed: '2019-12-13T13:10:47.115Z',
        },
        {
            _id: '33',
            user: user2,
            lastViewed: '2019-12-13T13:10:47.115Z',
        },
        {
            _id: '34',
            user: user3,
            lastViewed: '2019-12-13T13:10:03.115Z',
        }
    ],
    latestActivity: '2019-12-13T13:10:47.115Z'
};


export const message1 = {
    _id: '22',
    author: user1,
    body: 'Another message from user1',
    createdAt: '2019-12-13T13:09:13.115Z' 
};

export const message2 = {
    _id: '23',
    author: user2,
    body: 'Another message from user2',
    createdAt: '2019-12-13T13:09:42.115Z'
};