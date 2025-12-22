import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, StatusBar } from 'react-native';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { colors } from '../styles/colors';

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export const SignupScreen = () => {
    const navigation = useNavigation<SignupScreenNavigationProp>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await api.signup(email, password, name);
            Alert.alert('Success', 'Account created successfully! Please login.');
            navigation.navigate('Login');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
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
                <Text style={styles.subtitle}>Create an Account</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    placeholderTextColor={colors.mutedForeground}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor={colors.mutedForeground}
                    value={email}
                    onChangeText={setEmail}
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
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor={colors.mutedForeground}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                    <Text style={styles.linkText}>Already have an account? Login</Text>
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
        width: 80,
        height: 80,
        borderRadius: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.foreground,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.mutedForeground,
        marginTop: 4,
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
        marginTop: 8,
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
