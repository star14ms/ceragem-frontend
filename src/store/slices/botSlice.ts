import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import axios from '@/lib/api'
import { MessageData } from "@/../react-chat-bot/src/shared/types/react-chat-bot";
import { CreateChatbotForm } from "@/shared/types/bot";


export const createChatbot = createAsyncThunk(
  'bot/createChatbot',
  async (payload: CreateChatbotForm, { rejectWithValue }) => {
    // const session: any = await getSession()

    try {
      const response = await axios.post(`/chatbots`, payload, {
        // headers: {
        //   Authorization: `Bearer ${session.accessToken}`
        // }
      });
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
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Type for our state
export interface BotState {
  isOpen: boolean;
  messageData: MessageData[];
  chatbot_id: string | undefined;
}

// Initial state
const initialState: BotState = {
  isOpen: false,
  messageData: [],
  chatbot_id: undefined,
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

    setMessageData(state, action) {
      state.messageData = action.payload
    },
  
    addMessageData(state, action) {
      state.messageData.push(action.payload)
    },
  
    clearMessageData(state) {
      state.messageData = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChatbot.fulfilled, (state, action) => {
      state.chatbot_id = action.payload.chatbot_id;
    });
    builder.addCase(deleteChatbot.fulfilled, (state, action) => {
      state.chatbot_id = undefined;
    });
  },
});

export const { setIsOpen, setMessageData, addMessageData, clearMessageData } = botSlice.actions;

export const selectBotisOpen = (state: AppState) => state.bot.isOpen;
export const selectBotMessageData = (state: AppState) => state.bot.messageData;
export const selectBotId = (state: AppState) => state.bot.chatbot_id;

export default botSlice.reducer;