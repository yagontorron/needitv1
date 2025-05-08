import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import NeedCard from '@/components/needs/NeedCard';
import CategoryList from '@/components/needs/CategoryList';
import { useNeeds } from '@/contexts/NeedsContext';
import { AppTheme } from '@/constants/theme';
import { Need } from '@/types';

export default function HomeScreen() {
  const { needs, categories, isLoading } = useNeeds();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredNeeds(needs.filter(need => need.categoryId === selectedCategory));
    } else {
      setFilteredNeeds(needs);
    }
  }, [needs, selectedCategory]);

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, this would refresh the data from the server
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>NeedIt</Text>
        <Text style={styles.subtitle}>Discover what people need today</Text>
      </View>
      
      <CategoryList 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredNeeds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NeedCard need={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
              <Text style={styles.emptyText}>No needs found</Text>
              <Text style={styles.emptySubtext}>
                {selectedCategory
                  ? 'Try selecting a different category'
                  : 'Be the first to post a need!'
                }
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    textAlign: 'center',
  },
});