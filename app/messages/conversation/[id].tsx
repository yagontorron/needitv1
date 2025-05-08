import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, SafeAreaView, 
  Image, Keyboard, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMessages } from '@/contexts/MessagesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNeeds } from '@/contexts/NeedsContext';
import { StatusBar } from 'expo-status-bar';
import { AppTheme } from '@/constants/theme';
import { Send, ArrowLeft, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Message } from '@/types';

// Mock users for demo purposes
const mockUsers = {
  '1': {
    id: '1',
    displayName: 'John Doe',
    photoURL: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  '2': {
    id: '2',
    displayName: 'Alice Smith',
    photoURL: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  '3': {
    id: '3',
    displayName: 'Bob Johnson',
    photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  '4': {
    id: '4',
    displayName: 'Emma Wilson',
    photoURL: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  '5': {
    id: '5',
    displayName: 'David Brown',
    photoURL: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
};

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { conversations, messages, sendMessage, getMessagesForConversation, markConversationAsRead } = useMessages();
  const { needs } = useNeeds();
  
  const [conversation, setConversation] = useState(
    conversations.find(conv => conv.id === id)
  );
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [need, setNeed] = useState(null);
  
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    loadData();
    
    // Mark conversation as read when opened
    if (conversation) {
      markConversationAsRead(conversation.id);
    }
  }, [id]);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get conversation
      const conv = conversations.find(c => c.id === id);
      setConversation(conv);
      
      if (conv) {
        // Get messages
        const msgs = await getMessagesForConversation(conv.id);
        setMessagesList(msgs);
        
        // Get other user
        if (user) {
          const otherUserId = conv.members.find(memberId => memberId !== user.id);
          setOtherUser(mockUsers[otherUserId]);
        }
        
        // Get need
        const needData = needs.find(n => n.id === conv.needId);
        setNeed(needData);
      }
    } catch (error) {
      console.error('Error loading conversation data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSend = async () => {
    if (!newMessage.trim() || !user || !conversation) return;
    
    try {
      setIsSending(true);
      await sendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
      
      // Refresh messages
      const updatedMessages = await getMessagesForConversation(conversation.id);
      setMessagesList(updatedMessages);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const isNewDay = (index: number) => {
    if (index === 0) return true;
    
    const currentMessageDate = new Date(messagesList[index].createdAt).setHours(0, 0, 0, 0);
    const previousMessageDate = new Date(messagesList[index - 1].createdAt).setHours(0, 0, 0, 0);
    
    return currentMessageDate !== previousMessageDate;
  };
  
  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.senderId === user?.id;
    const showDateHeader = isNewDay(index);
    
    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeaderContainer}>
            <Text style={styles.dateHeaderText}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageRow,
          isCurrentUser ? styles.currentUserMessageRow : styles.otherUserMessageRow
        ]}>
          {!isCurrentUser && (
            <Image
              source={{ uri: otherUser?.photoURL }}
              style={styles.avatar}
            />
          )}
          
          <View style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
          ]}>
            <Text style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserMessageText : styles.otherUserMessageText
            ]}>
              {item.text}
            </Text>
            <Text style={[
              styles.messageTime,
              isCurrentUser ? styles.currentUserMessageTime : styles.otherUserMessageTime
            ]}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </>
    );
  };
  
  if (!conversation || isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={AppTheme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          {otherUser && (
            <Image source={{ uri: otherUser.photoURL }} style={styles.headerAvatar} />
          )}
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{otherUser?.displayName}</Text>
            {need && (
              <Text style={styles.headerNeed} numberOfLines={1}>
                Re: {need.title}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={24} color={AppTheme.colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Messages list */}
      <KeyboardAvoidingView
        style={styles.messageContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messagesList}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          initialNumToRender={15}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        
        {/* Input area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={AppTheme.colors.textLight}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newMessage.trim() || isSending) && styles.disabledSendButton
            ]}
            onPress={handleSend}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
  },
  headerNeed: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
  },
  menuButton: {
    padding: 4,
  },
  messageContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.textLight,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  currentUserMessageRow: {
    justifyContent: 'flex-end',
  },
  otherUserMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  currentUserBubble: {
    backgroundColor: AppTheme.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: AppTheme.colors.background,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  currentUserMessageText: {
    color: 'white',
  },
  otherUserMessageText: {
    color: AppTheme.colors.text,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    alignSelf: 'flex-end',
  },
  currentUserMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherUserMessageTime: {
    color: AppTheme.colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: AppTheme.colors.border,
  },
});