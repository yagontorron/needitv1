import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Message, Conversation } from '@/types';
import { useAuth } from './AuthContext';
import mockConversations from '@/data/mockConversations';
import mockMessages from '@/data/mockMessages';

interface MessagesContextProps {
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  getMessagesForConversation: (conversationId: string) => Promise<Message[]>;
  getUserConversations: () => Promise<Conversation[]>;
  startConversation: (needId: string, otherUserId: string) => Promise<string>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  getUnreadCount: () => number;
}

const MessagesContext = createContext<MessagesContextProps>({
  conversations: [],
  messages: [],
  isLoading: true,
  sendMessage: async () => {},
  getMessagesForConversation: async () => [],
  getUserConversations: async () => [],
  startConversation: async () => '',
  markConversationAsRead: async () => {},
  getUnreadCount: () => 0,
});

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;

      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConversations(mockConversations);
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error loading messages data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  const sendMessage = async (conversationId: string, text: string) => {
    if (!user) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: user.id,
      text,
      createdAt: Date.now(),
      read: false,
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Update the last message in conversation
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              lastMessage: {
                text,
                createdAt: Date.now(),
                senderId: user.id
              } 
            } 
          : conv
      )
    );
  };

  const getMessagesForConversation = async (conversationId: string): Promise<Message[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return messages.filter(message => message.conversationId === conversationId);
  };

  const getUserConversations = async (): Promise<Conversation[]> => {
    if (!user) return [];

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return conversations.filter(conv => conv.members.includes(user.id));
  };

  const startConversation = async (needId: string, otherUserId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    // Check if conversation already exists
    const existingConv = conversations.find(
      conv => conv.needId === needId && 
      conv.members.includes(user.id) && 
      conv.members.includes(otherUserId)
    );

    if (existingConv) {
      return existingConv.id;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      needId,
      members: [user.id, otherUserId],
      createdAt: Date.now(),
    };
    
    setConversations(prevConversations => [...prevConversations, newConversation]);
    
    return newConversation.id;
  };

  const markConversationAsRead = async (conversationId: string) => {
    if (!user) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.conversationId === conversationId && msg.senderId !== user.id
          ? { ...msg, read: true }
          : msg
      )
    );
  };

  const getUnreadCount = (): number => {
    if (!user) return 0;
    
    // Count unique conversations with unread messages
    const conversationsWithUnread = new Set();
    
    messages.forEach(msg => {
      if (!msg.read && msg.senderId !== user.id) {
        conversationsWithUnread.add(msg.conversationId);
      }
    });
    
    return conversationsWithUnread.size;
  };

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        messages,
        isLoading,
        sendMessage,
        getMessagesForConversation,
        getUserConversations,
        startConversation,
        markConversationAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);