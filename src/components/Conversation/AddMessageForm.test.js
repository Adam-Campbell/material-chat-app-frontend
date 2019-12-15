import React from 'react';
import AddMessageForm from './AddMessageForm';
import { render, fireEvent } from '@testing-library/react';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';

const mockedSocketContextValue = {
    emit: jest.fn()
};

it('is disabled when the text field is empty', () => {
    const { getByTestId } = render(
        <SocketContext.Provider value={mockedSocketContextValue}>
            <AddMessageForm 
                conversationId="0"
                addOptimisticMessagePlaceholder={() => {}}
            />
        </SocketContext.Provider>
    );
    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeDisabled();
});

it('updates the text field correctly', () => {
    const { container } = render(
        <SocketContext.Provider value={mockedSocketContextValue}>
            <AddMessageForm 
                conversationId="0"
                addOptimisticMessagePlaceholder={() => {}}
            />
        </SocketContext.Provider>
    );
    const textField = container.querySelector('input');
    fireEvent.change(textField, { target: { value: 'An updated message' } });
    expect(textField).toHaveValue('An updated message');
});

it('performs the appropriate actions when the form is submitted', () => {
    const mockedAddOptimisticMessagePlaceholder = jest.fn();
    const { container, getByTestId } = render(
        <SocketContext.Provider value={mockedSocketContextValue}>
            <AddMessageForm 
                conversationId="0"
                addOptimisticMessagePlaceholder={mockedAddOptimisticMessagePlaceholder}
            />
        </SocketContext.Provider>
    );
    const textField = container.querySelector('input');
    const submitButton = getByTestId('submit-button');
    fireEvent.change(textField, { target: { value: 'An updated message' } });
    fireEvent.click(submitButton);
    expect(mockedAddOptimisticMessagePlaceholder).toHaveBeenCalledWith('An updated message');
    expect(mockedSocketContextValue.emit).toHaveBeenCalledWith(
        socketActions.sendMessage,
        { conversationId: '0', messageText: 'An updated message' } 
    );
    expect(textField.value).toBe('');
});