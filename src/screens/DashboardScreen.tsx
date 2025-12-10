import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MetricCard } from '../components/MetricCard';
import { mockMetrics, mockApps } from '../data/mockMetrics';

export const DashboardScreen = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.welcome}>Welcome back,</Text>
                    <Text style={styles.user}>Admin</Text>
                </View>

                <Text style={styles.sectionTitle}>Overview</Text>
                <View style={styles.metricsContainer}>
                    {mockMetrics.map((metric, index) => (
                        <MetricCard key={metric.id} {...metric} iconName={metric.icon} index={index} />
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Active Applications</Text>
                <View style={styles.appsList}>
                    {mockApps.map((app) => (
                        <View key={app.id} style={styles.appRow}>
                            <View style={styles.appInfo}>
                                <View style={[styles.statusDot, { backgroundColor: app.status === 'running' ? '#10b981' : app.status === 'error' ? '#ef4444' : '#9ca3af' }]} />
                                <Text style={styles.appName}>{app.name}</Text>
                            </View>
                            <Text style={styles.uptime}>{app.uptime}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    welcome: {
        fontSize: 16,
        color: '#6b7280',
    },
    user: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
        marginTop: 8,
    },
    metricsContainer: {
        marginBottom: 24,
    },
    appsList: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    appRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    appInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    appName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1f2937',
    },
    uptime: {
        fontSize: 13,
        color: '#6b7280',
    },
});
