"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ChatBot from '@/components/chatbot';
import { MessageData } from "@/../react-chat-bot/src/shared/types/react-chat-bot";
import { useSession, signOut } from 'next-auth/react'
import { useAxios } from '@/lib/api'

import { useDispatch, useSelector } from "react-redux";
import { selectBotId, clearMessageData, createChatbot, deleteChatbot } from "@/store/slices/botSlice";

import { CSSTransition } from 'react-transition-group';
import styles from './page.module.scss';


export default function Index() {
  const { data: session }: any = useSession()
  const axios = useAxios(session?.accessToken);

  const [transition, setTransition] = useState({
    after_1000: false,
    after_2000: false,
    after_3500: false,
  });
  const [scenario, setScenario] = useState<MessageData[][]>([]);

  const dispatch = useDispatch();
  const chatbot_id = useSelector(selectBotId);

  useEffect(() => {
    setAnimationTimeout();

    if (chatbot_id === undefined) {
      initChatbot();
    }
  }, []);

  async function initChatbot() {
    console.log('create chatbot');
    const { payload } = await dispatch(createChatbot({}));

    const language = 'ko';
    try {
      const res = await axios.post(`/chatbots/${payload.chatbot_id}/chat/${language}`, {
        text: '안녕',
      })

      setScenario([[
        {
          agent: 'user',
          type: 'text',
          text: '안녕! 넌 누구니?',
          disableInput: true,
        },
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

  async function handleInitChatbot() {
    if (chatbot_id === undefined) return
    
    try {
      dispatch(clearMessageData());
      console.log('delete chatbot');
      await dispatch(deleteChatbot(chatbot_id));
      location.reload();
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

  return (
    <div className={`${styles.page} has-background-light2`}>
      <CSSTransition in={transition.after_1000} classNames="slide-y-down" timeout={300} mountOnEnter>
        <div id="title" className={`${styles.title} ${transition.after_2000 ? styles.titleMoved : ''}`}>
          <h1>
            Welcome to Ceragem!
          </h1>
          {/* <h2 className="mt-2"></h2> */}
        </div>
      </CSSTransition>

      <ChatBot
        style={{ display: transition.after_3500 && chatbot_id && scenario ? 'block' : 'none' }}
        isOpen={true}
        isDropMenu={false}
        startMessageDelay={3500}
        scenario={scenario}
        storeMessage={true}
        onChange={handleChatBotEvent}
      />

      <button className={`${styles.clearBtn} button is-danger`} onClick={handleInitChatbot}>Initialize Chatbot</button>
    </div>
  );
};
