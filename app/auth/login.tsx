import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../constants/api';
import { V } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        if (data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
        }

        try {
          const meRes = await fetch(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const meData = await meRes.json();

          if (meData.user?.onboardingComplete) {
            await AsyncStorage.setItem('onboardingComplete', 'true');
            router.replace('/(tabs)/home');
          } else {
            router.replace('/onboarding/allergens');
          }
        } catch {
          router.replace('/onboarding/allergens');
        }
      } else {
        Alert.alert('Login failed', data.message || 'Invalid credentials');
      }
    } catch {
      Alert.alert('Network Error', 'Cannot connect to server. Make sure backend is running on http://localhost:4000');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.heroOrb} />
        <View style={styles.heroOrbSecondary} />

        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={30} color={V.white} />
          </View>
          <Text style={styles.brand}>VERDANT</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your allergy-safe companion</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switcher}>
            <Pressable style={[styles.switchPill, styles.switchPillActive]}>
              <Text style={[styles.switchText, styles.switchTextActive]}>Login</Text>
            </Pressable>
            <Pressable style={styles.switchPill} onPress={() => router.replace('/auth/register')}>
              <Text style={styles.switchText}>Register</Text>
            </Pressable>
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={V.textLight} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={V.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={V.textLight} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={V.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable onPress={() => Alert.alert('Not available yet', 'Password reset is not connected yet.')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Need an account?</Text>
          <Pressable onPress={() => router.replace('/auth/register')}>
            <Text style={styles.linkBold}>Create one</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: V.cream,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  heroOrb: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#DDF4E6',
    top: -40,
    right: -80,
  },
  heroOrbSecondary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F0E8DF',
    top: 80,
    left: -70,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: V.mint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: V.pine,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.8,
    color: V.mintDark,
    marginBottom: 10,
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    color: V.pine,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: V.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 260,
  },
  card: {
    backgroundColor: V.white,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EEF1F4',
    shadowColor: V.pine,
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  switcher: {
    flexDirection: 'row',
    backgroundColor: V.neutralSoft,
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
  },
  switchPill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchPillActive: {
    backgroundColor: V.mint,
  },
  switchText: {
    color: V.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  switchTextActive: {
    color: V.white,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V.inputBg,
    borderWidth: 1,
    borderColor: V.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 12,
    fontSize: 16,
    color: V.textPrimary,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: V.mintDark,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 18,
  },
  btn: {
    backgroundColor: V.mint,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: V.white,
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 22,
  },
  footerText: {
    color: V.textSecondary,
    fontSize: 15,
  },
  linkBold: {
    color: V.mintDark,
    fontWeight: '700',
    fontSize: 15,
  },
});
