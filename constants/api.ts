import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEV_BACKEND_PORT = '4000';

const getApiBaseUrl = (): string => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    if (Platform.OS === 'web') {
        return '/api';
    }
    // On a physical device, Expo sets debuggerHost to "IP:PORT".
    // Use that IP so the device can reach the dev machine over LAN.
    const debuggerHost = Constants.expoConfig?.hostUri
        ?? (Constants as any).manifest?.debuggerHost;
    if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        return `http://${ip}:${DEV_BACKEND_PORT}/api`;
    }
    return `http://192.168.1.109:${DEV_BACKEND_PORT}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
