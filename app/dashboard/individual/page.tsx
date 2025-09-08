"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Pencil, X, Check, Loader2, Plus, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProcessedIssue {
  id: string;
  submission_id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  lawyer_id: string | null;
  classification: any;
  created_at: string;
  updated_at: string;
  submission?: {
    text_input: string;
    file_metadata: any[];
    created_at: string;
  };
}

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<ProcessedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'closed'>('all');
  const [editingIssue, setEditingIssue] = useState<ProcessedIssue | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Fetch issues from API
  const fetchIssues = async (status?: 'active' | 'closed') => {
    try {
      const url = status 
        ? `/api/issues?status=${status}`
        : '/api/issues';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setIssues(data.issues);
      } else {
        console.error('Failed to fetch issues:', data.error);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Filter issues based on active tab
  const getFilteredIssues = () => {
    if (activeTab === 'all') return issues;
    return issues.filter(issue => issue.status === activeTab);
  };

  // Open edit modal
  const handleEdit = (issue: ProcessedIssue) => {
    setEditingIssue(issue);
    setEditForm({
      title: issue.title,
      description: issue.description
    });
    setIsEditModalOpen(true);
  };

  // Save edited issue
  const handleSaveEdit = async () => {
    if (!editingIssue) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/issues/${editingIssue.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIssues(issues.map(i => 
          i.id === editingIssue.id ? data.issue : i
        ));
        setIsEditModalOpen(false);
        setEditingIssue(null);
      }
    } catch (error) {
      console.error('Error saving issue:', error);
    } finally {
      setSaving(false);
    }
  };

  // Toggle issue status
  const handleToggleStatus = async (issue: ProcessedIssue) => {
    const newStatus = issue.status === 'active' ? 'closed' : 'active';
    
    try {
      const response = await fetch(`/api/issues/${issue.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setIssues(issues.map(i => 
          i.id === issue.id ? data.issue : i
        ));
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  const filteredIssues = getFilteredIssues();

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Issues</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </header>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="flex w-full max-w-md">
          <TabsTrigger value="all">
            All ({issues.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({issues.filter(i => i.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({issues.filter(i => i.status === 'closed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredIssues.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <IssuesTable 
              issues={filteredIssues} 
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogDescription>
              Make changes to your issue details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Issue title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Describe your legal issue..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileTextIcon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {activeTab !== 'all' ? activeTab : ''} issues found
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {activeTab === 'all' 
          ? "You haven't submitted any legal issues yet." 
          : activeTab === 'active'
          ? "You don't have any active issues at the moment."
          : "You don't have any closed issues."}
      </p>
      {activeTab !== 'closed' && (
        <Button 
          onClick={() => router.push('/')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Submit Your First Issue
        </Button>
      )}
    </div>
  );
}

function IssuesTable({ 
  issues, 
  onEdit, 
  onToggleStatus 
}: { 
  issues: ProcessedIssue[];
  onEdit: (issue: ProcessedIssue) => void;
  onToggleStatus: (issue: ProcessedIssue) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
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
            <tr key={issue.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {issue.title}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-md">
                    {issue.description?.substring(0, 100)}...
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={issue.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {issue.lawyer_id ? 'Assigned' : 'Not assigned'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(issue.updated_at).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(issue)}
                    title="Edit issue"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus(issue)}
                    title={issue.status === 'active' ? 'Close issue' : 'Reopen issue'}
                  >
                    {issue.status === 'active' ? (
                      <X className="h-4 w-4 text-red-600" />
                    ) : (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: ProcessedIssue['status'] }) {
  const variants = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <Badge className={cn("font-semibold", variants[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
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
  );
}