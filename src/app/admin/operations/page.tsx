import { createServerSupabase } from '@/lib/server'
import { redirect } from 'next/navigation'
import OperationsDashboard from './components/OperationsDashboard'
import CoinConfigForm from './components/CoinConfigForm'
import PricingConfigForm from './components/PricingConfigForm'
import ModelCostsConfigForm from './components/ModelCostsConfigForm'

export default async function AdminOperationsPage() {
  const supabase = await createServerSupabase()
  
  // 检查用户是否登录
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/admin/login')
  }
  
  // 检查是否为管理员
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (user?.role !== 'admin') {
    redirect('/')
  }
  
  // 获取运营配置
  const { data: configs } = await supabase
    .from('operation_configs')
    .select('*')
    .order('key')
  
  // 获取用户统计
  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
  
  // 获取交易统计
  const { count: txCount } = await supabase
    .from('coin_transactions')
    .select('*', { count: 'exact', head: true })
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">运营配置后台</h1>
          <p className="mt-1 text-sm text-gray-500">无为AI 管理系统</p>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <OperationsDashboard 
          configs={configs || []} 
          stats={{ userCount: userCount || 0, txCount: txCount || 0 }}
        />
        
        <div className="mt-8 space-y-8">
          <CoinConfigForm />
          <PricingConfigForm />
          <ModelCostsConfigForm />
        </div>
      </main>
    </div>
  )
}
