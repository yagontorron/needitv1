import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useNeeds } from '@/contexts/NeedsContext';
import { router } from 'expo-router';
import { AppTheme } from '@/constants/theme';
import NeedCard from '@/components/needs/NeedCard';
import { Settings, LogOut, User as UserIcon, Mail, MapPin, Calendar, BookmarkMinus, Plus, ArrowRight, CreditCard as Edit3 } from 'lucide-react-native';
import { Need } from '@/types';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { getUserNeeds, getSavedNeeds } = useNeeds();
  const [userNeeds, setUserNeeds] = useState<Need[]>([]);
  const [savedNeeds, setSavedNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posted' | 'saved'>('posted');

  useEffect(() => {
    if (user) {
      loadUserNeeds();
    }
  }, [user]);

  const loadUserNeeds = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const posted = await getUserNeeds(user.id);
        const saved = await getSavedNeeds(user.id);
        setUserNeeds(posted);
        setSavedNeeds(saved);
      }
    } catch (error) {
      console.error('Error loading user needs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Not Logged In</Text>
          <Text style={styles.emptyText}>Please log in to view your profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Profile</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/settings')}>
              <Settings size={24} color={AppTheme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <LogOut size={24} color={AppTheme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: user.photoURL || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.profileImage} 
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.displayName}</Text>
            
            <View style={styles.profileDetail}>
              <Mail size={16} color={AppTheme.colors.textLight} />
              <Text style={styles.profileDetailText}>{user.email}</Text>
            </View>
            
            {user.location && (
              <View style={styles.profileDetail}>
                <MapPin size={16} color={AppTheme.colors.textLight} />
                <Text style={styles.profileDetailText}>{user.location}</Text>
              </View>
            )}
            
            <View style={styles.profileDetail}>
              <Calendar size={16} color={AppTheme.colors.textLight} />
              <Text style={styles.profileDetailText}>
                Joined {formatDate(user.createdAt)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/edit-profile')}>
            <Edit3 size={18} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posted' && styles.activeTab]}
            onPress={() => setActiveTab('posted')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'posted' && styles.activeTabText
            ]}>
              Posted ({userNeeds.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'saved' && styles.activeTabText
            ]}>
              Saved ({savedNeeds.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.needsContainer}>
          {activeTab === 'posted' ? (
            userNeeds.length > 0 ? (
              userNeeds.map(need => (
                <NeedCard key={need.id} need={need} />
              ))
            ) : (
              <View style={styles.emptyNeedsContainer}>
                <Text style={styles.emptyTitle}>No needs posted yet</Text>
                <Text style={styles.emptyText}>
                  Create your first need to let others know what you're looking for
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push('/(tabs)/create')}
                >
                  <Plus size={20} color="white" />
                  <Text style={styles.createButtonText}>Post a Need</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            savedNeeds.length > 0 ? (
              savedNeeds.map(need => (
                <NeedCard key={need.id} need={need} />
              ))
            ) : (
              <View style={styles.emptyNeedsContainer}>
                <Text style={styles.emptyTitle}>No saved needs</Text>
                <Text style={styles.emptyText}>
                  When you save needs you're interested in, they'll appear here
                </Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/(tabs)/')}
                >
                  <Text style={styles.browseButtonText}>Browse Needs</Text>
                  <ArrowRight size={16} color={AppTheme.colors.primary} />
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    marginLeft: 8,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: AppTheme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: AppTheme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.textLight,
  },
  activeTabText: {
    color: AppTheme.colors.primary,
  },
  needsContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyNeedsContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 16,
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
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  createButton: {
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  browseButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.primary,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.primary,
    marginRight: 8,
  },
});