import { useState } from 'react'
import { Search } from 'lucide-react'
import { logsData } from '../data/mockData'

const statusCategory = status => {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 400 && status < 500) return 'warning'
  if (status >= 500)                 return 'danger'
  return 'muted'
}

const methodColorMap = {
  GET:    'accent',
  POST:   'success',
  PUT:    'warning',
  DELETE: 'danger',
  PATCH:  'info',
}

function Logs() {
  const [search, setSearch]       = useState('')
  const [methodFilter, setMethod] = useState('all')
  const [statusFilter, setStatus] = useState('all')

  const filtered = logsData.filter(log => {
    const matchesSearch =
      log.ip.includes(search) ||
      log.endpoint.toLowerCase().includes(search.toLowerCase()) ||
      log.userAgent.toLowerCase().includes(search.toLowerCase())
    const matchesMethod = methodFilter === 'all' || log.method === methodFilter
    const matchesStatus =
      statusFilter === 'all'  ? true :
      statusFilter === '2xx'  ? log.status >= 200 && log.status < 300 :
      statusFilter === '4xx'  ? log.status >= 400 && log.status < 500 :
      statusFilter === '5xx'  ? log.status >= 500 :
      true
    return matchesSearch && matchesMethod && matchesStatus
  })

  return (
    <div className="page">
      {/* Controls */}
      <div className="logs-controls">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search IP, endpoint, or user agent…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            style={{ width: 280 }}
          />
        </div>
        <div className="filter-row">
          <select
            value={methodFilter}
            onChange={e => setMethod(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="2xx">2xx Success</option>
            <option value="4xx">4xx Client Error</option>
            <option value="5xx">5xx Server Error</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Request Logs{' '}
            <span className="muted" style={{ fontWeight: 400 }}>
              ({filtered.length} entries)
            </span>
          </h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>IP Address</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Resp. Time</th>
                <th>Country</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td className="mono muted">{log.timestamp}</td>
                  <td className="mono">{log.ip}</td>
                  <td>
                    <span className={`method-badge method-${methodColorMap[log.method] ?? 'muted'}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="endpoint-cell" title={log.endpoint}>
                    {log.endpoint}
                  </td>
                  <td>
                    <span className={`status-code status-${statusCategory(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className={log.responseTime > 200 ? 'text-warning' : ''}>
                    {log.responseTime}ms
                  </td>
                  <td>{log.country}</td>
                  <td className="truncate muted" title={log.userAgent}>
                    {log.userAgent}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}
                  >
                    No log entries match the current filter.
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

export default Logs
