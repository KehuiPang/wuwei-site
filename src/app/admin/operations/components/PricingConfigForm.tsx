'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'

interface PricingConfig {
  monthly_usd: number
  yearly_usd: number
  monthly_cny: number
  yearly_cny: number
  trial_days: number
  discount_enabled: boolean
  discount_percentage: number
}

export default function PricingConfigForm() {
  const [config, setConfig] = useState<PricingConfig>({
    monthly_usd: 19,
    yearly_usd: 190,
    monthly_cny: 138,
    yearly_cny: 1380,
    trial_days: 7,
    discount_enabled: false,
    discount_percentage: 0
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error: checkError } = await supabase
        .from('operation_configs')
        .select('id')
        .eq('key', 'pricing_config')
        .single()

      if (checkError && checkError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('operation_configs')
          .insert({
            key: 'pricing_config',
            value: config,
            description: '定价配置'
          })
        
        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from('operation_configs')
          .update({ value: config, updated_at: new Date().toISOString() })
          .eq('key', 'pricing_config')
        
        if (updateError) throw updateError
      }

      setMessage('✅ 定价配置保存成功')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
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

  const handleChange = (field: keyof PricingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">💳 定价配置</h3>
        <p className="mt-1 text-sm text-gray-500">配置会员价格和优惠策略</p>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        {message && (
          <div className={`mb-4 rounded-md p-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-800' : message.startsWith('⚠️') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">海外定价（USD）</h4>            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">月度会员</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={config.monthly_usd}
                    onChange={(e) => handleChange('monthly_usd', parseFloat(e.target.value) || 0)}
                    className="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">年度会员</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={config.yearly_usd}
                    onChange={(e) => handleChange('yearly_usd', parseFloat(e.target.value) || 0)}
                    className="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">国内定价（CNY）</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">月度会员</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={config.monthly_cny}
                    onChange={(e) => handleChange('monthly_cny', parseFloat(e.target.value) || 0)}
                    className="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">¥</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">年度会员</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={config.yearly_cny}
                    onChange={(e) => handleChange('yearly_cny', parseFloat(e.target.value) || 0)}
                    className="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">¥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">优惠设置</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="discount_enabled"
                type="checkbox"
                checked={config.discount_enabled}
                onChange={(e) => handleChange('discount_enabled', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="discount_enabled" className="ml-2 block text-sm text-gray-900">
                启用限时优惠
              </label>
            </div>
            
            {config.discount_enabled && (
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 mr-2">优惠力度</label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.discount_percentage}
                    onChange={(e) => handleChange('discount_percentage', parseInt(e.target.value) || 0)}
                    className="block w-20 pr-8 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">试用天数</label>
            <input
              type="number"
              min="0"
              max="30"
              value={config.trial_days}
              onChange={(e) => handleChange('trial_days', parseInt(e.target.value) || 0)}
              className="mt-1 block w-24 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
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
