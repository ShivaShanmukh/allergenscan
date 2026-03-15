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
  name: string;
  email: string;
  scanCount: number;
};

type ScanRecord = {
  id: number;
  risk_level: string;
  matched_allergens: string | { id: number; name: string }[];
  safe: boolean;
  created_at: string;
  product_name: string;
  brand: string;
};

type Allergen = { id: number; name: string };

const mapPins = [
  { id: 1, top: '26%', left: '28%' },
  { id: 2, top: '46%', left: '58%' },
  { id: 3, top: '62%', left: '38%' },
  { id: 4, top: '38%', left: '74%' },
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
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

      setUser(meData.user || null);
      setHistory(historyData.scans || []);
      setAllergens(allergenData.allergens || []);
    } catch (err) {
      console.log('Load dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }

  const safeCount = history.filter((scan) => scan.safe).length;
  const alertCount = history.length - safeCount;
  const recentScans = history.slice(0, 3);

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={V.mint} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Dashboard</Text>
        <Text style={styles.greeting}>Scan & discover</Text>
        <Text style={styles.subGreeting}>
          {user?.name ? `Hi ${user.name.split(' ')[0]}, here is your latest safety snapshot.` : 'Your latest safety snapshot.'}
        </Text>
      </View>

      <View style={styles.mapCard}>
        <View style={styles.mapCardHeader}>
          <View>
            <Text style={styles.mapTitle}>Nearby safe stores</Text>
            <Text style={styles.mapSubtext}>Map preview saved for phase two</Text>
          </View>
          <View style={styles.comingBadge}>
            <Text style={styles.comingBadgeText}>Soon</Text>
          </View>
        </View>

        <View style={styles.mapCanvas}>
          <View style={styles.parkPatch} />
          <View style={styles.gridLineHorizontalTop} />
          <View style={styles.gridLineHorizontalBottom} />
          <View style={styles.gridLineVerticalLeft} />
          <View style={styles.gridLineVerticalRight} />

          {mapPins.map((pin) => (
            <View key={pin.id} style={[styles.pinWrap, { top: pin.top as any, left: pin.left as any }]}>
              <Ionicons name="location" size={26} color={V.mint} />
            </View>
          ))}

          <View style={styles.userPulseOuter} />
          <View style={styles.userPulseInner} />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#EAF8EF' }]}>
            <Ionicons name="scan-outline" size={18} color={V.mint} />
          </View>
          <Text style={styles.statNumber}>{user?.scanCount || 0}</Text>
          <Text style={styles.statLabel}>Products scanned</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#EAF8EF' }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={V.mint} />
          </View>
          <Text style={styles.statNumber}>{safeCount}</Text>
          <Text style={styles.statLabel}>Safe products</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FDECEC' }]}>
            <Ionicons name="alert-circle-outline" size={18} color={V.dangerDark} />
          </View>
          <Text style={styles.statNumber}>{alertCount}</Text>
          <Text style={styles.statLabel}>Flagged scans</Text>
        </View>
      </View>

      <Pressable style={styles.scanButton} onPress={() => router.push('/(tabs)/scan')}>
        <View style={styles.scanButtonGlow} />
        <View style={styles.scanButtonInner}>
          <Ionicons name="scan" size={30} color={V.white} />
          <Text style={styles.scanButtonText}>SCAN</Text>
        </View>
      </Pressable>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent scans</Text>
          <Pressable onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.sectionLink}>See all</Text>
          </Pressable>
        </View>

        {recentScans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptyText}>Run your first barcode scan to populate this dashboard.</Text>
          </View>
        ) : (
          recentScans.map((scan) => (
            <View key={scan.id} style={styles.scanRow}>
              <View style={[styles.scanStatusDot, { backgroundColor: scan.safe ? V.mint : V.dangerDark }]} />
              <View style={styles.scanInfo}>
                <Text style={styles.scanName}>{scan.product_name || 'Unknown Product'}</Text>
                <Text style={styles.scanMeta}>
                  {scan.brand || 'Unknown brand'} · {formatTime(scan.created_at)}
                </Text>
              </View>
              <Text style={[styles.scanBadge, { color: scan.safe ? V.mintDark : V.dangerDark }]}>
                {scan.safe ? 'SAFE' : 'ALERT'}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your allergen profile</Text>
          <Pressable onPress={() => router.push('/onboarding/allergens')}>
            <Text style={styles.sectionLink}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.chipRow}>
          {allergens.length > 0 ? (
            allergens.map((allergen) => (
              <View key={allergen.id} style={styles.allergenChip}>
                <Text style={styles.allergenChipText}>{allergen.name}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No allergens selected yet.</Text>
          )}
        </View>
      </View>

      <View style={styles.placeholderCard}>
        <View style={styles.placeholderIcon}>
          <Ionicons name="sparkles-outline" size={18} color={V.skyStrong} />
        </View>
        <View style={styles.placeholderBody}>
          <Text style={styles.placeholderTitle}>Ivy assistant</Text>
          <Text style={styles.placeholderText}>
            Chat, voice, and store discovery stay disabled for now so we only ship real connected flows.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 32 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
  header: { marginBottom: 22 },
  kicker: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF8EF',
    color: V.mintDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  greeting: { fontSize: 31, fontWeight: '800', color: V.pine, marginBottom: 4 },
  subGreeting: { fontSize: 15, color: V.textSecondary, lineHeight: 22 },
  mapCard: {
    backgroundColor: V.white,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEFF3',
    marginBottom: 18,
    shadowColor: V.pine,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  mapTitle: { fontSize: 18, fontWeight: '700', color: V.textPrimary },
  mapSubtext: { fontSize: 12, color: V.textSecondary, marginTop: 4 },
  comingBadge: {
    backgroundColor: '#F4F6F8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  comingBadgeText: { color: V.textSecondary, fontSize: 12, fontWeight: '700' },
  mapCanvas: {
    height: 188,
    backgroundColor: '#F5F7F8',
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  parkPatch: {
    position: 'absolute',
    width: 72,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#DFF6E7',
    top: '48%',
    left: '14%',
  },
  gridLineHorizontalTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '33%',
    borderTopWidth: 1,
    borderTopColor: '#E3E7EA',
  },
  gridLineHorizontalBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '66%',
    borderTopWidth: 1,
    borderTopColor: '#E3E7EA',
  },
  gridLineVerticalLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '33%',
    borderLeftWidth: 1,
    borderLeftColor: '#E3E7EA',
  },
  gridLineVerticalRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '66%',
    borderLeftWidth: 1,
    borderLeftColor: '#E3E7EA',
  },
  pinWrap: {
    position: 'absolute',
    marginLeft: -13,
    marginTop: -26,
  },
  userPulseOuter: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(78, 142, 247, 0.22)',
    top: '50%',
    left: '50%',
    marginLeft: -14,
    marginTop: -14,
  },
  userPulseInner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: V.skyStrong,
    borderWidth: 2,
    borderColor: V.white,
    top: '50%',
    left: '50%',
    marginLeft: -6,
    marginTop: -6,
  },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 26 },
  statCard: {
    flex: 1,
    backgroundColor: V.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEFF3',
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: { fontSize: 25, fontWeight: '800', color: V.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: 12, color: V.textSecondary, lineHeight: 16 },
  scanButton: {
    alignSelf: 'center',
    width: 108,
    height: 108,
    marginBottom: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonGlow: {
    position: 'absolute',
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: 'rgba(46, 204, 113, 0.18)',
  },
  scanButtonInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: V.mint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: V.mintDark,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  scanButtonText: {
    color: V.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: V.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEFF3',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: V.textPrimary },
  sectionLink: { fontSize: 13, fontWeight: '700', color: V.mintDark },
  emptyState: {
    backgroundColor: '#F6F8FA',
    borderRadius: 18,
    padding: 18,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: V.textPrimary, marginBottom: 4 },
  emptyText: { fontSize: 14, color: V.textSecondary, lineHeight: 20 },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  scanStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  scanInfo: { flex: 1 },
  scanName: { fontSize: 15, fontWeight: '700', color: V.textPrimary, marginBottom: 3 },
  scanMeta: { fontSize: 12, color: V.textSecondary },
  scanBadge: { fontSize: 12, fontWeight: '800' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  allergenChip: {
    backgroundColor: V.roseSoft,
    borderColor: '#F7CDCD',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  allergenChipText: { color: V.dangerDark, fontSize: 13, fontWeight: '700' },
  placeholderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF5FF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D8E7FF',
  },
  placeholderIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: V.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeholderBody: { flex: 1 },
  placeholderTitle: { fontSize: 16, fontWeight: '700', color: V.textPrimary, marginBottom: 4 },
  placeholderText: { fontSize: 13, color: V.textSecondary, lineHeight: 19 },
});
