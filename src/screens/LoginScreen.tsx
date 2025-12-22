import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { colors } from '../styles/colors';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
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

            // Backend now returns user_id directly
            if (data.user_id) {
                await AsyncStorage.setItem('user_id', String(data.user_id));
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
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>Clestiq Shield</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor={colors.mutedForeground}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor={colors.mutedForeground}
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

                <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkButton}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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
        backgroundColor: colors.background,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginBottom: 10,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.foreground,
        marginTop: 10,
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    input: {
        backgroundColor: colors.input,
        padding: 15,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        fontSize: 16,
        color: colors.foreground,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: colors.primaryForeground,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    errorText: {
        color: colors.error,
        marginBottom: 10,
        textAlign: 'center',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
});
