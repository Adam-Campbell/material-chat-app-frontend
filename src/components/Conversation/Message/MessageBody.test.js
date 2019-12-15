import React from 'react';
import MessageBody from './MessageBody';
import { render } from '@testing-library/react';

it('renders the message body passed to it', () => {
    const { getByText } = render(<MessageBody 
        body="the body of a message"
        isOwnMessage={false}
    />);
    expect(getByText('the body of a message')).toBeInTheDocument();
});
