import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { listNotifications, markNotificationRead, markAllNotificationsRead } from '../services/candidateApi.js';
import DashboardPlaceholder from '../components/DashboardPlaceholder.jsx';

const NotificationsPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: () => listNotifications({ page: 1, limit: 20 }) });

  const notifications = data?.data?.notifications || [];

  const markMutation = useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <DashboardPlaceholder message="Loading notifications..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={() => markAllMutation.mutate()} className="text-sm text-slate-600">Mark all read</button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">No notifications.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`rounded-lg p-3 ${n.read ? 'bg-slate-50' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-slate-600">{n.message}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markMutation.mutate(n.id)} className="text-sm text-slate-600">Mark read</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
