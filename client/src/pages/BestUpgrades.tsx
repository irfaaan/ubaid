import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Trophy, Zap, BadgeDollarSign, Battery, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Phone } from "@shared/schema";
import { formatPhonePrice } from "@/lib/phoneUtils";

export default function BestUpgrades() {
  const { data: phones, isLoading } = useQuery<Phone[]>({
    queryKey: ["/api/phones"],
  });

  const filterPhonesByCategory = (category: string) => {
    if (!phones) return [];
    
    switch(category) {
      case "flagship":
        return phones.filter(phone => phone.series === "S" && !phone.model.includes("FE"));
      case "midrange":
        return phones.filter(phone => phone.series === "A" || phone.model.includes("FE"));
      case "foldable":
        return phones.filter(phone => phone.series === "Z");
      case "camera":
        return phones
          .filter(phone => phone.mainCamera.includes("108MP") || phone.mainCamera.includes("200MP") || phone.model.includes("Ultra"))
          .sort((a, b) => {
            // Extract MP from main camera
            const getMp = (str: string) => {
              const match = str.match(/(\d+)MP/);
              return match ? parseInt(match[1]) : 0;
            };
            return getMp(b.mainCamera) - getMp(a.mainCamera);
          });
      case "battery":
        return phones
          .filter(phone => {
            const match = phone.battery.match(/(\d+)\s*mAh/);
            return match && parseInt(match[1]) >= 4500;
          })
          .sort((a, b) => {
            const getCapacity = (str: string) => {
              const match = str.match(/(\d+)\s*mAh/);
              return match ? parseInt(match[1]) : 0;
            };
            return getCapacity(b.battery) - getCapacity(a.battery);
          });
      case "value":
        return phones
          .sort((a, b) => {
            // Simple value score based on processor and price
            const getValueScore = (phone: Phone) => {
              let score = 0;
              if (phone.processor.includes("Gen 3")) score += 5;
              else if (phone.processor.includes("Gen 2")) score += 4;
              else if (phone.processor.includes("Gen 1")) score += 3;
              
              // Adjust score based on price (lower is better for value)
              score = score * 1000 / phone.price;
              return score;
            };
            return getValueScore(b) - getValueScore(a);
          });
      default:
        return phones;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-2">
          Samsung Galaxy
        </Badge>
        <h1 className="text-3xl font-bold mb-3">Best Upgrade Options in {new Date().getFullYear()}</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Find the perfect Samsung Galaxy upgrade based on your priorities and budget. We've curated the top options across different categories.
        </p>
      </div>

      <Tabs defaultValue="flagship" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="flagship">Flagship</TabsTrigger>
            <TabsTrigger value="midrange">Midrange</TabsTrigger>
            <TabsTrigger value="foldable">Foldable</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="battery">Battery</TabsTrigger>
            <TabsTrigger value="value">Value</TabsTrigger>
          </TabsList>
        </div>

        <CategoryTabContent 
          value="flagship" 
          title="Best Flagship Galaxy Phones" 
          description="Samsung's premium Galaxy phones with top-of-the-line features and performance"
          icon={<Trophy className="h-5 w-5" />}
          phones={isLoading ? [] : filterPhonesByCategory("flagship")}
          isLoading={isLoading}
        />

        <CategoryTabContent 
          value="midrange" 
          title="Best Midrange Galaxy Phones" 
          description="Excellent Galaxy phones that balance performance and affordability"
          icon={<BadgeDollarSign className="h-5 w-5" />}
          phones={isLoading ? [] : filterPhonesByCategory("midrange")}
          isLoading={isLoading}
        />

        <CategoryTabContent 
          value="foldable" 
          title="Best Foldable Galaxy Phones" 
          description="Innovative foldable devices that redefine smartphone form factors"
          icon={<Zap className="h-5 w-5" />}
          phones={isLoading ? [] : filterPhonesByCategory("foldable")}
          isLoading={isLoading}
        />

        <CategoryTabContent 
          value="camera" 
          title="Best Galaxy Phones for Photography" 
          description="Phones with exceptional camera systems for photography enthusiasts"
          icon={<Camera className="h-5 w-5" />}
          phones={isLoading ? [] : filterPhonesByCategory("camera")}
          isLoading={isLoading}
        />

        <CategoryTabContent 
          value="battery" 
          title="Best Galaxy Phones for Battery Life" 
          description="Phones that deliver exceptional battery life for heavy users"
          icon={<Battery className="h-5 w-5" />}
          phones={isLoading ? [] : filterPhonesByCategory("battery")}
          isLoading={isLoading}
        />

        <CategoryTabContent 
          value="value" 
          title="Best Value Galaxy Phones" 
          description="Phones that offer the best features for your money"
          icon={<BadgeDollarSign className="h-5 w-5" />}
          phones={isLoading ? [] : filterPhonesByCategory("value")}
          isLoading={isLoading}
        />
      </Tabs>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Personalized Recommendation?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Get AI-powered recommendations based on your specific usage habits, budget, and priorities.
        </p>
        <Link href="/#advisor-tool">
          <Button size="lg" className="bg-[#1428A0] hover:bg-[#1428A0]/90">
            Try Our AI Advisor
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface CategoryTabContentProps {
  value: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  phones: Phone[];
  isLoading: boolean;
}

function CategoryTabContent({ 
  value, 
  title, 
  description, 
  icon,
  phones, 
  isLoading 
}: CategoryTabContentProps) {
  return (
    <TabsContent value={value} className="mt-6">
      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <div className="bg-[#1428A0]/10 p-2 rounded-full mr-3">
              {icon}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <PhoneSkeleton key={i} />
              ))}
            </div>
          ) : phones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No phones found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phones.slice(0, 6).map((phone, index) => (
                <PhoneCard 
                  key={phone.id} 
                  phone={phone}
                  ranking={index + 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface PhoneCardProps {
  phone: Phone;
  ranking: number;
}

function PhoneCard({ phone, ranking }: PhoneCardProps) {
  // Calculate recommendation strength based on ranking
  const getRecommendationBadge = (ranking: number) => {
    if (ranking === 1) return { text: "Top Pick", variant: "default" as const, className: "bg-[#1428A0]" };
    if (ranking === 2) return { text: "Runner Up", variant: "outline" as const, className: "border-[#1428A0] text-[#1428A0]" };
    if (ranking === 3) return { text: "Great Choice", variant: "outline" as const, className: "border-[#1428A0] text-[#1428A0]" };
    return { text: "Recommended", variant: "secondary" as const, className: "" };
  };

  const badge = getRecommendationBadge(ranking);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative">
        <img 
          src={phone.imageUrl} 
          alt={phone.model} 
          className="w-full h-48 object-contain pt-4"
        />
        <div className="absolute top-2 left-2">
          <Badge variant={badge.variant} className={badge.className}>
            {badge.text}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-1">{phone.model}</h3>
        <p className="text-sm text-gray-500 mb-4">Released {phone.year}</p>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Display</span>
            <span className="text-sm font-medium">{phone.displaySize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Processor</span>
            <span className="text-sm font-medium">{phone.processor.replace("Snapdragon", "SD")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Camera</span>
            <span className="text-sm font-medium">{phone.mainCamera.split(',')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Battery</span>
            <span className="text-sm font-medium">{phone.battery}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <p className="font-bold text-[#1428A0]">{formatPhonePrice(phone.price)}</p>
          <Link href={`/device/${phone.id}`}>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              Details <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function PhoneSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <Skeleton className="w-full h-48" />
        <div className="absolute top-2 left-2">
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2 mb-4" />

        <div className="space-y-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
