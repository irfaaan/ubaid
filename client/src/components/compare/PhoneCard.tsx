import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Cpu, Battery, Camera } from "lucide-react";
import { Phone } from "@shared/schema";

interface PhoneCardProps {
  phone: Phone;
}

export default function PhoneCard({ phone }: PhoneCardProps) {
  // Parse features for display
  const features = phone.features.split(",").map((f) => f.trim());
  
  // Calculate release year info
  const currentYear = new Date().getFullYear();
  const isCurrentYear = phone.year === currentYear;
  const isLastYear = phone.year === currentYear - 1;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={phone.imageUrl || 'https://via.placeholder.com/300x600?text=Galaxy+Phone'}
            alt={phone.model}
            className="h-48 object-contain mb-4"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x600?text=Galaxy+Phone';
            }}
          />
          <h3 className="text-xl font-bold text-center">{phone.model}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <Badge variant={isCurrentYear ? "default" : "outline"} className={isCurrentYear ? "bg-[#1428A0]" : ""}>
              {phone.year}
            </Badge>
            {isCurrentYear && (
              <Badge variant="secondary">Latest Model</Badge>
            )}
            {isLastYear && (
              <Badge variant="outline">Previous Gen</Badge>
            )}
          </div>
          <p className="mt-2 text-2xl font-bold text-[#1428A0]">${phone.price}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <Smartphone className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Display</p>
              <p className="text-sm text-gray-600">
                {phone.displaySize}, {phone.displayType}
              </p>
              <p className="text-sm text-gray-600">{phone.resolution}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Cpu className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Performance</p>
              <p className="text-sm text-gray-600">{phone.processor}</p>
              <p className="text-sm text-gray-600">{phone.ram} RAM, {phone.storageOptions}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Camera className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Camera</p>
              <p className="text-sm text-gray-600">{phone.mainCamera}</p>
              <p className="text-sm text-gray-600">Front: {phone.frontCamera}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Battery className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Battery</p>
              <p className="text-sm text-gray-600">{phone.battery}</p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Key Features</p>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
