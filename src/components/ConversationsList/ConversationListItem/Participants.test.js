import React from 'react';
import Participants from './Participants';
import { render } from '@testing-library/react';
import { CurrentUserContext } from '../../CurrentUserContext';

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

it('renders the correct initials, primary and secondary text', () => {
    const { getByText } = render(
        <CurrentUserContext.Provider value={{ currentUserId: user1._id }}>
            <Participants 
                participants={[ user1, user2, user3, user4 ]}
            />
        </CurrentUserContext.Provider>
    );
    expect(getByText('JD')).toBeInTheDocument();
    expect(getByText('jane doe, john smith')).toBeInTheDocument();
    expect(getByText('plus 1 more')).toBeInTheDocument();
});