import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ChatScreen from './Components/ChatScreen';

function App() {
  return (
    <ChakraProvider>
      <ChatScreen />
    </ChakraProvider>
  );
}

export default App;
