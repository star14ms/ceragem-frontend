import { MessageData } from "@/../react-chat-bot/src/shared/types/react-chat-bot";

type Language = 'input' | 'ko' | 'en' | 'es' | 'de' | 'fr';
type Style = 'brief' | 'casual' | 'long' | 'polite';

type Chat = {
  chatbot_id: string;
  messageData: MessageData[];
  config: ChatbotConfig;
}

type ChatbotConfig = {
  language: Language;
  style: Style;
  temperature: number;
};

type ChatbotCreateForm = {
  language?: Language;
  style?: Style;
  temperature?: number;
} | undefined;

export type { Chat, ChatbotConfig, ChatbotCreateForm };