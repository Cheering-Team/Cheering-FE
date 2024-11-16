import {Client} from '@stomp/stompjs';
import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
} from 'react';
import SockJS from 'sockjs-client';

type WebSocketContextType = {
  stompClient: MutableRefObject<Client | null>;
  activateWebSocket: () => void;
} | null;

type WebSocketProviderProps = {
  children: ReactNode;
};

const WebSocketContext = createContext<WebSocketContextType>(null);

export const WebSocketProvider = ({children}: WebSocketProviderProps) => {
  const stompClient = useRef<Client | null>(null);

  const activateWebSocket = () => {
    if (!stompClient.current) {
      const socket = new SockJS('http://15.165.150.47/ws');

      stompClient.current = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });
      stompClient.current.activate();
    } else if (!stompClient.current.connected) {
      stompClient.current.activate();
    }
  };

  return (
    <WebSocketContext.Provider value={{stompClient, activateWebSocket}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return context;
};
