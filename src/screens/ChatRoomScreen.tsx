import React from 'react';

const ChatRoomScreen = () => {
  React.useEffect(() => {
    const newSocket = new WebSocket('');

    console.log('hello');

    newSocket.onopen = () => {
      console.log('open!');
    };
  }, []);
  return <></>;
};

export default ChatRoomScreen;
