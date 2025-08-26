import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { practiceAreas } from "@/lib/constants/practice-areas"
import LanguageSelector from '@/components/profile/language-selector'
import { clearRole } from '../actions'
import { ArrowLeft } from 'lucide-react'
import LocationAutocomplete from '@/components/profile/location-autocomplete'
import { SubmitButton } from '@/components/debug-form-submit'

async function saveLawyerProfile(formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const practiceAreasSelected = formData.getAll('practiceArea') as string[]
  
  const languages = formData.getAll('languages') as string[]  // Fixed: should be 'languages' not 'language'

  
  const acceptsLegalAid = formData.get('legalAid') === 'yes'
  
  const accessibilitySupport: string[] = []
  if (formData.get('wheelchair-support')) accessibilitySupport.push('Wheelchair accessible office')
  if (formData.get('visual-support')) accessibilitySupport.push('Support for visual impairments')
  if (formData.get('auditory-support')) accessibilitySupport.push('Support for hearing impairments')
  const otherAccessibility = formData.get('other-accessibility') as string
  if (otherAccessibility) accessibilitySupport.push(otherAccessibility)
  
  // Format website URL - add https:// if no protocol specified
  let website = formData.get('website') as string
  if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
    website = 'https://' + website
  }
  
  // Debug logging
  console.log('Saving lawyer profile for user:', user.id)
  console.log('Form data:', {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    firmName: formData.get('firmName'),
    location: formData.get('location'),
    practiceAreas: practiceAreasSelected,
    languages,
    acceptsLegalAid,
    website
  })
  
  const { error, data } = await supabase
    .from('lawyer_profiles')
    .upsert({
      id: user.id,
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      firm_name: formData.get('firmName') as string,
      location: formData.get('location') as string,
      about: formData.get('about') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website,
      practice_areas: practiceAreasSelected,
      languages: languages.length > 0 ? languages : ['English'],
      accepts_legal_aid: acceptsLegalAid,
      accessibility_support: accessibilitySupport
    })
  
  if (error) {
    console.error('Profile save error:', error)
    console.error('Error details:', error.message, error.details, error.hint)
    // Don't return silently - throw an error so user knows something went wrong
    throw new Error(`Failed to save profile: ${error.message}`)
  }
  
  console.log('Profile saved successfully:', data)
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)
    
  if (updateError) {
    console.error('Failed to update onboarding status:', updateError)
  }
  
  redirect('/dashboard/lawyer/profile')
}

export default async function LawyerProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Verify user has lawyer role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'lawyer') {
    // Wrong role, redirect to appropriate page
    if (profile?.role === 'individual') {
      redirect('/onboarding/individual')
    } else {
      redirect('/onboarding')
    }
  }
  
  return (
    <main className="container mx-auto px-4 py-8 flex flex-1 justify-center items-center">
      <Card className="w-full max-w-3xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Lawyer Profile Setup</h1>
          <p className="text-muted-foreground">Please provide your professional information</p>
        </div>
        
        <form action={saveLawyerProfile} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                name="firstName" 
                required 
                placeholder="John"
                className="w-full"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                required 
                placeholder="Smith"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firmName">Name of Firm or Chambers*</Label>
            <Input 
              id="firmName" 
              name="firmName"
              required  
              placeholder="Smith & Associates"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Office Address *</Label>
            <LocationAutocomplete 
              fullAddress={true}
              placeholder="Enter your office address"
              name="location"
              id="location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea 
              id="about" 
              name="about" 
              rows={4}
              placeholder="Tell potential clients about your experience and approach... [Keep it simple and concise]"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel"
                  placeholder="+64 21 123 4567"
                  className="w-full"
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="email">Professional Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  placeholder="john@smithlaw.co.nz"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                name="website" 
                type="text"
                placeholder="smithlaw.co.nz"
                pattern="^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"
                title="Please enter a valid website URL"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Practice Areas *</Label>
              <p className="text-sm text-muted-foreground mb-3">Select your areas of practice</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {practiceAreas.map((area) => (
                <div key={area.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`practice-${area.value}`} 
                    name="practiceArea" 
                    value={area.value}
                  />
                  <Label 
                    htmlFor={`practice-${area.value}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {area.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Legal Aid</Label>
              <p className="text-sm text-muted-foreground mb-3">Do you accept legal aid clients?</p>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="legalAid"
                    value="yes"
                    className="w-4 h-4"
                    required
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="legalAid"
                    value="no"
                    className="w-4 h-4"
                    required
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Spoken Languages</Label>
            <LanguageSelector defaultLanguages={['English']} />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Accessibility Support</Label>
              <p className="text-sm text-muted-foreground mb-3">Select the accommodations your office can provide</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="wheelchair-support" name="wheelchair-support" />
                <Label htmlFor="wheelchair-support" className="text-sm font-normal">
                  Wheelchair accessible office
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="visual-support" name="visual-support" />
                <Label htmlFor="visual-support" className="text-sm font-normal">
                  Support for clients with visual impairments
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="auditory-support" name="auditory-support" />
                <Label htmlFor="auditory-support" className="text-sm font-normal">
                  Support for clients with hearing impairments
                </Label>
              </div>
              
              <div className="space-y-2">
                <Input
                  id="other-accessibility"
                  name="other-accessibility"
                  placeholder="Other accommodations (please specify)"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="submit" variant="outline" size="lg" formAction={clearRole} formNoValidate>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <SubmitButton>
              Complete Profile
            </SubmitButton>
          </div>
        </form>
      </Card>
    </main>
  )
}