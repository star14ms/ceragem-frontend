"use client";
import { useState, useEffect } from 'react';
// import Image from 'next/image';
import ChatBot from '@/components/chatbot';
import Sidebar from '@/components/sidebar';
import { MessageData } from "@/../react-chat-bot/src/shared/types/react-chat-bot";
// import { useSession, signOut } from 'next-auth/react'
import { useAxios } from '@/lib/api'
import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from "react-redux";
import { setActiveBotId, selectActiveBotId, setMessageData, createChatbot, selectBotMessageData, selectCurrentChat } from "@/store/slices/botSlice";

import { CSSTransition } from 'react-transition-group';
import styles from './page.module.scss';
import { Box } from '@chakra-ui/react';


export default function Index() {
  // const { data: session }: any = useSession()
  // const axios = useAxios(session?.accessToken);
  const axios = useAxios();
  const router = useRouter();

  const [transition, setTransition] = useState({
    after_1000: false,
    after_2000: false,
    after_3500: false,
  });
  const [scenario, setScenario] = useState<MessageData[][]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [mainContentMargin, setMainContentMargin] = useState("260px");
  const [mainContentWidth, setMainContentWidth] = useState("calc(100% - 260px)");

  const dispatch = useDispatch();
  const chatbot_id = useSelector(selectActiveBotId);
  const messageDataRedux = useSelector(selectBotMessageData);
  const currentChat = useSelector(selectCurrentChat);
  
  useEffect(() => {
    if (messageDataRedux.length === 0) {
      setAnimationTimeout();
    } else {
      setTransition({ after_1000: true, after_2000: true, after_3500: true });
    }

    if (chatbot_id === undefined) {
      initChatbot();
    } else if (messageDataRedux.length === 0) {
      startChat();
    }
  }, []);

  async function initChatbot() {
    console.log('create chatbot');
    const { payload } = await dispatch(createChatbot());
    dispatch(setActiveBotId(payload.chatbot_id))
    router.push(`/chat/${payload.chatbot_id}`);
  }

  async function startChat() {
    if (currentChat === undefined) return;

    try {
      const initText = '안녕'
      const res = await axios.post(`/chatbots/${currentChat.chatbot_id}/chat/${currentChat.config.language}`, {
        text: initText,
      })

      dispatch(setMessageData([
        {
          agent: 'user',
          type: 'text',
          text: initText,
          disableInput: true,
        },
      ]));

      setScenario([[
        {
          agent: 'bot',
          type: 'text',
          text: res.data.text,
        }
      ]])
    } catch (e) {
      console.log(e);
    }
  }

  function moveTitle() {
    const title = document.querySelector('#title');
    const chatBox = document.querySelector('.qkb-board-content__bubbles');
    if (title === null || chatBox === null || chatBox.parentNode === null) return;
    chatBox.before(title);
    document.documentElement.style.setProperty('--bottop', '0px');
    document.documentElement.style.setProperty('--title-margin-bottom', '40px');
  }

  function setAnimationTimeout() {
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_1000: true }));
    }, 1000);
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_2000: true }));
    }, 2000);
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_3500: true }));
      moveTitle();
    }, 3500);
  }

  function handleChatBotEvent(emit: string, data: any) {
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setMainContentMargin(isOpen ? "0" : "260px"); // toggle the margin of the main content
    setMainContentWidth(isOpen ? "100%" : "calc(100% - 260px)"); // toggle the width of the main content
  };

  return (
    <>
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

    <Box ml={mainContentMargin} w={mainContentWidth} transition="0.2s" className={`${styles.page} has-background-light2`}>
      <CSSTransition in={transition.after_1000} classNames="slide-y-down" timeout={300} mountOnEnter>
        <div id="title" className={`${styles.title} ${transition.after_2000 ? styles.titleMoved : ''}`}>
          <h1>
            Welcome to Ceragem!
          </h1>
          <h2 className="mt-2"></h2>
        </div>
      </CSSTransition>

      <ChatBot
        style={{ display: transition.after_3500 && chatbot_id && scenario ? 'block' : 'none' }}
        isOpen={true}
        isDropMenu={false}
        startMessageDelay={1500}
        scenario={scenario}
        storeMessage={true}
        onChange={handleChatBotEvent}
      />
    </Box>
    </>
  );
};
