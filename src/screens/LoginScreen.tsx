import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await api.login(username, password);
            await AsyncStorage.setItem('auth_token', data.access_token);
            await AsyncStorage.setItem('user_email', username);

            try {
                // Fetch users to find the current user's ID
                const users = await api.getUsers();
                const currentUser = users.find((u: any) => u.email === username);

                if (currentUser) {
                    await AsyncStorage.setItem('user_id', String(currentUser.id));
                } else {
                    console.warn('User ID not found for email:', username);
                }
            } catch (e) {
                console.warn('Failed to fetch user ID:', e);
            }

            onLogin();
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <ShieldCheck size={80} color="#4f46e5" />
                <Text style={styles.appName}>Clestiq Shield</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 10,
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4f46e5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    errorText: {
        color: '#ef4444',
        marginBottom: 10,
        textAlign: 'center',
    },
});
