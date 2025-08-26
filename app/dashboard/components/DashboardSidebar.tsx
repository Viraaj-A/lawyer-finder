'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  FileText, 
  User, 
  Settings,
  CreditCard,
  Briefcase
} from "lucide-react"

interface UserInfo {
  name: string
  role: string
  email: string
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const individualNavItems: NavItem[] = [
  {
    href: '/dashboard/individual',
    label: 'My Issues',
    icon: FileText
  },
  {
    href: '/dashboard/individual/profile',
    label: 'My Profile',
    icon: User
  },
  {
    href: '/dashboard/individual/settings',
    label: 'Settings',
    icon: Settings
  }
]

const lawyerNavItems: NavItem[] = [
  {
    href: '/dashboard/lawyer',
    label: 'Cases',
    icon: Briefcase
  },
  {
    href: '/dashboard/lawyer/profile',
    label: 'My Profile',
    icon: User
  },
  {
    href: '/dashboard/lawyer/settings',
    label: 'Settings',
    icon: Settings
  }
]

export function DashboardSidebar({ userInfo }: { userInfo: UserInfo }) {
  const pathname = usePathname()
  const navItems = userInfo.role === 'lawyer' ? lawyerNavItems : individualNavItems

  return (
    <aside className="w-80 flex-shrink-0 bg-white shadow-lg">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 p-2">
            <div className="size-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900">{userInfo.name}</h1>
              <p className="text-sm text-gray-500 capitalize">{userInfo.role}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                    isActive 
                      ? "bg-blue-50 text-blue-600 font-semibold" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            <Link 
              href="/dashboard/individual/payments"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                "text-gray-700 hover:bg-gray-100"
              )}
            >
              <CreditCard className="size-5" />
              <span>Payments</span>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  )
}