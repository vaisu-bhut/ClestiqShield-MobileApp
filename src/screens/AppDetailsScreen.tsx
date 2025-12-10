import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Key, Trash2, ArrowLeft, Copy, Plus, X } from 'lucide-react-native';
import { api } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

export const AppDetailsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { appId, appName } = route.params;

    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);

    useEffect(() => {
        loadKeys();
    }, []);

    const loadKeys = async () => {
        try {
            setLoading(true);
            const data = await api.getAppKeys(appId);
            setKeys(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;
        try {
            setCreating(true);
            const newKey = await api.createApiKey(appId, newKeyName);
            setCreatedKeySecret(newKey.api_key); // Use api_key field from response
            setNewKeyName('');
            loadKeys();
        } catch (error) {
            console.error(error);
            alert('Failed to create API key');
        } finally {
            setCreating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        Clipboard.setString(text);
        Alert.alert('Copied', 'API Key copied to clipboard');
    };

    const renderKey = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.keyIcon}>
                    <Key size={20} color="#4f46e5" />
                </View>
                <View style={styles.keyInfo}>
                    <Text style={styles.keyName}>{item.name}</Text>
                    <Text style={styles.keyPrefix}>Prefix: {item.key_prefix}...</Text>
                </View>
                {/* Delete button could go here */}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>{appName}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>API Keys</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Plus size={20} color="white" />
                    <Text style={styles.addButtonText}>New Key</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <FlatList
                    data={keys}
                    renderItem={renderKey}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No API keys found.</Text>
                        </View>
                    }
                />
            )}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    if (!createdKeySecret) setModalVisible(false);
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        {createdKeySecret ? (
                            <>
                                <View style={styles.successHeader}>
                                    <Text style={styles.modalTitle}>Key Created!</Text>
                                    <TouchableOpacity onPress={() => {
                                        setCreatedKeySecret(null);
                                        setModalVisible(false);
                                    }}>
                                        <X size={24} color="#6b7280" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.warningText}>
                                    Please copy your new API key now. You won't be able to see it again!
                                </Text>
                                <View style={styles.secretBox}>
                                    <Text style={styles.secretText}>{createdKeySecret}</Text>
                                    <TouchableOpacity onPress={() => copyToClipboard(createdKeySecret)}>
                                        <Copy size={20} color="#4f46e5" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={styles.doneButton}
                                    onPress={() => {
                                        setCreatedKeySecret(null);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.doneButtonText}>Done</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Create API Key</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <X size={24} color="#6b7280" />
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Key Name (e.g. Production)"
                                    value={newKeyName}
                                    onChangeText={setNewKeyName}
                                />

                                <TouchableOpacity
                                    style={[styles.createButton, creating && styles.disabled]}
                                    onPress={handleCreateKey}
                                    disabled={creating}
                                >
                                    <Text style={styles.createButtonText}>{creating ? 'Generating...' : 'Generate Key'}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    addButton: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    keyIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    keyInfo: {
        flex: 1,
    },
    keyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 2,
    },
    keyPrefix: {
        fontSize: 13,
        color: '#6b7280',
        fontFamily: 'monospace',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 14,
        textAlign: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
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
    successHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    input: {
        backgroundColor: '#f3f4f6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        color: '#1f2937',
    },
    createButton: {
        backgroundColor: '#4f46e5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.7,
    },
    warningText: {
        color: '#d97706',
        marginBottom: 16,
        fontSize: 14,
        lineHeight: 20,
    },
    secretBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f3f4f6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    secretText: {
        fontFamily: 'monospace',
        fontSize: 16,
        color: '#1f2937',
        flex: 1,
    },
    doneButton: {
        backgroundColor: '#10b981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
