import React, { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Session memory
  const [sessionMemory, setSessionMemory] = useState({
    budget: null,
    preferredCategory: null,
    preferredBrands: [],
    recentSearches: [],
    viewedProducts: [],
  });

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, { ...message, id: Date.now() + Math.random(), timestamp: new Date() }]);
  }, []);

  const addToHistory = useCallback((role, content) => {
    setConversationHistory((prev) => [...prev, { role, content }]);
  }, []);

  const updateSessionMemory = useCallback((updates) => {
    setSessionMemory((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationHistory([]);
    setSessionMemory({
      budget: null,
      preferredCategory: null,
      preferredBrands: [],
      recentSearches: [],
      viewedProducts: [],
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        conversationHistory,
        sessionMemory,
        setIsLoading,
        toggleChat,
        openChat,
        closeChat,
        addMessage,
        addToHistory,
        updateSessionMemory,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
