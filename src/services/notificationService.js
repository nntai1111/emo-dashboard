import * as signalR from '@microsoft/signalr';
import { getCurrentToken } from './authInit';

const REALTIME_HUB = 'https://api.emoease.vn/realtimehub-service/hubs/notifications';
const NOTIFICATION_API = 'https://api.emoease.vn/notification-service/v1/notifications';

export class NotificationService {
    constructor(aliasId) {
        this.aliasId = aliasId;
        this.connection = null;
    }

    async connect(onNotification) {
        const token = getCurrentToken();
        if (!token) throw new Error('Missing token');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${REALTIME_HUB}?aliasId=${this.aliasId}`, {
                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets,
                skipNegotiation: true,
            })
            .withAutomaticReconnect()
            .build();

        this.connection.on('ReceiveNotification', onNotification);
        try {
            await this.connection.start();
        } catch (e) {
            // Fallback: disable realtime if blocked by CORS; caller should rely on REST polling
            console.warn('Realtime connection failed, falling back to REST-only mode', e);
        }
    }

    async disconnect() {
        if (this.connection) await this.connection.stop();
    }

    async getNotifications(limit = 20, cursor = null) {
        const token = getCurrentToken();
        if (!token) throw new Error('Missing token');
        let url = `${NOTIFICATION_API}?limit=${limit}`;
        if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }

    async getUnreadCount() {
        const token = getCurrentToken();
        if (!token) throw new Error('Missing token');
        const res = await fetch(`${NOTIFICATION_API}/unread-count`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        return data.count;
    }

    async markAsRead(notificationIds) {
        const token = getCurrentToken();
        if (!token) throw new Error('Missing token');
        await fetch(`${NOTIFICATION_API}/mark-read`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationIds }),
        });
    }

    async markSingleAsRead(notificationId) {
        const token = getCurrentToken();
        if (!token) throw new Error('Missing token');
        await fetch(`${NOTIFICATION_API}/mark-read`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationIds: [notificationId] }),
        });
    }

    async markAllAsRead() {
        const token = getCurrentToken();
        if (!token) throw new Error('Missing token');
        await fetch(`${NOTIFICATION_API}/mark-all-read`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}


