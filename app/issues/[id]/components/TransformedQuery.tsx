import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Scale } from "lucide-react";

interface Category {
  title: string;
  category: string;
  score: number;
}

interface TransformedQueryProps {
  formalQuery: string;
  categories: Category[];
}

export default function TransformedQuery({ formalQuery, categories }: TransformedQueryProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3 mb-4">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            Legal Analysis of Your Issue
          </h3>
          <p className="text-blue-800 mb-4 italic">
            "{formalQuery}"
          </p>
        </div>
      </div>

      <div className="border-t border-blue-200 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Relevant Legal Categories:
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => (
            <Badge
              key={index}
              variant={index === 0 ? "default" : "secondary"}
              className={index === 0 ? "bg-blue-600" : ""}
            >
              <span className="font-medium">{cat.title}</span>
              <span className="ml-2 opacity-75">
                {(cat.score * 100).toFixed(0)}% match
              </span>
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}