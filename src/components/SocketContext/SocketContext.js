import React, { useRef, useCallback } from 'react';
import io from 'socket.io-client';

// should expose a socket property that is either the current socketio socket, or null if
// there  
// should expose a connect property that

/*

socket - either the current socketio socket, or null if there is no current socket. 
connect() - create a new socket and connect it.
disconnect() - disconnect the current socket. 




*/

export const SocketContext = React.createContext();

export const SocketContextProvider = ({ children }) => {

    const socketRef = useRef(null);

    const connect = useCallback((token, cb) => {
        if (socketRef.current) return;

        const socket = io.connect('http://localhost:5000');
        socket.on('connect', () => {
            socket.emit('authenticate', { token })
            .on('authenticated', () => {
                //console.log('Client is authenticated!');
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
        //console.log('emit was called');
        if (!socketRef.current) {
            //console.log('there was no socket ref')
            return;
        }
        //console.log('there was a socket ref');
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