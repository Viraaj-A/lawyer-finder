"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, MapPin, ChevronRight, Edit2, Plus, UserSearch } from "lucide-react";
import TransformedQuery from "./components/TransformedQuery";
import LawyerList from "./components/LawyerList";
import { createClient } from "@/lib/supabase/client";

interface TransformationResult {
  formal_query: string;
  categories: Array<{
    title: string;
    category: string;
    score: number;
  }>;
}

export default function IssueLawyerSearch() {
  const params = useParams();
  const issueId = params.id as string;
  
  const [originalQuery, setOriginalQuery] = useState("");
  const [transformedData, setTransformedData] = useState<TransformationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold mb-2">Summary of Your Enquiry</h2>
          <p className="text-gray-600 mb-6">
            <span className="font-medium text-gray-800">Type of Legal Issue:</span>{" "}
            {primaryCategory}
          </p>
          
          <div className="mb-6">
            <label 
              className="block text-sm font-medium text-gray-700 mb-2" 
              htmlFor="case-summary"
            >
              Brief Summary of Events
            </label>
            <Textarea
              id="case-summary"
              className="w-full min-h-[100px]"
              placeholder="Briefly describe what happened..."
              value={transformedData?.formal_query || originalQuery}
              onChange={(e) => setTransformedData(prev => 
                prev ? {...prev, formal_query: e.target.value} : null
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {transformedData?.categories && transformedData.categories.length > 0 ? (
              transformedData.categories.slice(0, 3).map((category, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  className="h-auto min-h-[3rem] py-3 px-4 whitespace-normal text-left"
                  onClick={() => console.log(`Selected: ${category.title}`)}
                >
                  <span className="text-sm break-words w-full">{category.title}</span>
                </Button>
              ))
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Enquiry
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add More Detail
                </Button>
                <Button 
                  className="flex items-center justify-center gap-2"
                >
                  <UserSearch className="h-4 w-4" />
                  Find a Lawyer
                </Button>
              </>
            )}
          </div>
        </Card>

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

            {/* Categories Display - Optional, can be shown as tags */}
            {transformedData?.categories && transformedData.categories.length > 0 && (
              <div className="mb-6 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Related categories:</span>
                {transformedData.categories.map((cat, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {cat.category}
                  </span>
                ))}
              </div>
            )}

            {/* Lawyer List */}
            <LawyerList location={location} category={primaryCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}