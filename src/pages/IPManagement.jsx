import { useState } from 'react'
import { Search, ShieldOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { ipData as initialData } from '../data/mockData'

const statusColor = { blocked: 'danger', flagged: 'warning', clean: 'success' }
const threatColor  = { critical: 'danger', high: 'warning', medium: 'info', low: 'success', none: 'muted' }

function IPManagement() {
  const [ips, setIPs] = useState(initialData)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = ips.filter(ip => {
    const matchesFilter = filter === 'all' || ip.status === filter
    const matchesSearch =
      ip.ip.includes(search) ||
      ip.country.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleBlock = id =>
    setIPs(prev =>
      prev.map(ip =>
        ip.id !== id
          ? ip
          : { ...ip, status: ip.status === 'blocked' ? 'flagged' : 'blocked' }
      )
    )

  const counts = {
    all:     ips.length,
    blocked: ips.filter(ip => ip.status === 'blocked').length,
    flagged: ips.filter(ip => ip.status === 'flagged').length,
    clean:   ips.filter(ip => ip.status === 'clean').length,
  }

  return (
    <div className="page">
      {/* Summary Bar */}
      <div className="page-stats-bar">
        <div className="mini-stat">
          <Shield size={15} className="text-danger" />
          <span><strong className="text-danger">{counts.blocked}</strong> Blocked</span>
        </div>
        <div className="mini-stat">
          <AlertTriangle size={15} className="text-warning" />
          <span><strong className="text-warning">{counts.flagged}</strong> Flagged</span>
        </div>
        <div className="mini-stat">
          <CheckCircle size={15} className="text-success" />
          <span><strong className="text-success">{counts.clean}</strong> Clean</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="filter-tabs">
            {['all', 'blocked', 'flagged', 'clean'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-tab ${filter === f ? 'filter-tab-active' : ''}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="tab-count">{counts[f]}</span>
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
                  <td className="muted">{ip.lastSeen}</td>
                  <td>
                    <button
                      onClick={() => toggleBlock(ip.id)}
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
