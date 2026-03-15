import { Platform } from 'react-native';

/**
 * On web deployments (Vercel), use a relative path so requests go
 * to the same origin. On native dev builds, fall back to localhost.
 * EXPO_PUBLIC_API_URL can override both if set at build time.
 */
const getApiBaseUrl = (): string => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    // Web (Vercel): use relative path — requests go to same origin
    if (Platform.OS === 'web') {
        return '/api';
    }
    // Native (Expo Go / dev build): talk to local backend
    return 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiBaseUrl();
