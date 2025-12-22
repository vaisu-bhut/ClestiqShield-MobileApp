import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Box, ChevronRight, X } from 'lucide-react-native';
import { api } from '../services/api';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';

type AppsStackParamList = {
    AppDetails: { appId: string; appName: string };
};

export const AppsScreen = () => {
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [newAppDesc, setNewAppDesc] = useState('');
    const [creating, setCreating] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<AppsStackParamList>>();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadApps();
        }
    }, [isFocused]);

    const loadApps = async () => {
        try {
            setLoading(true);
            const data = await api.getApps();
            setApps(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateApp = async () => {
        if (!newAppName.trim()) return;
        try {
            setCreating(true);
            await api.createApp(newAppName, newAppDesc);
            setModalVisible(false);
            setNewAppName('');
            setNewAppDesc('');
            loadApps();
        } catch (error) {
            console.error(error);
            alert('Failed to create app');
        } finally {
            setCreating(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AppDetails' as any, { appId: item.id, appName: item.name })}
        >
            <View style={styles.cardIcon}>
                <Box size={24} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={1}>{item.description || 'No description'}</Text>
            </View>
            <ChevronRight size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <View style={styles.header}>
                <Text style={styles.title}>My Apps</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Plus size={24} color="white" />
                </TouchableOpacity>
            </View>

            {loading && apps.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={apps}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No apps found. Create one to get started!</Text>
                        </View>
                    }
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create App</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={colors.mutedForeground} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="App Name"
                            placeholderTextColor={colors.mutedForeground}
                            value={newAppName}
                            onChangeText={setNewAppName}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description"
                            placeholderTextColor={colors.mutedForeground}
                            value={newAppDesc}
                            onChangeText={setNewAppDesc}
                            multiline
                            numberOfLines={3}
                        />

                        <TouchableOpacity
                            style={[styles.createButton, creating && styles.disabled]}
                            onPress={handleCreateApp}
                            disabled={creating}
                        >
                            <Text style={styles.createButtonText}>{creating ? 'Creating...' : 'Create App'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.foreground,
    },
    addButton: {
        backgroundColor: colors.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        // Minimal shadow for dark mode, or use border
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // customized for dark theme
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.cardForeground,
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        color: colors.mutedForeground,
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
        fontSize: 16,
        textAlign: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: colors.richBlack, // or colors.background + border
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 300,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.border,
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
    textArea: {
        height: 100,
        textAlignVertical: 'top',
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
});
