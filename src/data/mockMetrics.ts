export interface Metric {
    id: string;
    title: string;
    value: string;
    change: string; // e.g., "+12%" or "-5%"
    status: 'good' | 'warning' | 'critical';
    icon: string; // Lucide icon name
}

export const mockMetrics: Metric[] = [
    {
        id: '1',
        title: 'API Failures',
        value: '0.02%',
        change: '-0.01%',
        status: 'good',
        icon: 'AlertCircle',
    },
    {
        id: '2',
        title: 'Attacks Blocked',
        value: '1,240',
        change: '+12%',
        status: 'warning', // Attacks going up is "warning" or "good"? Let's say high activity is warning/monitoring.
        icon: 'ShieldAlert',
    },
    {
        id: '3',
        title: 'Models Usage',
        value: '45k',
        change: '+5%',
        status: 'good',
        icon: 'Cpu',
    },
    {
        id: '4',
        title: 'Est. Cost',
        value: '$340.50',
        change: '+2%',
        status: 'good',
        icon: 'DollarSign',
    },
];

export interface AppInstance {
    id: string;
    name: string;
    status: 'running' | 'stopped' | 'error';
    uptime: string;
}

export const mockApps: AppInstance[] = [
    { id: '1', name: 'Security-Gateway-Alpha', status: 'running', uptime: '14d 2h' },
    { id: '2', name: 'Log-Analyzer-Beta', status: 'running', uptime: '3d 10h' },
    { id: '3', name: 'Threat-Detector-v2', status: 'error', uptime: '0m' },
    { id: '4', name: 'Billing-Service', status: 'stopped', uptime: '-' },
];
