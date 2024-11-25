import {Client} from '@stomp/stompjs';
import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import SockJS from 'sockjs-client';
import config from 'react-native-config';

type WebSocketContextType = {
  stompClient: MutableRefObject<Client | null>;
  activateWebSocket: () => void;
  isConnected: boolean;
} | null;

type WebSocketProviderProps = {
  children: ReactNode;
};

const WebSocketContext = createContext<WebSocketContextType>(null);

export const WebSocketProvider = ({children}: WebSocketProviderProps) => {
  const stompClient = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const activateWebSocket = () => {
    if (!stompClient.current) {
      const socket = new SockJS(`${config.API_URL}/ws`);

      stompClient.current = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setIsConnected(true);
        },
        onDisconnect: () => {
          setIsConnected(false);
        },
      });
      stompClient.current.activate();
    } else if (!stompClient.current.connected) {
      stompClient.current.activate();
    }
  };

  return (
    <WebSocketContext.Provider
      value={{stompClient, activateWebSocket, isConnected}}>
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
