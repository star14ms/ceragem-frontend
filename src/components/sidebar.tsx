"use client";
import { useRef, useState } from 'react';
import { Box, Text, Link, useColorModeValue, Image, Button, Slide, VStack, HStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import SettingsModal from './settingsModal';
import SvgComponent from './SVG';

type NavItemProps = {
  title: string;
  path: string;
};

const NavItem: React.FC<NavItemProps> = ({ title, path }) => {
  const pathname = usePathname();
  const isActive = pathname === path;
  const bg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box w="full" _hover={{ bg: 'gray.700' }}>
      <NextLink href={path} passHref>
        <Box
          px={4}
          py={2}
          rounded={'md'}
          bg={isActive ? bg : undefined}
        >
          <Text textColor={isActive ? 'black' : "gray.200"} borderColor="white" w="full">{title}</Text>
        </Box>
      </NextLink>
    </Box>
  );
};


const Navigation = ({ isOpen, toggleSidebar }: any) => {
  const sidebarRef = useRef();

  return (
    <Box>
      <Button position="absolute" top="12px" left="12px" onClick={toggleSidebar}>
        <SvgComponent />
      </Button>

      <Slide direction="left" in={isOpen} style={{ zIndex: 10 }}>
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
                <SvgComponent />
              </Button>
            </HStack>

            <NavItem title="Home" path="/" />
            <NavItem title="About" path="/about" />
          </VStack>
        </Box>
      </Slide>
    </Box>
  );
};

export default Navigation;
