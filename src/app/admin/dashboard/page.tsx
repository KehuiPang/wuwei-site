import { createServerSupabase } from '@/lib/server'
import { redirect } from 'next/navigation'
import DashboardCharts from './components/DashboardCharts'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/admin/login')
  }
  
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (user?.role !== 'admin') {
    redirect('/')
  }
  
  // 统计数据
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
  
  const { count: totalTransactions } = await supabase
    .from('coin_transactions')
    .select('*', { count: 'exact', head: true })
  
  const { data: recentTransactions } = await supabase
    .from('coin_transactions')
    .select('type, amount, created_at')
    .order('created_at', { ascending: false })
    .limit(100)
  
  // 计算今日统计
  const today = new Date().toISOString().split('T')[0]
  const todayTransactions = recentTransactions?.filter(tx => 
    tx.created_at.startsWith(today)
  ) || []
  
  const todayEarned = todayTransactions
    .filter(tx => tx.type === 'earn')
    .reduce((sum, tx) => sum + tx.amount, 0)
  
  const todaySpent = todayTransactions
    .filter(tx => tx.type === 'spend')
    .reduce((sum, tx) => sum + tx.amount, 0)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">数据看板</h1>
          <p className="mt-1 text-sm text-gray-500">无为AI 运营数据概览</p>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardCharts 
          stats={{
            totalUsers: totalUsers || 0,
            totalTransactions: totalTransactions || 0,
            todayEarned,
            todaySpent
          }}
          recentTransactions={recentTransactions || []}
        />
      </main>
    </div>
  )
}
