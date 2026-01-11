import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/api';

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
      console.log('Login button pressed');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        console.log('Login success, token saved');
        router.replace('/(tabs)/scan');
      } else {
        console.log('Login failed:', data.message);
        Alert.alert('Login failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.log('Login failed: Network Error');
      Alert.alert('Network Error', 'Cannot connect to server');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button 
        title={loading ? "Logging in..." : "Login"} 
        onPress={handleLogin}
        disabled={loading}
      />
      <Text style={styles.test}>test@test.com / password123</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 40, backgroundColor: '#020617' },
  title: { fontSize: 32, color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: { 
    borderWidth: 1, 
    borderColor: '#475569', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 20, 
    color: '#fff',
    backgroundColor: '#1e293b'
  },
  test: { color: '#94a3b8', textAlign: 'center', marginTop: 20, fontSize: 12 }
});
