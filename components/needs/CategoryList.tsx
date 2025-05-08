import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppTheme } from '@/constants/theme';
import { Category } from '@/types';
import { PenTool as Tool, Smartphone, Sofa, Shirt, BookOpen, Car, Chrome as Home, Utensils, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryList({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryListProps) {
  const getIconComponent = (iconName: string, isSelected: boolean) => {
    const color = isSelected ? 'white' : AppTheme.colors.text;
    const size = 20;
    
    switch (iconName) {
      case 'tool':
        return <Tool size={size} color={color} />;
      case 'smartphone':
        return <Smartphone size={size} color={color} />;
      case 'sofa':
        return <Sofa size={size} color={color} />;
      case 'shirt':
        return <Shirt size={size} color={color} />;
      case 'book-open':
        return <BookOpen size={size} color={color} />;
      case 'car':
        return <Car size={size} color={color} />;
      case 'home':
        return <Home size={size} color={color} />;
      case 'utensils':
        return <Utensils size={size} color={color} />;
      case 'more-horizontal':
      default:
        return <MoreHorizontal size={size} color={color} />;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.categoryItem,
          selectedCategory === null && styles.selectedItem
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text style={[
          styles.categoryText,
          selectedCategory === null && styles.selectedText
        ]}>
          All
        </Text>
      </TouchableOpacity>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            selectedCategory === category.id && styles.selectedItem
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <View style={styles.categoryContent}>
            {getIconComponent(category.icon, selectedCategory === category.id)}
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedText
            ]}>
              {category.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  selectedItem: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppTheme.colors.text,
    marginLeft: 6,
  },
  selectedText: {
    color: 'white',
  },
});