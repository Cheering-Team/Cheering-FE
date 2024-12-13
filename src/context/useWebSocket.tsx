import {Client} from '@stomp/stompjs';
import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import SockJS from 'sockjs-client';
import config from 'react-native-config';
import {AppState} from 'react-native';

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
  const appState = useRef(AppState.currentState);

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

  const deactivateWebScoket = () => {
    if (stompClient.current) {
      stompClient.current?.deactivate();
      stompClient.current = null;
    }
  };

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        activateWebSocket();
      } else {
        deactivateWebScoket();
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

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
