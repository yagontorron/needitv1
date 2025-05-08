import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Camera, MapPin, DollarSign, CirclePlus as PlusCircle, Battery as Category, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useNeeds } from '@/contexts/NeedsContext';
import { useAuth } from '@/contexts/AuthContext';
import { AppTheme } from '@/constants/theme';

export default function CreateScreen() {
  const router = useRouter();
  const { addNeed, categories } = useNeeds();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [locationName, setLocationName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Mock image selection - in a real app, this would use image picker
  const mockImageUrls = [
    'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/5935755/pexels-photo-5935755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];
  
  const handleAddImage = () => {
    if (images.length < 5) {
      // Just add a random image from our mock urls for demo
      const randomIndex = Math.floor(Math.random() * mockImageUrls.length);
      setImages([...images, mockImageUrls[randomIndex]]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    
    if (!categoryId) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    
    if (!locationName.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post a need');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newNeed = await addNeed({
        userId: user.id,
        title,
        description,
        categoryId,
        price: price ? parseFloat(price) : undefined,
        location: locationName 
          ? {
              name: locationName,
              latitude: 40.4168, // Mock location - would be actual coordinates in real app
              longitude: -3.7038
            }
          : undefined,
        images,
      });
      
      Alert.alert(
        'Success',
        'Your need has been posted!',
        [{ text: 'OK', onPress: () => router.push(`/need/${newNeed.id}`) }]
      );
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategoryId('');
      setPrice('');
      setLocationName('');
      setImages([]);
      
    } catch (error) {
      console.error('Error creating need:', error);
      Alert.alert('Error', 'Failed to create need. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getCategoryName = () => {
    if (!categoryId) return 'Select a category';
    return categories.find(c => c.id === categoryId)?.name || 'Select a category';
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create a Need</Text>
            <Text style={styles.subtitle}>Let others know what you're looking for</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What do you need?"
                placeholderTextColor={AppTheme.colors.textLight}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Provide details about what you need..."
                placeholderTextColor={AppTheme.colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  !categoryId && styles.placeholderText
                ]}>
                  {getCategoryName()}
                </Text>
                {showCategoryDropdown ? (
                  <ChevronUp size={20} color={AppTheme.colors.text} />
                ) : (
                  <ChevronDown size={20} color={AppTheme.colors.text} />
                )}
              </TouchableOpacity>
              
              {showCategoryDropdown && (
                <View style={styles.dropdownMenu}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategoryId(category.id);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        category.id === categoryId && styles.selectedDropdownItemText
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (optional)</Text>
              <View style={styles.priceInputContainer}>
                <DollarSign size={18} color={AppTheme.colors.text} />
                <TextInput
                  style={styles.priceInput}
                  placeholder="0"
                  placeholderTextColor={AppTheme.colors.textLight}
                  value={price}
                  onChangeText={(text) => {
                    // Only allow numbers and decimal point
                    if (/^\d*\.?\d*$/.test(text)) {
                      setPrice(text);
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.locationInputContainer}>
                <MapPin size={18} color={AppTheme.colors.text} />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Where are you located?"
                  placeholderTextColor={AppTheme.colors.textLight}
                  value={locationName}
                  onChangeText={setLocationName}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Photos (optional)</Text>
              <View style={styles.imageContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <X size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {images.length < 5 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handleAddImage}
                  >
                    <Camera size={24} color={AppTheme.colors.textLight} />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.helperText}>
                You can add up to 5 photos
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <PlusCircle size={20} color="white" />
                  <Text style={styles.submitButtonText}>Post Need</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
  },
  textArea: {
    minHeight: 120,
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
  },
  placeholderText: {
    color: AppTheme.colors.textLight,
  },
  dropdownMenu: {
    marginTop: 4,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
  },
  selectedDropdownItemText: {
    color: AppTheme.colors.primary,
    fontFamily: 'Inter-Medium',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    padding: 12,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
    marginLeft: 8,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    padding: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
    marginLeft: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 8,
    marginBottom: 8,
  },
  addImageText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.textLight,
    marginTop: 8,
  },
  imagePreviewContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
});