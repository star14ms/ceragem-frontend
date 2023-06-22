'use client';
import { PropsWithChildren } from "react";
import { SessionProvider } from 'next-auth/react';
import { usePathname } from "next/navigation";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/store/store";

import { ReactNode, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';


type LayoutProps = {
  children: ReactNode;
};

function InnerLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const backgroundClassName =
    // pathname.includes('login') ? '' : 
    pathname === '/_error' ? 'has-background-black' :
    'has-background-light2'

  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    function handleResize() {
      // console.log("resize");
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <ChakraProvider resetCSS={false}>
        <div className={backgroundClassName}>
          {children}
        </div>
      </ChakraProvider>
    </>
  );
}


export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={null}>
        {/* <SessionProvider> */}
          <InnerLayout>
            { children }
          </InnerLayout>
        {/* </SessionProvider> */}
      </PersistGate>
    </Provider>
  );
}
