'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import adminApi from '@/lib/adminApi';
import toast from 'react-hot-toast';
import {
  Bell, X, CheckCheck, ShieldCheck, ShieldOff, FileText,
  Settings, Info, Home, Users, Briefcase, Tag, Star,
  HelpCircle, Mail, Trash2, Edit3, PlusCircle, Image,
  UserCheck, UserX, AlertTriangle, Building2,
} from 'lucide-react';

// ─── Type → icon/color config ────────────────────────────────────────────────
const TYPE_CONFIG = {
  // Access / RBAC
  access_granted:   { icon: UserCheck,   color: '#4ade80', bg: 'rgba(34,197,94,0.12)',   label: 'Access' },
  access_revoked:   { icon: UserX,       color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Access' },
  page_added:       { icon: ShieldCheck, color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  label: 'Access' },
  page_removed:     { icon: ShieldOff,   color: '#facc15', bg: 'rgba(234,179,8,0.12)',   label: 'Access' },
  profile_updated:  { icon: Settings,    color: '#c084fc', bg: 'rgba(192,132,252,0.12)', label: 'Access' },
  // Cranes
  crane_created:    { icon: PlusCircle,  color: '#34d399', bg: 'rgba(52,211,153,0.12)',  label: 'Cranes' },
  crane_updated:    { icon: Edit3,       color: '#34d399', bg: 'rgba(52,211,153,0.12)',  label: 'Cranes' },
  crane_deleted:    { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Cranes' },
  // Services
  service_created:  { icon: PlusCircle,  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'Services' },
  service_updated:  { icon: Edit3,       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'Services' },
  service_deleted:  { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Services' },
  // Projects
  project_created:  { icon: PlusCircle,  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  label: 'Projects' },
  project_updated:  { icon: Edit3,       color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  label: 'Projects' },
  project_deleted:  { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Projects' },
  // Blogs
  blog_created:     { icon: PlusCircle,  color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  label: 'Blogs' },
  blog_updated:     { icon: Edit3,       color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  label: 'Blogs' },
  blog_deleted:     { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Blogs' },
  // Careers
  career_created:   { icon: Briefcase,   color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  label: 'Careers' },
  career_updated:   { icon: Edit3,       color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  label: 'Careers' },
  career_deleted:   { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Careers' },
  // Categories
  category_created: { icon: Tag,         color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: 'Categories' },
  category_updated: { icon: Edit3,       color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: 'Categories' },
  category_deleted: { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Categories' },
  // Clients
  client_created:   { icon: Star,        color: '#f472b6', bg: 'rgba(244,114,182,0.12)', label: 'Clients' },
  client_updated:   { icon: Edit3,       color: '#f472b6', bg: 'rgba(244,114,182,0.12)', label: 'Clients' },
  client_deleted:   { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Clients' },
  // FAQs
  faq_created:      { icon: HelpCircle,  color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)',  label: 'FAQs' },
  faq_updated:      { icon: Edit3,       color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)',  label: 'FAQs' },
  faq_deleted:      { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'FAQs' },
  // Pages
  homepage_updated: { icon: Home,        color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  label: 'Homepage' },
  about_updated:    { icon: Building2,   color: '#a3e635', bg: 'rgba(163,230,53,0.12)',  label: 'About' },
  // Contacts
  contact_received: { icon: Mail,        color: '#f87171', bg: 'rgba(239,68,68,0.15)',   label: 'Contacts' },
  contact_deleted:  { icon: Trash2,      color: '#f87171', bg: 'rgba(239,68,68,0.12)',   label: 'Contacts' },
  // Settings
  settings_updated: { icon: Settings,    color: '#94a3b8', bg: 'rgba(100,116,139,0.12)', label: 'Settings' },
  // Generic
  system:           { icon: Info,        color: '#94a3b8', bg: 'rgba(100,116,139,0.12)', label: 'System' },
};

// Filter tab groups
const FILTER_TABS = [
  { key: 'all',      label: 'All' },
  { key: 'access',   label: 'Access' },
  { key: 'content',  label: 'Content' },
  { key: 'contacts', label: 'Enquiries' },
];

const CONTENT_TYPES = [
  'crane_created','crane_updated','crane_deleted',
  'service_created','service_updated','service_deleted',
  'project_created','project_updated','project_deleted',
  'blog_created','blog_updated','blog_deleted',
  'career_created','career_updated','career_deleted',
  'category_created','category_updated','category_deleted',
  'client_created','client_updated','client_deleted',
  'faq_created','faq_updated','faq_deleted',
  'homepage_updated','about_updated','settings_updated',
];

const ACCESS_TYPES = ['access_granted','access_revoked','page_added','page_removed','profile_updated'];
const CONTACT_TYPES = ['contact_received','contact_deleted'];

function matchesFilter(n, filter) {
  if (filter === 'all') return true;
  if (filter === 'access') return ACCESS_TYPES.includes(n.type);
  if (filter === 'content') return CONTENT_TYPES.includes(n.type);
  if (filter === 'contacts') return CONTACT_TYPES.includes(n.type);
  return true;
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await adminApi.get('/auth/notifications');
      setNotifications(res.data.data || []);
      setUnread(res.data.unreadCount || 0);
    } catch (e) { /* silent */ }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAllRead = async () => {
    try {
      await adminApi.put('/auth/notifications/read-all');
      setNotifications(n => n.map(x => ({ ...x, isRead: true })));
      setUnread(0);
    } catch (e) { toast.error('Failed to mark as read'); }
  };

  const markRead = async (id) => {
    try {
      await adminApi.put(`/auth/notifications/${id}/read`);
      setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
      setUnread(u => Math.max(0, u - 1));
    } catch (e) { /* silent */ }
  };

  const deleteNotification = async (e, id, isRead) => {
    e.stopPropagation();
    try {
      await adminApi.delete(`/auth/notifications/${id}`);
      setNotifications(n => n.filter(x => x._id !== id));
      if (!isRead) setUnread(u => Math.max(0, u - 1));
    } catch (e) { toast.error('Failed to delete'); }
  };

  const clearAll = async () => {
    try {
      await adminApi.delete('/auth/notifications');
      setNotifications([]);
      setUnread(0);
      toast.success('All notifications cleared');
    } catch (e) { toast.error('Failed to clear'); }
  };

  const handleToggle = () => {
    setOpen(o => !o);
    if (!open) fetchNotifications();
  };

  const filtered = notifications.filter(n => matchesFilter(n, filter));
  const filteredUnread = filtered.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2.5 rounded-xl transition-all"
        style={{
          background: open ? 'rgba(220,38,38,0.15)' : '#1e293b',
          border: open ? '1px solid rgba(220,38,38,0.3)' : '1px solid #334155',
          cursor: 'pointer',
          color: '#94a3b8',
        }}>
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: '#dc2626', boxShadow: '0 0 0 2px #0f172a' }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute right-0 top-12 w-[420px] rounded-2xl overflow-hidden"
          style={{
            background: '#0f172a',
            border: '1px solid rgba(51,65,85,0.8)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
            zIndex: 100,
          }}>
          {/* Header */}
          <div className="px-5 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" style={{ color: '#ef4444' }} />
                <h3 className="font-bold text-white text-sm">Notifications</h3>
                {unread > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(220,38,38,0.2)', color: '#f87171' }}>
                    {unread} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {unread > 0 && (
                  <button onClick={markAllRead}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(51,65,85,0.5)', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', cursor: 'pointer' }}>
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '4px' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Filter tabs */}
            <div className="flex gap-1">
              {FILTER_TABS.map(tab => (
                <button key={tab.key} onClick={() => setFilter(tab.key)}
                  className="text-xs px-3 py-1 rounded-lg font-medium transition-all"
                  style={{
                    background: filter === tab.key ? 'rgba(220,38,38,0.2)' : 'rgba(51,65,85,0.3)',
                    color: filter === tab.key ? '#f87171' : '#64748b',
                    border: filter === tab.key ? '1px solid rgba(220,38,38,0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: '440px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: '#94a3b8' }} />
                <p className="text-sm" style={{ color: '#475569' }}>
                  {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                </p>
              </div>
            ) : (
              filtered.map(n => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n._id}
                    className="group flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all"
                    style={{
                      borderBottom: '1px solid rgba(51,65,85,0.2)',
                      background: n.isRead ? 'transparent' : 'rgba(220,38,38,0.04)',
                    }}
                    onClick={() => !n.isRead && markRead(n._id)}>
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: cfg.bg }}>
                      <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold text-white leading-tight">{n.title}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!n.isRead && (
                            <div className="w-2 h-2 rounded-full" style={{ background: '#dc2626' }} />
                          )}
                          <button
                            onClick={(e) => deleteNotification(e, n._id, n.isRead)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#94a3b8' }}>{n.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-[10px]" style={{ color: '#475569' }}>{timeAgo(n.createdAt)}</p>
                        {n.actor?.name && (
                          <p className="text-[10px]" style={{ color: '#334155' }}>by {n.actor.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-2.5 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(51,65,85,0.3)' }}>
              <p className="text-[10px]" style={{ color: '#334155' }}>
                {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
                {filteredUnread > 0 ? ` · ${filteredUnread} unread` : ''}
              </p>
              <p className="text-[10px]" style={{ color: '#1e293b' }}>Auto-refreshes every 30s</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
