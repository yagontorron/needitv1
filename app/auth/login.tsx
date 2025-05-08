import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import LoginForm from '@/components/auth/LoginForm';
import { AppTheme } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>NeedIt</Text>
          <Text style={styles.tagline}>Find what you need, when you need it</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back! Please sign in to continue</Text>
          
          <LoginForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: AppTheme.colors.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});