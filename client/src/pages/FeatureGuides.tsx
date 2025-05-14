import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Guide } from "@shared/schema";

export default function FeatureGuides() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: ["/api/guides"],
  });

  // Filter guides based on search query
  const filteredGuides = useMemo(() => {
    if (!guides) return [];
    if (!searchQuery.trim()) return guides;

    const query = searchQuery.toLowerCase();
    return guides.filter(
      guide =>
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.content.toLowerCase().includes(query)
    );
  }, [guides, searchQuery]);

  // Categories for filtering
  const categories = {
    all: { label: "All Guides", filter: () => true },
    camera: { 
      label: "Camera Tips", 
      filter: (guide: Guide) => guide.title.toLowerCase().includes("camera") || 
                              guide.content.toLowerCase().includes("camera") ||
                              guide.content.toLowerCase().includes("photo") 
    },
    battery: { 
      label: "Battery & Power", 
      filter: (guide: Guide) => guide.title.toLowerCase().includes("battery") || 
                              guide.content.toLowerCase().includes("battery") ||
                              guide.content.toLowerCase().includes("power") ||
                              guide.content.toLowerCase().includes("charging")
    },
    features: {
      label: "UI Features",
      filter: (guide: Guide) => guide.title.toLowerCase().includes("ui") ||
                              guide.title.toLowerCase().includes("feature") ||
                              guide.content.toLowerCase().includes("one ui") ||
                              guide.content.toLowerCase().includes("interface")
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-[#1428A0]/10 text-[#1428A0] text-sm font-medium rounded-full mb-3">
          Resources
        </span>
        <h1 className="text-3xl font-bold mb-3">Galaxy Feature Guides & Tips</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Learn how to get the most out of your Samsung Galaxy phone with our detailed guides and tutorials
        </p>
      </div>

      <div className="max-w-lg mx-auto mb-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList>
            {Object.entries(categories).map(([key, { label }]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(categories).map(([key, { label, filter }]) => (
          <TabsContent key={key} value={key}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <GuideSkeleton key={i} />
                ))}
              </div>
            ) : filteredGuides.filter(filter).length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No guides found</h3>
                <p className="text-gray-500">
                  {searchQuery ? `No results found for "${searchQuery}"` : "No guides available in this category yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.filter(filter).map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface GuideCardProps {
  guide: Guide;
}

function GuideCard({ guide }: GuideCardProps) {
  // Function to extract categories from guide title/content
  const extractCategories = (guide: Guide): string[] => {
    const categories = [];
    
    if (guide.title.toLowerCase().includes("camera") || 
        guide.content.toLowerCase().includes("camera") ||
        guide.content.toLowerCase().includes("photo")) {
      categories.push("Camera");
    }
    
    if (guide.title.toLowerCase().includes("battery") || 
        guide.content.toLowerCase().includes("battery") ||
        guide.content.toLowerCase().includes("power")) {
      categories.push("Battery");
    }
    
    if (guide.title.toLowerCase().includes("ui") || 
        guide.content.toLowerCase().includes("one ui") ||
        guide.content.toLowerCase().includes("interface")) {
      categories.push("One UI");
    }
    
    if (guide.title.toLowerCase().includes("tip") || 
        guide.content.toLowerCase().includes("tip") ||
        guide.content.toLowerCase().includes("trick")) {
      categories.push("Tips & Tricks");
    }
    
    if (categories.length === 0) {
      categories.push("Feature Guide");
    }
    
    return categories;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group cursor-pointer">
      <img
        src={guide.imageUrl}
        alt={guide.title}
        className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
      />
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {extractCategories(guide).map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-[#1428A0] transition-colors">
          {guide.title}
        </h3>
        <p className="text-gray-700 mb-4 line-clamp-2">
          {guide.description}
        </p>
        <div className="flex items-center text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {guide.readTime} min read
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(guide.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function GuideSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-6">
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-7 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 mx-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
