'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import adminApi from '@/lib/adminApi';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Settings, HelpCircle, LogOut, Globe,
  Newspaper, Wrench, UserCheck, Building2, Star, FolderOpen,
  Phone, Briefcase, Tag, Users, UserCircle, Lock,
  ChevronRight,
} from 'lucide-react';

const PAGE_NAV_MAP = {
  homepage:   { label: 'Homepage',    href: '/admin/homepage',    icon: Globe,          color: '#ef4444' },
  about:      { label: 'About Page',  href: '/admin/about',       icon: Building2,      color: '#f97316' },
  cranes:     { label: 'Our Cranes',  href: '/admin/cranes',      icon: Star,           color: '#eab308' },
  services:   { label: 'Services',    href: '/admin/services',    icon: Wrench,         color: '#22c55e' },
  projects:   { label: 'Projects',    href: '/admin/projects',    icon: FolderOpen,     color: '#3b82f6' },
  blogs:      { label: 'Blog Posts',  href: '/admin/blogs',       icon: Newspaper,      color: '#a855f7' },
  careers:    { label: 'Careers',     href: '/admin/careers',     icon: Briefcase,      color: '#f59e0b' },
  categories: { label: 'Categories',  href: '/admin/categories',  icon: Tag,            color: '#06b6d4' },
  clients:    { label: 'Our Clients', href: '/admin/clients',     icon: UserCheck,      color: '#10b981' },
  faqs:       { label: 'FAQs',        href: '/admin/faqs',        icon: HelpCircle,     color: '#8b5cf6' },
  contacts:   { label: 'Contacts',    href: '/admin/contacts',    icon: Phone,          color: '#0d9488' },
  settings:   { label: 'Settings',    href: '/admin/settings',    icon: Settings,       color: '#64748b' },
};

const ALL_PAGE_KEYS = Object.keys(PAGE_NAV_MAP);

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isSuperAdmin = user?.role === 'superadmin';
  const allowedPageKeys = isSuperAdmin ? ALL_PAGE_KEYS : (user?.allowedPages || []).filter(k => ALL_PAGE_KEYS.includes(k));

  const handleLogout = async () => {
    try { await adminApi.post('/auth/logout'); } catch (e) {}
    logout();
    toast.success('Logged out');
    router.push('/admin/login');
  };

  const NavItem = ({ href, icon: Icon, label, color, badge }) => {
    const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
    return (
      <Link href={href} onClick={onClose} style={{ textDecoration: 'none' }}>
        <div
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer relative"
          style={{
            background: isActive ? 'rgba(220,38,38,0.12)' : 'transparent',
            border: isActive ? '1px solid rgba(220,38,38,0.2)' : '1px solid transparent',
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
        >
          {/* Active left bar */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
              style={{ background: '#dc2626' }} />
          )}
          {/* Icon container */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isActive ? color + '22' : 'rgba(255,255,255,0.04)',
              border: isActive ? `1px solid ${color}33` : '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.2s',
            }}>
            <Icon className="w-4 h-4" style={{ color: isActive ? color : '#64748b' }} />
          </div>
          <span className="flex-1 text-sm font-medium truncate"
            style={{ color: isActive ? 'white' : '#94a3b8' }}>
            {label}
          </span>
          {badge && (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5' }}>
              {badge}
            </span>
          )}
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          width: '260px',
          background: 'linear-gradient(180deg, #09090b 0%, #0c0c10 60%, #0f0f14 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo area */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: '1px solid rgba(220,38,38,0.3)', boxShadow: '0 0 12px rgba(220,38,38,0.2)' }}>
              <Image src="/companylogo.jpeg" alt="ASP Cranes" fill className="object-cover" priority />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">ASP <span style={{ color: '#ef4444' }}>Cranes</span></p>
              <p className="text-[10px] font-medium" style={{ color: '#475569', letterSpacing: '0.12em' }}>CMS PANEL</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>

          {/* Dashboard */}
          <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" color="#ef4444" />

          {/* Section divider */}
          <div className="py-2 px-3">
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Content</p>
          </div>

          {/* RBAC pages */}
          {allowedPageKeys.length === 0 && !isSuperAdmin ? (
            <div className="px-3 py-8 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Lock className="w-4 h-4" style={{ color: '#334155' }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#334155' }}>No pages assigned</p>
              <p className="text-[10px] mt-1" style={{ color: '#1e293b' }}>Contact superadmin</p>
            </div>
          ) : (
            allowedPageKeys.map(key => {
              const item = PAGE_NAV_MAP[key];
              if (!item) return null;
              return <NavItem key={key} href={item.href} icon={item.icon} label={item.label} color={item.color} />;
            })
          )}

          {/* Superadmin section */}
          {isSuperAdmin && (
            <>
              <div className="py-2 px-3 mt-1">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Superadmin</p>
              </div>
              <NavItem href="/admin/admins" icon={Users} label="Admin Management" color="#ef4444" badge="SA" />
            </>
          )}
        </nav>

        {/* User section */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Profile link */}
          <Link href="/admin/profile" onClick={onClose} style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all group"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #f87171)' }}>
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: '#22c55e', borderColor: '#09090b' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[10px] uppercase font-medium truncate"
                  style={{ color: isSuperAdmin ? '#f87171' : '#60a5fa', letterSpacing: '0.08em' }}>
                  {user?.role || 'admin'}
                </p>
              </div>
              <UserCircle className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: '#475569' }} />
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all group"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: '#64748b',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
