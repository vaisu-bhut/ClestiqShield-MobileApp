import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

class ApiService {
    private async getHeaders(contentType = 'application/json') {
        const token = await AsyncStorage.getItem('auth_token');
        const headers: Record<string, string> = {
            'Content-Type': contentType,
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    private async handleResponse(response: Response) {
        if (response.status === 401) {
            // Token expired or invalid
            await AsyncStorage.removeItem('auth_token');
            // Ideally trigger a navigation to login or event
            throw new Error('Unauthorized');
        }
        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { detail: errorText };
            }
            throw new Error(errorData.detail || 'API Request Failed');
        }
        return response.json();
    }

    async login(username: string, password: string): Promise<{ access_token: string; user_id: string }> {
        // Gateway expects Form Data for login (OAuth2PasswordRequestForm)
        const formBody = new URLSearchParams();
        formBody.append('username', username);
        formBody.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody.toString(),
        });

        const data = await this.handleResponse(response);
        return data;
    }

    async signup(email: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return this.handleResponse(response);
    }

    async getUsers() {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'GET',
            headers,
        });
        return this.handleResponse(response);
    }

    async getProfile(userId: string) {
        // Using /users/{userId} as there is no /users/me yet
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'GET',
            headers,
        });
        return this.handleResponse(response);
    }

    async getApps() {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE_URL}/apps/`, {
            method: 'GET',
            headers,
        });
        return this.handleResponse(response);
    }

    async createApp(name: string, description: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE_URL}/apps/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name, description }),
        });
        return this.handleResponse(response);
    }

    async getAppDetails(appId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE_URL}/apps/${appId}`, {
            method: 'GET',
            headers,
        });
        return this.handleResponse(response);
    }

    async getAppKeys(appId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE_URL}/apps/${appId}/keys`, {
            method: 'GET',
            headers,
        });
        return this.handleResponse(response);
    }

    async createApiKey(appId: string, name: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE_URL}/apps/${appId}/keys`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name }),
        });
        return this.handleResponse(response);
    }

    async logout() {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_id');
    }
}

export const api = new ApiService();
