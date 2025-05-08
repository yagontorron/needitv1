import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Mail, Lock, Apple, Eye, EyeOff } from 'lucide-react-native';
import { AppTheme } from '@/constants/theme';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleSignIn, appleSignIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await googleSignIn();
      router.replace('/(tabs)');
    } catch (err) {
      setError('Google sign in failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await appleSignIn();
      router.replace('/(tabs)');
    } catch (err) {
      setError('Apple sign in failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Mail size={18} color={AppTheme.colors.text} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={AppTheme.colors.textLight}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Lock size={18} color={AppTheme.colors.text} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={AppTheme.colors.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          style={styles.passwordToggle} 
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={18} color={AppTheme.colors.text} />
          ) : (
            <Eye size={18} color={AppTheme.colors.text} />
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity 
        style={styles.socialButton} 
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.socialButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {Platform.OS !== 'web' && (
        <TouchableOpacity 
          style={[styles.socialButton, styles.appleButton]} 
          onPress={handleAppleSignIn}
        >
          <Apple size={18} color="black" />
          <Text style={styles.socialButtonText}>Sign in with Apple</Text>
        </TouchableOpacity>
      )}

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
  },
  passwordToggle: {
    padding: 12,
  },
  button: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: AppTheme.colors.border,
  },
  orText: {
    marginHorizontal: 8,
    color: AppTheme.colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appleButton: {
    backgroundColor: 'white',
  },
  socialButtonText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    color: AppTheme.colors.text,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    fontFamily: 'Inter-Regular',
    color: AppTheme.colors.text,
  },
  signupLink: {
    fontFamily: 'Inter-SemiBold',
    color: AppTheme.colors.primary,
    marginLeft: 5,
  },
  errorText: {
    color: AppTheme.colors.error,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
});