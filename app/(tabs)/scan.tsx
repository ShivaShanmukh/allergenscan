import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { API_BASE_URL } from '../../constants/api';
import { V } from '../../constants/theme';

const isWeb = Platform.OS === 'web';

interface ScanResult {
  product?: {
    barcode?: string;
    name: string;
    brand?: string;
    ingredients?: string;
    nutrition_grade?: string;
  };
  safe: boolean;
  riskLevel?: string;
  allergenWarnings?: { id: number; name: string }[];
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showManual, setShowManual] = useState(isWeb);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isWeb) {
      requestPermission();
    }
  }, []);

  const hasPermission = permission?.granted ?? null;

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    if (!isWeb) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await performScan(data);
  };

  const showError = (msg: string) => {
    setError(msg);
    if (!isWeb) Alert.alert('Error', msg);
    setTimeout(() => setError(null), 4000);
  };

  const performScan = async (barcodeData: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ barcode: barcodeData.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        showError(data.message || 'Product not found');
        setScanned(false);
      }
    } catch {
      showError('Cannot connect to server. Check your network.');
      setScanned(false);
    }
    setLoading(false);
  };

  const handleManualScan = async () => {
    if (!barcode.trim()) return;
    await performScan(barcode);
  };

  function getRiskInfo(riskLevel: string, safe: boolean) {
    if (safe) {
      return {
        label: 'SAFE FOR YOU',
        subtitle: 'No allergens detected based on your profile.',
        icon: 'checkmark' as const,
        color: V.mint,
        tint: '#EAF8EF',
      };
    }
    if (riskLevel === 'high') {
      return {
        label: 'NOT SAFE',
        subtitle: 'This product strongly matches your allergen profile.',
        icon: 'alert-circle' as const,
        color: V.dangerDark,
        tint: '#FDECEC',
      };
    }
    return {
      label: 'CHECK INGREDIENTS',
      subtitle: 'Review the ingredient list before deciding.',
      icon: 'warning' as const,
      color: V.warning,
      tint: '#FFF3E0',
    };
  }

  if (result) {
    const risk = getRiskInfo(result.riskLevel || '', result.safe);
    return (
      <ScrollView style={styles.resultContainer} contentContainerStyle={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              setResult(null);
              setBarcode('');
              setScanned(false);
            }}
          >
            <Ionicons name="arrow-back" size={20} color={V.textPrimary} />
          </Pressable>
          <Text style={styles.resultHeaderTitle}>Scan Result</Text>
          <View style={styles.backButtonGhost} />
        </View>

        <View style={[styles.resultHero, { backgroundColor: risk.tint }]}>
          <View style={[styles.resultIconOuter, { borderColor: risk.color + '33' }]}>
            <View style={[styles.resultIconInner, { backgroundColor: risk.color }]}>
              <Ionicons name={risk.icon} size={42} color={V.white} />
            </View>
          </View>
          <Text style={[styles.resultLabel, { color: risk.color }]}>{risk.label}</Text>
          <Text style={styles.resultSubtitle}>{risk.subtitle}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRowTop}>
            <View style={styles.infoIcon}>
              <Ionicons name="cube-outline" size={22} color={V.mintDark} />
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.productName}>{result.product?.name || 'Unknown Product'}</Text>
              {!!result.product?.brand && <Text style={styles.productBrand}>{result.product.brand}</Text>}
            </View>
          </View>

          {!!result.product?.barcode && (
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>{result.product.barcode}</Text>
            </View>
          )}

          {!!result.product?.ingredients && (
            <View style={styles.ingredientsBlock}>
              <Text style={styles.ingredientsLabel}>Ingredients</Text>
              <Text style={styles.ingredientsText}>{result.product.ingredients}</Text>
            </View>
          )}
        </View>

        {!!result.allergenWarnings?.length && (
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <Ionicons name="alert-circle" size={18} color={V.dangerDark} />
              <Text style={styles.warningTitle}>Detected allergens</Text>
            </View>

            {result.allergenWarnings.map((warning) => (
              <View key={warning.id} style={styles.warningItem}>
                <Text style={styles.warningItemText}>{warning.name}</Text>
                <View style={styles.warningDot} />
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={styles.scanAnotherButton}
          onPress={() => {
            setResult(null);
            setBarcode('');
            setScanned(false);
          }}
        >
          <Text style={styles.scanAnotherButtonText}>Scan Another Product</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (!isWeb && hasPermission === false) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={34} color={V.textSecondary} />
          </View>
          <Text style={styles.permissionTitle}>Camera access required</Text>
          <Text style={styles.permissionText}>
            VERDANT needs permission to scan barcodes live. You can still use manual barcode entry below.
          </Text>
          <Pressable style={styles.primaryAction} onPress={requestPermission}>
            <Text style={styles.primaryActionText}>Grant Permission</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => setShowManual(true)}>
            <Text style={styles.secondaryActionText}>Enter Barcode Manually</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (showManual) {
    return (
      <View style={styles.manualScreen}>
        <View style={styles.manualHeader}>
          <Pressable style={styles.backButton} onPress={() => setShowManual(false)}>
            <Ionicons name="arrow-back" size={20} color={V.textPrimary} />
          </Pressable>
          <Text style={styles.manualHeaderTitle}>Manual entry</Text>
          <View style={styles.backButtonGhost} />
        </View>

        <View style={styles.manualCard}>
          <View style={styles.manualIcon}>
            <Ionicons name="keypad-outline" size={30} color={V.mint} />
          </View>
          <Text style={styles.manualTitle}>Enter a barcode</Text>
          <Text style={styles.manualText}>Type the number shown under the product barcode.</Text>
          <TextInput
            style={styles.manualInput}
            placeholder="8901234567890"
            placeholderTextColor={V.textLight}
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="number-pad"
            autoFocus
          />
          <Pressable
            style={[styles.primaryAction, (!barcode.trim() || loading) && styles.disabledAction]}
            onPress={handleManualScan}
            disabled={!barcode.trim() || loading}
          >
            <Text style={styles.primaryActionText}>{loading ? 'Scanning...' : 'Scan Product'}</Text>
          </Pressable>
          {!!error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#D32F2F" />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  if (!isWeb && hasPermission === null) {
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.cameraShade} pointerEvents="none" />

      <View style={styles.topBar} pointerEvents="box-none">
        <Text style={styles.topBarTitle}>Scan Product</Text>
        <Pressable
          style={styles.topBarButton}
          onPress={() => setTorch((prev) => !prev)}
        >
          <Ionicons name={torch ? 'flash' : 'flash-off'} size={20} color={V.white} />
        </Pressable>
      </View>

      <View style={styles.scanFrameWrap} pointerEvents="none">
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
          <View style={styles.scanLine} />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetRow}>
          <View style={styles.bottomSheetIcon}>
            <Ionicons name={loading || scanned ? 'sync' : 'shield-checkmark'} size={22} color={V.mint} />
          </View>
          <View style={styles.bottomSheetBody}>
            <Text style={styles.bottomSheetTitle}>
              {loading || scanned ? 'Analyzing ingredients and allergens' : 'Scan a barcode to check allergens'}
            </Text>
            <Text style={styles.bottomSheetText}>
              {loading || scanned ? 'Please wait...' : 'Center the barcode inside the frame'}
            </Text>
          </View>
        </View>

        <Pressable style={styles.manualShortcut} onPress={() => setShowManual(true)}>
          <Ionicons name="keypad-outline" size={18} color={V.white} />
          <Text style={styles.manualShortcutText}>Enter manually</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: { flex: 1, backgroundColor: '#0E1113' },
  cameraShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarTitle: { color: V.white, fontSize: 22, fontWeight: '700' },
  topBarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: {
    width: 280,
    height: 190,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderColor: V.mint,
    borderWidth: 4,
  },
  cornerTopLeft: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 18 },
  cornerTopRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 18 },
  cornerBottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 18 },
  cornerBottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 18 },
  scanLine: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: '50%',
    borderTopWidth: 2,
    borderTopColor: V.mint,
    shadowColor: V.mint,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  bottomSheet: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 24,
    backgroundColor: V.white,
    borderRadius: 28,
    padding: 18,
  },
  bottomSheetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bottomSheetIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#EAF8EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bottomSheetBody: { flex: 1 },
  bottomSheetTitle: { fontSize: 16, fontWeight: '700', color: V.textPrimary, marginBottom: 4 },
  bottomSheetText: { fontSize: 13, color: V.textSecondary },
  manualShortcut: {
    backgroundColor: V.mint,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  manualShortcutText: { color: V.white, fontSize: 15, fontWeight: '700' },
  permissionScreen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    padding: 24,
  },
  permissionCard: {
    backgroundColor: V.white,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ECEFF3',
  },
  permissionIcon: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: '#F3F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  permissionTitle: { fontSize: 25, fontWeight: '800', color: V.pine, marginBottom: 8 },
  permissionText: { fontSize: 15, color: V.textSecondary, lineHeight: 22, marginBottom: 18 },
  primaryAction: {
    backgroundColor: V.mint,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryActionText: { color: V.white, fontSize: 16, fontWeight: '700' },
  secondaryAction: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F3F5F7',
  },
  secondaryActionText: { color: V.textPrimary, fontSize: 16, fontWeight: '700' },
  disabledAction: { opacity: 0.55 },
  manualScreen: { flex: 1, backgroundColor: '#F7F8FA', padding: 24, paddingTop: 56 },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  manualHeaderTitle: { fontSize: 20, fontWeight: '700', color: V.textPrimary },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: V.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonGhost: { width: 40, height: 40 },
  manualCard: {
    backgroundColor: V.white,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ECEFF3',
  },
  manualIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EAF8EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  manualTitle: { fontSize: 26, fontWeight: '800', color: V.pine, marginBottom: 8 },
  manualText: { fontSize: 15, color: V.textSecondary, lineHeight: 22, marginBottom: 18 },
  manualInput: {
    backgroundColor: '#F8FAFB',
    borderWidth: 1,
    borderColor: V.border,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 18,
    color: V.textPrimary,
    textAlign: 'center',
    letterSpacing: 1.4,
    marginBottom: 16,
  },
  resultContainer: { flex: 1, backgroundColor: '#F7F8FA' },
  resultContent: { padding: 24, paddingTop: 56, paddingBottom: 32 },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  resultHeaderTitle: { fontSize: 20, fontWeight: '700', color: V.textPrimary },
  resultHero: {
    borderRadius: 30,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 18,
  },
  resultIconOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultLabel: { fontSize: 28, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  resultSubtitle: { fontSize: 15, color: V.textSecondary, textAlign: 'center', lineHeight: 22 },
  infoCard: {
    backgroundColor: V.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEFF3',
    marginBottom: 16,
  },
  infoRowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  infoIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EAF8EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoBody: { flex: 1 },
  productName: { fontSize: 19, fontWeight: '700', color: V.textPrimary, marginBottom: 3 },
  productBrand: { fontSize: 14, color: V.textSecondary },
  metaPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F5F7',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  metaPillText: { fontSize: 12, color: V.textSecondary, fontWeight: '700' },
  ingredientsBlock: { borderTopWidth: 1, borderTopColor: '#EEF1F4', paddingTop: 14 },
  ingredientsLabel: { fontSize: 13, color: V.textSecondary, fontWeight: '700', marginBottom: 6 },
  ingredientsText: { fontSize: 14, color: V.textPrimary, lineHeight: 21 },
  warningCard: {
    backgroundColor: '#FFF6F6',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F7D7D7',
    marginBottom: 18,
  },
  warningHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  warningTitle: { fontSize: 16, fontWeight: '700', color: V.dangerDark },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: V.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  warningItemText: { fontSize: 15, fontWeight: '600', color: V.textPrimary },
  warningDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: V.dangerDark },
  scanAnotherButton: {
    backgroundColor: V.mint,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  scanAnotherButtonText: { color: V.white, fontSize: 16, fontWeight: '700' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 12,
  },
  errorBannerText: { color: '#D32F2F', fontSize: 14, fontWeight: '600', flex: 1 },
});
