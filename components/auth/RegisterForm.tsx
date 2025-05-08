import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { AppTheme } from '@/constants/theme';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await register(email, password, name);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Registration failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <User size={18} color={AppTheme.colors.text} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={AppTheme.colors.textLight}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

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

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Lock size={18} color={AppTheme.colors.text} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={AppTheme.colors.textLight}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.signupLink}>Sign In</Text>
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