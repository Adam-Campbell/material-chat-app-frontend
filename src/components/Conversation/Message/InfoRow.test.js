import React from 'react';
import InfoRow from './InfoRow';
import { render } from '@testing-library/react';

it('displays the username given', () => {
    const { getByText } = render(<InfoRow 
        username="joe bloggs"
        createdAt="2019-07-03T20:38:10.893Z"
        isOwnMessage={false}
    />);
    expect(getByText('joe bloggs')).toBeInTheDocument();
});

it('derives a time from the createdAt prop and displays that time', () => {
    const { getByText } = render(<InfoRow 
        username="joe bloggs"
        createdAt="2019-07-03T20:38:10.893Z"
        isOwnMessage={false}
    />);
    expect(getByText('20:38')).toBeInTheDocument();
});