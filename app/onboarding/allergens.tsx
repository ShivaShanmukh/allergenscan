import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../constants/api';
import { V } from '../../constants/theme';

type Allergen = { id: number; name: string };

export default function AllergensOnboarding() {
  const [available, setAvailable] = useState<Allergen[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAllergens();
  }, []);

  async function loadAllergens() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/profile/allergens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAvailable(data.available || []);
      setSelectedIds((data.allergens || []).map((a: Allergen) => a.id));
    } catch (err) {
      console.log('Load allergens error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleNext() {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await fetch(`${API_BASE_URL}/profile/allergens`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ allergenIds: selectedIds }),
      });
      router.push('/onboarding/dietary');
    } catch (err) {
      console.log('Save allergens error:', err);
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
        <Text style={styles.step}>Step 1 of 3</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.title}>What are you allergic to?</Text>
        <Text style={styles.subtitle}>
          Select any allergies or intolerances so we can keep every scan relevant to you.
        </Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {available.map((allergen) => {
          const selected = selectedIds.includes(allergen.id);
          return (
            <Pressable
              key={allergen.id}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => toggle(allergen.id)}
            >
              <Ionicons
                name={selected ? 'shield-checkmark' : 'ellipse-outline'}
                size={18}
                color={selected ? V.white : V.mintDark}
              />
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{allergen.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={handleNext} disabled={saving}>
          <Text style={styles.primaryBtnText}>
            {saving ? 'Saving...' : selectedIds.length > 0 ? `Next (${selectedIds.length} selected)` : 'Next'}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/onboarding/dietary')}>
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
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#DDF4E6',
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
  subtitle: { fontSize: 15, color: V.textSecondary, lineHeight: 22, maxWidth: 300 },
  list: { flex: 1, paddingHorizontal: 24 },
  listContent: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: V.white,
    borderWidth: 1.5,
    borderColor: '#E8ECEF',
    shadowColor: V.pine,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: V.mint,
    borderColor: V.mint,
  },
  chipText: { fontSize: 15, color: V.textPrimary, fontWeight: '600' },
  chipTextSelected: { color: V.white },
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
