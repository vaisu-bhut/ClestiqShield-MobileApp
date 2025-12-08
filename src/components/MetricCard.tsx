import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert, Activity, DollarSign, AlertCircle, Cpu, LucideIcon } from 'lucide-react-native';

const iconMap: Record<string, LucideIcon> = {
    AlertCircle,
    ShieldAlert,
    Cpu,
    DollarSign,
};

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    status: 'good' | 'warning' | 'critical';
    iconName: string;
    index: number;
}

export const MetricCard = ({ title, value, change, status, iconName }: MetricCardProps) => {
    const Icon = iconMap[iconName] || Activity;

    // Simple color logic
    const statusColor = status === 'good' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444';

    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: `${statusColor}20` }]}>
                <Icon size={24} color={statusColor} />
            </View>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
                <Text style={[styles.change, { color: status === 'critical' ? '#ef4444' : '#6b7280' }]}>
                    {change} from last week
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 16,
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
    },
    title: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
        fontWeight: '500',
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    change: {
        fontSize: 12,
        marginTop: 2,
    },
});
