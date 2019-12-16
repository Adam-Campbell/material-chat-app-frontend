import React from 'react';
import SignInForm from './SignInForm';
import { render, fireEvent, act } from '@testing-library/react';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import { MemoryRouter } from 'react-router-dom';
import * as ApiModule from '../../Api';

jest.mock('../../Api', () => ({
    signIn: jest.fn(async (username, password) => {
        const usernameException = {
            response: {
                data: {
                    error: 'User not found'
                }
            }
        };
        const passwordException = {
            response: {
                data: {
                    error: 'Incorrect password'
                }
            }
        };
        if (username === 'joe bloggs' && password === 'secret') {
            return {
                data: {
                    socketToken: 'placeholderSocketToken',
                    user: { username: 'joe bloggs', _id: '0' }
                }
            }
        } else if (username === 'joe bloggs') {
            throw passwordException;
        } else if (password === 'secret') {
            throw usernameException;
        }
    })
}))

it('is disabled initially', () => {
    const { getByTestId } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    expect(getByTestId('submit-button')).toBeDisabled();
});


it('updates the username field correctly', async () => {
    const { container, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'joe bloggs' } });
    });
    expect(usernameInput).toHaveValue('joe bloggs');
});

it('renders an appropriate error message when the username field becomes empty after having been touched', 
async () => {
    const { container, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    expect(queryByText('Username required')).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'joe bloggs' } });
    });
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: '' } });
    });
    expect(queryByText('Username required')).toBeInTheDocument();
});

it('updates the password field correctly', async () => {
    const { container, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const passwordInput = container.querySelector('input[name="password"]');
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    expect(passwordInput).toHaveValue('secret');
});

it('renders an appropriate error message when the password field becomes empty after having been touched', 
async () => {
    const { container, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const passwordInput = container.querySelector('input[name="password"]');
    expect(queryByText('Password required')).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: '' } });
    });
    expect(queryByText('Password required')).toBeInTheDocument();
});

it('attempts to sign in upon successful form submission', async () => {
    const { container, getByTestId } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = getByTestId('submit-button');
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'joe bloggs' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(ApiModule.signIn).toHaveBeenCalledWith('joe bloggs', 'secret');
});

it('performs the correct actions if the sign in is successful', async () => {

    const mockedConnect = jest.fn((socketToken, cb) => {
        cb();
    });
    const mockedStoreUser = jest.fn();

    const { container, getByTestId } = render(
        <SocketContext.Provider value={{ connect: mockedConnect }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: mockedStoreUser }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = getByTestId('submit-button');
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'joe bloggs' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(mockedConnect).toHaveBeenCalled();
    expect(mockedStoreUser).toHaveBeenCalledWith('joe bloggs', '0');
});

it('sets the appropriate error if the username was incorrect when attempting sign in', async () => {
    const { container, getByTestId, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = getByTestId('submit-button');
    expect(queryByText('User not found')).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'john smith' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(queryByText('User not found')).toBeInTheDocument();
});

it('sets the appropriate error if the password was incorrect when attempting sign in', async () => {
    const { container, getByTestId, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-in']} initialIndex={0}>
                    <SignInForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = getByTestId('submit-button');
    expect(queryByText('Incorrect password')).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'joe bloggs' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'notcorrect' } });
    });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(queryByText('Incorrect password')).toBeInTheDocument();
});
