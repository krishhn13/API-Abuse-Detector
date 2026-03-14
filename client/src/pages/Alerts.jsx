import { useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, Clock, Server } from 'lucide-react'
import { alertsData as initialAlerts } from '../data/mockData'

const severityConfig = {
  critical: { color: 'danger',  Icon: XCircle       },
  high:     { color: 'warning', Icon: AlertTriangle  },
  medium:   { color: 'info',    Icon: Info           },
  low:      { color: 'success', Icon: CheckCircle    },
}

function Alerts() {
  const [alerts, setAlerts]         = useState(initialAlerts)
  const [filter, setFilter]         = useState('all')
  const [showResolved, setResolved] = useState(false)

  const filtered = alerts.filter(a => {
    const matchesSeverity = filter === 'all' || a.severity === filter
    const matchesResolved = showResolved || !a.resolved
    return matchesSeverity && matchesResolved
  })

  const resolve = id =>
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, resolved: true } : a)))

  const counts = {
    all:      alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    high:     alerts.filter(a => a.severity === 'high'     && !a.resolved).length,
    medium:   alerts.filter(a => a.severity === 'medium'   && !a.resolved).length,
    low:      alerts.filter(a => a.severity === 'low'      && !a.resolved).length,
  }

  return (
    <div className="page">
      <div className="alerts-controls">
        <div className="filter-tabs">
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-tab ${filter === f ? 'filter-tab-active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {counts[f] > 0 && (
                <span className={`tab-count${f !== 'all' ? ` count-${severityConfig[f]?.color}` : ''}`}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={e => setResolved(e.target.checked)}
          />
          Show resolved
        </label>
      </div>

      <div className="alerts-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <CheckCircle size={40} />
            <p>No alerts match the current filter.</p>
          </div>
        )}

        {filtered.map(alert => {
          const { color, Icon } = severityConfig[alert.severity]
          return (
            <div
              key={alert.id}
              className={`alert-card alert-card-${color} ${alert.resolved ? 'alert-resolved' : ''}`}
            >
              <div className="alert-card-left">
                <div className={`alert-icon alert-icon-${color}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="alert-card-body">
                <div className="alert-card-header">
                  <span className="alert-card-type">{alert.type}</span>
                  <div className="alert-card-meta">
                    <span className="alert-card-endpoint">
                      <Server size={11} /> {alert.endpoint}
                    </span>
                    <span className="alert-card-time">
                      <Clock size={11} /> {alert.time}
                    </span>
                  </div>
                </div>
                <p className="alert-card-message">{alert.message}</p>
              </div>

              <div className="alert-card-actions">
                <span className={`badge badge-${color}`}>{alert.severity}</span>
                {!alert.resolved ? (
                  <button onClick={() => resolve(alert.id)} className="resolve-btn">
                    Resolve
                  </button>
                ) : (
                  <span className="resolved-tag">✓ Resolved</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Alerts
