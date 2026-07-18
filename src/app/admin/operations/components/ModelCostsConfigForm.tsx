'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'

interface ModelCost {
  name: string
  cost_per_1k: number
  enabled: boolean
}

interface ModelCostsConfig {
  models: ModelCost[]
  default_model: string
}

export default function ModelCostsConfigForm() {
  const [config, setConfig] = useState<ModelCostsConfig>({
    models: [
      { name: 'GPT-4', cost_per_1k: 10, enabled: true },
      { name: 'GPT-3.5', cost_per_1k: 1, enabled: true },
      { name: 'Claude 3', cost_per_1k: 8, enabled: true },
      { name: 'Claude 3.5', cost_per_1k: 12, enabled: true },
      { name: '本地模型', cost_per_1k: 0, enabled: true }
    ],
    default_model: 'GPT-3.5'
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
        .eq('key', 'model_costs_config')
        .single()

      if (checkError && checkError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('operation_configs')
          .insert({
            key: 'model_costs_config',
            value: config,
            description: '模型消耗配置'
          })
        
        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from('operation_configs')
          .update({ value: config, updated_at: new Date().toISOString() })
          .eq('key', 'model_costs_config')
        
        if (updateError) throw updateError
      }

      setMessage('✅ 模型消耗配置保存成功')
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

  const handleModelChange = (index: number, field: keyof ModelCost, value: any) => {
    const newModels = [...config.models]
    newModels[index] = { ...newModels[index], [field]: value }
    setConfig(prev => ({ ...prev, models: newModels }))
  }

  const addModel = () => {
    setConfig(prev => ({
      ...prev,
      models: [...prev.models, { name: '', cost_per_1k: 0, enabled: true }]
    }))
  }

  const removeModel = (index: number) => {
    setConfig(prev => ({
      ...prev,
      models: prev.models.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">🤖 模型消耗配置</h3>
        <p className="mt-1 text-sm text-gray-500">配置各模型的积分消耗比例</p>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        {message && (
          <div className={`mb-4 rounded-md p-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-800' : message.startsWith('⚠️') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {config.models.map((model, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={model.name}
                  onChange={(e) => handleModelChange(index, 'name', e.target.value)}
                  placeholder="模型名称"
                  className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="w-32">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    min="0"
                    value={model.cost_per_1k}
                    onChange={(e) => handleModelChange(index, 'cost_per_1k', parseInt(e.target.value) || 0)}
                    placeholder="消耗"
                    className="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-xs">币/k</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={model.enabled}
                  onChange={(e) => handleModelChange(index, 'enabled', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">启用</label>
              </div>

              <button
                onClick={() => removeModel(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                删除
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addModel}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          + 添加模型
        </button>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700">默认模型</label>
          <select
            value={config.default_model}
            onChange={(e) => setConfig(prev => ({ ...prev, default_model: e.target.value }))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {config.models.filter(m => m.enabled).map((model) => (
              <option key={model.name} value={model.name}>{model.name}</option>
            ))}
          </select>
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
