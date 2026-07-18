import { createServerSupabase } from '@/lib/server'
import { redirect } from 'next/navigation'
import UsersTable from './components/UsersTable'

export default async function AdminUsersPage() {
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
  
  // 获取用户列表（含积分余额）
  const { data: users } = await supabase
    .from('users')
    .select(`
      id,
      email,
      role,
      created_at,
      coin_balances (balance)
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="mt-1 text-sm text-gray-500">查看用户积分、手动调整余额</p>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <UsersTable users={users || []} />
      </main>
    </div>
  )
}
