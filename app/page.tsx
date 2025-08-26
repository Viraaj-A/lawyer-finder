"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import VoiceInput from "@/components/VoiceInput";
import { submitIssue } from "@/app/actions/issues";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [legalIssue, setLegalIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmitIssue = async () => {
    // Validation
    if (!legalIssue.trim()) {
      setError("Please describe your legal issue");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Submit to database
      const result = await submitIssue({
        text: legalIssue
      });
      
      if (result.error) {
        setError(result.error);
        // If not logged in, redirect to login
        if (result.error.includes("logged in")) {
          setTimeout(() => router.push("/login"), 2000);
        }
      } else {
        setSuccess(true);
        // Clear form
        setLegalIssue("");
        // Show success message
        setTimeout(() => {
          setSuccess(false);
          // Optionally redirect to dashboard
          router.push("/dashboard/individual");
        }, 2000);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchLawyers = () => {
    console.log("Searching lawyers for:", legalIssue);
  };

  const handleVoiceTranscript = (transcript: string) => {
    // Replace entire text with new transcript
    setLegalIssue(transcript);
    // To append instead, use: setLegalIssue(prev => prev ? `${prev} ${transcript}` : transcript)
  };

  return (
    <div className="flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <div 
          className="relative flex min-h-[520px] flex-col items-center justify-center gap-8 overflow-hidden rounded-lg bg-cover bg-center p-8 text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070')`
          }}
        >
          <div className="z-10 flex flex-col gap-4">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter">
              Find the Right Lawyer For Your Needs
            </h1>
            <p className="text-lg font-light text-gray-200 max-w-2xl mx-auto">
              Describe your legal issue or use our search to find qualified lawyers across New Zealand. 
              Get help quickly and easily.
            </p>
          </div>

          <Card className="z-10 w-full max-w-2xl bg-white/95 backdrop-blur-sm p-6 shadow-xl">
            <div className="flex flex-col gap-4">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm">
                  ✓ Issue submitted successfully! Redirecting to dashboard...
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}
              <div className="relative flex flex-col">
                <label className="sr-only" htmlFor="legal-issue">
                  Describe your legal issue
                </label>
                <Textarea
                  id="legal-issue"
                  className="min-h-[120px] resize-y text-base"
                  placeholder="Describe your legal issue here... e.g., 'I need help with a property dispute.'"
                  value={legalIssue}
                  onChange={(e) => setLegalIssue(e.target.value)}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <VoiceInput 
                      onTranscript={handleVoiceTranscript}
                      provider="google-cloud"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleSearchLawyers}
                      className="font-semibold"
                      disabled={isSubmitting}
                    >
                      Search Lawyers
                    </Button>
                    <Button
                      onClick={handleSubmitIssue}
                      className="font-bold"
                      disabled={isSubmitting || !legalIssue.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Issue'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}