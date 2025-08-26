import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function MyProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('individual_profiles')
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
    const age = formData.get('age') as string
    const gender = formData.get('gender') as string
    const location = formData.get('location') as string

    await supabase
      .from('individual_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        age: parseInt(age),
        gender,
        location
      })
      .eq('id', user.id)

    redirect('/dashboard/individual/profile?updated=true')
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and preferences
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

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    defaultValue={profile.age}
                    required
                    min="18"
                    max="120"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={profile.gender}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={profile.location}
                  placeholder="City, Region"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="rounded-md border p-3 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {profile.languages?.join(', ') || 'No languages selected'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accessibility Needs</Label>
                <div className="rounded-md border p-3 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {profile.accessibility_needs?.length > 0 
                      ? profile.accessibility_needs.join(', ') 
                      : 'No accessibility needs specified'}
                  </p>
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
      </div>
    </div>
  )
}