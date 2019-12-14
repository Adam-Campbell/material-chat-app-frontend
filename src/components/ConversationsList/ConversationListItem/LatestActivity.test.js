import React from 'react';
import LatestActivity from './LatestActivity';
import { render } from '@testing-library/react';
import { CurrentUserContext } from '../../CurrentUserContext';

const latestActivity = '2019-07-03T20:38:10.893Z'
const hasViewed = [{
    _id: '10',
    lastViewed: '2019-07-03T20:38:10.893Z',
    user: { _id: '0', username: 'user1' }
}];
const hasNotViewed = [{
    _id: '10',
    lastViewed: '2019-07-03T20:36:10.893Z',
    user: { _id: '0', username: 'user1' }
}];

it('renders a time or date string based on the latestActivity given', () => {
    const { getByText } = render(
        <CurrentUserContext.Provider value={{ currentUserId: '0' }}>
            <LatestActivity 
                participantsLastViewed={hasViewed}
                latestActivity={latestActivity}
            />
        </CurrentUserContext.Provider>
    );
    expect(getByText('03/07/2019')).toBeInTheDocument();
});

it('renders the new messages icon when appropriate', () => {
    const { getByTestId } = render(
        <CurrentUserContext.Provider value={{ currentUserId: '0' }}>
            <LatestActivity 
                participantsLastViewed={hasNotViewed}
                latestActivity={latestActivity}
            />
        </CurrentUserContext.Provider>
    );
    expect(getByTestId('new-messages-icon')).toBeInTheDocument();
});

it('omits the new messages icon when not required', () => {
    const { queryByTestId } = render(
        <CurrentUserContext.Provider value={{ currentUserId: '0' }}>
            <LatestActivity 
                participantsLastViewed={hasViewed}
                latestActivity={latestActivity}
            />
        </CurrentUserContext.Provider>
    );
    expect(queryByTestId('new-messages-icon')).not.toBeInTheDocument();
});