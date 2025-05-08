import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMessages } from '@/contexts/MessagesContext';
import { useNeeds } from '@/contexts/NeedsContext';
import { useAuth } from '@/contexts/AuthContext';
import ConversationItem from '@/components/messages/ConversationItem';
import { Conversation, Need, User } from '@/types';
import { AppTheme } from '@/constants/theme';

// Mock users for demo purposes
const mockUsers: Record<string, User> = {
  '1': {
    id: '1',
    email: 'user@example.com',
    displayName: 'John Doe',
    photoURL: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: Date.now(),
  },
  '2': {
    id: '2',
    email: 'alice@example.com',
    displayName: 'Alice Smith',
    photoURL: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: Date.now(),
  },
  '3': {
    id: '3',
    email: 'bob@example.com',
    displayName: 'Bob Johnson',
    photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: Date.now(),
  },
  '4': {
    id: '4',
    email: 'emma@example.com',
    displayName: 'Emma Wilson',
    photoURL: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: Date.now(),
  },
  '5': {
    id: '5',
    email: 'david@example.com',
    displayName: 'David Brown',
    photoURL: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: Date.now(),
  },
};

export default function MessagesScreen() {
  const { user } = useAuth();
  const { conversations, messages, getUserConversations, isLoading } = useMessages();
  const { needs } = useNeeds();
  const [userConversations, setUserConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [user, conversations]);

  const loadConversations = async () => {
    if (user) {
      const convs = await getUserConversations();
      setUserConversations(convs);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const getOtherUser = (conversation: Conversation): User => {
    if (!user) return mockUsers['2']; // Fallback

    const otherUserId = conversation.members.find(id => id !== user.id);
    return mockUsers[otherUserId || '2']; // Use the mock user data
  };

  const getNeedFromConversation = (conversation: Conversation): Need => {
    return needs.find(need => need.id === conversation.needId) || needs[0];
  };

  const isUnread = (conversation: Conversation): boolean => {
    if (!user) return false;
    
    return messages.some(
      msg => 
        msg.conversationId === conversation.id && 
        msg.senderId !== user.id && 
        !msg.read
    );
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const otherUser = getOtherUser(item);
    const need = getNeedFromConversation(item);
    const unread = isUnread(item);
    
    return (
      <ConversationItem
        conversation={item}
        otherUser={otherUser}
        need={need}
        unread={unread}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={userConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversationItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[AppTheme.colors.primary]}
              tintColor={AppTheme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyText}>
                When you start conversations with others, they'll appear here
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    textAlign: 'center',
  },
});