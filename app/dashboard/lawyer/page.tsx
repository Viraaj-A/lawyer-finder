import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Case {
  id: string
  title: string
  status: 'new' | 'active' | 'closed'
  client: string
  category: string
  lastUpdated: string
  budget?: string
}

export default function LawyerCasesPage() {
  const cases: Case[] = []

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Browse New Cases
        </Button>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <CasesTable cases={cases} />
        </TabsContent>
        
        <TabsContent value="new" className="mt-6">
          <CasesTable cases={cases.filter(c => c.status === 'new')} />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <CasesTable cases={cases.filter(c => c.status === 'active')} />
        </TabsContent>
        
        <TabsContent value="closed" className="mt-6">
          <CasesTable cases={cases.filter(c => c.status === 'closed')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CasesTable({ cases }: { cases: Case[] }) {
  if (cases.length === 0) {
    return (
      <div className="rounded-lg border bg-white">
        <div className="p-12 text-center">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No cases</h3>
          <p className="mt-1 text-sm text-gray-500">
            Browse available cases to get started.
          </p>
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse Cases
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
              Case
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Budget
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
          {cases.map((caseItem) => (
            <tr key={caseItem.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {caseItem.title}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {caseItem.category}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <StatusBadge status={caseItem.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {caseItem.client}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {caseItem.budget || '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {caseItem.lastUpdated}
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

function StatusBadge({ status }: { status: Case['status'] }) {
  const variants = {
    new: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  
  return (
    <Badge className={cn("font-semibold", variants[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72ZM40,200V131.64A200.25,200.25,0,0,0,128,152a200.19,200.19,0,0,0,88-20.36V200Z"></path>
    </svg>
  )
}