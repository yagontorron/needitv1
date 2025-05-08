import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { Need } from '@/types';
import { useRouter } from 'expo-router';
import { AppTheme } from '@/constants/theme';
import { MapPin, Calendar, BookmarkPlus, BookmarkCheck } from 'lucide-react-native';
import { useNeeds } from '@/contexts/NeedsContext';

interface NeedCardProps {
  need: Need;
}

export default function NeedCard({ need }: NeedCardProps) {
  const router = useRouter();
  const { toggleSaveNeed } = useNeeds();
  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSave = async () => {
    try {
      await toggleSaveNeed(need.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving need:', error);
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/need/${need.id}`)}
    >
      <View style={styles.card}>
        {need.images?.length > 0 && (
          <Image
            source={{ uri: need.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>{need.title}</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              {isSaved ? (
                <BookmarkCheck size={20} color={AppTheme.colors.primary} />
              ) : (
                <BookmarkPlus size={20} color={AppTheme.colors.textLight} />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {need.description}
          </Text>
          
          <View style={styles.footer}>
            {need.location && (
              <View style={styles.infoItem}>
                <MapPin size={14} color={AppTheme.colors.textLight} />
                <Text style={styles.infoText}>{need.location.name}</Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Calendar size={14} color={AppTheme.colors.textLight} />
              <Text style={styles.infoText}>{formatDate(need.createdAt)}</Text>
            </View>
            
            {need.price !== undefined && (
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>
                  €{need.price}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
    marginRight: 8,
  },
  saveButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    marginLeft: 4,
  },
  priceTag: {
    backgroundColor: AppTheme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.primary,
  },
});