import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import LocationAutocomplete from '@/components/profile/location-autocomplete'
import LanguageSelector from '@/components/profile/language-selector'

async function saveProfile(formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Extract form data
  const languages = formData.getAll('languages') as string[]
  const accessibilityNeeds = formData.getAll('accessibility') as string[]
  const otherAccessibility = formData.get('other-accessibility') as string
  
  if (otherAccessibility) {
    accessibilityNeeds.push(otherAccessibility)
  }
  
  // Debug: Log form data
  console.log('Form data:', {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    age: formData.get('age'),
    gender: formData.get('gender'),
    location: formData.get('location'),
    languages,
    accessibilityNeeds
  })

  // Save to individual_profiles table
  const { error, data } = await supabase
    .from('individual_profiles')
    .upsert({
      id: user.id,
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      location: formData.get('location') as string,
      languages: languages.length > 0 ? languages : ['English'],
      accessibility_needs: accessibilityNeeds
    })
  
  if (error) {
    console.error('Individual profile save error:', error)
    // Don't redirect on error, let user see what happened
    return
  }

  console.log('Individual profile saved:', data)
  
  // Mark onboarding as complete
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)
    
  if (profileError) {
    console.error('Profile update error:', profileError)
  }
  
  redirect('/')
}

export default async function IndividualProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <main className="container mx-auto px-4 py-8 flex flex-1 justify-center items-center">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Your Personal Information</h1>
          <p className="text-muted-foreground">Please provide your personal details below.</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 text-sm">
          <p>
            <span className="font-semibold">Privacy Note:</span> Your name, age, and gender will remain confidential. 
            Only your suburb location, preferred languages, and accessibility needs will be shared with legal practitioners.
          </p>
        </div>
        
        <form action={saveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Enter your age"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">A gender not listed here</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location (Suburb only)</Label>
              <LocationAutocomplete />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Preferred Languages</Label>
            <LanguageSelector defaultLanguages={['English']} />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Accessibility Requirements</Label>
              <p className="text-sm text-muted-foreground mb-2">Select any accommodations you may require.</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="wheelchair-access" name="accessibility" value="wheelchair" />
                <Label htmlFor="wheelchair-access" className="text-sm font-normal">
                  Wheelchair Access
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="visual-impairment" name="accessibility" value="visual" />
                <Label htmlFor="visual-impairment" className="text-sm font-normal">
                  Accommodation for visual impairment
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="auditory-impairment" name="accessibility" value="auditory" />
                <Label htmlFor="auditory-impairment" className="text-sm font-normal">
                  Accommodation for auditory impairment
                </Label>
              </div>
              
              <div className="space-y-2">
                <Input
                  id="other-accessibility"
                  name="other-accessibility"
                  placeholder="Other (please specify)"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              Save and Continue
            </Button>
          </div>
        </form>
      </Card>
    </main>
  )
}