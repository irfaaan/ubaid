import { Phone } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface ComparisonTableProps {
  phone1: Phone;
  phone2: Phone;
}

interface ComparisonItem {
  label: string;
  key: keyof Phone | ((phone: Phone) => string);
  highlight?: boolean;
}

export default function ComparisonTable({ phone1, phone2 }: ComparisonTableProps) {
  const comparisonItems: ComparisonItem[] = [
    { label: "Price", key: "price", highlight: true },
    { label: "Release Year", key: "year" },
    { label: "Display Size", key: "displaySize" },
    { label: "Display Type", key: "displayType" },
    { label: "Resolution", key: "resolution" },
    { label: "Processor", key: "processor", highlight: true },
    { label: "RAM", key: "ram" },
    { label: "Storage Options", key: "storageOptions" },
    { label: "Main Camera", key: "mainCamera", highlight: true },
    { label: "Front Camera", key: "frontCamera" },
    { label: "Battery", key: "battery", highlight: true },
    { 
      label: "Key Features", 
      key: (phone) => {
        return phone.features.split(',').join(', ');
      }
    },
  ];

  const getValue = (phone: Phone, item: ComparisonItem): string => {
    if (typeof item.key === 'function') {
      return item.key(phone);
    }
    
    const value = phone[item.key];
    
    if (item.key === 'price') {
      return `$${value}`;
    }
    
    return String(value);
  };

  const hasBetterValue = (item: ComparisonItem): Phone | undefined => {
    // Don't highlight if not specified
    if (!item.highlight) return undefined;
    
    // Handle specific comparisons based on feature
    if (typeof item.key === 'string') {
      switch (item.key) {
        case 'price':
          return phone1.price < phone2.price ? phone1 : phone2;
        
        case 'processor':
          // Simple heuristic: higher generation is better
          const gen1 = extractGenNumber(phone1.processor);
          const gen2 = extractGenNumber(phone2.processor);
          if (gen1 > 0 && gen2 > 0) {
            return gen1 > gen2 ? phone1 : (gen2 > gen1 ? phone2 : undefined);
          }
          return undefined;
          
        case 'mainCamera':
          // Simple heuristic: higher MP in main sensor is better
          const mp1 = extractMainMP(phone1.mainCamera);
          const mp2 = extractMainMP(phone2.mainCamera);
          if (mp1 > 0 && mp2 > 0) {
            return mp1 > mp2 ? phone1 : (mp2 > mp1 ? phone2 : undefined);
          }
          return undefined;
          
        case 'battery':
          // Larger battery capacity is better
          const capacity1 = extractBatteryCapacity(phone1.battery);
          const capacity2 = extractBatteryCapacity(phone2.battery);
          if (capacity1 > 0 && capacity2 > 0) {
            return capacity1 > capacity2 ? phone1 : (capacity2 > capacity1 ? phone2 : undefined);
          }
          return undefined;
          
        default:
          return undefined;
      }
    }
    
    return undefined;
  };

  const extractGenNumber = (processorString: string): number => {
    const match = processorString.match(/Gen\s*(\d+)/i);
    return match ? parseInt(match[1]) : 0;
  };

  const extractMainMP = (cameraString: string): number => {
    const match = cameraString.match(/(\d+)MP/);
    return match ? parseInt(match[1]) : 0;
  };

  const extractBatteryCapacity = (batteryString: string): number => {
    const match = batteryString.match(/(\d+)\s*mAh/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700 border-b">Feature</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 border-b">{phone1.model}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 border-b">{phone2.model}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 border-b">Better Option</th>
              </tr>
            </thead>
            <tbody>
              {comparisonItems.map((item, index) => {
                const value1 = getValue(phone1, item);
                const value2 = getValue(phone2, item);
                const betterPhone = hasBetterValue(item);
                
                return (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4 font-medium border-b">{item.label}</td>
                    <td className={`py-3 px-4 border-b ${betterPhone === phone1 ? "font-medium text-[#1428A0]" : ""}`}>
                      {value1}
                    </td>
                    <td className={`py-3 px-4 border-b ${betterPhone === phone2 ? "font-medium text-[#1428A0]" : ""}`}>
                      {value2}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {betterPhone && (
                        <Badge 
                          variant="outline" 
                          className={betterPhone === phone1 ? "border-[#1428A0] text-[#1428A0]" : "border-[#1428A0] text-[#1428A0]"}
                        >
                          {betterPhone.model.replace("Galaxy ", "")}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {/* Additional feature comparison */}
              <tr>
                <td colSpan={4} className="py-4 px-4 border-b">
                  <h3 className="font-semibold text-lg mb-2">Additional Features Comparison</h3>
                </td>
              </tr>
              {generateAdditionalFeatures(phone1, phone2).map((feature, index) => (
                <tr key={`feature-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-4 font-medium border-b">{feature.name}</td>
                  <td className="py-3 px-4 border-b">
                    {feature.phone1 ? <Check className="text-green-500" size={18} /> : <X className="text-red-500" size={18} />}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {feature.phone2 ? <Check className="text-green-500" size={18} /> : <X className="text-red-500" size={18} />}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {feature.phone1 && !feature.phone2 && (
                      <Badge variant="outline" className="border-[#1428A0] text-[#1428A0]">
                        {phone1.model.replace("Galaxy ", "")}
                      </Badge>
                    )}
                    {!feature.phone1 && feature.phone2 && (
                      <Badge variant="outline" className="border-[#1428A0] text-[#1428A0]">
                        {phone2.model.replace("Galaxy ", "")}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeatureComparison {
  name: string;
  phone1: boolean;
  phone2: boolean;
}

function generateAdditionalFeatures(phone1: Phone, phone2: Phone): FeatureComparison[] {
  const features: FeatureComparison[] = [];
  
  // Common feature checks
  const featuresToCheck = [
    { name: "Water Resistance", check: (phone: Phone) => phone.features.includes("IP") },
    { name: "Wireless Charging", check: (phone: Phone) => phone.features.toLowerCase().includes("wireless charging") },
    { name: "S Pen Support", check: (phone: Phone) => phone.features.toLowerCase().includes("s pen") },
    { name: "Foldable Display", check: (phone: Phone) => phone.model.toLowerCase().includes("fold") || phone.model.toLowerCase().includes("flip") },
    { name: "5G Connectivity", check: (phone: Phone) => true }, // All modern Samsung phones have 5G
    { name: "High Refresh Rate", check: (phone: Phone) => phone.features.toLowerCase().includes("120hz") || phone.features.toLowerCase().includes("refresh rate") },
    { name: "AI Features", check: (phone: Phone) => phone.features.toLowerCase().includes("ai") },
    { name: "Ultra HDR", check: (phone: Phone) => phone.features.toLowerCase().includes("hdr") },
  ];

  featuresToCheck.forEach(feature => {
    features.push({
      name: feature.name,
      phone1: feature.check(phone1),
      phone2: feature.check(phone2)
    });
  });

  return features;
}
