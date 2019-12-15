import React from 'react';
import AlertSnackbar from './AlertSnackbar';
import { render, fireEvent } from '@testing-library/react';

it('renders the message when isOpen is true', () => {
    const { queryByText } = render(<AlertSnackbar 
            message="A placeholder message"
            isOpen={true}
            handleClose={() => {}}
            handleActionClick={() => {}}
    />);
    expect(queryByText('A placeholder message')).toBeInTheDocument();
});

it('does not render the message when isOpen is false', () => {
    const { queryByText } = render(<AlertSnackbar 
        message="A placeholder message"
        isOpen={false}
        handleClose={() => {}}
        handleActionClick={() => {}}
    />);
    expect(queryByText('A placeholder message')).not.toBeInTheDocument();
});

it('calls the handleActionClick function when the action button is clicked', () => {
    const mockedHandleActionClick = jest.fn();
    const { getByTestId } = render(<AlertSnackbar 
        message="A placeholder message"
        isOpen={true}
        handleClose={() => {}}
        handleActionClick={mockedHandleActionClick}
    />);
    const actionButton = getByTestId('snackbar-action-button');
    fireEvent.click(actionButton);
    expect(mockedHandleActionClick).toHaveBeenCalledTimes(1);
});