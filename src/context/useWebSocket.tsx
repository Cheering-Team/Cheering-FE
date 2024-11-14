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
  children: ReactNode; // children 타입 명시적으로 정의
};

const WebSocketContext = createContext<WebSocketContextType>(null);

export const WebSocketProvider = ({children}: WebSocketProviderProps) => {
  const stompClient = useRef<Client | null>(null);

  const activateWebSocket = () => {
    if (!stompClient.current) {
      const socket = new SockJS('http://192.168.0.28:8080/ws');

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
