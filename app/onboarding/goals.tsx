import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../constants/api';
import { V } from '../../constants/theme';

type Goal = { id: number; name: string; description: string };

const goalIcons: Record<string, string> = {
  'Eat Healthier': 'leaf',
  'Manage Allergies': 'shield-checkmark',
  'Save Money': 'cash',
  'Go Sustainable': 'earth',
};

export default function GoalsOnboarding() {
  const [available, setAvailable] = useState<Goal[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/profile/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAvailable(data.available || []);
      setSelectedIds((data.goals || []).map((g: Goal) => g.id));
    } catch (err) {
      console.log('Load goals error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('authToken');

      await fetch(`${API_BASE_URL}/profile/goals`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ goalIds: selectedIds }),
      });

      await fetch(`${API_BASE_URL}/profile/onboarding-complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(tabs)/home');
    } catch (err) {
      console.log('Complete onboarding error:', err);
    } finally {
      setSaving(false);
    }
  }

  const toggle = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={V.mint} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroOrb} />

      <View style={styles.header}>
        <Text style={styles.step}>Step 3 of 3</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.title}>What are your goals?</Text>
        <Text style={styles.subtitle}>
          Tell us what matters most so the dashboard and scan results feel more personal from day one.
        </Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {available.map((goal) => {
          const selected = selectedIds.includes(goal.id);
          return (
            <Pressable
              key={goal.id}
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => toggle(goal.id)}
            >
              <View style={[styles.cardIconWrap, selected && styles.cardIconWrapSelected]}>
                <Ionicons
                  name={(goalIcons[goal.name] as keyof typeof Ionicons.glyphMap) || 'flag'}
                  size={24}
                  color={selected ? V.mintDark : V.mint}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, selected && styles.cardTitleSelected]}>{goal.name}</Text>
                <Text style={[styles.cardDesc, selected && styles.cardDescSelected]}>{goal.description}</Text>
              </View>
              {selected && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={16} color={V.white} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={handleComplete} disabled={saving}>
          <Text style={styles.primaryBtnText}>{saving ? 'Setting up...' : 'Complete Setup'}</Text>
        </Pressable>
        <Pressable onPress={handleComplete}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: V.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: V.cream },
  heroOrb: {
    position: 'absolute',
    top: -80,
    right: -50,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#E7F7EE',
  },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  step: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: V.mintDark,
    fontWeight: '700',
    marginBottom: 10,
    backgroundColor: '#EAF8EF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E8ECEF',
    borderRadius: 999,
    marginBottom: 24,
  },
  progressFill: { height: 8, backgroundColor: V.mint, borderRadius: 999 },
  title: { fontSize: 30, fontWeight: '800', color: V.pine, marginBottom: 8 },
  subtitle: { fontSize: 15, color: V.textSecondary, lineHeight: 22, maxWidth: 310 },
  list: { flex: 1, paddingHorizontal: 24 },
  listContent: { gap: 12, paddingBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    backgroundColor: V.white,
    borderWidth: 1.5,
    borderColor: '#E8ECEF',
    shadowColor: V.pine,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardSelected: {
    borderColor: V.mint,
    backgroundColor: '#F2FCF6',
  },
  cardIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#EEF7F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardIconWrapSelected: {
    backgroundColor: '#DFF6E7',
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: V.textPrimary, marginBottom: 4 },
  cardTitleSelected: { color: V.mintDark },
  cardDesc: { fontSize: 13, color: V.textSecondary, lineHeight: 18 },
  cardDescSelected: { color: V.sageDark },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: V.mint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: { padding: 24, gap: 12 },
  primaryBtn: {
    backgroundColor: V.mint,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  primaryBtnText: { color: V.white, fontSize: 17, fontWeight: '700' },
  skipText: { textAlign: 'center', color: V.textSecondary, fontSize: 15, fontWeight: '600' },
});
