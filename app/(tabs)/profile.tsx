import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../constants/api';
import { V } from '../../constants/theme';

type UserData = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  scanCount: number;
};

type ScanRecord = {
  id: number;
  safe: boolean;
};

type Allergen = { id: number; name: string };

export default function ProfileScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const [meRes, historyRes, allergenRes] = await Promise.all([
        fetch(`${API_BASE_URL}/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/scan/history`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/profile/allergens`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [meData, historyData, allergenData] = await Promise.all([
        meRes.json(),
        historyRes.json(),
        allergenRes.json(),
      ]);

      if (meData.user) setUser(meData.user);
      setHistory(historyData.scans || []);
      setAllergens(allergenData.allergens || []);
    } catch (err) {
      console.log('Load profile error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.multiRemove(['authToken', 'user', 'onboardingComplete']);
    router.replace('/');
  }

  const safeProducts = history.filter((scan) => scan.safe).length;
  const avoidedAlerts = history.length - safeProducts;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={V.mint} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroTitle}>Profile</Text>
          <Pressable style={styles.settingsButton} onPress={() => router.push('/onboarding/allergens')}>
            <Ionicons name="settings-outline" size={18} color={V.white} />
          </Pressable>
        </View>

        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.identityBody}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.memberSince}>
              Member since{' '}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                : 'recently'}
            </Text>

            <View style={styles.chipRow}>
              {allergens.length > 0 ? (
                allergens.slice(0, 3).map((allergen) => (
                  <View key={allergen.id} style={styles.allergenChip}>
                    <Text style={styles.allergenChipText}>{allergen.name}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.editChip}>
                  <Text style={styles.editChipText}>Add allergens</Text>
                </View>
              )}

              {allergens.length > 3 && (
                <View style={styles.editChip}>
                  <Text style={styles.editChipText}>+{allergens.length - 3} more</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Safety stats</Text>
          <Ionicons name="shield-checkmark-outline" size={20} color={V.mint} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.scanCount || 0}</Text>
            <Text style={styles.statLabel}>Products scanned</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxHighlight]}>
            <Text style={[styles.statNumber, { color: V.mintDark }]}>{safeProducts}</Text>
            <Text style={[styles.statLabel, { color: V.mintDark }]}>Safe products</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{avoidedAlerts}</Text>
            <Text style={styles.statLabel}>Alerts caught</Text>
          </View>
        </View>

        <Pressable style={styles.outlineButton} onPress={() => router.push('/(tabs)/history')}>
          <Text style={styles.outlineButtonText}>View Full History</Text>
          <Ionicons name="chevron-forward" size={16} color={V.mintDark} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health profile</Text>

        <Pressable style={styles.menuItem} onPress={() => router.push('/onboarding/allergens')}>
          <View style={styles.menuLeft}>
            <Ionicons name="shield-outline" size={18} color={V.textSecondary} />
            <Text style={styles.menuText}>Allergies</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={V.textLight} />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => router.push('/onboarding/dietary')}>
          <View style={styles.menuLeft}>
            <Ionicons name="leaf-outline" size={18} color={V.textSecondary} />
            <Text style={styles.menuText}>Dietary Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={V.textLight} />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => router.push('/onboarding/goals')}>
          <View style={styles.menuLeft}>
            <Ionicons name="flag-outline" size={18} color={V.textSecondary} />
            <Text style={styles.menuText}>Health Goals</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={V.textLight} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Email</Text>
          <Text style={styles.accountValue}>{user?.email || '-'}</Text>
        </View>

        <Pressable style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <View style={styles.menuLeft}>
            <Ionicons name="log-out-outline" size={18} color={V.dangerDark} />
            <Text style={[styles.menuText, { color: V.dangerDark }]}>Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={V.textLight} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  content: { paddingBottom: 32 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
  hero: {
    backgroundColor: V.mint,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: { fontSize: 30, fontWeight: '800', color: V.white },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  identityCard: {
    backgroundColor: V.white,
    borderRadius: 28,
    padding: 18,
    flexDirection: 'row',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: V.mint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { color: V.white, fontSize: 28, fontWeight: '800' },
  identityBody: { flex: 1 },
  name: { fontSize: 22, fontWeight: '800', color: V.textPrimary, marginBottom: 4 },
  memberSince: { fontSize: 13, color: V.textSecondary, marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  allergenChip: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F7D7D7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  allergenChipText: { fontSize: 12, fontWeight: '700', color: V.dangerDark },
  editChip: {
    backgroundColor: '#F3F5F7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editChipText: { fontSize: 12, fontWeight: '700', color: V.textSecondary },
  card: {
    backgroundColor: V.white,
    borderRadius: 26,
    padding: 18,
    marginHorizontal: 24,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#ECEFF3',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: V.textPrimary, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: '#F6F8FA',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  statBoxHighlight: { backgroundColor: '#EAF8EF' },
  statNumber: { fontSize: 24, fontWeight: '800', color: V.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: V.textSecondary, textAlign: 'center' },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#D9EFE0',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineButtonText: { color: V.mintDark, fontSize: 14, fontWeight: '700' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEF1F4',
  },
  logoutItem: { marginTop: 8 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuText: { fontSize: 15, fontWeight: '600', color: V.textPrimary },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  accountLabel: { fontSize: 13, color: V.textSecondary },
  accountValue: { fontSize: 14, fontWeight: '600', color: V.textPrimary, maxWidth: '65%' },
});
