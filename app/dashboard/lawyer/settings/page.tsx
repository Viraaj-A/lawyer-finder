import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function LawyerSettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>
                Manage your availability for new cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accepting-cases">Accepting new cases</Label>
                  <p className="text-sm text-gray-500">
                    Allow potential clients to contact you for new cases
                  </p>
                </div>
                <Switch id="accepting-cases" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="urgent-cases">Available for urgent cases</Label>
                  <p className="text-sm text-gray-500">
                    Show your profile for time-sensitive legal matters
                  </p>
                </div>
                <Switch id="urgent-cases" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive updates about cases and clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="case-notifications">New case notifications</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when cases matching your practice areas are posted
                  </p>
                </div>
                <Switch id="case-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="client-messages">Client messages</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications when clients message you
                  </p>
                </div>
                <Switch id="client-messages" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Platform updates</Label>
                  <p className="text-sm text-gray-500">
                    Receive updates about new platform features
                  </p>
                </div>
                <Switch id="marketing" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility</CardTitle>
              <CardDescription>
                Control how your profile appears in search results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-profile">Public profile</Label>
                  <p className="text-sm text-gray-500">
                    Allow your profile to appear in public lawyer searches
                  </p>
                </div>
                <Switch id="public-profile" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-rates">Display rates</Label>
                  <p className="text-sm text-gray-500">
                    Show your hourly rates on your public profile
                  </p>
                </div>
                <Switch id="show-rates" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-availability">Show availability</Label>
                  <p className="text-sm text-gray-500">
                    Display your current availability status
                  </p>
                </div>
                <Switch id="show-availability" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full">
                  Subscription Settings
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}