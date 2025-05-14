import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, Smartphone, Shield, Zap, Cpu, Camera, Layers, BarChart3, Battery } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone } from "@shared/schema";
import { useState } from "react";

interface DeviceDetailsProps {
  deviceId: string;
}

export default function DeviceDetails({ deviceId }: DeviceDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: phone, isLoading, error } = useQuery<Phone>({
    queryKey: [`/api/phones/${deviceId}`]
  });

  if (isLoading) {
    return <DeviceDetailsSkeleton />;
  }

  if (error || !phone) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Device Not Found</h3>
            <p className="text-gray-600">
              We couldn't find the device you're looking for. Please try another device.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Set the selected image to the phone image if not already set
  if (!selectedImage && phone.imageUrl) {
    setSelectedImage(phone.imageUrl);
  }

  const features = phone.features.split(",").map(f => f.trim());
  const storageOptions = phone.storageOptions.split(",").map(s => s.trim());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col items-center">
              <img
                src={selectedImage || phone.imageUrl}
                alt={phone.model}
                className="h-[300px] object-contain"
              />
              {/* Could add more images and color options here */}
            </div>

            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                {phone.series} Series
              </Badge>
              <h1 className="text-2xl font-bold mb-1">{phone.model}</h1>
              <p className="text-sm text-gray-500 mb-3">Released in {phone.year}</p>

              <div className="flex justify-center items-center mb-4">
                <div className="flex text-[#FF9500]">
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current" size={20} />
                  <StarHalf className="fill-current" size={20} />
                </div>
                <span className="ml-2 text-sm text-gray-600">4.7 (Based on reviews)</span>
              </div>

              <p className="text-3xl font-bold text-[#1428A0] mb-1">${phone.price}</p>
              <p className="text-sm text-gray-600 mb-4">
                Available from ${Math.round(phone.price / 24)}/mo for 24 mo.
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {storageOptions.map((option, index) => (
                  <Badge 
                    key={index} 
                    variant={index === 0 ? "default" : "outline"}
                    className={index === 0 ? "bg-[#1428A0]" : ""}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <p className="text-gray-700 mb-6">
              The {phone.model} is a{phone.series === "S" ? " flagship" : phone.series === "A" ? " mid-range" : phone.series === "Z" ? " foldable" : ""} 
              smartphone released by Samsung in {phone.year}. It features 
              a {phone.displaySize} {phone.displayType} display, powered by 
              the {phone.processor} processor and {phone.ram} of RAM.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-[#1428A0]/10 p-2 rounded-full mr-3">
                  <Smartphone className="h-5 w-5 text-[#1428A0]" />
                </div>
                <div>
                  <h3 className="font-semibold">Display</h3>
                  <p className="text-gray-600 text-sm">{phone.displaySize}, {phone.displayType}</p>
                  <p className="text-gray-600 text-sm">{phone.resolution}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#1428A0]/10 p-2 rounded-full mr-3">
                  <Cpu className="h-5 w-5 text-[#1428A0]" />
                </div>
                <div>
                  <h3 className="font-semibold">Processor</h3>
                  <p className="text-gray-600 text-sm">{phone.processor}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#1428A0]/10 p-2 rounded-full mr-3">
                  <Camera className="h-5 w-5 text-[#1428A0]" />
                </div>
                <div>
                  <h3 className="font-semibold">Camera</h3>
                  <p className="text-gray-600 text-sm">{phone.mainCamera}</p>
                  <p className="text-gray-600 text-sm">Front: {phone.frontCamera}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#1428A0]/10 p-2 rounded-full mr-3">
                  <Battery className="h-5 w-5 text-[#1428A0]" />
                </div>
                <div>
                  <h3 className="font-semibold">Battery</h3>
                  <p className="text-gray-600 text-sm">{phone.battery}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Shield className="h-5 w-5 text-[#1428A0] mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Detailed Specifications</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="display">
                <AccordionTrigger>Display</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size</span>
                      <span>{phone.displaySize}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span>{phone.displayType}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolution</span>
                      <span>{phone.resolution}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refresh Rate</span>
                      <span>{phone.features.includes("120Hz") ? "120Hz" : phone.features.includes("90Hz") ? "90Hz" : "60Hz"}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="performance">
                <AccordionTrigger>Performance</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processor</span>
                      <span>{phone.processor}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">RAM</span>
                      <span>{phone.ram}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage Options</span>
                      <span>{phone.storageOptions}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="camera">
                <AccordionTrigger>Camera</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Main Camera</span>
                      <span>{phone.mainCamera}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Front Camera</span>
                      <span>{phone.frontCamera}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Video Recording</span>
                      <span>4K @ 60fps</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="battery">
                <AccordionTrigger>Battery & Charging</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity</span>
                      <span>{phone.battery}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fast Charging</span>
                      <span>{phone.features.includes("Fast Charging") || phone.features.includes("45W") 
                              ? "Yes" : "Standard"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wireless Charging</span>
                      <span>{phone.features.includes("Wireless Charging") ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="design">
                <AccordionTrigger>Design & Durability</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water Resistance</span>
                      <span>{phone.features.includes("IP68") ? "IP68" : 
                             phone.features.includes("IP67") ? "IP67" : "Not rated"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Build</span>
                      <span>{phone.features.includes("Titanium") ? "Titanium Frame, Glass Back" : 
                             "Aluminum Frame, Glass Back"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biometrics</span>
                      <span>Ultrasonic Fingerprint, Face Recognition</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Why Choose the {phone.model}?</h2>
            
            <div className="space-y-4">
              {phone.series === "S" && (
                <div className="flex items-start">
                  <BarChart3 className="h-5 w-5 text-[#1428A0] mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Flagship Performance</h3>
                    <p className="text-gray-600">
                      With the powerful {phone.processor} processor and {phone.ram} of RAM, 
                      the {phone.model} delivers best-in-class performance for gaming, multitasking, 
                      and demanding applications.
                    </p>
                  </div>
                </div>
              )}

              {phone.mainCamera.includes("50MP") || phone.mainCamera.includes("108MP") || phone.mainCamera.includes("200MP") && (
                <div className="flex items-start">
                  <Camera className="h-5 w-5 text-[#1428A0] mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Exceptional Camera System</h3>
                    <p className="text-gray-600">
                      Capture stunning photos in any lighting condition with the 
                      advanced {phone.mainCamera.split(',')[0]} main camera and 
                      versatile lens setup.
                    </p>
                  </div>
                </div>
              )}

              {phone.displayType.includes("AMOLED") && (
                <div className="flex items-start">
                  <Smartphone className="h-5 w-5 text-[#1428A0] mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Brilliant Display</h3>
                    <p className="text-gray-600">
                      Experience vivid colors and deep blacks on the {phone.displaySize} 
                      {phone.displayType} display, perfect for media consumption and gaming.
                    </p>
                  </div>
                </div>
              )}

              {phone.features.includes("AI") && (
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-[#1428A0] mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Intelligent AI Features</h3>
                    <p className="text-gray-600">
                      Benefit from Samsung's Galaxy AI capabilities, from smarter photo 
                      editing to intelligent text suggestions and real-time translation.
                    </p>
                  </div>
                </div>
              )}

              {phone.series === "Z" && (
                <div className="flex items-start">
                  <Layers className="h-5 w-5 text-[#1428A0] mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Innovative Foldable Design</h3>
                    <p className="text-gray-600">
                      Experience the future of smartphones with the innovative foldable design, 
                      giving you a phone and tablet in one sleek device.
                    </p>
                  </div>
                </div>
              )}

              {parseInt(phone.battery.match(/\d+/)![0]) > 4500 && (
                <div className="flex items-start">
                  <Battery className="h-5 w-5 text-[#1428A0] mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">All-Day Battery Life</h3>
                    <p className="text-gray-600">
                      Stay powered throughout your day with the large {phone.battery} 
                      battery that supports your busy lifestyle.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DeviceDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Skeleton className="h-[300px] w-[200px] mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-4 w-40 mb-4" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32 mb-6" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-10 w-full mb-2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
