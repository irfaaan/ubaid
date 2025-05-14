import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bot, CheckCircle, Star, StarHalf, Smartphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Phone, PhoneRecommendation, RecommendationResponse } from "@shared/schema";

type UsageType = "light" | "moderate" | "heavy" | "professional";
type Priority = "camera" | "gaming" | "battery" | "display" | "design";

export default function AdvisorTool() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [currentStorage, setCurrentStorage] = useState<string>("");
  const [usageType, setUsageType] = useState<UsageType>("moderate");
  const [budget, setBudget] = useState<number>(800);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [includeTradeIn, setIncludeTradeIn] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const { data: phonesData, isLoading: isLoadingPhones } = useQuery({
    queryKey: ["/api/phones"],
    enabled: true,
  });

  const recommendMutation = useMutation({
    mutationFn: async (data: {
      currentPhone: string;
      currentStorage: string;
      usageType: string;
      budget: number;
      priorities: string[];
      includeTradeIn: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/recommend", data);
      return response.json();
    },
  });

  const handlePriorityChange = (priority: Priority) => {
    if (priorities.includes(priority)) {
      setPriorities(priorities.filter((p) => p !== priority));
    } else {
      setPriorities([...priorities, priority]);
    }
  };

  const handleSubmit = () => {
    recommendMutation.mutate(
      {
        currentPhone,
        currentStorage,
        usageType,
        budget,
        priorities,
        includeTradeIn,
      },
      {
        onSuccess: () => {
          setShowResults(true);
          setTimeout(() => {
            if (resultsRef.current) {
              resultsRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        },
      }
    );
  };

  const recommendationData: RecommendationResponse | undefined = recommendMutation.data;

  return (
    <section id="advisor-tool" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-[#1428A0]/10 text-[#1428A0] text-sm font-medium rounded-full mb-3">
            AI-Powered
          </span>
          <h2 className="text-3xl font-bold mb-3">Samsung Upgrade Advisor</h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            Tell us what you're looking for and we'll recommend the perfect Galaxy upgrade
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#1428A0] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
                Your Current Phone
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPhone">Current Phone Model</Label>
                  <Select value={currentPhone} onValueChange={setCurrentPhone}>
                    <SelectTrigger id="currentPhone">
                      <SelectValue placeholder="Select your current phone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Samsung Galaxy S24">Samsung Galaxy S24</SelectItem>
                      <SelectItem value="Samsung Galaxy S23">Samsung Galaxy S23</SelectItem>
                      <SelectItem value="Samsung Galaxy S22">Samsung Galaxy S22</SelectItem>
                      <SelectItem value="Samsung Galaxy S21">Samsung Galaxy S21</SelectItem>
                      <SelectItem value="Samsung Galaxy A54">Samsung Galaxy A54</SelectItem>
                      <SelectItem value="Samsung Galaxy A53">Samsung Galaxy A53</SelectItem>
                      <SelectItem value="Samsung Galaxy Note 20">Samsung Galaxy Note 20</SelectItem>
                      <SelectItem value="Other Samsung">Other Samsung</SelectItem>
                      <SelectItem value="Other Brand">Other Brand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentStorage">Current Storage</Label>
                  <Select value={currentStorage} onValueChange={setCurrentStorage}>
                    <SelectTrigger id="currentStorage">
                      <SelectValue placeholder="Select storage capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128GB">128GB</SelectItem>
                      <SelectItem value="256GB">256GB</SelectItem>
                      <SelectItem value="512GB">512GB</SelectItem>
                      <SelectItem value="1TB">1TB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#1428A0] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
                Usage Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-3">What matters most to you?</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="camera" 
                        checked={priorities.includes("camera")}
                        onCheckedChange={() => handlePriorityChange("camera")}
                      />
                      <Label htmlFor="camera">Camera Quality</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gaming" 
                        checked={priorities.includes("gaming")}
                        onCheckedChange={() => handlePriorityChange("gaming")}
                      />
                      <Label htmlFor="gaming">Gaming Performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="battery" 
                        checked={priorities.includes("battery")}
                        onCheckedChange={() => handlePriorityChange("battery")}
                      />
                      <Label htmlFor="battery">Battery Life</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="display" 
                        checked={priorities.includes("display")}
                        onCheckedChange={() => handlePriorityChange("display")}
                      />
                      <Label htmlFor="display">Screen Size & Quality</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="design" 
                        checked={priorities.includes("design")}
                        onCheckedChange={() => handlePriorityChange("design")}
                      />
                      <Label htmlFor="design">Foldable / Unique Design</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">How do you use your phone?</p>
                  <RadioGroup value={usageType} onValueChange={(value) => setUsageType(value as UsageType)} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="usage-light" />
                      <Label htmlFor="usage-light">Light (calls, texts, social media)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="usage-moderate" />
                      <Label htmlFor="usage-moderate">Moderate (photos, videos, light games)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="heavy" id="usage-heavy" />
                      <Label htmlFor="usage-heavy">Heavy (gaming, content creation, multitasking)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professional" id="usage-professional" />
                      <Label htmlFor="usage-professional">Professional (business, productivity)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#1428A0] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">3</span>
                Budget
              </h3>

              <div className="mb-4 space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="budget">Your Budget</Label>
                  <span className="text-sm font-medium text-[#1428A0]">${budget}</span>
                </div>
                <Slider
                  id="budget"
                  min={200}
                  max={2000}
                  step={50}
                  value={[budget]}
                  onValueChange={(value) => setBudget(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$200</span>
                  <span>$2000</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tradeIn" 
                  checked={includeTradeIn}
                  onCheckedChange={(checked) => setIncludeTradeIn(checked === true)}
                />
                <Label htmlFor="tradeIn">Include trade-in value in your recommendation</Label>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="button"
                className="w-full py-6 bg-[#1428A0] hover:bg-[#1428A0]/90"
                onClick={handleSubmit}
                disabled={recommendMutation.isPending || !currentPhone || !currentStorage || priorities.length === 0}
              >
                {recommendMutation.isPending ? (
                  <>
                    <Bot className="mr-2 h-5 w-5 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-5 w-5" />
                    Generate Recommendations
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div ref={resultsRef} className={`mt-12 ${showResults && recommendationData ? 'block' : 'hidden'}`}>
          {recommendMutation.isPending ? (
            <ResultsSkeletons />
          ) : (
            recommendationData && (
              <RecommendationResults
                data={recommendationData}
                currentPhone={currentPhone}
                currentStorage={currentStorage}
                budget={budget}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function ResultsSkeletons() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

interface RecommendationResultsProps {
  data: RecommendationResponse;
  currentPhone: string;
  currentStorage: string;
  budget: number;
}

function RecommendationResults({ data, currentPhone, currentStorage, budget }: RecommendationResultsProps) {
  const { bestMatch, alternatives } = data;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Your Personalized Recommendations</h3>
        <p className="text-gray-700">Based on your usage habits and budget of <span className="font-medium">${budget}</span></p>
      </div>

      {/* Top Recommendation */}
      <Card className="mb-8 border-2 border-[#1428A0]">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center mb-4">
            <span className="bg-[#1428A0] text-white px-3 py-1 rounded-md text-sm font-medium">Best Match</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex justify-center">
              <img
                src={bestMatch.phone.imageUrl || 'https://via.placeholder.com/300x600?text=Galaxy+Phone'}
                alt={bestMatch.phone.model}
                className="h-48 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x600?text=Galaxy+Phone';
                }}
              />
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xl font-bold mb-2">{bestMatch.phone.model}</h4>
              <div className="flex items-center mb-4">
                <div className="flex text-[#FF9500]">
                  <Star className="fill-current" size={18} />
                  <Star className="fill-current" size={18} />
                  <Star className="fill-current" size={18} />
                  <Star className="fill-current" size={18} />
                  <StarHalf className="fill-current" size={18} />
                </div>
                <span className="ml-2 text-sm text-gray-700">
                  {(bestMatch.match / 20).toFixed(1)} ({Math.round(bestMatch.match)}% match)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Key Strengths:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    {bestMatch.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-[#1428A0] mr-1 h-4 w-4 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Price:</p>
                  <p className="text-2xl font-bold text-[#1428A0]">${bestMatch.phone.price}</p>
                  <p className="text-xs text-gray-700">
                    Available from ${Math.round(bestMatch.phone.price / 24)}/mo
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Link href={`/device/${bestMatch.phone.id}`}>
                  <Button className="w-full sm:w-auto bg-[#1428A0] hover:bg-[#1428A0]/90">
                    View Details
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="outline" className="w-full sm:w-auto border-[#1428A0] text-[#1428A0] hover:bg-[#1428A0]/5">
                    Compare With Others
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <p className="text-sm font-medium mb-2">Why We Recommend This:</p>
            <p className="text-sm text-gray-700">
              Based on your preferences, the {bestMatch.phone.model} offers the best balance of features and value within your budget.
              {bestMatch.phone.features.includes("camera") && " Its advanced camera system is perfect for photography enthusiasts."}
              {bestMatch.phone.processor.includes("Gen") && " The powerful processor ensures smooth performance for all your tasks."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Recommendations */}
      <h4 className="text-xl font-bold mb-4">Alternative Options</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {alternatives.map((alt, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`${index === 0 ? "bg-gray-100 text-gray-800" : "bg-[#FF9500]/10 text-[#FF9500]"} px-3 py-1 rounded-md text-sm inline-block`}>
                    {index === 0 ? "Budget Option" : "Premium Option"}
                  </span>
                  <h5 className="text-lg font-bold mt-2">{alt.phone.model}</h5>
                </div>
                <p className="text-xl font-bold text-[#1428A0]">${alt.phone.price}</p>
              </div>

              <div className="flex space-x-4 mb-4">
                <img
                  src={alt.phone.imageUrl || 'https://via.placeholder.com/150x300?text=Galaxy+Phone'}
                  alt={alt.phone.model}
                  className="h-28 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150x300?text=Galaxy+Phone';
                  }}
                />

                <div>
                  <p className="text-sm font-medium">Highlights:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    {alt.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="text-[#1428A0] mr-1 h-4 w-4 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/device/${alt.phone.id}`}>
                  <Button variant="secondary" size="sm">
                    Details
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="outline" size="sm">
                    Compare
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-10">
        <h4 className="text-xl font-bold mb-4">Feature Comparison</h4>

        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">Feature</th>
                {alternatives.length > 0 && (
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                    {alternatives[0].phone.model}
                  </th>
                )}
                <th className="py-3 px-4 text-left text-sm font-medium text-[#1428A0] border-b">
                  {bestMatch.phone.model}
                </th>
                {alternatives.length > 1 && (
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                    {alternatives[1].phone.model}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 text-sm border-b font-medium">Price</td>
                {alternatives.length > 0 && (
                  <td className="py-3 px-4 text-sm border-b">${alternatives[0].phone.price}</td>
                )}
                <td className="py-3 px-4 text-sm border-b font-medium text-[#1428A0] bg-[#1428A0]/5">
                  ${bestMatch.phone.price}
                </td>
                {alternatives.length > 1 && (
                  <td className="py-3 px-4 text-sm border-b">${alternatives[1].phone.price}</td>
                )}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm border-b font-medium">Display</td>
                {alternatives.length > 0 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[0].phone.displaySize}, {alternatives[0].phone.displayType}</td>
                )}
                <td className="py-3 px-4 text-sm border-b font-medium text-[#1428A0] bg-[#1428A0]/5">
                  {bestMatch.phone.displaySize}, {bestMatch.phone.displayType}
                </td>
                {alternatives.length > 1 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[1].phone.displaySize}, {alternatives[1].phone.displayType}</td>
                )}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm border-b font-medium">Processor</td>
                {alternatives.length > 0 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[0].phone.processor}</td>
                )}
                <td className="py-3 px-4 text-sm border-b font-medium text-[#1428A0] bg-[#1428A0]/5">
                  {bestMatch.phone.processor}
                </td>
                {alternatives.length > 1 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[1].phone.processor}</td>
                )}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm border-b font-medium">Camera</td>
                {alternatives.length > 0 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[0].phone.mainCamera}</td>
                )}
                <td className="py-3 px-4 text-sm border-b font-medium text-[#1428A0] bg-[#1428A0]/5">
                  {bestMatch.phone.mainCamera}
                </td>
                {alternatives.length > 1 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[1].phone.mainCamera}</td>
                )}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm border-b font-medium">Battery</td>
                {alternatives.length > 0 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[0].phone.battery}</td>
                )}
                <td className="py-3 px-4 text-sm border-b font-medium text-[#1428A0] bg-[#1428A0]/5">
                  {bestMatch.phone.battery}
                </td>
                {alternatives.length > 1 && (
                  <td className="py-3 px-4 text-sm border-b">{alternatives[1].phone.battery}</td>
                )}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium">Storage</td>
                {alternatives.length > 0 && (
                  <td className="py-3 px-4 text-sm">{alternatives[0].phone.storageOptions}</td>
                )}
                <td className="py-3 px-4 text-sm font-medium text-[#1428A0] bg-[#1428A0]/5">
                  {bestMatch.phone.storageOptions}
                </td>
                {alternatives.length > 1 && (
                  <td className="py-3 px-4 text-sm">{alternatives[1].phone.storageOptions}</td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade-in Value */}
      {bestMatch.tradeInValue !== undefined && (
        <div className="mt-10">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-xl font-bold mb-4">Trade-in Estimate</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">Your Current Device</p>
                  <div className="flex items-center">
                    <Smartphone className="text-gray-700 mr-3" size={24} />
                    <span className="font-medium">{currentPhone}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{currentStorage}, Good Condition</p>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Estimated Trade-in Value:</p>
                    <p className="text-2xl font-bold text-[#1428A0]">${bestMatch.tradeInValue}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Your Potential Savings</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{bestMatch.phone.model} Price</span>
                      <span className="font-medium">${bestMatch.phone.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Trade-in Value</span>
                      <span className="font-medium text-green-600">-${bestMatch.tradeInValue}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Your Final Price</span>
                      <span className="font-bold">
                        ${bestMatch.phone.price - bestMatch.tradeInValue}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#1428A0] hover:bg-[#1428A0]/90">
                    Complete Your Upgrade
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
