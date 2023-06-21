import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import ReactChatBot, { MessageData, MessageDataOption } from 'react-chat-bot';
import ReactChatBot, { MessageData, MessageDataOption } from '@/../react-chat-bot/src/react-chat-bot';
import { useSession } from 'next-auth/react';
import { useAxios } from '@/lib/api'

import { useDispatch, useSelector } from "react-redux";
import { setIsOpen, addMessageData, clearMessageData } from "@/store/slices/botSlice";
import { selectBotisOpen, selectBotMessageData, selectActiveBotId, selectBotConfig } from "@/store/slices/botSlice";
import styles from './chatbot.module.scss';


type Props = {
  style?: React.CSSProperties;
  isOpen?: boolean;
  isDropMenu?: boolean;
  startMessageDelay?: number;
  scenario?: MessageData[][];
  questionId?: string | null;
  clearButton?: boolean;
  storeMessage?: boolean;
  ratingEnable?: boolean;
  onChange?: (emit: string, value: any) => void;
};

const ChatBot: React.FC<Props> = ({
  style = {},
  isOpen = false,
  isDropMenu = true,
  startMessageDelay = 0,
  scenario = [],
  clearButton = false,
  storeMessage = false,
  ratingEnable = false,
  onChange = () => {},
}) => {
  const { data: session }: any = useSession()
  const axios = useAxios(session?.accessToken);
  const router = useRouter();
  const isMountedRef = useRef(false);

  const [messageData, setMessageData] = useState<Array<MessageData>>([]);
  const [botTyping, setBotTyping] = useState(false);
  const [inputDisable, setInputDisable] = useState<boolean>(scenario.length === 0 ? false : true);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const dispatch = useDispatch();
  const isOpenRedux = useSelector(selectBotisOpen);
  const messageDataRedux = useSelector(selectBotMessageData);
  const chatbot_id = useSelector(selectActiveBotId);
  const config = useSelector(selectBotConfig);

  let messageSound: HTMLAudioElement | null

  const botOptions = {
    botTitle: 'Glide',
    colorScheme: '#fff',
    textColor: '#000',
    bubbleBtnSize: 60,
    boardContentBg: isDropMenu ? '#F9FAFB' : '#F3F4F6',
    botAvatarSize: 40,
    botAvatarImg: '/icons/pinata.png',
    userAvatarSize: 40,
    userAvatarImg: '/icons/user.svg',
    msgBubbleBgBot: '#fff',
    msgBubbleBgUser: '#EFF6FF',
    msgBubbleColorUser: '#000',
    inputPlaceholder: 'Send Message',
    inputDisableBg: '#fff',
    inputDisablePlaceholder: 'Hit the buttons above to respond',
    iconSendSrc: '/icons/send-white.svg',
    iconBubbleSrc: '/icons/bubble.svg',
    iconCloseSrc: '/icons/close.svg',
    iconCloseHeaderSrc: '/icons/arrow-down-invert.svg',
    messageSoundOption: {
      src: '/audios/bubble.mp3',
      volume: 0.7,
    },
  };

  // Message Sound Loading
  useEffect(() => {
    if (botOptions.messageSoundOption.src) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      messageSound = new Audio(botOptions.messageSoundOption.src)
      messageSound.volume = botOptions.messageSoundOption.volume
    }
    
    return () => {
      if (messageSound) {
        messageSound.pause()
        messageSound = null
      }
    }
  }, [])

  // Mounted Check
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Scenario Start
  useEffect(() => {
    if (isMountedRef.current) {
      startScenario();
    }
  }, [scenario]);

  const startScenario = () => {
    if (scenario.length > 0) {
      setTimeout(() => {
        nextScenario(true);
      }, startMessageDelay);
    }
  };

  const nextScenario = (init: boolean = false) => {
    let _scenarioIndex = scenarioIndex;

    if (init) {
      setScenarioIndex(0);
      _scenarioIndex = 0;
    }

    if (_scenarioIndex > scenario.length - 1) {
      console.log('다음 시나리오가 없습니다.');
      return;
    }

    for (let i = 0; i < scenario[_scenarioIndex].length; i++) {
      setBotTyping(true);

      setTimeout(() => {
        const message = scenario[_scenarioIndex][i];
        updateMessageData(message);

        if (isOpen) {
          messageSound?.play();
        }
        setInputDisable(message.disableInput ?? false);

        if (i === scenario[_scenarioIndex].length - 1) {
          if (!message.botTyping) {
            setBotTyping(false);
          }
          setScenarioIndex((prevIndex) => prevIndex + 1);
        }
      }, (i + 1) * 1500);
    }
  };

  const msgSend = (data: MessageDataOption) => {
    if (data.action === 'url') {
      return router.push(data.value);
    } else if (data.emit !== undefined) {
      onChange(data.emit, { key: data.emit.slice(data.emit.indexOf(':')+1), value: data.value})
    }

    const text = data.value !== 'Give me more hints' ? data.text : 'Give me more hints';

    // Push the user's message to board
    const message: MessageData = {
      agent: 'user',
      type: 'text',
      text: text,
    };

    updateMessageData(message);

    if (scenarioIndex <= scenario.length - 1) {
      nextScenario();
    } else {
      getResponse(text);
    }
  };

  const msgClear = () => {
    if (storeMessage) {
      dispatch(clearMessageData({}))
    } else {
      setMessageData([]);
    }
    startScenario();
  };

  const updateMessageData = (replyMessage: MessageData) => {
    if (storeMessage) {
      dispatch(addMessageData(replyMessage));
    } else {
      setMessageData((prevData) => [...prevData, replyMessage]);
    }
  };

  const changeOpenState = (isOpen: boolean) => {
    dispatch(setIsOpen(isOpen));
  };

  const getResponse = (text: any) => {
    // Loading
    setBotTyping(true);

    // const urls = ['https://fastcampus.co.kr/data_online_dpnlp', 'https://fastcampus.co.kr/data_online_dpnlg']

    // getMetadataAll(urls).then((metaDataList) => {
    //   updateMessageData({
    //     agent: 'bot',
    //     type: 'url',
    //     metaDataList,
    //     urlText: '강의 바로가기'
    //   })

    //   setBotTyping(false);
    // })

    // return

    console.log({ text })
    axios.post(`/chatbots/${chatbot_id}/chat/${config.language}`, { text }, {
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`
      }
    })
      .then(({ data }) => {
        console.log(data)
        switch (data.intend) {
          default:
            const replyMessage = buildReplyMessage(data);

            if (replyMessage) {
              updateMessageData(replyMessage);
              messageSound?.play();
            }
        }
        // finish
        setBotTyping(false);
      });
  };
  
  // const getMetadataAll = async (urls: string[]) => {
  //   return Promise.all(urls?.map((url) => getMetadata(url)));
  // }

  // const getMetadata = async (url: string) => {
  //   // Fetch the HTML from the URL
  //   const response = await fetch(url);
  //   const html = await response.text();
  
  //   // Parse the HTML into a document
  //   const doc = new DOMParser().parseFromString(html, 'text/html');
  
  //   // Extract the metadata
  //   const metadata = {
  //     url: url,
  //     title: doc.querySelector('title')?.innerText ?? '',
  //     description: doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
  //     image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
  //     // ...extract other metadata as needed...
  //   };
  
  //   return metadata;
  // }

  const buildReplyMessage = (data: any) => {
    return {
      type: 'button',
      agent: 'bot',
      text: data.text,
    };
  }

  return (
    <div
      id="chatbot" 
      style={style}
      className={`${styles.chatbot} ${!isDropMenu && "not-drop-menu"} ${isOpenRedux && "is-open"}`}
    >
      <ReactChatBot
        options={botOptions}
        messages={storeMessage ? messageDataRedux : messageData}
        botTyping={botTyping}
        inputDisable={inputDisable || botTyping}
        isOpen={isOpen}
        clearButton={clearButton}
        ratingEnable={ratingEnable}
        onMsgSend={msgSend}
        onMsgClear={msgClear}
        onOpen={() => changeOpenState(true)}
        onDestroy={() => changeOpenState(false)}
        header={
          <div slot="header" className="is-flex">
            <Image
              src="/icons/pinata.png"
              width={32}
              height={32}
              alt="pinata"
              priority
            />
            <Image
              src="/icons/title/glide-28.svg"
              width={48}
              height={16}
              alt="glide"
              priority
              className="ml-3"
            />
          </div>
        }
      />
    </div>
  );
};

export default ChatBot;