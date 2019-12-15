import React from 'react';
import Header from './Header';
import { render, fireEvent, wait } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import * as ApiModule from '../../Api';

jest.mock('../../Api');

it('renders the correct elements when the user is signed in', () => {
    const { queryByTestId } = render(
        <SocketContext.Provider value={{ 
            disconnect: () => {},
            emit: () => {},
            on: () => () => {}
        }}>
            <CurrentUserContext.Provider value={{ isSignedIn: true, clearUser: () => {} }}>
                <MemoryRouter initialEntries={['/conversations']} initialIndex={0}>
                    <Header />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    expect(queryByTestId('open-modal-button')).toBeInTheDocument();
    expect(queryByTestId('sign-out-button')).toBeInTheDocument();
    expect(queryByTestId('sign-in-link')).not.toBeInTheDocument();
    expect(queryByTestId('sign-up-link')).not.toBeInTheDocument();
});

it('renders the correct elements when the user is not signed in', () => {
    const { queryByTestId } = render(
        <SocketContext.Provider value={{ 
            disconnect: () => {},
            emit: () => {},
            on: () => () => {}
        }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, clearUser: () => {} }}>
                <MemoryRouter initialEntries={['/conversations']} initialIndex={0}>
                    <Header />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    expect(queryByTestId('open-modal-button')).not.toBeInTheDocument();
    expect(queryByTestId('sign-out-button')).not.toBeInTheDocument();
    expect(queryByTestId('sign-in-link')).toBeInTheDocument();
    expect(queryByTestId('sign-up-link')).toBeInTheDocument();
});

it('opens the NewConversationModal when the corresponding button is clicked', () => {
    const { queryByTestId } = render(
        <SocketContext.Provider value={{ 
            disconnect: () => {},
            emit: () => {},
            on: () => () => {}
        }}>
            <CurrentUserContext.Provider value={{ isSignedIn: true, clearUser: () => {} }}>
                <MemoryRouter initialEntries={['/conversations']} initialIndex={0}>
                    <Header />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const openModalButton = queryByTestId('open-modal-button');
    expect(queryByTestId('new-conversation-form')).not.toBeInTheDocument();
    fireEvent.click(openModalButton);
    expect(queryByTestId('new-conversation-form')).toBeInTheDocument();
});

it('performs the necessary actions when the user signs out', async () => {
    const mockedDisconnect = jest.fn();
    const mockedClearUser = jest.fn();
    const { getByTestId } = render(
        <SocketContext.Provider value={{ 
            disconnect: mockedDisconnect,
            emit: () => {},
            on: () => () => {}
        }}>
            <CurrentUserContext.Provider value={{ isSignedIn: true, clearUser: mockedClearUser }}>
                <MemoryRouter initialEntries={['/conversations']} initialIndex={0}>
                    <Header />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    fireEvent.click(getByTestId('sign-out-button'));
    await wait()
    expect(ApiModule.signOut).toHaveBeenCalledTimes(1);
    expect(mockedDisconnect).toHaveBeenCalledTimes(1);
    expect(mockedClearUser).toHaveBeenCalledTimes(1);
});
