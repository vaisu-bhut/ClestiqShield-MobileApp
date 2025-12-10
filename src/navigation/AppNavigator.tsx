import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AppsScreen } from '../screens/AppsScreen';
import { AppDetailsScreen } from '../screens/AppDetailsScreen';
import { LayoutDashboard, User, Box } from 'lucide-react-native';

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    Apps: undefined;
    Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

export type AppsStackParamList = {
    AppsList: undefined;
    AppDetails: { appId: string; appName: string };
};

const AppsStack = createNativeStackNavigator<AppsStackParamList>();

const AppsNavigator = () => (
    <AppsStack.Navigator screenOptions={{ headerShown: false }}>
        <AppsStack.Screen name="AppsList" component={AppsScreen} />
        <AppsStack.Screen name="AppDetails" component={AppDetailsScreen} />
    </AppsStack.Navigator>
);

const AuthNavigator = ({ onLogin }: { onLogin: () => void }) => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={onLogin} />}
        </AuthStack.Screen>
    </AuthStack.Navigator>
);

const MainNavigator = ({ onLogout }: { onLogout: () => void }) => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4f46e5',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarStyle: {
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                height: 60,
                paddingBottom: 10,
                paddingTop: 10,
            },
        }}
    >
        <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
                tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
            }}
        />
        <Tab.Screen
            name="Apps"
            component={AppsNavigator}
            options={{
                tabBarIcon: ({ color, size }) => <Box color={color} size={size} />
            }}
        />
        <Tab.Screen
            name="Profile"
            children={() => <ProfileScreen onLogout={onLogout} />}
            options={{
                tabBarIcon: ({ color, size }) => <User color={color} size={size} />
            }}
        />
    </Tab.Navigator>
);

export const AppNavigator = ({ isAuthenticated, onLogin, onLogout }: { isAuthenticated: boolean; onLogin: () => void; onLogout: () => void }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="Main">
                    {() => <MainNavigator onLogout={onLogout} />}
                </Stack.Screen>
            ) : (
                <Stack.Screen name="Auth">
                    {() => <AuthNavigator onLogin={onLogin} />}
                </Stack.Screen>
            )}
        </Stack.Navigator>
    );
};
