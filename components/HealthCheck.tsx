/**
 * HealthCheck — Example component demonstrating the correct pattern
 * for fetching Supabase data through the API layer.
 *
 * ✅ DO: Fetch through API_BASE_URL (api/[...path].ts → Express backend)
 * ❌ DON'T: Connect directly to the database from the frontend
 */

import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

interface HealthStatus {
  status: string;
}

type FetchState = 'idle' | 'loading' | 'success' | 'error';

export default function HealthCheck() {
  const [state, setState] = useState<FetchState>('idle');
  const [data, setData] = useState<HealthStatus | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const checkHealth = useCallback(async () => {
    setState('loading');
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/health`);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json: HealthStatus = await response.json();
      setData(json);
      setState('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(message);
      setState('error');
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons
            name={state === 'success' ? 'checkmark-circle' : state === 'error' ? 'alert-circle' : 'pulse'}
            size={22}
            color={state === 'success' ? '#34D399' : state === 'error' ? '#F87171' : '#94A3B8'}
          />
          <Text style={styles.title}>API Health Check</Text>
        </View>

        {state === 'loading' && (
          <View style={styles.statusRow}>
            <ActivityIndicator size='small' color='#94A3B8' />
            <Text style={styles.statusText}>Checking server…</Text>
          </View>
        )}

        {state === 'success' && data && (
          <View style={styles.statusRow}>
            <Text style={styles.successText}>
              Status: {data.status}
            </Text>
          </View>
        )}

        {state === 'error' && (
          <View style={styles.statusRow}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <Pressable style={styles.retryBtn} onPress={checkHealth}>
          <Ionicons name='refresh' size={16} color='#fff' />
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF1F4',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  successText: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#F87171',
    fontSize: 14,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#34D399',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
