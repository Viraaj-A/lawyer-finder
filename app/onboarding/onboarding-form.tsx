'use client'

import { useRef } from 'react'
import { User, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { selectRole } from './actions'

export default function OnboardingForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleRoleSelect = () => {
    // Auto-submit the form when a role is selected
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
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
          <form ref={formRef} action={selectRole} className="space-y-6">
            <fieldset>
              <legend className="text-xl font-semibold text-center mb-6">
                Select your role to continue
              </legend>
              
              <div className="flex flex-col md:flex-row gap-6">
                <label className="flex-1 relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-solid hover:border-primary hover:bg-primary/5 has-[:checked]:border-solid has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    className="absolute opacity-0 w-full h-full"
                    name="role"
                    type="radio"
                    value="individual"
                    onChange={handleRoleSelect}
                    required
                  />
                  <User className="w-16 h-16 mb-4 text-primary" />
                  <span className="text-lg font-medium">I'm an individual</span>
                  <span className="text-sm text-muted-foreground text-center">
                    seeking legal advice.
                  </span>
                </label>
                
                <label className="flex-1 relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-solid hover:border-primary hover:bg-primary/5 has-[:checked]:border-solid has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    className="absolute opacity-0 w-full h-full"
                    name="role"
                    type="radio"
                    value="lawyer"
                    onChange={handleRoleSelect}
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
          </form>
        </Card>
      </div>
    </div>
  )
}