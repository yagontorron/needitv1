import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, X, MapPin, Tag } from 'lucide-react-native';
import { useNeeds } from '@/contexts/NeedsContext';
import NeedCard from '@/components/needs/NeedCard';
import { AppTheme } from '@/constants/theme';
import { Need } from '@/types';

export default function SearchScreen() {
  const { needs, categories, isLoading } = useNeeds();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Need[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Locations extracted from needs for filtering
  const locations = Array.from(new Set(
    needs
      .filter(need => need.location?.name)
      .map(need => need.location!.name)
  ));

  useEffect(() => {
    if (query.trim() === '' && !selectedCategory && !location) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API search delay
    const timer = setTimeout(() => {
      let results = [...needs];
      
      // Filter by search query
      if (query.trim() !== '') {
        const lowercaseQuery = query.toLowerCase();
        results = results.filter(
          need => need.title.toLowerCase().includes(lowercaseQuery) || 
                 need.description.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      // Filter by category
      if (selectedCategory) {
        results = results.filter(need => need.categoryId === selectedCategory);
      }
      
      // Filter by location
      if (location) {
        results = results.filter(need => need.location?.name === location);
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, selectedCategory, location, needs]);

  const clearSearch = () => {
    setQuery('');
    setSelectedCategory(null);
    setLocation(null);
    setSearchResults([]);
  };

  const renderFilterPill = (label: string, value: string | null, setter: (value: string | null) => void) => {
    if (!value) return null;
    
    return (
      <TouchableOpacity 
        style={styles.filterPill}
        onPress={() => setter(null)}
      >
        <Text style={styles.filterPillText}>{label}: {value}</Text>
        <X size={14} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find exactly what you're looking for</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={AppTheme.colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for needs..."
            placeholderTextColor={AppTheme.colors.textLight}
            value={query}
            onChangeText={setQuery}
          />
          {query !== '' && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={20} color={AppTheme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Tag size={16} color={AppTheme.colors.text} />
              <Text style={styles.filterTitle}>Categories</Text>
            </View>
            <View style={styles.filterOptions}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterOption,
                    selectedCategory === category.id && styles.selectedFilterOption
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedCategory === category.id && styles.selectedFilterOptionText
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <MapPin size={16} color={AppTheme.colors.text} />
              <Text style={styles.filterTitle}>Locations</Text>
            </View>
            <View style={styles.filterOptions}>
              {locations.map(loc => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.filterOption,
                    location === loc && styles.selectedFilterOption
                  ]}
                  onPress={() => setLocation(
                    location === loc ? null : loc
                  )}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      location === loc && styles.selectedFilterOptionText
                    ]}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.activeFiltersContainer}>
          {(selectedCategory || location) && (
            <>
              <Text style={styles.activeFiltersTitle}>Active filters:</Text>
              <View style={styles.filterPills}>
                {renderFilterPill(
                  'Category', 
                  categories.find(c => c.id === selectedCategory)?.name || null, 
                  () => setSelectedCategory(null)
                )}
                {renderFilterPill('Location', location, () => setLocation(null))}
              </View>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearFiltersText}>Clear all filters</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.resultsContainer}>
        {(query || selectedCategory || location) && (
          <Text style={styles.resultsTitle}>
            {isSearching 
              ? 'Searching...' 
              : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
            }
          </Text>
        )}
        
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppTheme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <NeedCard need={item} />}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {(query || selectedCategory || location) ? (
                  <>
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
                  </>
                ) : (
                  <Text style={styles.emptyText}>Search for needs above</Text>
                )}
              </View>
            }
          />
        )}
      </View>
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
    marginBottom: 16,
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
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
    marginLeft: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.background,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: AppTheme.colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.text,
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  activeFiltersContainer: {
    marginBottom: 16,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  filterPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterPillText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginRight: 8,
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
  },
  clearFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.primary,
    textDecorationLine: 'underline',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.text,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsList: {
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