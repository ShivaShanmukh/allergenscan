import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from '../../constants/api';

interface ScanResult {
  product?: {
    name: string;
  };
  safe: boolean;
  allergenWarnings?: Array<{
    id: string;
    name: string;
  }>;
}

export default function ScanScreen() {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const testScan = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ barcode }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      Alert.alert('Scan failed', e instanceof Error ? e.message : 'An unknown error occurred');
    }
    setLoading(false);
  };

  if (result) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>✅ SCAN RESULT</Text>
        <Text style={styles.product}>{result.product?.name || 'Unknown'}</Text>
        {!result.safe && (
          <>
            <Text style={styles.warningTitle}>⚠️ DANGER</Text>
            {result.allergenWarnings?.map(w => (
              <Text key={w.id} style={styles.warningText}>• {w.name}</Text>
            ))}
          </>
        )}
        <Button title="New Scan" onPress={() => setResult(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Scan Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Type barcode here"
        value={barcode}
        onChangeText={setBarcode}
      />
      <Button 
        title="TEST SCAN" 
        onPress={testScan} 
        disabled={!barcode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 40, backgroundColor: '#000' },
  title: { fontSize: 24, color: '#fff', marginBottom: 30, textAlign: 'center' },
  input: { borderColor: '#fff', borderWidth: 1, padding: 15, color: '#fff', marginBottom: 20, borderRadius: 10 },
  product: { fontSize: 20, color: '#0f0', textAlign: 'center', marginBottom: 20 },
  warningTitle: { fontSize: 22, color: '#f00', textAlign: 'center', marginBottom: 15 },
  warningText: { color: '#ff0', fontSize: 18, textAlign: 'center' },
});
