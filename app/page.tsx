"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Paperclip, Mic } from "lucide-react";

export default function Home() {
  const [legalIssue, setLegalIssue] = useState("");

  const handleSubmitIssue = () => {
    // TODO(human): Implement issue submission logic
    console.log("Submitting issue:", legalIssue);
  };

  const handleSearchLawyers = () => {
    console.log("Searching lawyers for:", legalIssue);
  };

  const handleVoiceInput = () => {
    console.log("Voice input clicked");
  };

  const handleFileAttach = () => {
    console.log("File attach clicked");
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFileAttach}
                      className="rounded-full hover:bg-secondary"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleVoiceInput}
                      className="rounded-full hover:bg-secondary"
                      aria-label="Record voice message"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleSearchLawyers}
                      className="font-semibold"
                    >
                      Search Lawyers
                    </Button>
                    <Button
                      onClick={handleSubmitIssue}
                      className="font-bold"
                    >
                      Submit Issue
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