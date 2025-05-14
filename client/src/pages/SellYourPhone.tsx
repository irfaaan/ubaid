import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";

type PhoneCondition = "excellent" | "good" | "fair" | "poor";

export default function SellYourPhone() {
  const [phoneModel, setPhoneModel] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState<PhoneCondition>("good");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [showEstimate, setShowEstimate] = useState(false);
  const { toast } = useToast();

  const getConditionMultiplier = (condition: PhoneCondition): number => {
    switch (condition) {
      case "excellent": return 1.0;
      case "good": return 0.85;
      case "fair": return 0.7;
      case "poor": return 0.5;
      default: return 0.85;
    }
  };

  const getBaseTradeInValue = (model: string): number => {
    // Trade-in value mapping (simplified for demo)
    const values: Record<string, number> = {
      "Samsung Galaxy S24 Ultra": 750,
      "Samsung Galaxy S24+": 650,
      "Samsung Galaxy S24": 550,
      "Samsung Galaxy S23 Ultra": 550,
      "Samsung Galaxy S23+": 450,
      "Samsung Galaxy S23": 350,
      "Samsung Galaxy S22 Ultra": 400,
      "Samsung Galaxy S22+": 300,
      "Samsung Galaxy S22": 250,
      "Samsung Galaxy S21 Ultra": 300,
      "Samsung Galaxy S21+": 250,
      "Samsung Galaxy S21": 200,
      "Samsung Galaxy Z Fold5": 700,
      "Samsung Galaxy Z Fold4": 500,
      "Samsung Galaxy Z Flip5": 450,
      "Samsung Galaxy Z Flip4": 350,
      "Samsung Galaxy A54": 150,
      "Samsung Galaxy A53": 100,
      "Samsung Galaxy Note 20 Ultra": 300,
      "Samsung Galaxy Note 20": 250,
      "Other Samsung": 150,
      "Other Brand": 100,
    };
    return values[model] || 150;
  };

  const calculateStorageBonus = (storage: string, baseValue: number): number => {
    switch (storage) {
      case "1TB": return baseValue * 0.2;
      case "512GB": return baseValue * 0.15;
      case "256GB": return baseValue * 0.1;
      default: return 0;
    }
  };

  const calculateTradeInValue = (): number => {
    if (!phoneModel || !storage) return 0;
    
    const baseValue = getBaseTradeInValue(phoneModel);
    const conditionMultiplier = getConditionMultiplier(condition);
    const storageBonus = calculateStorageBonus(storage, baseValue);
    
    return Math.round((baseValue * conditionMultiplier) + storageBonus);
  };

  const handleGetEstimate = () => {
    if (!phoneModel || !storage) {
      toast({
        title: "Missing information",
        description: "Please select your phone model and storage capacity.",
        variant: "destructive",
      });
      return;
    }
    
    const value = calculateTradeInValue();
    setEstimatedValue(value);
    setShowEstimate(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneModel || !storage || !email) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Request submitted!",
        description: "We'll contact you soon with next steps for selling your phone.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Sell Your Galaxy Phone</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Get the best value for your used Samsung Galaxy phone and put it toward your next upgrade
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Get a Trade-in Estimate</CardTitle>
              <CardDescription>Tell us about your device to receive a trade-in value estimate</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="trade-in" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="trade-in">Trade-in</TabsTrigger>
                  <TabsTrigger value="sell">Sell Outright</TabsTrigger>
                </TabsList>
                <TabsContent value="trade-in" className="pt-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone-model">Phone Model</Label>
                        <Select value={phoneModel} onValueChange={setPhoneModel}>
                          <SelectTrigger id="phone-model">
                            <SelectValue placeholder="Select your phone model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Samsung Galaxy S24 Ultra">Galaxy S24 Ultra</SelectItem>
                            <SelectItem value="Samsung Galaxy S24+">Galaxy S24+</SelectItem>
                            <SelectItem value="Samsung Galaxy S24">Galaxy S24</SelectItem>
                            <SelectItem value="Samsung Galaxy S23 Ultra">Galaxy S23 Ultra</SelectItem>
                            <SelectItem value="Samsung Galaxy S23+">Galaxy S23+</SelectItem>
                            <SelectItem value="Samsung Galaxy S23">Galaxy S23</SelectItem>
                            <SelectItem value="Samsung Galaxy S22 Ultra">Galaxy S22 Ultra</SelectItem>
                            <SelectItem value="Samsung Galaxy S22+">Galaxy S22+</SelectItem>
                            <SelectItem value="Samsung Galaxy S22">Galaxy S22</SelectItem>
                            <SelectItem value="Samsung Galaxy S21 Ultra">Galaxy S21 Ultra</SelectItem>
                            <SelectItem value="Samsung Galaxy S21+">Galaxy S21+</SelectItem>
                            <SelectItem value="Samsung Galaxy S21">Galaxy S21</SelectItem>
                            <SelectItem value="Samsung Galaxy Z Fold5">Galaxy Z Fold5</SelectItem>
                            <SelectItem value="Samsung Galaxy Z Fold4">Galaxy Z Fold4</SelectItem>
                            <SelectItem value="Samsung Galaxy Z Flip5">Galaxy Z Flip5</SelectItem>
                            <SelectItem value="Samsung Galaxy Z Flip4">Galaxy Z Flip4</SelectItem>
                            <SelectItem value="Samsung Galaxy A54">Galaxy A54</SelectItem>
                            <SelectItem value="Samsung Galaxy A53">Galaxy A53</SelectItem>
                            <SelectItem value="Samsung Galaxy Note 20 Ultra">Galaxy Note 20 Ultra</SelectItem>
                            <SelectItem value="Samsung Galaxy Note 20">Galaxy Note 20</SelectItem>
                            <SelectItem value="Other Samsung">Other Samsung</SelectItem>
                            <SelectItem value="Other Brand">Other Brand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="storage">Storage Capacity</Label>
                        <Select value={storage} onValueChange={setStorage}>
                          <SelectTrigger id="storage">
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

                      <div>
                        <Label>Device Condition</Label>
                        <RadioGroup value={condition} onValueChange={(value) => setCondition(value as PhoneCondition)} className="grid grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center space-x-2 border rounded-md p-3 hover:border-[#1428A0] cursor-pointer">
                            <RadioGroupItem value="excellent" id="excellent" />
                            <Label htmlFor="excellent" className="cursor-pointer">Excellent</Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3 hover:border-[#1428A0] cursor-pointer">
                            <RadioGroupItem value="good" id="good" />
                            <Label htmlFor="good" className="cursor-pointer">Good</Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3 hover:border-[#1428A0] cursor-pointer">
                            <RadioGroupItem value="fair" id="fair" />
                            <Label htmlFor="fair" className="cursor-pointer">Fair</Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3 hover:border-[#1428A0] cursor-pointer">
                            <RadioGroupItem value="poor" id="poor" />
                            <Label htmlFor="poor" className="cursor-pointer">Poor</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Button 
                          type="button" 
                          onClick={handleGetEstimate}
                          className="w-full bg-[#1428A0] hover:bg-[#1428A0]/90"
                        >
                          Get Estimate
                        </Button>
                      </div>

                      {showEstimate && (
                        <div className="bg-[#1428A0]/5 p-6 rounded-lg border border-[#1428A0]/20 mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">Estimated Trade-in Value</h3>
                            <span className="text-2xl font-bold text-[#1428A0]">${estimatedValue}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            This is an estimate. Final value will be determined after device inspection.
                          </p>
                          
                          <div className="space-y-3 pt-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="your@email.com" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button 
                              type="submit"
                              disabled={isSubmitting} 
                              className="w-full mt-2"
                            >
                              {isSubmitting ? "Processing..." : "Continue with Trade-in"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="sell" className="pt-4">
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone-model-sell">Phone Model</Label>
                        <Select>
                          <SelectTrigger id="phone-model-sell">
                            <SelectValue placeholder="Select your phone model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="samsung-s24-ultra">Galaxy S24 Ultra</SelectItem>
                            <SelectItem value="samsung-s24-plus">Galaxy S24+</SelectItem>
                            <SelectItem value="samsung-s24">Galaxy S24</SelectItem>
                            {/* Additional models would go here */}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="storage-sell">Storage Capacity</Label>
                        <Select>
                          <SelectTrigger id="storage-sell">
                            <SelectValue placeholder="Select storage capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="128">128GB</SelectItem>
                            <SelectItem value="256">256GB</SelectItem>
                            <SelectItem value="512">512GB</SelectItem>
                            <SelectItem value="1000">1TB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>

                      <div>
                        <Label htmlFor="email-sell">Email Address</Label>
                        <Input id="email-sell" type="email" placeholder="your@email.com" />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="(123) 456-7890" />
                      </div>

                      <Button className="w-full bg-[#1428A0] hover:bg-[#1428A0]/90">
                        Request Sell Quote
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-[#1428A0]" />
                Why Trade-in with Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Best Value Guarantee</p>
                  <p className="text-sm text-gray-600">We offer competitive trade-in values for your device</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Easy Process</p>
                  <p className="text-sm text-gray-600">Simple online evaluation and fast payment</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Eco-Friendly</p>
                  <p className="text-sm text-gray-600">Your device will be responsibly recycled or refurbished</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-[#1428A0] mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Data Security</p>
                  <p className="text-sm text-gray-600">We ensure complete data wiping from your device</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Condition Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Excellent</p>
                <p className="text-sm text-gray-600">Like new, no scratches or signs of use</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Good</p>
                <p className="text-sm text-gray-600">Minor scratches or wear, fully functional</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Fair</p>
                <p className="text-sm text-gray-600">Noticeable scratches or dents, works properly</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Poor</p>
                <p className="text-sm text-gray-600">Heavy wear, cracks, or functional issues</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <ArrowRight className="h-10 w-10 text-[#1428A0]" />
                <div>
                  <h3 className="font-semibold">Ready to Upgrade?</h3>
                  <p className="text-sm text-gray-600">Apply your trade-in value to a new device</p>
                  <Button variant="link" className="p-0 h-auto text-[#1428A0]">
                    See Latest Galaxy Phones
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
