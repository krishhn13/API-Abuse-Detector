import { Link } from 'react-router-dom'
import { Activity, Shield, Bell, Zap } from 'lucide-react'
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import StatCard from '../components/StatCard'
import { trafficData, abuseTypes, ipData, alertsData } from '../data/mockData'

const recentAlerts = alertsData.filter(a => !a.resolved).slice(0, 5)
const topIPs = ipData.filter(ip => ip.status !== 'clean').slice(0, 5)

const severityColor = { critical: 'danger', high: 'warning', medium: 'info', low: 'success' }
const statusColor   = { blocked: 'danger',  flagged: 'warning', clean: 'success' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(entry => (
        <p key={entry.name} style={{ color: entry.color, margin: '2px 0' }}>
          {entry.name}: <strong>{entry.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

function Dashboard() {
  const totalRequests = trafficData.reduce((s, d) => s + d.requests, 0)
  const totalBlocked  = ipData.filter(ip => ip.status === 'blocked').length
  const activeAlerts  = alertsData.filter(a => !a.resolved).length

  return (
    <div className="dashboard">
      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <StatCard
          title="Total Requests (24h)"
          value={totalRequests.toLocaleString()}
          icon={Activity}
          color="accent"
          trend="up"
          trendValue="+12.4%"
          subtitle="vs yesterday"
        />
        <StatCard
          title="Blocked IPs"
          value={totalBlocked}
          icon={Shield}
          color="danger"
          trend="up"
          trendValue="+3 today"
          subtitle="Active blocks"
        />
        <StatCard
          title="Active Alerts"
          value={activeAlerts}
          icon={Bell}
          color="warning"
          trend="down"
          trendValue="-2 resolved"
          subtitle="Requires attention"
        />
        <StatCard
          title="Req / Sec"
          value="94.3"
          icon={Zap}
          color="success"
          trend="up"
          trendValue="+8.2%"
          subtitle="Current rate"
        />
      </div>

      {/* ── Traffic Line Chart ── */}
      <div className="chart-full">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Traffic Overview — Last 24 Hours</h3>
            <div className="chart-legend">
              <span className="legend-item legend-accent">Requests</span>
              <span className="legend-item legend-danger">Blocked</span>
              <span className="legend-item legend-warning">Flagged</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trafficData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" stroke="var(--text-muted)" tick={{ fontSize: 11 }} interval={3} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="requests" name="Requests" stroke="var(--accent)"  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="blocked"  name="Blocked"  stroke="var(--danger)"  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="flagged"  name="Flagged"  stroke="var(--warning)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Abuse Types + Recent Alerts ── */}
      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Abuse by Category</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={abuseTypes} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="type" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Incidents" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
            <Link to="/alerts" className="card-link">View all →</Link>
          </div>
          <div className="alert-list">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="alert-item">
                <span className={`badge badge-${severityColor[alert.severity]}`}>
                  {alert.severity}
                </span>
                <div className="alert-info">
                  <span className="alert-type">{alert.type}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Flagged IPs ── */}
      <div className="card dash-bottom-card">
        <div className="card-header">
          <h3 className="card-title">Top Flagged / Blocked IPs</h3>
          <Link to="/ips" className="card-link">Manage all →</Link>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Country</th>
                <th>Requests</th>
                <th>Failed Logins</th>
                <th>Status</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {topIPs.map(ip => (
                <tr key={ip.id}>
                  <td className="mono">{ip.ip}</td>
                  <td>{ip.country}</td>
                  <td>{ip.requests.toLocaleString()}</td>
                  <td className={ip.failedLogins > 100 ? 'text-danger' : ''}>{ip.failedLogins}</td>
                  <td><span className={`badge badge-${statusColor[ip.status]}`}>{ip.status}</span></td>
                  <td className="muted">{ip.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
