import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTheme } from '@/constants/theme';
import { Conversation, Need, User } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
  otherUser: User;
  need: Need;
  unread: boolean;
}

export default function ConversationItem({ conversation, otherUser, need, unread }: ConversationItemProps) {
  const router = useRouter();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today: show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const openConversation = () => {
    router.push(`/messages/conversation/${conversation.id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, unread && styles.unreadContainer]} 
      onPress={openConversation}
    >
      <Image 
        source={{ uri: otherUser.photoURL || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
        style={styles.avatar} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {otherUser.displayName}
          </Text>
          {conversation.lastMessage && (
            <Text style={styles.time}>
              {formatTime(conversation.lastMessage.createdAt)}
            </Text>
          )}
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.needTitle} numberOfLines={1}>
            Re: {need.title}
          </Text>
        </View>
        
        {conversation.lastMessage && (
          <Text style={[styles.message, unread && styles.unreadMessage]} numberOfLines={1}>
            {conversation.lastMessage.text}
          </Text>
        )}
      </View>
      
      {unread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  unreadContainer: {
    backgroundColor: AppTheme.colors.primaryLight,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  needTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.primary,
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
  },
  unreadMessage: {
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.text,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppTheme.colors.primary,
    marginLeft: 8,
    alignSelf: 'center',
  },
});