'use client'

import { useState, useMemo } from 'react'

interface Transaction {
  type: 'earn' | 'spend' | 'refund'
  amount: number
  created_at: string
}

interface Props {
  stats: {
    totalUsers: number
    totalTransactions: number
    todayEarned: number
    todaySpent: number
  }
  recentTransactions: Transaction[]
}

export default function DashboardCharts({ stats, recentTransactions }: Props) {
  const [timeRange, setTimeRange] = useState('7d')

  // 按日期分组统计
  const dailyStats = useMemo(() => {
    const stats: Record<string, { earn: number; spend: number }> = {}
    
    recentTransactions.forEach(tx => {
      const date = tx.created_at.split('T')[0]
      if (!stats[date]) {
        stats[date] = { earn: 0, spend: 0 }
      }
      if (tx.type === 'earn') {
        stats[date].earn += tx.amount
      } else if (tx.type === 'spend') {
        stats[date].spend += tx.amount
      }
    })
    
    return Object.entries(stats)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
  }, [recentTransactions])

  const maxValue = useMemo(() => {
    return Math.max(
      ...dailyStats.map(([_, s]) => Math.max(s.earn, s.spend)),
      1
    )
  }, [dailyStats])

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">总用户数</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">总交易数</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalTransactions}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">今日发放</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">+{stats.todayEarned}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">今日消耗</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">-{stats.todaySpent}</dd>
          </div>
        </div>
      </div>

      {/* 时间范围选择 */}
      <div className="flex space-x-4">
        {[
          { key: '7d', label: '近7天' },
          { key: '30d', label: '近30天' },
          { key: '90d', label: '近90天' }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTimeRange(item.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeRange === item.key
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 简易柱状图 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">积分收支趋势</h3>
        
        <div className="space-y-4">
          {dailyStats.map(([date, stat]) => (
            <div key={date} className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{date}</span>
                <span>发放: +{stat.earn} / 消耗: -{stat.spend}</span>
              </div>
              
              <div className="flex space-x-2 h-8">
                <div 
                  className="bg-green-500 rounded-l"
                  style={{ 
                    width: `${(stat.earn / maxValue) * 50}%`,
                    minWidth: stat.earn > 0 ? '4px' : '0'
                  }}
                />
                <div 
                  className="bg-red-500 rounded-r"
                  style={{ 
                    width: `${(stat.spend / maxValue) * 50}%`,
                    minWidth: stat.spend > 0 ? '4px' : '0'
                  }}
                />
              </div>
            </div>
          ))}
          
          {dailyStats.length === 0 && (
            <p className="text-gray-500 text-center py-8">暂无交易数据</p>
          )}
        </div>
        
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">积分发放</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">积分消耗</span>
          </div>
        </div>
      </div>

      {/* 收入统计 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">收入统计</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-sm text-gray-500">月度会员收入</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">$0</p>
            <p className="text-xs text-gray-400">待接入支付系统</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">年度会员收入</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">$0</p>
            <p className="text-xs text-gray-400">待接入支付系统</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">总收入</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">$0</p>
            <p className="text-xs text-gray-400">待接入支付系统</p>
          </div>
        </div>
      </div>
    </div>
  )
}
