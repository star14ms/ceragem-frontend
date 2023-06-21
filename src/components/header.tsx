"use client";
import { useSession, signOut } from 'next-auth/react';
import { Flex, Link, Spacer, Button, Text } from '@chakra-ui/react';
import SvgComponent from './SVG';

// import Image from 'next/image';


export default function Header({ toggleSidebar }: any) {
  const { data: session } = useSession();

  return (
    <Flex style={{ zIndex: 1000 }} as="nav" p={3} align="center" boxShadow="base">
      <Button onClick={toggleSidebar}>
        <SvgComponent />
      </Button>
      
      {/* <Link href="/" display="flex" alignItems="center">
        <Image src="/icons/pinata.png" alt="Pinata" width={32} height={32} />
        <Text ml={2} fontWeight="bold">
        Ceragem
        </Text>
      </Link> */}

      <Spacer />

      <Flex align="center">
        {session && (
          <Button ml={4} onClick={() => signOut()}>
            Logout
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
