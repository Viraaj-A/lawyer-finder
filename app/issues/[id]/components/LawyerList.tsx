import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface LawyerListProps {
  location: string;
  category: string;
}

// Placeholder lawyer data
const placeholderLawyers = [
  {
    id: 1,
    name: "Sarah Thompson",
    specialties: ["Employment Law", "Business Law"],
    initials: "ST",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Michael Chen",
    specialties: ["Employment Law", "Business Law"],
    initials: "MC",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Olivia Bennett",
    specialties: ["Employment Law", "Business Law"],
    initials: "OB",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  },
  {
    id: 4,
    name: "Ethan Walker",
    specialties: ["Employment Law", "Business Law"],
    initials: "EW",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  },
  {
    id: 5,
    name: "Sophia Carter",
    specialties: ["Employment Law", "Business Law"],
    initials: "SC",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
  }
];

export default function LawyerList({ location, category }: LawyerListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Lawyers (20)</h2>
        <p className="text-sm text-gray-600">
          Showing placeholder results for {category} in {location}
        </p>
      </div>

      {placeholderLawyers.map((lawyer) => (
        <Card key={lawyer.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={lawyer.image} alt={lawyer.name} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-lg font-semibold">{lawyer.name}</h3>
                <p className="text-gray-600">
                  {lawyer.specialties.join(", ")}
                </p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>📍 {location}</span>
                  <span>⭐ 4.8 (12 reviews)</span>
                  <span>💼 10+ years experience</span>
                </div>
              </div>
            </div>

            <Button variant="outline">
              View profile
            </Button>
          </div>
        </Card>
      ))}

      {/* Load More Button */}
      <div className="text-center mt-6">
        <Button variant="outline" className="px-8">
          Load more lawyers
        </Button>
      </div>
    </div>
  );
}