import { useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { API_BASE_URL } from '../constants/api';

type Allergen = {
    id: number;
    name: string;
};

export default function AllergensScreen() {
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Common allergens (these should match your DB IDs)
    const commonAllergens = [
        { id: 1, name: 'Peanuts' },
        { id: 2, name: 'Tree Nuts' },
        { id: 3, name: 'Milk' },
        { id: 4, name: 'Eggs' },
        { id: 5, name: 'Fish' },
        { id: 6, name: 'Shellfish' },
        { id: 7, name: 'Soy' },
        { id: 8, name: 'Wheat' },
        { id: 9, name: 'Sesame' },
        { id: 10, name: 'Mustard' },
    ];

    useEffect(() => {
        loadAllergens();
    }, []);

    async function loadAllergens() {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`${API_BASE_URL}/profile/allergens`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSelectedIds(response.data.allergens.map((a: Allergen) => a.id));
        } catch (err) {
            console.log('Load allergens error:', err);
        } finally {
            setLoading(false);
        }
    }

    async function saveAllergens() {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            await axios.put(
                `${API_BASE_URL}/profile/allergens`,
                { allergenIds: selectedIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Allergens saved:', selectedIds);
            router.back();
        } catch (err: any) {
            console.log('Save allergens error:', err.response?.data || err.message);
        } finally {
            setSaving(false);
        }
    }

    const toggleAllergen = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#facc15" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Allergens</Text>
            <Text style={styles.subtitle}>
                Tap to select allergens you're sensitive to
            </Text>

            <ScrollView style={styles.list}>
                {commonAllergens.map((allergen) => (
                    <Pressable
                        key={allergen.id}
                        style={[
                            styles.allergenItem,
                            selectedIds.includes(allergen.id) && styles.selectedItem,
                        ]}
                        onPress={() => toggleAllergen(allergen.id)}
                    >
                        <Text style={styles.allergenName}>{allergen.name}</Text>
                        <View
                            style={[
                                styles.checkbox,
                                selectedIds.includes(allergen.id) && styles.checkboxSelected,
                            ]}
                        />
                    </Pressable>
                ))}
            </ScrollView>

            <Pressable style={styles.saveButton} onPress={saveAllergens} disabled={saving}>
                <Text style={styles.saveButtonText}>
                    {saving ? 'Saving...' : `Save ${selectedIds.length} allergens`}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#facc15',
        marginTop: 40,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#9ca3af',
        marginBottom: 24,
    },
    list: {
        flex: 1,
    },
    allergenItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#0f172a',
    },
    selectedItem: {
        backgroundColor: '#1f2937',
    },
    allergenName: {
        flex: 1,
        fontSize: 18,
        color: '#f9fafb',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#6b7280',
    },
    checkboxSelected: {
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
    },
    saveButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#022c22',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
