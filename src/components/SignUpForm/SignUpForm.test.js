import React from 'react';
import SignUpForm from './SignUpForm';
import { render, fireEvent, act } from '@testing-library/react';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import { MemoryRouter } from 'react-router-dom';
import * as ApiModule from '../../Api';


// Todo: see if mock implementation needs to be updated to mimic the real signUp
jest.mock('../../Api', () => ({
    signUp: jest.fn(async (username, password) => {
        const usernameException = {
            response: {
                data: {
                    error: 'Username is taken'
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
        } else if (username === 'john smith') {
            throw usernameException;
        } 
    })
}));

it('is disabled initially', () => {
    const { getByTestId } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
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
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
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
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
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
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
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
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
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

it('updates the confirmPassword field correctly', async () => {
    const { container, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: 'secret' } });
    });
    expect(confirmPasswordInput).toHaveValue('secret');
});

it('renders an appropriate error message when the confirmPassword field becomes empty after having been touched', 
async () => {
    const { container, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');
    expect(queryByText('Password confirmation required')).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: '' } });
    });
    expect(queryByText('Password confirmation required')).toBeInTheDocument();
});

it(`renders an appropriate error message when the confirmPassword has been touched and does not match 
the password field`, async () => {
    const { container, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: 'secret' } });
    });
    expect(queryByText('Password confirmation does not match password')).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: 'secre' } });
    });
    expect(queryByText('Password confirmation does not match password')).toBeInTheDocument();
});

it('attempts to sign up upon successful form submission', async () => {
    const { container, getByTestId } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');
    const submitButton = getByTestId('submit-button');
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'joe bloggs' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(ApiModule.signUp).toHaveBeenCalledWith('joe bloggs', 'secret');
});

it('performs the correct actions if the sign up is successful', async () => {

    const mockedConnect = jest.fn((socketToken, cb) => {
        cb();
    });
    const mockedStoreUser = jest.fn();

    const { container, getByTestId } = render(
        <SocketContext.Provider value={{ connect: mockedConnect }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: mockedStoreUser }}>
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');
    const submitButton = getByTestId('submit-button');
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'joe bloggs' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(mockedConnect).toHaveBeenCalled();
    expect(mockedStoreUser).toHaveBeenCalledWith('joe bloggs', '0');
});

it('sets the appropriate error if the username was taken when sign up attempted', async () => {
    const { container, getByTestId, queryByText } = render(
        <SocketContext.Provider value={{ connect: () => {} }}>
            <CurrentUserContext.Provider value={{ isSignedIn: false, storeUser: () => {} }}>
                <MemoryRouter initialEntries={['/sign-up']} initialIndex={0}>
                    <SignUpForm />
                </MemoryRouter>
            </CurrentUserContext.Provider>
        </SocketContext.Provider>
    );
    const usernameInput = container.querySelector('input[name="username"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');
    const submitButton = getByTestId('submit-button');
    expect(queryByText('Username is taken')).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'john smith' } });
    });
    await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.change(confirmPasswordInput, { target: { value: 'secret' } });
    });
    await act(async () => {
        fireEvent.click(submitButton);
    });
    expect(queryByText('Username is taken')).toBeInTheDocument();
});