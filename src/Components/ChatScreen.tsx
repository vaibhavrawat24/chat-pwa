// src/components/ChatScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Text, Image, VStack, HStack, Input, Button, InputGroup, InputLeftElement, InputRightElement, Menu, MenuButton, MenuList, MenuItem, IconButton, Icon, Divider,
} from '@chakra-ui/react';
import { FiMoreVertical, FiArrowLeft,FiUser, FiSend, FiPaperclip  } from 'react-icons/fi';
import axios from 'axios';

interface Chat {
  id: string;
  message: string;
  sender: {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
  };
  time: string;
}

const ChatScreen: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [page, setPage] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [tripDetails, setTripDetails] = useState({ name: '', from: '', to: '' });
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats(page);
  }, [page]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const fetchChats = async (pageNumber: number) => {
    try {
      const response = await axios.get(`https://qa.corider.in/assignment/chat?page=${pageNumber}`);
      const { chats, from, to, name } = response.data;
      setChats(prevChats => [...prevChats, ...chats]);
      setTripDetails({ from, to, name });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleSendMessage = () => {
    // Handle send message logic here
    console.log(newMessage);
    setNewMessage('');
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <VStack spacing={4} align="stretch" width="100%" maxWidth="480px" mx="auto" p={4}>
      {/* Header with back button and trip details */}
      <HStack width="100%" justifyContent="space-between" alignItems="center">
  <HStack alignItems="center" spacing={2}>
    <IconButton icon={<FiArrowLeft />} aria-label="Back" variant="ghost" />
    <Text fontWeight="bold">{tripDetails.name}</Text>
  </HStack>
 
</HStack>

      <HStack width="100%" justifyContent="space-between">
        <HStack>
          <Image src="https://fastly.picsum.photos/id/1/40/40.jpg?hmac=3tN1kZ3b6aOr3v5DP4idcJ7jaEGRKgVZfV-wIqPBq2U" alt="Trip" boxSize="40px" borderRadius="full" />
          <VStack align="start" spacing={0}>
            <Text fontSize="sm">From {tripDetails.from}</Text>
            <Text fontSize="sm">To {tripDetails.to}</Text>
          </VStack>
        </HStack>
        <Menu>
          <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
          <MenuList>
            <MenuItem>Members</MenuItem>
            <MenuItem>Share Number</MenuItem>
            <MenuItem>Report</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <Divider />

      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        boxShadow="lg"
        bg="white"
        height="70vh"
        overflowY="auto"
      >
        {chats.map(chat => (
          <VStack key={chat.id} align={chat.sender.self ? 'flex-end' : 'flex-start'} spacing={1} mb={4}>
            <HStack align="start" spacing={4} width="100%">
              {!chat.sender.self && (
                <Image src={chat.sender.image} alt="User" boxSize="40px" borderRadius="full" />
              )}
              <VStack align={chat.sender.self ? 'end' : 'start'} spacing={1} width="80%">
                <Box
                  bg={chat.sender.self ? 'blue.100' : 'gray.100'}
                  p={3}
                  borderRadius="lg"
                  width="100%"
                >
                  <Text dangerouslySetInnerHTML={{ __html: chat.message }} />
                </Box>
                <Text fontSize="xs" color="gray.500">{new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </VStack>
              {chat.sender.self && (
                <Image src={chat.sender.image} alt="User" boxSize="40px" borderRadius="full" />
              )}
            </HStack>
          </VStack>
        ))}
        <div ref={messageEndRef} />
      </Box>
      <Box
  position="sticky"
  bottom="0"
  width="100%"
  zIndex="sticky"
  bg="white"
  p={4}
  boxShadow="lg"
>
  <InputGroup>
    <InputLeftElement>
      <IconButton
        icon={<FiPaperclip />}
        aria-label="Attach"
        variant="ghost"
        onClick={() => { /* Handle attachment logic here */ }}
      />
    </InputLeftElement>
    <Input
      placeholder="Type a message..."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
    />
    <InputRightElement width="4.5rem">
      <IconButton
        icon={<FiSend />}
        aria-label="Send"
        onClick={handleSendMessage}
      />
    </InputRightElement>
  </InputGroup>
</Box>
    </VStack>
  );
};

export default ChatScreen;
