import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Issue {
  id: string
  title: string
  status: 'open' | 'closed' | 'pending'
  lawyer: string | null
  lastUpdated: string
}

export default function MyIssuesPage() {
  const issues: Issue[] = []

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Issues</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          New Issue
        </Button>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <IssuesTable issues={issues} />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <IssuesTable issues={issues.filter(i => i.status === 'open')} />
        </TabsContent>
        
        <TabsContent value="closed" className="mt-6">
          <IssuesTable issues={issues.filter(i => i.status === 'closed')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function IssuesTable({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return (
      <div className="rounded-lg border bg-white">
        <div className="p-12 text-center">
          <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No issues</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new legal issue.
          </p>
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700">
              New Issue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Issue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Lawyer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Last Updated
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {issue.title}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <StatusBadge status={issue.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {issue.lawyer || '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {issue.lastUpdated}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <a href="#" className="text-blue-600 hover:text-blue-900">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: Issue['status'] }) {
  const variants = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  
  return (
    <Badge className={cn("font-semibold", variants[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44Z"></path>
    </svg>
  )
}

import { cn } from "@/lib/utils"