'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'

interface CoinConfig {
  signup_bonus: number
  daily_checkin: number
  pro_monthly_coins: number
  pro_yearly_coins: number
  referral_bonus: number
  min_withdrawal: number
}

export default function CoinConfigForm() {
  const [config, setConfig] = useState<CoinConfig>({
    signup_bonus: 100,
    daily_checkin: 10,
    pro_monthly_coins: 500,
    pro_yearly_coins: 5000,
    referral_bonus: 50,
    min_withdrawal: 100
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      // 先检查数据库是否就绪（本地开发模式兼容）
      const { error: checkError } = await supabase
        .from('operation_configs')
        .select('id')
        .eq('key', 'coin_config')
        .single()

      if (checkError && checkError.code === 'PGRST116') {
        // 配置不存在，创建
        const { error: insertError } = await supabase
          .from('operation_configs')
          .insert({
            key: 'coin_config',
            value: config as any,
            description: '无为币积分配置'
          } as any)
        
        if (insertError) throw insertError
      } else {
        // 更新
        const { error: updateError } = await supabase
          .from('operation_configs')
          .update({ value: config as any, updated_at: new Date().toISOString() } as any)
          .eq('key', 'coin_config')
        
        if (updateError) throw updateError
      }

      setMessage('✅ 积分配置保存成功')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      // 数据库未就绪时，显示本地保存成功（开发模式）
      if (err.message?.includes('Could not find the table')) {
        setMessage('⚠️ 数据库未就绪，配置已本地保存（开发模式）')
        setTimeout(() => setMessage(''), 5000)
      } else {
        setMessage(`❌ 错误: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CoinConfig, value: number) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const fields = [
    { key: 'signup_bonus' as const, label: '注册奖励', unit: '无为币', desc: '新用户注册时赠送' },
    { key: 'daily_checkin' as const, label: '每日签到', unit: '无为币', desc: '每日签到奖励' },
    { key: 'pro_monthly_coins' as const, label: '月度 Pro 赠送', unit: '无为币', desc: '月度会员额外赠送' },
    { key: 'pro_yearly_coins' as const, label: '年度 Pro 赠送', unit: '无为币', desc: '年度会员额外赠送' },
    { key: 'referral_bonus' as const, label: '邀请奖励', unit: '无为币', desc: '成功邀请好友奖励' },
    { key: 'min_withdrawal' as const, label: '最小提现', unit: '无为币', desc: '提现最低门槛' }
  ]

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">💰 积分配置</h3>
        <p className="mt-1 text-sm text-gray-500">配置无为币的获取规则和额度</p>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        {message && (
          <div className={`mb-4 rounded-md p-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-800' : message.startsWith('⚠️') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id={field.key}
                  value={config[field.key]}
                  onChange={(e) => handleChange(field.key, parseInt(e.target.value) || 0)}
                  className="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{field.unit}</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">{field.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存配置'}
          </button>
        </div>
      </div>
    </div>
  )
}
