import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "./components/DashboardSidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  let userName = user.email?.split('@')[0] || 'User'
  
  if (profile?.role === 'lawyer') {
    const { data: lawyerProfile } = await supabase
      .from('lawyer_profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()
    
    if (lawyerProfile) {
      userName = `${lawyerProfile.first_name} ${lawyerProfile.last_name}`
    }
  } else {
    const { data: individualProfile } = await supabase
      .from('individual_profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()
    
    if (individualProfile) {
      userName = `${individualProfile.first_name} ${individualProfile.last_name}`
    }
  }

  const userInfo = {
    name: userName,
    role: profile?.role || 'individual',
    email: user.email || ''
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userInfo={userInfo} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}