// WebSocketContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';

type WebSocketContextType = WebSocket | null;
const WebSocketContext = createContext<WebSocketContextType>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}
const RECONNECT_DELAY = 3000; // 3 seconds

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocketContextType>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setSocket(null);
        
      };

      return () => {
        if (ws) {
          ws.close();
          setTimeout(connectWebSocket, RECONNECT_DELAY); // Reconnect after delay
        }
      };
    };

    connectWebSocket();
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => useContext(WebSocketContext);
