import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
const backend_URL= import.meta.env.VITE_BACKEND_URL
const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);



  const removeNotification = (notificationToRemove: any) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== notificationToRemove)
    );
  };

  useEffect(() => {
    // Connect to the server (replace with your backend URL)
    const socketIo = io(`${backend_URL}`, {
      withCredentials: true, // If you are using cookies for authentication
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 10, // Retry up to 10 times
      reconnectionDelay: 1000, // Start with a 1-second delay
      reconnectionDelayMax: 5000, // Maximum delay between retries
    });

    setSocket(socketIo);

    // Listen for the 'appointmentCanceled' event
    socketIo.on('appointmentCanceled', (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    // Add reconnection event listeners
    socketIo.on('reconnect_attempt', (attempt) => {
      (`Reconnection attempt #${attempt}`);
    });

    socketIo.on('reconnect', () => {
      ('Reconnected successfully');
    });

    socketIo.on('reconnect_failed', () => {
      ('Reconnection failed. No further attempts.');
    });

    // Cleanup on dismount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  return { socket, notifications, removeNotification };
};

export default useSocket;
