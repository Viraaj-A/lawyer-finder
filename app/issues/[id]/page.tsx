"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MapPin, ChevronRight, Edit2, Plus, UserSearch, Info, AlertTriangle, FileText, Clock, CheckCircle2 } from "lucide-react";
import TransformedQuery from "./components/TransformedQuery";
import LawyerList from "./components/LawyerList";
import { createClient } from "@/lib/supabase/client";

interface TransformationResult {
  formal_query: string;
  categories: Array<{
    title: string;
    category: string;
    subcategory?: string;
    url?: string;
    score: number;
  }>;
}

interface ArticleData {
  article_id: string;
  original_title: string;
  original_url: string;
  issue_title: string;
  issue_category: string;
  main_category: string;
  subcategory: string;
  processed_result: any;
  has_situation_checklist: boolean;
  has_lawyer_summary: boolean;
  has_actions_taken: boolean;
  has_documents_checklist: boolean;
  has_information_panels: boolean;
  has_next_steps_checklist: boolean;
  has_resolution_options: boolean;
  has_timeline_check: boolean;
}

interface CheckboxState {
  [key: string]: boolean;
}

export default function IssueLawyerSearch() {
  const params = useParams();
  const issueId = params.id as string;
  
  const [originalQuery, setOriginalQuery] = useState("");
  const [transformedData, setTransformedData] = useState<TransformationResult | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search filters
  const [location, setLocation] = useState("Auckland");
  const [lawyerName, setLawyerName] = useState("");

  useEffect(() => {
    fetchIssueAndTransform();
  }, [issueId]);

  const fetchIssueAndTransform = async () => {
    try {
      // Fetch the original issue submission
      const supabase = createClient();
      const { data: issue, error: fetchError } = await supabase
        .from("issue_submissions")
        .select("text_input")
        .eq("id", issueId)
        .single();

      if (fetchError || !issue) {
        setError("Unable to load your issue. Please try again.");
        setIsLoading(false);
        return;
      }

      setOriginalQuery(issue.text_input);

      // Call Flask API for transformation
      const response = await fetch("/api/ai/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: issue.text_input }),
      });

      if (!response.ok) {
        throw new Error("Failed to transform query");
      }

      const transformedResult = await response.json();
      setTransformedData(transformedResult);
    } catch (err) {
      console.error("Error:", err);
      setError("Processing your request... Please wait.");
      // Fallback: show original query if transformation fails
      setTimeout(() => {
        setTransformedData({
          formal_query: originalQuery,
          categories: []
        });
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    console.log("Searching with filters:", { location, lawyerName });
    // TODO: Implement actual search when lawyer data is available
  };

  const handleArticleSelect = async (title: string) => {
    setIsLoadingArticle(true);
    setCheckboxState({});
    
    try {
      const supabase = createClient();
      
      // Fetch the article from Supabase using the title
      const { data: article, error: fetchError } = await supabase
        .from("articles")
        .select("*")
        .eq("original_title", title)
        .single();

      if (fetchError || !article) {
        console.error("Error fetching article:", fetchError);
        setError(`Could not fetch article: ${title}`);
        return;
      }

      setSelectedArticle(article);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch article from database");
    } finally {
      setIsLoadingArticle(false);
    }
  };

  const handleCheckboxToggle = (fieldName: string, itemId: string) => {
    const key = `${fieldName}-${itemId}`;
    setCheckboxState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Rendering functions for dynamic form fields
  const renderSituationChecklist = (data: any) => (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        Situation Checklist
      </h3>
      {data.description && (
        <p className="text-sm text-gray-600">{data.description}</p>
      )}
      <div className="space-y-2">
        {data.items.map((item: any) => (
          <div key={item.id} className="flex items-start space-x-2">
            <input
              type="checkbox"
              id={`situation-${item.id}`}
              checked={checkboxState[`situation_checklist-${item.id}`] || false}
              onChange={() => handleCheckboxToggle('situation_checklist', item.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor={`situation-${item.id}`} className="text-sm cursor-pointer">
                {item.label}
                {item.importance && (
                  <Badge 
                    className="ml-2" 
                    variant={item.importance === 'high' ? 'destructive' : item.importance === 'medium' ? 'default' : 'secondary'}
                  >
                    {item.importance}
                  </Badge>
                )}
              </label>
              {item.helper_text && (
                <p className="text-xs text-gray-500 mt-1">{item.helper_text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActionsTaken = (data: any) => (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        Actions Already Taken
      </h3>
      {data.description && (
        <p className="text-sm text-gray-600">{data.description}</p>
      )}
      <div className="space-y-2">
        {data.items.map((item: any) => (
          <div key={item.id} className="flex items-start space-x-2">
            <input
              type="checkbox"
              id={`actions-${item.id}`}
              checked={checkboxState[`actions_taken-${item.id}`] || false}
              onChange={() => handleCheckboxToggle('actions_taken', item.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor={`actions-${item.id}`} className="text-sm cursor-pointer">
                {item.label}
              </label>
              {item.helper_text && (
                <p className="text-xs text-gray-500 mt-1">{item.helper_text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsChecklist = (data: any) => (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-purple-600" />
        Documents Needed
      </h3>
      {data.description && (
        <p className="text-sm text-gray-600">{data.description}</p>
      )}
      <div className="space-y-2">
        {data.items.map((item: any) => (
          <div key={item.id} className="flex items-start space-x-2">
            <input
              type="checkbox"
              id={`docs-${item.id}`}
              checked={checkboxState[`documents_checklist-${item.id}`] || false}
              onChange={() => handleCheckboxToggle('documents_checklist', item.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor={`docs-${item.id}`} className="text-sm cursor-pointer">
                {item.label}
                {item.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {item.helper_text && (
                <p className="text-xs text-gray-500 mt-1">{item.helper_text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimelineCheck = (data: any) => (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5 text-orange-600" />
        Timeline Check
      </h3>
      {data.description && (
        <p className="text-sm text-gray-600">{data.description}</p>
      )}
      <div className="space-y-3">
        {data.items.map((item: any) => (
          <div key={item.id} className="border-l-2 border-orange-200 pl-4 py-2">
            <p className="text-sm font-medium">{item.label}</p>
            {item.details && (
              <p className="text-xs text-gray-600 mt-1">{item.details}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderInformationPanels = (panels: any[]) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Important Information</h3>
      <div className="flex flex-wrap gap-3">
        {panels.sort((a, b) => (a.priority || 0) - (b.priority || 0)).map((panel, index) => (
          <div 
            key={index} 
            className={`flex-1 min-w-[280px] border rounded-lg p-4 ${
              panel.type === 'warning' 
                ? 'border-orange-200 bg-orange-50' 
                : 'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex gap-3">
              {panel.type === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-medium">{panel.title}</span>
                <p className="text-sm mt-1 text-gray-600">{panel.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNextSteps = (data: any) => (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <ChevronRight className="h-5 w-5 text-green-600" />
        Next Steps
      </h3>
      {data.description && (
        <p className="text-sm text-gray-600">{data.description}</p>
      )}
      <div className="space-y-3">
        {data.items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
              {item.order || '•'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.label}
                {item.urgency && (
                  <Badge 
                    className="ml-2" 
                    variant={item.urgency === 'immediate' ? 'destructive' : 'secondary'}
                  >
                    {item.urgency}
                  </Badge>
                )}
              </p>
              {item.details && (
                <p className="text-xs text-gray-600 mt-1">{item.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResolutionOptions = (data: any) => (
    <div className="space-y-3">
      <h3 className="font-semibold">Resolution Options</h3>
      {data.description && (
        <p className="text-sm text-gray-600">{data.description}</p>
      )}
      <div className="space-y-3">
        {data.items.map((option: any) => (
          <Card key={option.id} className="p-4">
            <h4 className="font-medium text-sm mb-2">{option.label}</h4>
            <div className="space-y-1 text-xs">
              {option.method && (
                <div>
                  <span className="text-gray-500">Method:</span> {option.method}
                </div>
              )}
              {option.body && (
                <div>
                  <span className="text-gray-500">Body:</span> {option.body}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDynamicForm = () => {
    if (!selectedArticle) return null;
    
    const processed = selectedArticle.processed_result;
    if (!processed) return <p className="text-gray-500">No form data available for this article.</p>;
    
    // Collect all available sections
    const sections = [];
    
    if ('situation_checklist' in processed && processed.situation_checklist) {
      sections.push({
        key: 'situation_checklist',
        content: renderSituationChecklist(processed.situation_checklist)
      });
    }
    if ('actions_taken' in processed && processed.actions_taken) {
      sections.push({
        key: 'actions_taken',
        content: renderActionsTaken(processed.actions_taken)
      });
    }
    if ('documents_checklist' in processed && processed.documents_checklist) {
      sections.push({
        key: 'documents_checklist',
        content: renderDocumentsChecklist(processed.documents_checklist)
      });
    }
    if ('timeline_check' in processed && processed.timeline_check) {
      sections.push({
        key: 'timeline_check',
        content: renderTimelineCheck(processed.timeline_check)
      });
    }
    if ('next_steps_checklist' in processed && processed.next_steps_checklist) {
      sections.push({
        key: 'next_steps_checklist',
        content: renderNextSteps(processed.next_steps_checklist)
      });
    }
    if ('resolution_options' in processed && processed.resolution_options) {
      sections.push({
        key: 'resolution_options',
        content: renderResolutionOptions(processed.resolution_options)
      });
    }
    
    return (
      <div className="space-y-6">
        {/* Information Panels - Full width at top */}
        {'information_panels' in processed && processed.information_panels && (
          <div className="w-full">
            {renderInformationPanels(processed.information_panels)}
          </div>
        )}
        
        {/* Simple 2-column grid for all sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map(section => (
            <div key={section.key} className="border rounded-lg p-4 bg-white">
              {section.content}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Processing Your Legal Issue</h2>
          <p className="text-gray-600">Analyzing and finding relevant lawyers...</p>
        </Card>
      </div>
    );
  }

  const primaryCategory = transformedData?.categories?.[0]?.category || "Legal Services";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Summary of Enquiry Card */}
        {!selectedArticle ? (
          <Card className="mb-8 p-6">
            {/* Show article selection if we have categories */}
            {transformedData?.categories && transformedData.categories.length > 0 && (
              <>
                {/* Side-by-side display of original and legal formulation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Your Original Issue
                    </h3>
                    <Textarea
                      className="w-full min-h-[100px] bg-gray-50"
                      value={originalQuery}
                      readOnly
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Legal Formulation
                    </h3>
                    <Textarea
                      className="w-full min-h-[100px] bg-blue-50"
                      value={transformedData?.formal_query || originalQuery}
                      readOnly
                    />
                  </div>
                </div>
                
                <h3 className="text-base font-semibold text-center mb-3">Does your issue relate to any of the following topics?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {transformedData.categories.slice(0, 3).map((category, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      className="h-auto min-h-[3rem] py-3 px-4 whitespace-normal text-center"
                      onClick={() => handleArticleSelect(category.title)}
                      disabled={isLoadingArticle}
                    >
                      <span className="text-sm break-words w-full">{category.title}</span>
                    </Button>
                  ))}
                </div>
              </>
            )}
            
            {/* Show loading or error state */}
            {isLoadingArticle && (
              <div className="mt-4 p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Loading article details...</p>
              </div>
            )}
          </Card>
        ) : (
          /* Dynamic Form when article is selected */
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold mb-4">{selectedArticle.original_title}</h2>
            
            {/* Side-by-side display of original and legal formulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Your Original Issue
                </h3>
                <Textarea
                  className="w-full min-h-[100px] bg-gray-50"
                  value={originalQuery}
                  readOnly
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Legal Formulation
                </h3>
                <Textarea
                  className="w-full min-h-[100px] bg-blue-50"
                  value={transformedData?.formal_query || originalQuery}
                  readOnly
                />
              </div>
            </div>
            
            {/* Dynamic Form Fields */}
            {renderDynamicForm()}
            
            {/* Submit Button */}
            <div className="mt-6 pt-6 border-t">
              <Button 
                className="w-full"
                onClick={() => {
                  const checkedItems = Object.entries(checkboxState)
                    .filter(([_, value]) => value)
                    .map(([key]) => key);
                  console.log("Selected article:", selectedArticle.article_id);
                  console.log("Checked items:", checkedItems);
                  // TODO: Navigate to lawyer search with this data
                }}
              >
                Continue to Find Lawyers
              </Button>
            </div>
            
            {/* Back button to select different article */}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedArticle(null);
                  setCheckboxState({});
                }}
              >
                ← Choose a different topic
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Filter Results</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What is your location?
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Auckland"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search for a lawyer by name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="e.g. Sarah Thompson"
                      value={lawyerName}
                      onChange={(e) => setLawyerName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full"
                >
                  Update Search
                </Button>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="text-sm mb-4 flex items-center text-gray-600">
              <a href="/" className="hover:text-blue-600">Home</a>
              <ChevronRight className="h-3 w-3 mx-2" />
              <a href="/search" className="hover:text-blue-600">Find a lawyer</a>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span className="text-gray-900">{primaryCategory}</span>
            </nav>

            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-2">
              {primaryCategory} lawyers in {location}
            </h1>


            {/* Lawyer List */}
            <LawyerList location={location} category={primaryCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}