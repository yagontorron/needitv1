import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, X, SlidersHorizontal, MapPin, Tag } from 'lucide-react-native';
import NeedCard from '@/components/needs/NeedCard';
import { useNeeds } from '@/contexts/NeedsContext';
import { AppTheme } from '@/constants/theme';
import { Need } from '@/types';

export default function HomeScreen() {
  const { needs, categories, isLoading } = useNeeds();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const locations = Array.from(new Set(
    needs.filter(need => need.location?.name).map(need => need.location!.name)
  ));

  useEffect(() => {
    let filtered = [...needs];

    if (searchText) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter(
        need =>
          need.title.toLowerCase().includes(query) ||
          (need.description && need.description.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(need => need.categoryId === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(need => need.location?.name === selectedLocation);
    }

    setFilteredNeeds(filtered);
  }, [needs, searchText, selectedCategory, selectedLocation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>NeedIt</Text>
        <Text style={styles.subtitle}>Encuentra justo lo que estás buscando</Text>
      </View>

      {/* Buscador + icono de filtros */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Search size={20} color={AppTheme.colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar necesidades..."
            placeholderTextColor={AppTheme.colors.textLight}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <X size={20} color={AppTheme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.slidersButton}
          onPress={() => setShowFilters(prev => !prev)}
        >
          <SlidersHorizontal size={22} color="#4A638D" />
        </TouchableOpacity>
      </View>

      {/* Filtros colapsables */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterBlock}>
            <View style={styles.filterHeader}>
              <Tag size={16} color={AppTheme.colors.text} />
              <Text style={styles.filterLabel}>Categorías</Text>
            </View>
            <View style={styles.filterOptions}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterOption,
                    selectedCategory === category.id && styles.selectedFilterOption
                  ]}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
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

          <View style={styles.filterBlock}>
            <View style={styles.filterHeader}>
              <MapPin size={16} color={AppTheme.colors.text} />
              <Text style={styles.filterLabel}>Ubicación</Text>
            </View>
            <View style={styles.filterOptions}>
              {locations.map(loc => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.filterOption,
                    selectedLocation === loc && styles.selectedFilterOption
                  ]}
                  onPress={() =>
                    setSelectedLocation(selectedLocation === loc ? null : loc)
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedLocation === loc && styles.selectedFilterOptionText
                    ]}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Resultados */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredNeeds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NeedCard need={item} />}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay resultados</Text>
              <Text style={styles.emptySubtext}>Intenta ajustar tus filtros</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.colors.background },
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
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
  },
  slidersButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E8EEF6',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  filterBlock: {
    marginBottom: 10,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.text,
    marginLeft: 6,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    backgroundColor: '#EEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedFilterOption: {
    backgroundColor: AppTheme.colors.primary,
  },
  filterOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: AppTheme.colors.text,
  },
  selectedFilterOptionText: {
    color: 'white',
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
});//