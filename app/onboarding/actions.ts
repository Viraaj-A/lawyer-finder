'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function clearRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Clear the role to allow re-selection
  await supabase
    .from('profiles')
    .update({ role: null })
    .eq('id', user.id)
  
  redirect('/onboarding')
}

export async function selectRole(formData: FormData) {
  const role = formData.get('role') as 'individual' | 'lawyer'
  if (!role) return
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Save role to profiles table
  await supabase
    .from('profiles')
    .update({ role })
    .eq('id', user.id)
  
  // Redirect based on role
  redirect(role === 'lawyer' ? '/onboarding/lawyer' : '/onboarding/individual')
}