import { useState } from 'react'
import { Zap, Shield, AlertTriangle, Bell } from 'lucide-react'
import { rulesData as initialRules } from '../data/mockData'

const actionConfig = {
  throttle: { color: 'warning', Icon: Zap,           label: 'Throttle' },
  block:    { color: 'danger',  Icon: Shield,         label: 'Block'    },
  flag:     { color: 'info',    Icon: AlertTriangle,  label: 'Flag'     },
  alert:    { color: 'accent',  Icon: Bell,           label: 'Alert'    },
}

function Rules() {
  const [rules, setRules] = useState(initialRules)

  const toggleRule = id =>
    setRules(prev => prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r)))

  const totalTriggers = rules.reduce((s, r) => s + r.triggered, 0)

  return (
    <div className="page">
      {/* Summary */}
      <div className="rules-summary">
        <div className="mini-stat">
          <strong className="text-success">{rules.filter(r => r.enabled).length}</strong>
          &nbsp;Active rules
        </div>
        <div className="mini-stat">
          <strong className="text-muted">{rules.filter(r => !r.enabled).length}</strong>
          &nbsp;Disabled
        </div>
        <div className="mini-stat">
          <strong>{totalTriggers.toLocaleString()}</strong>&nbsp;total triggers (24h)
        </div>
      </div>

      {/* Rules Grid */}
      <div className="rules-grid">
        {rules.map(rule => {
          const { color, Icon, label: actionLabel } = actionConfig[rule.action]
          return (
            <div key={rule.id} className={`rule-card ${!rule.enabled ? 'rule-disabled' : ''}`}>
              <div className="rule-card-header">
                <div className="rule-name-row">
                  <h3 className="rule-name">{rule.name}</h3>
                  <div className="rule-toggle">
                    <input
                      type="checkbox"
                      id={`rule-${rule.id}`}
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                      className="toggle-input"
                    />
                    <label htmlFor={`rule-${rule.id}`} className="toggle-switch" />
                  </div>
                </div>
                <p className="rule-desc">{rule.description}</p>
              </div>

              <div className="rule-details">
                <div className="rule-detail">
                  <span className="detail-label">Threshold</span>
                  <span className="detail-value">{rule.threshold} req</span>
                </div>
                <div className="rule-detail">
                  <span className="detail-label">Window</span>
                  <span className="detail-value">{rule.window}</span>
                </div>
                <div className="rule-detail">
                  <span className="detail-label">Action</span>
                  <span className={`badge badge-${color}`}>
                    <Icon size={11} /> {actionLabel}
                  </span>
                </div>
                <div className="rule-detail">
                  <span className="detail-label">Triggered (24h)</span>
                  <span className="detail-value">{rule.triggered.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Rules
