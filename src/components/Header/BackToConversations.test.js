import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BackToConversations from './BackToConversations';
import { render } from '@testing-library/react';

it('renders a link if the current route passes the regex test', () => {
    const { getByTestId } = render(
        <MemoryRouter
            initialEntries={['/conversation/123foo']}
            initialIndex={0}
        >
            <BackToConversations />
        </MemoryRouter>
    );
    expect(getByTestId('back-to-conversations-link')).toBeInTheDocument();
});

it('renders nothing if the current route does not pass the regex test', () => {
    const { queryByTestId } = render(
        <MemoryRouter
            initialEntries={['/other-route']}
            initialIndex={0}
        >
            <BackToConversations />
        </MemoryRouter>
    );
    expect(queryByTestId('back-to-conversations-link')).not.toBeInTheDocument();
});

