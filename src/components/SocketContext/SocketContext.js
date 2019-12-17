import React, { useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const SocketContext = React.createContext();

export const SocketContextProvider = ({ children }) => {

    const socketRef = useRef(null);

    // Attempts to connect to the socket using the authentication token
    // provided. If successfull the new socket instance is stored in socketRef
    // and the callback function, if provided, is called.
    const connect = useCallback((token, cb) => {
        if (socketRef.current) return;

        const socket = io.connect('http://localhost:5000');
        socket.on('connect', () => {
            socket.emit('authenticate', { token })
            .on('authenticated', () => {
                socketRef.current = socket;
                if (cb) {
                    cb();
                }
            });
        });
    }, []);

    // If there is a socket stored in socketRef, disconnects the socket and sets
    // socketRef to null.
    const disconnect = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.disconnect();
        socketRef.current = null;
    }, []);

    // If there is is a socket stored in socketRef, emits an event from the socket
    // using the event name and arguments provided. 
    const emit = useCallback((evtName, ...args) => {
        if (!socketRef.current) return;
        socketRef.current.emit(evtName, ...args);
    }, []);

    // If there is a socket stored in socketRef then sets up a subscription with the event
    // name and callback function provided. Returns a function to unsubscribe that the 
    // consuming code can call during cleanup etc.
    const on = useCallback((evtName, cb) => {
        if (!socketRef.current) return;
        socketRef.current.on(evtName, cb);
        return () => {
            if (socketRef.current) {
                socketRef.current.off(evtName, cb);
            }
        }
    }, []);

    return (
        <SocketContext.Provider value={{
            connect,
            disconnect,
            emit,
            on
        }}>
            {children}
        </SocketContext.Provider>
    );
}