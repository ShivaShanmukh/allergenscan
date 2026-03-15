import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../constants/api';
import { V } from '../../constants/theme';

type ScanRecord = {
  id: number;
  risk_level: string;
  matched_allergens: string | { id: number; name: string }[];
  safe: boolean;
  created_at: string;
  barcode: string;
  product_name: string;
  brand: string;
  image_url: string | null;
};

export default function HistoryScreen() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/scan/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setScans(data.scans || []);
    } catch (err) {
      console.log('Load history error:', err);
    } finally {
      setLoading(false);
    }
  }

  function getRiskConfig(riskLevel: string, safe: boolean) {
    if (safe) {
      return { label: 'SAFE', icon: 'checkmark-circle' as const, color: V.mint, bg: '#EAF8EF' };
    }
    if (riskLevel === 'high') {
      return { label: 'NOT SAFE', icon: 'alert-circle' as const, color: V.dangerDark, bg: '#FDECEC' };
    }
    return { label: 'CHECK', icon: 'warning' as const, color: V.warning, bg: '#FFF3E0' };
  }

  function formatScanDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  function getDateGroup(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  const groupedScans = scans.reduce<Record<string, ScanRecord[]>>((acc, scan) => {
    const group = getDateGroup(scan.created_at);
    if (!acc[group]) acc[group] = [];
    acc[group].push(scan);
    return acc;
  }, {});

  const orderedGroups = Object.keys(groupedScans);
  const safeCount = scans.filter((scan) => scan.safe).length;
  const notSafeCount = scans.filter((scan) => !scan.safe && scan.risk_level === 'high').length;

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
        <Text style={styles.title}>Scan History</Text>
        <Text style={styles.subtitle}>Everything you have checked recently, grouped by day.</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryIcon}>
            <Ionicons name="time-outline" size={20} color={V.mint} />
          </View>
          <View>
            <Text style={styles.summaryTitle}>Your scan activity</Text>
            <Text style={styles.summarySubtext}>Current account history</Text>
          </View>
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryNumber}>{scans.length}</Text>
            <Text style={styles.summaryLabel}>Total scans</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={[styles.summaryNumber, { color: V.mintDark }]}>{safeCount}</Text>
            <Text style={styles.summaryLabel}>Safe</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={[styles.summaryNumber, { color: V.dangerDark }]}>{notSafeCount}</Text>
            <Text style={styles.summaryLabel}>Not safe</Text>
          </View>
        </View>
      </View>

      {scans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="scan-outline" size={42} color={V.textLight} />
          <Text style={styles.emptyTitle}>No scan history yet</Text>
          <Text style={styles.emptyText}>Start scanning products and they will appear here automatically.</Text>
        </View>
      ) : (
        orderedGroups.map((group) => (
          <View key={group} style={styles.groupSection}>
            <Text style={styles.groupTitle}>{group}</Text>

            {groupedScans[group].map((scan) => {
              const risk = getRiskConfig(scan.risk_level, scan.safe);
              return (
                <View key={scan.id} style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.productName}>{scan.product_name || 'Unknown Product'}</Text>
                      <Text style={styles.brand}>{scan.brand || 'Unknown brand'}</Text>
                      <Text style={styles.date}>
                        <Ionicons name="time-outline" size={12} color={V.textLight} /> {formatScanDate(scan.created_at)}
                      </Text>
                    </View>

                    <View style={[styles.badge, { backgroundColor: risk.bg }]}>
                      <Ionicons name={risk.icon} size={15} color={risk.color} />
                      <Text style={[styles.badgeText, { color: risk.color }]}>{risk.label}</Text>
                    </View>
                  </View>

                  {scan.matched_allergens && (
                    <View style={styles.chipRow}>
                      {(typeof scan.matched_allergens === 'string'
                        ? JSON.parse(scan.matched_allergens)
                        : scan.matched_allergens || []
                      ).map((allergen: { id: number; name: string }) => (
                        <View key={allergen.id} style={styles.allergenChip}>
                          <Text style={styles.allergenChipText}>{allergen.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 32 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
  header: { marginBottom: 20 },
  title: { fontSize: 30, fontWeight: '800', color: V.pine, marginBottom: 4 },
  subtitle: { fontSize: 15, color: V.textSecondary, lineHeight: 22 },
  summaryCard: {
    backgroundColor: V.white,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEFF3',
    marginBottom: 22,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EAF8EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryTitle: { fontSize: 17, fontWeight: '700', color: V.textPrimary },
  summarySubtext: { fontSize: 13, color: V.textSecondary, marginTop: 2 },
  summaryStats: { flexDirection: 'row', alignItems: 'center' },
  summaryStat: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 27, fontWeight: '800', color: V.textPrimary, marginBottom: 4 },
  summaryLabel: { fontSize: 12, color: V.textSecondary },
  summaryDivider: { width: 1, alignSelf: 'stretch', backgroundColor: '#ECEFF3' },
  emptyCard: {
    backgroundColor: V.white,
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEFF3',
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: V.textPrimary, marginTop: 14, marginBottom: 6 },
  emptyText: { fontSize: 14, color: V.textSecondary, textAlign: 'center', lineHeight: 20 },
  groupSection: { marginBottom: 20 },
  groupTitle: { fontSize: 14, fontWeight: '700', color: V.textPrimary, marginBottom: 10, marginLeft: 2 },
  card: {
    backgroundColor: V.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEFF3',
    marginBottom: 10,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardInfo: { flex: 1, marginRight: 12 },
  productName: { fontSize: 16, fontWeight: '700', color: V.textPrimary, marginBottom: 2 },
  brand: { fontSize: 13, color: V.textSecondary, marginBottom: 8 },
  date: { fontSize: 12, color: V.textLight },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: '800' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  allergenChip: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F7D7D7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  allergenChipText: { fontSize: 12, fontWeight: '700', color: V.dangerDark },
});
