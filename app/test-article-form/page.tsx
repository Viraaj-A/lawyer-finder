"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle, ChevronRight, FileText, Clock, CheckCircle2 } from "lucide-react";

// Mock article data matching your Supabase structure
const mockArticles = {
  "consumer-guarantees": {
    article_id: "art-001",
    issue_title: "Consumer Guarantees Act Rights",
    issue_category: "Consumer Law",
    processed_result: {
      situation_checklist: {
        description: "Check all that apply to your situation:",
        items: [
          {
            id: "private_sale_no_fta",
            label: "My issue involves a private sale not covered by FTA",
            importance: "high",
            helper_text: "Private sales between individuals aren't covered by consumer laws"
          },
          {
            id: "business_purchase",
            label: "I purchased from a registered business",
            importance: "high"
          },
          {
            id: "product_faulty",
            label: "The product was faulty when I received it",
            importance: "medium"
          },
          {
            id: "warranty_expired",
            label: "Manufacturer warranty has expired",
            importance: "low",
            helper_text: "CGA rights may still apply beyond warranty"
          }
        ]
      },
      actions_taken: {
        description: "Which of these have you already done?",
        items: [
          {
            id: "contacted_business",
            label: "I have contacted the business about the issue"
          },
          {
            id: "written_complaint",
            label: "I have sent a written complaint",
            helper_text: "Email or letter documenting the issue"
          },
          {
            id: "sought_repair",
            label: "I asked for a repair or replacement"
          }
        ]
      },
      documents_checklist: {
        description: "Which documents do you have?",
        items: [
          {
            id: "receipt",
            label: "Receipt or proof of purchase",
            required: true,
            helper_text: "Bank statement also acceptable"
          },
          {
            id: "warranty_docs",
            label: "Warranty documentation",
            required: false
          },
          {
            id: "correspondence",
            label: "Email/letter correspondence with seller",
            required: false
          },
          {
            id: "photos",
            label: "Photos of the fault/damage",
            required: true,
            helper_text: "Clear images showing the problem"
          }
        ]
      },
      information_panels: [
        {
          type: "info",
          title: "Consumer Guarantees Act Coverage",
          content: "The CGA provides automatic guarantees for goods purchased from businesses in trade. These rights cannot be waived and apply regardless of warranty.",
          priority: 1
        },
        {
          type: "warning",
          title: "Time Limits Apply",
          content: "While there's no specific time limit under the CGA, claims should be made within a reasonable time of discovering the fault.",
          priority: 2
        }
      ],
      next_steps_checklist: {
        description: "Recommended next steps:",
        items: [
          {
            id: "contact_seller",
            label: "Contact the seller in writing",
            order: 1,
            urgency: "immediate",
            details: "Document your complaint and proposed resolution"
          },
          {
            id: "disputes_tribunal",
            label: "Consider Disputes Tribunal if unresolved",
            order: 2,
            urgency: "soon",
            details: "Claims up to $30,000 can be heard"
          },
          {
            id: "seek_advice",
            label: "Get legal advice for complex cases",
            order: 3,
            urgency: "eventual",
            details: "Especially for high-value items or business purchases"
          }
        ]
      },
      resolution_options: {
        description: "Available resolution methods:",
        items: [
          {
            id: "disputes_tribunal",
            label: "Disputes Tribunal",
            method: "Tribunal",
            body: "New Zealand Disputes Tribunal",
            estimated_time: "4-6 weeks",
            estimated_cost: "$45 filing fee"
          },
          {
            id: "motor_vehicle_disputes",
            label: "Motor Vehicle Disputes Tribunal",
            method: "Specialized Tribunal",
            body: "For vehicle-related disputes",
            estimated_time: "6-8 weeks",
            estimated_cost: "$333 standard fee"
          }
        ]
      },
      lawyer_summary: {
        key_legal_issues: [
          "Consumer Guarantees Act application",
          "Acceptable quality standards",
          "Reasonable remedy expectations"
        ],
        relevant_legislation: [
          "Consumer Guarantees Act 1993",
          "Fair Trading Act 1986",
          "Contract and Commercial Law Act 2017"
        ],
        potential_claims: [
          "Breach of guarantee of acceptable quality",
          "Breach of guarantee of fitness for purpose",
          "Misleading conduct claims"
        ],
        critical_facts_needed: [
          "Date and place of purchase",
          "Nature and extent of defect",
          "Communications with seller"
        ]
      }
    }
  },
  "employment-dismissal": {
    article_id: "art-002",
    issue_title: "Unfair Dismissal Claims",
    issue_category: "Employment Law",
    processed_result: {
      situation_checklist: {
        description: "Select your employment situation:",
        items: [
          {
            id: "permanent_employee",
            label: "I was a permanent employee",
            importance: "high"
          },
          {
            id: "trial_period",
            label: "I was within my 90-day trial period",
            importance: "high",
            helper_text: "Different rules apply during trial periods"
          },
          {
            id: "written_warning",
            label: "I received written warnings before dismissal",
            importance: "medium"
          }
        ]
      },
      timeline_check: {
        description: "Important deadlines:",
        items: [
          {
            id: "personal_grievance",
            label: "Personal grievance must be raised within 90 days",
            details: "From the date of dismissal or when you became aware"
          },
          {
            id: "mediation",
            label: "Mediation typically within 3-6 weeks of claim",
            details: "MBIE provides free mediation services"
          }
        ]
      },
      documents_checklist: {
        description: "Gather these employment documents:",
        items: [
          {
            id: "employment_agreement",
            label: "Employment agreement",
            required: true
          },
          {
            id: "dismissal_letter",
            label: "Dismissal letter or notice",
            required: true
          },
          {
            id: "warnings",
            label: "Any warnings received",
            required: false
          }
        ]
      }
    }
  },
  "tenancy-bond": {
    article_id: "art-003",
    issue_title: "Bond Refund Disputes",
    issue_category: "Tenancy Law",
    processed_result: {
      situation_checklist: {
        description: "What applies to your tenancy?",
        items: [
          {
            id: "bond_lodged",
            label: "Bond was lodged with Tenancy Services",
            importance: "high"
          },
          {
            id: "inspection_done",
            label: "Entry/exit inspections were completed",
            importance: "medium"
          }
        ]
      },
      information_panels: [
        {
          type: "info",
          title: "Bond Refund Process",
          content: "Both landlord and tenant must agree to bond refund. If disputed, Tenancy Tribunal decides.",
          priority: 1
        }
      ],
      next_steps_checklist: {
        description: "Steps to get your bond back:",
        items: [
          {
            id: "apply_refund",
            label: "Apply for bond refund online",
            order: 1,
            urgency: "immediate"
          },
          {
            id: "tribunal_application",
            label: "Apply to Tenancy Tribunal if disputed",
            order: 2,
            urgency: "soon",
            details: "Within 2 months of tenancy ending"
          }
        ]
      }
    }
  }
};

