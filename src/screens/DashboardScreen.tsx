import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MetricCard } from '../components/MetricCard';
import { mockMetrics, mockApps } from '../data/mockMetrics';
import { colors } from '../styles/colors';

export const DashboardScreen = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
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
                                <View style={[styles.statusDot, { backgroundColor: app.status === 'running' ? colors.success : app.status === 'error' ? colors.error : colors.mutedForeground }]} />
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
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    welcome: {
        fontSize: 16,
        color: colors.mutedForeground,
    },
    user: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.foreground,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.mutedForeground,
        marginBottom: 16,
        marginTop: 8,
    },
    metricsContainer: {
        marginBottom: 24,
    },
    appsList: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    appRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
        color: colors.foreground,
    },
    uptime: {
        fontSize: 13,
        color: colors.mutedForeground,
    },
});
