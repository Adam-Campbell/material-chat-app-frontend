import axios from 'axios';

const a = axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true
});

const post = (url, body) => a.request(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    data: body
});


export const getProfile = () => a.get('me');

export const checkForSession = () => a.get('auth/check-for-session');

export const signIn = (username, password) => {
    return post('auth/sign-in', { username, password });
};

export const signOut = () => a.get('auth/sign-out');

export const signUp = (username, password) => post('auth/sign-up', { username, password });

export const checkUsername = (username) => post('auth/check-username', { username });

export const getUsersConversations = () => a.get('me/conversations');

export const getConversation = (conversationId) => a.get(`conversations/${conversationId}`);

export const postMessage = (conversationId, text) => {
    return post(`conversations/${conversationId}`, { text });
};

export const searchUsers = (query) => a.get('users/search', { params: { query } });

export const postConversation = (userId, messageText) => {
    return post('conversations', { userId, messageText });
};
