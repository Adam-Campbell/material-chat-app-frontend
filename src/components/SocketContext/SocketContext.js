import React, { useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const SocketContext = React.createContext();

export const SocketContextProvider = ({ children }) => {

    const socketRef = useRef(null);

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

    const disconnect = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.disconnect();
        socketRef.current = null;
    }, []);

    const emit = useCallback((evtName, ...args) => {
        if (!socketRef.current) {
            return;
        }
        socketRef.current.emit(evtName, ...args);
    }, []);

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