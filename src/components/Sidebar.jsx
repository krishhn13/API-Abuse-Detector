import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Shield,
  Bell,
  Settings,
  FileText,
} from 'lucide-react'

const navItems = [
  { to: '/',       icon: LayoutDashboard, label: 'Dashboard'         },
  { to: '/ips',    icon: Shield,          label: 'IP Management'     },
  { to: '/alerts', icon: Bell,            label: 'Alerts', badge: 5  },
  { to: '/rules',  icon: Settings,        label: 'Rate Limit Rules'  },
  { to: '/logs',   icon: FileText,        label: 'Request Logs'      },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Shield size={18} />
        </div>
        <div className="brand-text">
          <span className="brand-name">API Shield</span>
          <span className="brand-sub">Abuse Detector</span>
        </div>
      </div>

      <div className="sidebar-status">
        <div className="status-dot status-active" />
        <span className="status-text">System Active</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-stats">
          <div className="sys-stat">
            <span className="sys-label">Uptime</span>
            <span className="sys-value">14d 7h 23m</span>
          </div>
          <div className="sys-stat">
            <span className="sys-label">Engine</span>
            <span className="sys-value">Rule-based v2</span>
          </div>
          <div className="sys-stat">
            <span className="sys-label">Version</span>
            <span className="sys-value">v1.2.4</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
