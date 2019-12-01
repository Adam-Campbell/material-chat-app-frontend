import axios from 'axios';

const a = axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true
});

export const getProfile = async () => {
    try {
        const response = await a.get('me');
        return response.data.user;
    } catch (error) {
        //console.log(error);
        throw new Error(error);
    }
}

export const signUserIn = async (username, password) => {
    try {
        const response = await a.request('auth/sign-in', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: {
                username,
                password
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signUserOut = async (username, password) => {
    try {
        const response = await a.get('auth/sign-out');
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signUserUp = async (username, password) => {
    try {
        const response = await a.request('auth/sign-up', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: {
                username,
                password
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


export const getUsersConversations = async () => {
    try {
        const response = await a.get('me/conversations');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getConversation = async (conversationId) => {
    try {
        const response = await a.get(`conversations/${conversationId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const postMessage = async (conversationId, text) => {
    try {
        const response = await a.request(`conversations/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                text
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}