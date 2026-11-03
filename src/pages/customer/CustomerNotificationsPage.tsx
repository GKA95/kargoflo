import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { EmptyState } from '../../components/common/EmptyState';

export const CustomerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<any>('/notifications/my');
      setNotifications(res.data || []);
    } catch (err: any) {
      setNotifications([]);
      setError(err.message || 'Notification service offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time delivery milestones, rider assignment alerts, and system notices.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchNotifications}
          className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          Checking for notifications...
        </div>
      ) : error ? (
        <EmptyState
          title="Notifications Offline"
          description={error}
          isError={true}
          onRetry={fetchNotifications}
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications at this time."
          description="When your package is assigned to a courier, picked up, or confirmed at destination, alerts will arrive here."
          icon={<Bell className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <h4 className="font-semibold text-slate-900">{n.title}</h4>
                <p className="text-slate-600 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
