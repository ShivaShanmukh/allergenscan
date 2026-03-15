import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { V } from '../constants/theme';

export default function SplashScreen() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = await AsyncStorage.getItem('authToken');
    const onboarded = await AsyncStorage.getItem('onboardingComplete');
    if (token && onboarded) {
      router.replace('/(tabs)/home');
    } else if (token) {
      router.replace('/onboarding/allergens');
    }
    setChecking(false);
  }

  if (checking) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Text style={styles.leaf}>🌿</Text>
        <Text style={styles.title}>VERDANT</Text>
        <Text style={styles.tagline}>Your AI Health Companion</Text>
        <Text style={styles.subtitle}>Sustainable food, simplified</Text>
      </View>

      <View style={styles.buttonArea}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/auth/register')}>
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/auth/login')}>
          <Text style={styles.secondaryBtnText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: V.forest,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaf: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: V.white,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 18,
    color: V.sage,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  buttonArea: {
    width: '100%',
    paddingBottom: 48,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: V.terracotta,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: V.white,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: V.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
