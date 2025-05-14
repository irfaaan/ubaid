import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone } from "@shared/schema";
import ComparisonTable from "./ComparisonTable";
import PhoneCard from "./PhoneCard";

export default function PhoneComparisonTool() {
  const [phone1Id, setPhone1Id] = useState<string>("");
  const [phone2Id, setPhone2Id] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonId, setComparisonId] = useState<number | null>(null);

  const { data: phones, isLoading: isLoadingPhones } = useQuery({
    queryKey: ["/api/phones"],
  });

  const { data: phone1Data, isLoading: isLoadingPhone1 } = useQuery({
    queryKey: [`/api/phones/${phone1Id}`],
    enabled: !!phone1Id,
  });

  const { data: phone2Data, isLoading: isLoadingPhone2 } = useQuery({
    queryKey: [`/api/phones/${phone2Id}`],
    enabled: !!phone2Id,
  });

  // Create comparison when both phones are selected
  useEffect(() => {
    if (phone1Id && phone2Id && !comparisonId) {
      createComparison();
    }
  }, [phone1Id, phone2Id]);

  const createComparison = async () => {
    try {
      const response = await apiRequest("POST", "/api/comparisons", {
        phoneId1: parseInt(phone1Id),
        phoneId2: parseInt(phone2Id),
      });
      
      const data = await response.json();
      setComparisonId(data.id);
      
      // Increment view count
      if (data.id) {
        await apiRequest("GET", `/api/comparisons/${data.id}/view`);
      }
    } catch (error) {
      console.error("Failed to create comparison:", error);
    }
  };

  const handleCompare = () => {
    if (phone1Id && phone2Id) {
      setIsComparing(true);
    }
  };

  const resetComparison = () => {
    setPhone1Id("");
    setPhone2Id("");
    setIsComparing(false);
    setComparisonId(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-[#1428A0]/10 text-[#1428A0] text-sm font-medium rounded-full mb-3">
          Compare
        </span>
        <h1 className="text-3xl font-bold mb-3">Samsung Galaxy Phone Comparison</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Select two Samsung phones to compare specifications and features side by side
        </p>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Select Phones to Compare</CardTitle>
          <CardDescription>Choose two Samsung Galaxy phones to see a detailed comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-2">First Phone</p>
              <Select value={phone1Id} onValueChange={setPhone1Id} disabled={isComparing}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select first phone" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingPhones ? (
                    <div className="p-2">Loading phones...</div>
                  ) : (
                    phones?.map((phone: Phone) => (
                      <SelectItem key={`phone1-${phone.id}`} value={phone.id.toString()}>
                        {phone.model}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Second Phone</p>
              <Select value={phone2Id} onValueChange={setPhone2Id} disabled={isComparing}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select second phone" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingPhones ? (
                    <div className="p-2">Loading phones...</div>
                  ) : (
                    phones?.map((phone: Phone) => (
                      <SelectItem key={`phone2-${phone.id}`} value={phone.id.toString()}>
                        {phone.model}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 space-x-4">
            <Button 
              onClick={handleCompare} 
              disabled={!phone1Id || !phone2Id || isComparing}
              className="bg-[#1428A0] hover:bg-[#1428A0]/90"
            >
              Compare Phones
            </Button>
            {isComparing && (
              <Button variant="outline" onClick={resetComparison}>
                Reset Comparison
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isComparing && (
        <>
          {(isLoadingPhone1 || isLoadingPhone2) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <Skeleton className="h-[400px] rounded-lg" />
              <Skeleton className="h-[400px] rounded-lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {phone1Data && <PhoneCard phone={phone1Data} />}
                {phone2Data && <PhoneCard phone={phone2Data} />}
              </div>
              
              {phone1Data && phone2Data && (
                <ComparisonTable phone1={phone1Data} phone2={phone2Data} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
