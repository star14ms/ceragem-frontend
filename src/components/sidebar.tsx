"use client";
import React, { useRef } from 'react';
import { Box, Text, Link, useColorModeValue, Image, Button, Slide, VStack, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'
import { useRouter, usePathname } from 'next/navigation';
import NextLink from 'next/link';
import SettingsModal from './settingsModal';
import { SvgSidebar } from './SVG';

import { useDispatch, useSelector } from "react-redux";
import { selectChats, selectActiveBotId, setActiveBotId, deleteChatbot, createChatbot } from '@/store/slices/botSlice';
import { Chat } from '@/shared/types/bot';

type NavItemProps = {
  path: string;
  chat: Chat;
};

const NavItem: React.FC<NavItemProps> = ({ path, chat }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;
  const bg = useColorModeValue('gray.200', 'gray.700');
  const dispatch = useDispatch();
  const activeBotId = useSelector(selectActiveBotId);
  const chats = useSelector(selectChats);

  const handleClick = () => {
    dispatch(setActiveBotId(chat.chatbot_id));
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isDeleteActieBot = activeBotId === chat.chatbot_id;

    if (isDeleteActieBot && chats.length > 1) {
      const index = chats.findIndex((_chat: Chat) => _chat.chatbot_id == activeBotId);
      const anotherChat = index === 0 ? chats[1] : chats[index - 1];
      dispatch(setActiveBotId(anotherChat.chatbot_id));
      router.push(`?${anotherChat.chatbot_id}`);
    }

    console.log('delete chatbot');
    await dispatch(deleteChatbot(chat.chatbot_id));

    if (isDeleteActieBot && chats.length === 1) {
      console.log('create chatbot');
      const { payload } = await dispatch(createChatbot());
      dispatch(setActiveBotId(payload.chatbot_id))
      location.reload();
    }
  };

  return (
    <Box title={chat.chatbot_id} w="full" _hover={{ bg: 'gray.700' }} onClick={handleClick}>
      <NextLink href={path} passHref>
        <Box
          px={4}
          py={2}
          rounded={'md'}
          bg={isActive ? bg : undefined}
        >
          <HStack textColor={isActive ? 'black' : "gray.200"} justifyContent="space-between">
            <VStack align="start">
              <Text>
                language: {chat.config.language}
              </Text>
              <Text>
                style: {chat.config.style}
              </Text>
              <Text>
                temperature: {chat.config.temperature}
              </Text>
            </VStack>
  
            <Button size="sm" onClick={handleDelete}>
              <DeleteIcon />
            </Button>
          </HStack>
        </Box>
      </NextLink>
    </Box>
  );
};


const Navigation = ({ isOpen, toggleSidebar }: any) => {
  const sidebarRef = useRef();
  const chats = useSelector(selectChats);

  return (
    <Box>
      <Button position="absolute" top="12px" left="12px" onClick={toggleSidebar}>
        <SvgSidebar />
      </Button>

      <Slide direction="left" in={isOpen} style={{ zIndex: 1 }}>
        <Box
          ref={sidebarRef.current}
          p="12px"
          color="white"
          bg="rgba(32, 33, 35, 1)"
          w="260px"
          h="full"
          position="fixed"
        >
          <VStack spacing={4} align="start">
            <HStack justifyContent="space-between">
              <SettingsModal />
              
              <Button colorScheme="blackAlpha" onClick={toggleSidebar}>
                <SvgSidebar />
              </Button>
            </HStack>

            {chats.map((chat: any) => (
              <NavItem key={chat.chatbot_id} path={`?${chat.chatbot_id}`} chat={chat} />
            ))}
          </VStack>
        </Box>
      </Slide>
    </Box>
  );
};

export default Navigation;
