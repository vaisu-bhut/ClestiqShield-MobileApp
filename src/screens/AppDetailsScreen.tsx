import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionSheetIOS, Platform } from 'react-native'; // Optional if needed for better alerts? standard Alert is fine
import { Key, Trash2, ArrowLeft, Copy, Plus, X, Edit2 } from 'lucide-react-native';
import { api } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../styles/colors';

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

    // Edit App State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editName, setEditName] = useState(appName);
    const [editDesc, setEditDesc] = useState(''); // Not initially loaded, might need to fetch details first if description needed
    const [updatingApp, setUpdatingApp] = useState(false);
    const [currentAppDetails, setCurrentAppDetails] = useState<any>(null);

    useEffect(() => {
        loadKeys();
        loadAppDetails();
    }, []);

    const loadAppDetails = async () => {
        try {
            const details = await api.getAppDetails(appId);
            setCurrentAppDetails(details);
            setEditName(details.name);
            setEditDesc(details.description || '');
        } catch (e) {
            console.error(e);
        }
    };

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
    const handleUpdateApp = async () => {
        try {
            setUpdatingApp(true);
            const updated = await api.updateApp(appId, { name: editName, description: editDesc });
            setCurrentAppDetails(updated);
            setEditModalVisible(false);
            Alert.alert('Success', 'Application updated');
            // Optimistically update header title? Or navigation params?
            // navigation.setParams({ appName: editName }); // Requires navigation prop type adjustment
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update app');
        } finally {
            setUpdatingApp(false);
        }
    };

    const handleDeleteApp = () => {
        Alert.alert(
            'Delete Application',
            'Are you sure you want to delete this application? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.deleteApp(appId);
                            Alert.alert('Success', 'Application deleted');
                            navigation.goBack();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete app');
                        }
                    }
                }
            ]
        );
    };

    const handleRevokeKey = (keyId: string) => {
        Alert.alert(
            'Revoke API Key',
            'Are you sure you want to revoke this key? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Revoke',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.revokeApiKey(appId, keyId);
                            loadKeys();
                            Alert.alert('Revoked', 'API Key has been revoked');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to revoke key');
                        }
                    }
                }
            ]
        );
    };

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied', 'API Key copied to clipboard');
    };

    const renderKey = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.keyIcon}>
                    <Key size={20} color={colors.primary} />
                </View>
                <View style={styles.keyInfo}>
                    <Text style={styles.keyName}>{item.name}</Text>
                    <Text style={styles.keyPrefix}>Prefix: {item.key_prefix}...</Text>
                </View>
                <TouchableOpacity onPress={() => handleRevokeKey(item.id)} style={styles.revokeButton}>
                    <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={styles.title}>{currentAppDetails ? currentAppDetails.name : appName}</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.backButton}>
                    <Edit2 size={24} color={colors.primary} />
                </TouchableOpacity>
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
                    <ActivityIndicator size="large" color={colors.primary} />
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

            <View style={styles.deleteContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteApp}>
                    <Trash2 size={20} color="white" />
                    <Text style={styles.deleteButtonText}>Delete Application</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    if (!createdKeySecret) setModalVisible(false);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheet}>
                        {createdKeySecret ? (
                            <>
                                <View style={styles.successHeader}>
                                    <Text style={styles.modalTitle}>Key Created!</Text>
                                    <TouchableOpacity onPress={() => {
                                        setCreatedKeySecret(null);
                                        setModalVisible(false);
                                    }}>
                                        <X size={24} color={colors.mutedForeground} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.warningText}>
                                    Please copy your new API key now. You won't be able to see it again!
                                </Text>
                                <View style={styles.secretBox}>
                                    <Text style={styles.secretText}>{createdKeySecret}</Text>
                                    <TouchableOpacity onPress={() => copyToClipboard(createdKeySecret)}>
                                        <Copy size={20} color={colors.primary} />
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
                                        <X size={24} color={colors.mutedForeground} />
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Key Name (e.g. Production)"
                                    placeholderTextColor={colors.mutedForeground}
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

            {/* Edit App Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Application</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
                                <X size={24} color={colors.mutedForeground} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>App Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editName}
                            onChangeText={setEditName}
                            placeholderTextColor={colors.mutedForeground}
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                            value={editDesc}
                            onChangeText={setEditDesc}
                            multiline
                            placeholderTextColor={colors.mutedForeground}
                        />

                        <TouchableOpacity
                            style={[styles.createButton, updatingApp && styles.disabled]}
                            onPress={handleUpdateApp}
                            disabled={updatingApp}
                        >
                            <Text style={styles.createButtonText}>{updatingApp ? 'Updating...' : 'Save Changes'}</Text>
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
        backgroundColor: colors.background,
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
        color: colors.foreground,
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
        color: colors.mutedForeground,
    },
    addButton: {
        backgroundColor: colors.primary,
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
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    keyIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
        color: colors.foreground,
        marginBottom: 2,
    },
    keyPrefix: {
        fontSize: 13,
        color: colors.mutedForeground,
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
        color: colors.mutedForeground,
        fontSize: 14,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        backgroundColor: colors.richBlack,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
        minHeight: 300,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.border,
    },
    closeButton: {
        padding: 4,
    },
    deleteContainer: {
        padding: 20,
        paddingTop: 0,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.error,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        color: colors.foreground,
    },
    input: {
        backgroundColor: colors.input,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        color: colors.foreground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    createButton: {
        backgroundColor: colors.primary,
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
        color: colors.warning,
        marginBottom: 16,
        fontSize: 14,
        lineHeight: 20,
    },
    secretBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.input,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    secretText: {
        fontFamily: 'monospace',
        fontSize: 16,
        color: colors.foreground,
        flex: 1,
    },
    doneButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    revokeButton: {
        padding: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.mutedForeground,
        marginBottom: 8,
    },
});
