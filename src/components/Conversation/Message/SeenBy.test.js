import React from 'react';
import SeenBy from './SeenBy';
import { render } from '@testing-library/react';

it('renders the seen-by information when appropriate', () => {
    const { getByText } = render(<SeenBy 
        participantsLastViewed={[
            {
                _id: '10',
                lastViewed: '2019-07-03T20:38:10.893Z',
                user: { _id: '0', username: 'user1' }
            },
            {
                _id: '11',
                lastViewed: '2019-07-03T20:38:10.893Z',
                user: { _id: '1', username: 'user2' }      
            }
        ]}
        currentUserId="0"
        createdAt="2019-07-03T20:38:10.893Z"
        isOwnMessage={false}
    />);
    expect(getByText('Seen')).toBeInTheDocument();
});

it('renders the placeholder element when there is no seen-by information to display', () => {
    const { getByTestId } = render(<SeenBy 
        participantsLastViewed={[
            {
                _id: '10',
                lastViewed: '2019-07-03T20:38:10.893Z',
                user: { _id: '0', username: 'user1' }
            },
            {
                _id: '11',
                lastViewed: '2019-07-03T20:35:10.893Z',
                user: { _id: '1', username: 'user2' }      
            }
        ]}
        currentUserId="0"
        createdAt="2019-07-03T20:38:10.893Z"
        isOwnMessage={false}
    />);
    expect(getByTestId('seenby-placeholder-element')).toBeInTheDocument();
});
