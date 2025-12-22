import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert, Activity, DollarSign, AlertCircle, Cpu, LucideIcon } from 'lucide-react-native';
import { colors } from '../styles/colors';

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
    const statusColor = status === 'good' ? colors.success : status === 'warning' ? colors.warning : colors.error;

    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: `${statusColor}20` }]}>
                <Icon size={24} color={statusColor} />
            </View>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
                <Text style={[styles.change, { color: status === 'critical' ? colors.error : colors.mutedForeground }]}>
                    {change} from last week
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        // minimal shadow/border for dark mode
        borderWidth: 1,
        borderColor: colors.border,
        gap: 16,
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
    },
    title: {
        fontSize: 14,
        color: colors.mutedForeground,
        marginBottom: 4,
        fontWeight: '500',
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.foreground,
    },
    change: {
        fontSize: 12,
        marginTop: 2,
    },
});
