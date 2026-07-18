import { createServerSupabase } from '@/lib/server'
import { redirect } from 'next/navigation'
import TransactionsTable from './components/TransactionsTable'

export default async function AdminTransactionsPage() {
  const supabase = await createServerSupabase()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/admin/login')
  }
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (userError || !userData || (userData as any).role !== 'admin') {
    redirect('/')
  }
  
  // 获取交易记录
  const { data: transactions } = await supabase
    .from('coin_transactions')
    .select(`
      id,
      user_id,
      type,
      amount,
      description,
      created_at,
      users (email)
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">积分流水</h1>
          <p className="mt-1 text-sm text-gray-500">查看所有积分交易记录</p>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TransactionsTable transactions={transactions || []} />
      </main>
    </div>
  )
}
