import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ token, children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (token) {
            const socketConnection = io(import.meta.env.VITE_APP_BACKEND_URL, {
                auth: { token }
            });

            socketConnection.on('connect', () => {
                console.log('Connected to the server');
            });

            socketConnection.on('disconnect', () => {
                console.log('Disconnected from the server');
            });

            socketConnection.on('connect_error', (error) => {
                console.log('Connection Error:', error);
            });

            setSocket(socketConnection);

            return () => {
                socketConnection.disconnect();
            };
        } else {
            setSocket(null);
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

SocketProvider.propTypes = {
    token: PropTypes.string,
    children: PropTypes.node.isRequired,
};
