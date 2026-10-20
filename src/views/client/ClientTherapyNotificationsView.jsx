import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  BookOpen,
  User,
  CreditCard,
  Mail,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Sliders,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ClientTherapyNotificationsView({
  notifications = [],
  unreadCount = 0,
  loading = false,
  error = null,
  preferences = { smsReminders: true, whatsappReminders: false, digestFrequency: 'daily' },
  loadingPreferences = false,
  onRefresh,
  onMarkAsRead,
  onMarkAllAsRead,
  onUpdatePreferences,
  onNavigateTab,
  onOpenHomework,
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // all | unread | sessions | homework | billing
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [prefForm, setPrefForm] = useState(preferences);

  // Sync preference prop changes
  React.useEffect(() => {
    if (preferences) {
      setPrefForm(preferences);
    }
  }, [preferences]);

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'sessions') return n.type.startsWith('session_');
    if (activeFilter === 'homework') return n.type.startsWith('homework_');
    if (activeFilter === 'billing') return n.type.startsWith('payment_') || n.linkTab === 'billing';
    return true;
  });

  // Handle preference update
  const handlePreferenceSave = async (e) => {
    e.preventDefault();
    setSavingPreferences(true);
    try {
      if (onUpdatePreferences) {
        await onUpdatePreferences(prefForm);
      }
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSavingPreferences(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session_confirmed':
      case 'session_rescheduled':
      case 'session_cancelled':
        return <Calendar size={16} className="text-emerald-800" />;
      case 'homework_assigned':
      case 'homework_reviewed':
        return <BookOpen size={16} className="text-blue-800" />;
      case 'therapist_matched':
        return <User size={16} className="text-amber-800" />;
      case 'payment_refunded':
        return <CreditCard size={16} className="text-purple-800" />;
      case 'email_delivery':
      default:
        return <Mail size={16} className="text-[#66747A]" />;
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead && onMarkAsRead) {
      onMarkAsRead(item.id);
    }

    if (item.linkTab && onNavigateTab) {
      if (item.linkTab === 'homework' && item.targetId && onOpenHomework) {
        onNavigateTab('homework');
        onOpenHomework(item.targetId);
      } else {
        onNavigateTab(item.linkTab);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
            <Bell size={12} className="text-emerald-700" /> Authorized Care Communications
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] font-medium">
            Notifications &amp; Activity
          </h1>
          <p className="text-xs text-[#66747A] mt-1">
            Authoritative session alerts, clinician reflections, and communication preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowPreferencesPanel(!showPreferencesPanel)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer shadow-2xs ${
              showPreferencesPanel
                ? 'bg-[#132A24] text-white border-[#132A24]'
                : 'bg-white text-[#132A24] border-[#263238]/15 hover:bg-[#F4F1EC]'
            }`}
          >
            <Sliders size={13} />
            <span>Preferences</span>
          </button>

          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              type="button"
              onClick={() => onMarkAllAsRead(notifications.map((n) => n.id))}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <CheckCheck size={13} />
              <span>Mark all read</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-xs text-[#132A24] bg-white border border-[#263238]/15 rounded-xl hover:bg-[#F4F1EC] transition-colors shadow-2xs cursor-pointer"
            title="Refresh notifications"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-red-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-900">Unable to load notifications</h4>
              <p className="text-xs text-red-800">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-semibold px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Notification Preferences Collapsible Panel */}
      {showPreferencesPanel && (
        <form
          onSubmit={handlePreferenceSave}
          className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-5 animate-in fade-in duration-200"
        >
          <div className="border-b border-[#263238]/10 pb-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-medium text-[#132A24]">
                Notification &amp; Delivery Preferences
              </h3>
              <p className="text-xs text-[#66747A]">
                Configure how you receive session reminders, homework alerts, and platform digests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* SMS Reminders Toggle */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#263238]/10 hover:bg-[#F4F1EC]/40 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={prefForm.smsReminders}
                onChange={(e) => setPrefForm({ ...prefForm, smsReminders: e.target.checked })}
                className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#132A24] block">SMS Reminders</span>
                <span className="text-[11px] text-[#66747A] leading-relaxed block">
                  Receive SMS alerts 1 hour before scheduled consultations.
                </span>
              </div>
            </label>

            {/* WhatsApp Reminders Toggle */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#263238]/10 hover:bg-[#F4F1EC]/40 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={prefForm.whatsappReminders}
                onChange={(e) => setPrefForm({ ...prefForm, whatsappReminders: e.target.checked })}
                className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 h-4 w-4"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#132A24] block">WhatsApp Alerts</span>
                <span className="text-[11px] text-[#66747A] leading-relaxed block">
                  Receive session updates and calendar links via WhatsApp.
                </span>
              </div>
            </label>

            {/* Email Digest Frequency */}
            <div className="p-4 rounded-xl border border-[#263238]/10 space-y-2">
              <label className="text-xs font-bold text-[#132A24] block">Digest Frequency</label>
              <select
                value={prefForm.digestFrequency}
                onChange={(e) => setPrefForm({ ...prefForm, digestFrequency: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-[#263238]/15 bg-white text-[#263238] focus:ring-1 focus:ring-emerald-700"
              >
                <option value="immediate">Immediate (All events)</option>
                <option value="daily">Daily Morning Digest</option>
                <option value="weekly">Weekly Summary</option>
                <option value="none">Essential Only</option>
              </select>
              <span className="text-[10px] text-[#66747A] block">
                Controls cadence of non-urgent platform summaries.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPreferencesPanel(false)}
              className="text-xs px-3.5 py-2 font-medium text-[#66747A] hover:text-[#132A24]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingPreferences}
              className="px-4 py-2 bg-[#132A24] text-white hover:bg-[#1C3E35] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              {savingPreferences && <RefreshCw size={12} className="animate-spin" />}
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. Notifications Feed with Filter Pills */}
      <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-4">
          <div>
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Recent Communications
            </h3>
            <p className="text-xs text-[#66747A] mt-0.5">
              Showing {filteredNotifications.length} update{filteredNotifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` (${unreadCount} unread)`}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#F4F1EC] rounded-xl self-start sm:self-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'sessions', label: 'Sessions' },
              { id: 'homework', label: 'Self-Work' },
              { id: 'billing', label: 'Billing' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#132A24] text-white shadow-2xs'
                    : 'text-[#66747A] hover:text-[#132A24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Feed */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#66747A] flex flex-col items-center justify-center gap-2">
            <RefreshCw size={20} className="animate-spin text-emerald-800" />
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F4F1EC] text-[#66747A] flex items-center justify-center mx-auto">
              <Bell size={20} />
            </div>
            <h4 className="text-sm font-semibold text-[#132A24]">No notifications found</h4>
            <p className="text-xs text-[#66747A] max-w-sm mx-auto">
              {activeFilter === 'unread'
                ? "You're all caught up! No unread notifications."
                : 'Session updates, self-work assignments, and receipts will appear here as they happen.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#263238]/6">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`py-4 px-3 sm:px-4 rounded-xl transition-all flex items-start justify-between gap-4 ${
                  !item.isRead
                    ? 'bg-emerald-50/40 hover:bg-emerald-50/70 border-l-3 border-emerald-800'
                    : 'hover:bg-[#F4F1EC]/40'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#263238]/10 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#132A24]">{item.title}</span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />
                      )}
                      {item.deliveryStatus && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                          {item.deliveryStatus}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#4E5D64] leading-relaxed break-words">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-[#8C989E] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {item.linkTab && (
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(item)}
                          className="font-bold text-emerald-900 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Open in {item.linkTab}</span>
                          <ChevronRight size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mark as read button */}
                <div className="shrink-0 flex items-center gap-2">
                  {!item.isRead && onMarkAsRead && (
                    <button
                      type="button"
                      onClick={() => onMarkAsRead(item.id)}
                      className="p-1.5 text-gray-400 hover:text-emerald-800 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Privacy Boundary Assurance Notice */}
      <div className="bg-[#F4F1EC] border border-[#263238]/10 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-[#263238]">
        <ShieldCheck size={18} className="shrink-0 text-emerald-800 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[#132A24]">
            Strict Clinical Confidentiality &amp; Privacy Boundary
          </span>
          <p className="text-[#66747A] leading-relaxed">
            Your notification feed includes only client-facing appointment updates, self-work notifications,
            and billing acknowledgments. Clinician-internal SOAP notes, diagnostic hypotheses, and supervisory
            documentation are strictly isolated and never transmitted to or accessible by client interfaces.
          </p>
        </div>
      </div>
    </div>
  );
}
