import { TrendingUp, TrendingDown } from 'lucide-react'

function StatCard({ title, value, subtitle, icon: Icon, color = 'accent', trend, trendValue }) {
  const isUp = trend === 'up'

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-header">
        <div className={`stat-icon stat-icon-${color}`}>
          <Icon size={20} />
        </div>
        {trendValue && (
          <div className={`stat-trend ${isUp ? 'trend-up' : 'trend-down'}`}>
            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-sub">{subtitle}</div>}
    </div>
  )
}

export default StatCard
