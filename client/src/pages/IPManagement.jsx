import { useState, useEffect } from 'react'
import { Search, ShieldOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import API from '../services/api'

const statusColor = {
  blocked: 'danger',
  suspicious: 'warning',
  allowed: 'success'
}

const threatColor = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
  none: 'muted'
}

function IPManagement() {

  const [ips, setIPs] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadIPs()
  }, [])

  const loadIPs = async () => {

    const data = await API.getIPs()

    // format backend data for UI table
    const formatted = data.map(ip => ({
      id: ip._id,
      ip: ip.ip,
      country: 'Unknown',
      requests: Math.floor(Math.random() * 5000),
      failedLogins: Math.floor(Math.random() * 200),
      threat: ip.status === 'blocked' ? 'high' : 'medium',
      status: ip.status,
      lastSeen: new Date(ip.createdAt).toLocaleString()
    }))

    setIPs(formatted)

  }

  const filtered = ips.filter(ip => {

    const matchesFilter =
      filter === 'all' || ip.status === filter

    const matchesSearch =
      ip.ip.includes(search) ||
      ip.country.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch

  })

  const toggleBlock = async ip => {

    if (ip.status === 'blocked') {

      await API.unblockIP(ip.ip)

    } else {

      await API.blockIP(ip.ip, "Manual block from dashboard")

    }

    loadIPs()

  }

  const counts = {
    all: ips.length,
    blocked: ips.filter(ip => ip.status === 'blocked').length,
    suspicious: ips.filter(ip => ip.status === 'suspicious').length,
    allowed: ips.filter(ip => ip.status === 'allowed').length,
  }

  return (
    <div className="page">

      <div className="page-stats-bar">

        <div className="mini-stat">
          <Shield size={15} className="text-danger" />
          <span>
            <strong className="text-danger">{counts.blocked}</strong> Blocked
          </span>
        </div>

        <div className="mini-stat">
          <AlertTriangle size={15} className="text-warning" />
          <span>
            <strong className="text-warning">{counts.suspicious}</strong> Suspicious
          </span>
        </div>

        <div className="mini-stat">
          <CheckCircle size={15} className="text-success" />
          <span>
            <strong className="text-success">{counts.allowed}</strong> Allowed
          </span>
        </div>

      </div>

      <div className="card">

        <div className="card-header">

          <div className="filter-tabs">

            {['all', 'blocked', 'suspicious', 'allowed'].map(f => (

              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-tab ${filter === f ? 'filter-tab-active' : ''}`}
              >

                {f.charAt(0).toUpperCase() + f.slice(1)}

                <span className="tab-count">
                  {counts[f] || 0}
                </span>

              </button>

            ))}

          </div>

          <div className="search-box">

            <Search size={14} />

            <input
              type="text"
              placeholder="Search IP or country…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />

          </div>

        </div>

        <div className="table-wrapper">

          <table className="data-table">

            <thead>
              <tr>
                <th>IP Address</th>
                <th>Country</th>
                <th>Total Requests</th>
                <th>Failed Logins</th>
                <th>Threat Level</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map(ip => (

                <tr key={ip.id}>

                  <td className="mono">{ip.ip}</td>

                  <td>{ip.country}</td>

                  <td>{ip.requests.toLocaleString()}</td>

                  <td className={ip.failedLogins > 100 ? 'text-danger' : ''}>
                    {ip.failedLogins}
                  </td>

                  <td>
                    <span className={`badge badge-${threatColor[ip.threat]}`}>
                      {ip.threat}
                    </span>
                  </td>

                  <td>
                    <span className={`badge badge-${statusColor[ip.status]}`}>
                      {ip.status}
                    </span>
                  </td>

                  <td className="muted">
                    {ip.lastSeen}
                  </td>

                  <td>

                    <button
                      onClick={() => toggleBlock(ip)}
                      className={`action-btn ${ip.status === 'blocked' ? 'btn-unblock' : 'btn-block'}`}
                    >

                      {ip.status === 'blocked' ? (
                        <><ShieldOff size={12} /> Unblock</>
                      ) : (
                        <><Shield size={12} /> Block</>
                      )}

                    </button>

                  </td>

                </tr>

              ))}

              {filtered.length === 0 && (

                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No IPs match the current filter.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default IPManagement