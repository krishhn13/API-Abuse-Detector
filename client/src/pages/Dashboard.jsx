import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Shield, Bell, Zap } from 'lucide-react'
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

import StatCard from '../components/StatCard'
import API from '../services/api'

const severityColor = { critical: 'danger', high: 'warning', medium: 'info', low: 'success' }
const statusColor   = { blocked: 'danger',  suspicious: 'warning', allowed: 'success' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(entry => (
        <p key={entry.name} style={{ color: entry.color, margin: '2px 0' }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  )
}

function Dashboard() {

  const [overview, setOverview] = useState({})
  const [trafficData, setTrafficData] = useState([])
  const [topIPs, setTopIPs] = useState([])
  const [alerts, setAlerts] = useState([])

  useEffect(() => {

    const loadData = async () => {

      const overviewData = await API.getOverview()
      const traffic = await API.getTraffic()
      const ips = await API.getTopIPs()
      const alertsData = await API.getAlerts()

      setOverview(overviewData)

      // convert backend traffic format for charts
      const formattedTraffic = traffic.map(t => ({
        hour: `${t._id.hour}:${t._id.minute.toString().padStart(2, "0")}`,
        requests: t.count,
        blocked: 0,
        flagged: 0
      }))

      setTrafficData(formattedTraffic)
      setTopIPs(ips)
      setAlerts(alertsData)

    }

    loadData()

  }, [])

  const recentAlerts = alerts.filter(a => !a.resolved).slice(0, 5)

  const totalRequests = overview.totalRequests || 0
  const totalBlocked  = topIPs.filter(ip => ip.status === "blocked").length
  const activeAlerts  = recentAlerts.length

  return (
    <div className="dashboard">

      {/* ── Stat Cards ── */}
      <div className="stats-grid">

        <StatCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          icon={Activity}
          color="accent"
          subtitle="All recorded traffic"
        />

        <StatCard
          title="Blocked IPs"
          value={totalBlocked}
          icon={Shield}
          color="danger"
          subtitle="Currently blocked"
        />

        <StatCard
          title="Active Alerts"
          value={activeAlerts}
          icon={Bell}
          color="warning"
          subtitle="Unresolved alerts"
        />

        <StatCard
          title="Error Requests"
          value={overview.errorRequests || 0}
          icon={Zap}
          color="info"
          subtitle="HTTP errors"
        />

      </div>

      {/* ── Traffic Line Chart ── */}
      <div className="chart-full">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Traffic Overview</h3>
          </div>

          <div className="chart-container">

            <ResponsiveContainer width="100%" height={240}>

              <LineChart data={trafficData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="hour" />

                <YAxis />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="requests"
                  name="Requests"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>
        </div>
      </div>

      {/* ── Recent Alerts ── */}
      <div className="two-col-grid">

        <div className="card">

          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
            <Link to="/alerts" className="card-link">View all →</Link>
          </div>

          <div className="alert-list">

            {recentAlerts.map(alert => (

              <div key={alert._id} className="alert-item">

                <span className={`badge badge-${severityColor[alert.severity]}`}>
                  {alert.severity}
                </span>

                <div className="alert-info">

                  <span className="alert-type">
                    {alert.message}
                  </span>

                  <span className="alert-time">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* ── Top IPs ── */}
      <div className="card dash-bottom-card">

        <div className="card-header">
          <h3 className="card-title">Top Active IPs</h3>
          <Link to="/ips" className="card-link">Manage all →</Link>
        </div>

        <div className="table-wrapper">

          <table className="data-table">

            <thead>
              <tr>
                <th>IP Address</th>
                <th>Requests</th>
              </tr>
            </thead>

            <tbody>

              {topIPs.map(ip => (

                <tr key={ip._id}>

                  <td className="mono">{ip._id}</td>

                  <td>{ip.requestCount}</td>

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