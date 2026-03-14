import { useLocation } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

const pageMeta = {
  '/':       { title: 'Dashboard',        sub: 'Real-time API traffic overview'                     },
  '/ips':    { title: 'IP Management',    sub: 'Monitor and manage suspicious IP addresses'          },
  '/alerts': { title: 'Security Alerts',  sub: 'Active threats and security notifications'           },
  '/rules':  { title: 'Rate Limit Rules', sub: 'Configure abuse detection rules and thresholds'      },
  '/logs':   { title: 'Request Logs',     sub: 'Detailed API request history and forensic data'      },
}

function Header() {
  const location = useLocation()
  const { title, sub } = pageMeta[location.pathname] || pageMeta['/']
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{sub}</p>
      </div>
      <div className="header-right">
        <div className="live-indicator">
          <span className="live-dot" />
          <span>LIVE</span>
        </div>
        <span className="header-time">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <button className="icon-btn" title="Refresh data" onClick={() => window.location.reload()}>
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  )
}

export default Header