interface CheckboxState {
  [key: string]: boolean;
}

export default function TestArticleForm() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({});
  const [showJson, setShowJson] = useState(false);

  const handleCheckboxToggle = (fieldName: string, itemId: string) => {
    const key = `${fieldName}-${itemId}`;
    setCheckboxState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
      <h3 className="font-semibold">Important Information</h3>
      {panels.sort((a, b) => a.priority - b.priority).map((panel, index) => (
        <Alert key={index} className={panel.type === 'warning' ? 'border-orange-200 bg-orange-50' : ''}>
          {panel.type === 'warning' ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertDescription>
            <span className="font-medium">{panel.title}</span>
            <p className="text-sm mt-1">{panel.content}</p>
          </AlertDescription>
        </Alert>
      ))}
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
        {data.items.sort((a: any, b: any) => a.order - b.order).map((item: any) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
              {item.order}
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
      <div className="grid gap-3">
        {data.items.map((option: any) => (
          <Card key={option.id} className="p-4">
            <h4 className="font-medium text-sm mb-2">{option.label}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Method:</span> {option.method}
              </div>
              <div>
                <span className="text-gray-500">Body:</span> {option.body}
              </div>
              <div>
                <span className="text-gray-500">Time:</span> {option.estimated_time}
              </div>
              <div>
                <span className="text-gray-500">Cost:</span> {option.estimated_cost}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLawyerSummary = (data: any) => (
    <div className="space-y-3">
      <h3 className="font-semibold">Legal Summary</h3>
      <div className="space-y-3">
        {data.key_legal_issues && data.key_legal_issues.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Key Legal Issues:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {data.key_legal_issues.map((issue: string, i: number) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
        {data.relevant_legislation && data.relevant_legislation.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Relevant Legislation:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {data.relevant_legislation.map((law: string, i: number) => (
                <li key={i}>{law}</li>
              ))}
            </ul>
          </div>
        )}
        {data.potential_claims && data.potential_claims.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Potential Claims:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {data.potential_claims.map((claim: string, i: number) => (
                <li key={i}>{claim}</li>
              ))}
            </ul>
          </div>
        )}
        {data.critical_facts_needed && data.critical_facts_needed.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Critical Facts Needed:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {data.critical_facts_needed.map((fact: string, i: number) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderDynamicForm = () => {
    if (!selectedArticle) return null;
    
    const article = mockArticles[selectedArticle as keyof typeof mockArticles];
    const processed = article.processed_result;
    
    return (
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">{article.issue_title}</h2>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Type of Legal Issue:</span>{" "}
            {article.issue_category}
          </p>
        </div>
        
        <div className="space-y-6">
          {processed.situation_checklist && renderSituationChecklist(processed.situation_checklist)}
          {processed.actions_taken && renderActionsTaken(processed.actions_taken)}
          {processed.documents_checklist && renderDocumentsChecklist(processed.documents_checklist)}
          {processed.timeline_check && renderTimelineCheck(processed.timeline_check)}
          {processed.information_panels && renderInformationPanels(processed.information_panels)}
          {processed.next_steps_checklist && renderNextSteps(processed.next_steps_checklist)}
          {processed.resolution_options && renderResolutionOptions(processed.resolution_options)}
          {processed.lawyer_summary && renderLawyerSummary(processed.lawyer_summary)}
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button 
            className="w-full"
            onClick={() => {
              const checkedItems = Object.entries(checkboxState)
                .filter(([_, value]) => value)
                .map(([key]) => key);
              console.log("Checked items:", checkedItems);
              alert(`Form submitted with ${checkedItems.length} items checked`);
            }}
          >
            Continue with Selected Information
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Dynamic Article Form Test Viewer</h1>
        <p className="text-gray-600 mb-8">
          Click on a category below to see how the dynamic form renders different article structures
        </p>

        {/* Category Selection */}
        <Card className="p-6 mb-8">
          <p className="text-sm font-medium mb-4">Does your issue relate to any of the following topics?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant={selectedArticle === 'consumer-guarantees' ? 'default' : 'outline'}
              className="h-auto min-h-[3rem] py-3 px-4 whitespace-normal text-left"
              onClick={() => {
                setSelectedArticle('consumer-guarantees');
                setCheckboxState({});
              }}
            >
              <span className="text-sm break-words w-full">Consumer Guarantees Act Rights</span>
            </Button>
            <Button
              variant={selectedArticle === 'employment-dismissal' ? 'default' : 'outline'}
              className="h-auto min-h-[3rem] py-3 px-4 whitespace-normal text-left"
              onClick={() => {
                setSelectedArticle('employment-dismissal');
                setCheckboxState({});
              }}
            >
              <span className="text-sm break-words w-full">Unfair Dismissal Claims</span>
            </Button>
            <Button
              variant={selectedArticle === 'tenancy-bond' ? 'default' : 'outline'}
              className="h-auto min-h-[3rem] py-3 px-4 whitespace-normal text-left"
              onClick={() => {
                setSelectedArticle('tenancy-bond');
                setCheckboxState({});
              }}
            >
              <span className="text-sm break-words w-full">Bond Refund Disputes</span>
            </Button>
          </div>
        </Card>

        {/* Dynamic Form Display */}
        {renderDynamicForm()}

        {/* Debug Panel */}
        {selectedArticle && (
          <Card className="p-4 mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Debug Info</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJson(!showJson)}
              >
                {showJson ? 'Hide' : 'Show'} JSON Structure
              </Button>
            </div>
            
            <div className="text-sm space-y-2">
              <p><strong>Selected Article:</strong> {selectedArticle}</p>
              <p><strong>Checked Items:</strong> {Object.keys(checkboxState).filter(k => checkboxState[k]).join(', ') || 'None'}</p>
            </div>
            
            {showJson && (
              <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(mockArticles[selectedArticle as keyof typeof mockArticles].processed_result, null, 2)}
              </pre>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}