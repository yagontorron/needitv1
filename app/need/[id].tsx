import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, 
  ActivityIndicator, FlatList, Dimensions, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNeeds } from '@/contexts/NeedsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/contexts/MessagesContext';
import { StatusBar } from 'expo-status-bar';
import { AppTheme } from '@/constants/theme';
import { 
  MapPin, Calendar, Tag, DollarSign, 
  MessageSquare, Share2, BookmarkPlus, 
  BookmarkCheck, ChevronLeft, ArrowLeft, User
} from 'lucide-react-native';

// Mock user for demonstration
const mockUser = {
  id: '2',
  displayName: 'Alice Smith',
  photoURL: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

export default function NeedDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getNeedById, categories, toggleSaveNeed } = useNeeds();
  const { user } = useAuth();
  const { startConversation } = useMessages();
  
  const [need, setNeed] = useState(getNeedById(id as string));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const windowWidth = Dimensions.get('window').width;
  
  useEffect(() => {
    if (id && !need) {
      setNeed(getNeedById(id as string));
    }
  }, [id]);
  
  if (!need) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </View>
    );
  }
  
  const categoryName = categories.find(c => c.id === need.categoryId)?.name || '';
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleSave = async () => {
    try {
      await toggleSaveNeed(need.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving need:', error);
    }
  };
  
  const handleShare = () => {
    // In a real app, this would use the share API
    Alert.alert('Share', 'Sharing functionality would be implemented here');
  };
  
  const handleContact = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to contact the user');
      return;
    }
    
    if (user.id === need.userId) {
      Alert.alert('Error', 'You cannot message yourself');
      return;
    }
    
    try {
      setIsLoading(true);
      const conversationId = await startConversation(need.id, need.userId);
      router.push(`/messages/conversation/${conversationId}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      Alert.alert('Error', 'Failed to start conversation');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderImageItem = ({ item, index }) => (
    <Image
      source={{ uri: item }}
      style={{
        width: windowWidth,
        height: 300,
        resizeMode: 'cover',
      }}
    />
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Floating header buttons */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.rightButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Share2 size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSave}
          >
            {isSaved ? (
              <BookmarkCheck size={20} color="white" />
            ) : (
              <BookmarkPlus size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image gallery */}
        {need.images && need.images.length > 0 ? (
          <View>
            <FlatList
              data={need.images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / windowWidth
                );
                setActiveImageIndex(newIndex);
              }}
            />
            
            {need.images.length > 1 && (
              <View style={styles.pagination}>
                {need.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activeImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/5935755/pexels-photo-5935755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={{
                width: windowWidth,
                height: 300,
                resizeMode: 'cover',
              }}
            />
          </View>
        )}
        
        <View style={styles.content}>
          {/* Title section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{need.title}</Text>
            
            {need.price !== undefined && (
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>€{need.price}</Text>
              </View>
            )}
          </View>
          
          {/* Info section */}
          <View style={styles.infoSection}>
            {need.location && (
              <View style={styles.infoItem}>
                <MapPin size={16} color={AppTheme.colors.textLight} />
                <Text style={styles.infoText}>{need.location.name}</Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Calendar size={16} color={AppTheme.colors.textLight} />
              <Text style={styles.infoText}>Posted on {formatDate(need.createdAt)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Tag size={16} color={AppTheme.colors.textLight} />
              <Text style={styles.infoText}>{categoryName}</Text>
            </View>
          </View>
          
          {/* Description section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{need.description}</Text>
          </View>
          
          {/* User section */}
          <View style={styles.userSection}>
            <Text style={styles.sectionTitle}>Posted by</Text>
            <View style={styles.userCard}>
              <Image 
                source={{ uri: mockUser.photoURL }} 
                style={styles.userImage} 
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{mockUser.displayName}</Text>
                <Text style={styles.userJoined}>Member since 2023</Text>
              </View>
              <View style={styles.userStats}>
                <Text style={styles.userStatsNumber}>12</Text>
                <Text style={styles.userStatsLabel}>Posts</Text>
              </View>
            </View>
          </View>
          
          {/* Status section */}
          <View style={styles.statusSection}>
            <View style={[
              styles.statusIndicator,
              need.status === 'active' && styles.activeStatus,
              need.status === 'fulfilled' && styles.fulfilledStatus,
              need.status === 'closed' && styles.closedStatus,
            ]} />
            <Text style={styles.statusText}>
              {need.status === 'active' ? 'Active' :
               need.status === 'fulfilled' ? 'Fulfilled' : 'Closed'}
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContact}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MessageSquare size={20} color="white" />
              <Text style={styles.contactButtonText}>Contact</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  placeholderImage: {
    height: 300,
    backgroundColor: AppTheme.colors.background,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.text,
    marginRight: 16,
  },
  priceTag: {
    backgroundColor: AppTheme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.primary,
  },
  infoSection: {
    backgroundColor: AppTheme.colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
    marginLeft: 8,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
    lineHeight: 24,
  },
  userSection: {
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.background,
    padding: 16,
    borderRadius: 8,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
  },
  userJoined: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
  },
  userStats: {
    alignItems: 'center',
  },
  userStatsNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.primary,
  },
  userStatsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 80, // Add some bottom padding for the action bar
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activeStatus: {
    backgroundColor: '#4CAF50', // Green for active
  },
  fulfilledStatus: {
    backgroundColor: '#2196F3', // Blue for fulfilled
  },
  closedStatus: {
    backgroundColor: '#F44336', // Red for closed
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.text,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    padding: 16,
  },
  contactButton: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
});