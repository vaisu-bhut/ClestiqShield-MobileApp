import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Volume2, User, LogOut, Zap, Edit2, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export const ProfileScreen = ({ onLogout }: { onLogout: () => void }) => {
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const [vibration, setVibration] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [updating, setUpdating] = useState(false);

    React.useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const userId = await AsyncStorage.getItem('user_id');
            const email = await AsyncStorage.getItem('user_email');

            if (userId) {
                const userData = await api.getProfile(userId);
                setUser(userData);
            } else if (email) {
                // Fallback: try to find user by email again if ID missing
                const users = await api.getUsers();
                const foundUser = users.find((u: any) => u.email === email);
                if (foundUser) {
                    await AsyncStorage.setItem('user_id', String(foundUser.id));
                    setUser(foundUser);
                }
            }
        } catch (e) {
            console.error('Failed to load profile', e);
        }
    };

    const handleLogout = async () => {
        await api.logout();
        onLogout();
    };

    const handleUpdateProfile = async () => {
        if (!editName.trim()) return;
        try {
            setUpdating(true);
            const updatedUser = await api.updateProfile({ full_name: editName });
            setUser(updatedUser);
            setEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const openEditModal = () => {
        if (user) {
            setEditName(user.full_name || user.name || '');
            setEditModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <User size={40} color="#849bff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{user ? (user.full_name || user.name || user.email) : 'Loading...'}</Text>
                        <Text style={styles.role}>{user ? 'User' : '...'}</Text>
                    </View>
                    <TouchableOpacity onPress={openEditModal} style={styles.editButton}>
                        <Edit2 size={20} color="#4f46e5" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
                            <Bell size={20} color="#849bff" />
                        </View>
                        <Text style={styles.rowLabel}>Error Notifications</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#d1d5db', true: '#818cf8' }}
                        thumbColor={notifications ? '#849bff' : '#f3f4f6'}
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
                        thumbColor={sound ? '#849bff' : '#f3f4f6'}
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
                        thumbColor={vibration ? '#849bff' : '#f3f4f6'}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.logoutButton, { marginTop: 12, backgroundColor: '#fee2e2' }]} onPress={() => {
                Alert.alert(
                    'Delete Account',
                    'Are you sure you want to delete your account? This action cannot be undone.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                                try {
                                    await api.deleteAccount();
                                    await onLogout();
                                } catch (error: any) {
                                    Alert.alert('Error', error.response?.data?.detail || error.message || 'Failed to delete account');
                                }
                            }
                        }
                    ]
                );
            }}>
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Delete Account</Text>
            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <X size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editName}
                            onChangeText={setEditName}
                            autoCapitalize="words"
                        />

                        <TouchableOpacity
                            style={[styles.saveButton, updating && styles.disabled]}
                            onPress={handleUpdateProfile}
                            disabled={updating}
                        >
                            <Text style={styles.saveButtonText}>{updating ? 'Updating...' : 'Save Changes'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
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
    editButton: {
        padding: 8,
        backgroundColor: '#e0e7ff',
        borderRadius: 20,
    },
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f3f4f6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        fontSize: 16,
        color: '#1f2937',
    },
    saveButton: {
        backgroundColor: '#4f46e5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.7,
    },
});
