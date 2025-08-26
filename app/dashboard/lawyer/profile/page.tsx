import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { practiceAreas } from "@/lib/constants/practice-areas"

export default async function LawyerProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  async function updateProfile(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const firmName = formData.get('firmName') as string
    const location = formData.get('location') as string
    const about = formData.get('about') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    
    // Format website URL - add https:// if no protocol specified
    let website = formData.get('website') as string
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
      website = 'https://' + website
    }

    await supabase
      .from('lawyer_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        firm_name: firmName,
        location,
        about,
        phone,
        email,
        website
      })
      .eq('id', user.id)

    redirect('/dashboard/lawyer/profile?updated=true')
  }

  const getPracticeAreaLabel = (value: string) => {
    return practiceAreas.find(area => area.value === value)?.label || value
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Update your professional details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={profile.first_name}
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={profile.last_name}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firmName">Firm Name</Label>
                <Input
                  id="firmName"
                  name="firmName"
                  defaultValue={profile.firm_name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Office Address</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={profile.location}
                  placeholder="Full office address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  name="about"
                  defaultValue={profile.about}
                  rows={4}
                  placeholder="Describe your experience and approach..."
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={profile.phone}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email">Professional Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="text"
                    placeholder="smithlaw.co.nz"
                    pattern="^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"
                    title="Please enter a valid website URL"
                    defaultValue={profile.website}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Practice Areas</CardTitle>
            <CardDescription>
              Your areas of legal expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.practice_areas?.map((area: string) => (
                <Badge key={area} variant="secondary" className="px-3 py-1">
                  {getPracticeAreaLabel(area)}
                </Badge>
              )) || <p className="text-sm text-gray-500">No practice areas selected</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Legal Aid</CardTitle>
            <CardDescription>
              Do you accept legal aid clients?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge 
              variant={profile.accepts_legal_aid ? "default" : "secondary"} 
              className="px-3 py-1"
            >
              {profile.accepts_legal_aid ? "Yes" : "No"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>
              Languages you can provide services in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.languages?.map((language: string) => (
                <Badge key={language} variant="secondary" className="px-3 py-1">
                  {language}
                </Badge>
              )) || <p className="text-sm text-gray-500">No languages specified</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility Support</CardTitle>
            <CardDescription>
              Accommodations your office provides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.accessibility_support?.length > 0 ? (
                profile.accessibility_support.map((support: string) => (
                  <Badge key={support} variant="secondary" className="px-3 py-1">
                    {support}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No accessibility support specified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}