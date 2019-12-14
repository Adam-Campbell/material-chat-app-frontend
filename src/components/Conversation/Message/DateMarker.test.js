import React from 'react';
import DateMarker from './DateMarker';
import { render } from '@testing-library/react';

it("renders the date when createdAt and previousCreatedAt resolve to different dates", () => {
    const createdAt = '2019-07-03T20:38:10.893Z';
    const previousCreatedAt = '2019-07-02T20:38:10.893Z';
    const { getByText, getByTestId } = render(<DateMarker 
        createdAt={createdAt}
        previousCreatedAt={previousCreatedAt}
    />);
    expect(getByText('03/07/2019')).toBeInTheDocument();
    expect(getByTestId('date-marker-container')).toBeInTheDocument();
});

it('renders nothing if createdAt and previousCreated resolve to the same date', () => {
    const createdAt = '2019-07-03T20:38:10.893Z';
    const previousCreatedAt = '2019-07-03T16:42:18.893Z';
    const { queryByTestId } = render(<DateMarker 
        createdAt={createdAt}
        previousCreatedAt={previousCreatedAt}
    />);
    expect(queryByTestId('date-marker-container')).not.toBeInTheDocument();
});
