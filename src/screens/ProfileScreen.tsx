import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Volume2, User, LogOut, Zap } from 'lucide-react-native';

export const ProfileScreen = ({ onLogout }: { onLogout: () => void }) => {
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const [vibration, setVibration] = useState(true);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <User size={40} color="#4f46e5" />
                    </View>
                    <View>
                        <Text style={styles.name}>Admin User</Text>
                        <Text style={styles.role}>System Administrator</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
                            <Bell size={20} color="#4f46e5" />
                        </View>
                        <Text style={styles.rowLabel}>Error Notifications</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#d1d5db', true: '#818cf8' }}
                        thumbColor={notifications ? '#4f46e5' : '#f3f4f6'}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                            <Volume2 size={20} color="#16a34a" />
                        </View>
                        <Text style={styles.rowLabel}>Sound</Text>
                    </View>
                    <Switch
                        value={sound}
                        onValueChange={setSound}
                        trackColor={{ false: '#d1d5db', true: '#818cf8' }}
                        thumbColor={sound ? '#4f46e5' : '#f3f4f6'}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
                            <Zap size={20} color="#d97706" />
                        </View>
                        <Text style={styles.rowLabel}>Vibration</Text>
                    </View>
                    <Switch
                        value={vibration}
                        onValueChange={setVibration}
                        trackColor={{ false: '#d1d5db', true: '#818cf8' }}
                        thumbColor={vibration ? '#4f46e5' : '#f3f4f6'}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 20,
    },
    header: {
        marginBottom: 32,
        marginTop: 20,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    role: {
        fontSize: 14,
        color: '#6b7280',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabel: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#fee2e2',
        borderRadius: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
});
