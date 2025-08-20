import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Briefcase } from 'lucide-react'

async function selectRole(formData: FormData) {
  'use server'
  
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

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Create Your Profile
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Tell us who you are to get started.
          </p>
        </div>
        
        <Card className="p-8">
          <form action={selectRole} className="space-y-6">
            <fieldset>
              <legend className="text-xl font-semibold text-center mb-6">
                Are you an individual or a lawyer?
              </legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-solid hover:border-primary hover:bg-primary/5 has-[:checked]:border-solid has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    className="absolute opacity-0 w-full h-full"
                    name="role"
                    type="radio"
                    value="individual"
                    required
                  />
                  <User className="w-16 h-16 mb-4 text-primary" />
                  <span className="text-lg font-medium">I'm an individual</span>
                  <span className="text-sm text-muted-foreground text-center">
                    seeking legal advice.
                  </span>
                </label>
                
                <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-solid hover:border-primary hover:bg-primary/5 has-[:checked]:border-solid has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    className="absolute opacity-0 w-full h-full"
                    name="role"
                    type="radio"
                    value="lawyer"
                    required
                  />
                  <Briefcase className="w-16 h-16 mb-4 text-primary" />
                  <span className="text-lg font-medium">I'm a lawyer</span>
                  <span className="text-sm text-muted-foreground text-center">
                    offering legal services.
                  </span>
                </label>
              </div>
            </fieldset>
            
            <div className="flex justify-center pt-6">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                Continue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}