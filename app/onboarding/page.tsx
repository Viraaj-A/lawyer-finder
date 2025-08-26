import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from './onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check if user already has a role assigned
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()
  
  if (profile?.role) {
    // User already has a role, redirect appropriately
    if (profile.onboarding_completed) {
      redirect(profile.role === 'lawyer' ? '/dashboard/lawyer' : '/dashboard/individual')
    } else {
      // Continue with their existing role's onboarding
      redirect(profile.role === 'lawyer' ? '/onboarding/lawyer' : '/onboarding/individual')
    }
  }
  
  return <OnboardingForm />
}