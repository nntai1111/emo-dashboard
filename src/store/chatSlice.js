import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  groups: [],
  activeConversation: null,
  messages: {},
  onlineUsers: [],
  isTyping: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Conversations
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      const exists = state.conversations.find(
        (conv) => conv.id === action.payload.id
      );
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        (conv) => conv.id !== action.payload
      );
      // Also remove messages for this conversation
      delete state.messages[action.payload];
    },
    hideConversation: (state, action) => {
      const conversation = state.conversations.find(
        (conv) => conv.id === action.payload
      );
      if (conversation) {
        conversation.hidden = true;
      }
    },

    // Groups
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroup: (state, action) => {
      const exists = state.groups.find(
        (group) => group.id === action.payload.id
      );
      if (!exists) {
        state.groups.unshift(action.payload);
      }
    },
    updateGroupStatus: (state, action) => {
      const group = state.groups.find((g) => g.id === action.payload.groupId);
      if (group) {
        group.status = action.payload.status;
      }
    },

    // Active conversation
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },

    // Messages
    setMessages: (state, action) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);

      // Update last message in conversation
      const conversation =
        state.conversations.find((conv) => conv.id === conversationId) ||
        state.groups.find((group) => group.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.timestamp;
      }
    },

    // Online status
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    updateUserOnlineStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      if (isOnline && !state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      } else if (!isOnline) {
        state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      }
    },

    // Typing status
    setUserTyping: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.isTyping[conversationId]) {
        state.isTyping[conversationId] = [];
      }

      if (isTyping && !state.isTyping[conversationId].includes(userId)) {
        state.isTyping[conversationId].push(userId);
      } else if (!isTyping) {
        state.isTyping[conversationId] = state.isTyping[conversationId].filter(
          (id) => id !== userId
        );
      }
    },

    // Loading and error
    setChatLoading: (state, action) => {
      state.loading = action.payload;
    },
    setChatError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConversations,
  addConversation,
  deleteConversation,
  hideConversation,
  setGroups,
  addGroup,
  updateGroupStatus,
  setActiveConversation,
  setMessages,
  addMessage,
  setOnlineUsers,
  updateUserOnlineStatus,
  setUserTyping,
  setChatLoading,
  setChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
