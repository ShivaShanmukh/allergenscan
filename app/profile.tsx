import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

type MeResponse = {
    user: {
        userId: number;
        email: string;
        name?: string;
    };
};

export default function ProfileScreen() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<MeResponse['user'] | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadUser() {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    setError('No token found. Please log in again.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get<MeResponse>(`${API_BASE_URL}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data.user);
            } catch (err: any) {
                setError('Failed to load profile. Please try again.');
                console.log('Profile error:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#facc15" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>No user data.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.name || 'No name set'}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#020617',
    },
    loadingText: {
        marginTop: 8,
        color: '#e5e7eb',
    },
    errorText: {
        color: '#f97373',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        backgroundColor: '#020617',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#facc15',
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 12,
    },
    value: {
        fontSize: 18,
        color: '#f9fafb',
    },
});
