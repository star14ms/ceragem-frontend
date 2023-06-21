import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import axios from '@/lib/api'
import { Chat, ChatbotConfig, ChatbotCreateForm } from "@/shared/types/bot";


export const createChatbot = createAsyncThunk(
  'bot/createChatbot',
  async (config: ChatbotCreateForm, { rejectWithValue }) => {
    // const session: any = await getSession()
    const configData: ChatbotConfig = { ...defaultConfig, ...config }

    try {
      const response = await axios.post(`/chatbots`, configData, {
        // headers: {
        //   Authorization: `Bearer ${session.accessToken}`
        // }
      });
      response.data.config = configData;

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteChatbot = createAsyncThunk(
  'bot/deleteChatbot',
  async (chatbot_id: string, { rejectWithValue }) => {
    // const session: any = await getSession()

    try {
      const response = await axios.delete(`/chatbots/${chatbot_id}`, {
        // headers: {
        //   Authorization: `Bearer ${session.accessToken}`
        // }
      });
      response.data.chatbot_id = chatbot_id;

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Type for our state
export interface BotState {
  isOpen: boolean;
  activeBotId: string | undefined;
  chats: Chat[];
}

export const defaultConfig: {
  language: 'ko',
  style: 'polite',
  temperature: 0.2,
} = {
  language: 'ko',
  style: 'polite',
  temperature: 0.2,
}

// Initial state
const initialState: BotState = {
  isOpen: false,
  activeBotId: undefined,
  chats: [],
};

// Actual Slice
export const botSlice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    // Action to set the authentication status
    setIsOpen(state, action) {
      state.isOpen = action.payload;
    },

    setActiveBotId(state, action) {
      state.activeBotId = action.payload;
    },

    setMessageData(state, action) {
      const chat = state.chats.find((chat) => chat.chatbot_id === state.activeBotId);
      if (chat) {
        chat.messageData = action.payload;
      }
    },
  
    addMessageData(state, action) {
      state.chats.find((chat) => chat.chatbot_id === state.activeBotId)?.messageData.push(action.payload)
    },
  
    clearMessageData(state, action) {
      const chat = state.chats.find((chat) => chat.chatbot_id === state.activeBotId);
      if (chat) {
        chat.messageData = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChatbot.fulfilled, (state, action) => {
      state.chats.push({
        chatbot_id: action.payload.chatbot_id,
        messageData: [],
        config: action.payload.config,
      });
      state.activeBotId = action.payload.chatbot_id;
    });
    builder.addCase(deleteChatbot.fulfilled, (state, action) => {
      state.chats.splice(state.chats.findIndex((chat) => chat.chatbot_id === action.payload.chatbot_id), 1);
    });
  },
});

export const { setIsOpen, setActiveBotId, setMessageData, addMessageData, clearMessageData } = botSlice.actions;

export const selectBotisOpen = (state: AppState) => state.bot.isOpen;
export const selectBotMessageData = (state: AppState) => state.bot.chats.find((chat: Chat) => chat.chatbot_id === state.bot.activeBotId)?.messageData ?? [];
export const selectActiveBotId = (state: AppState) => state.bot.activeBotId;
export const selectBotConfig = (state: AppState) => state.bot.chats.find((chat: Chat) => chat.chatbot_id === state.bot.activeBotId)?.config;
export const selectChats = (state: AppState) => state.bot.chats;
export const selectCurrentChat = (state: AppState) => state.bot.chats.find((chat: Chat) => chat.chatbot_id === state.bot.activeBotId);

export default botSlice.reducer;