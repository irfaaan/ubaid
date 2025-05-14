import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PopularComparisons() {
  const { data: popularComparisons, isLoading } = useQuery({
    queryKey: ["/api/comparisons/popular"],
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-[#1428A0]/10 text-[#1428A0] text-sm font-medium rounded-full mb-3">
            Trending
          </span>
          <h2 className="text-3xl font-bold mb-3">Popular Phone Comparisons</h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            See how the latest Galaxy phones stack up against each other
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-6" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularComparisons?.map((comparison: any, index: number) => (
              <Link key={index} href={`/compare?id=${comparison.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-center items-center space-x-4 mb-6">
                      <div className="text-center">
                        <img
                          src={comparison.phone1?.imageUrl || "https://via.placeholder.com/100x200"}
                          alt={comparison.phone1?.model || "Phone 1"}
                          className="h-32 object-contain mx-auto"
                        />
                        <p className="mt-2 font-medium">{comparison.phone1?.model.replace("Galaxy ", "") || "Phone 1"}</p>
                      </div>

                      <span className="text-gray-800 font-bold">VS</span>

                      <div className="text-center">
                        <img
                          src={comparison.phone2?.imageUrl || "https://via.placeholder.com/100x200"}
                          alt={comparison.phone2?.model || "Phone 2"}
                          className="h-32 object-contain mx-auto"
                        />
                        <p className="mt-2 font-medium">{comparison.phone2?.model.replace("Galaxy ", "") || "Phone 2"}</p>
                      </div>
                    </div>

                    <p className="text-center text-sm text-gray-700">
                      {generateComparisonDescription(comparison)}
                    </p>

                    <div className="mt-4 text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {comparison.viewCount.toLocaleString()} views
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/compare" className="inline-flex items-center text-[#1428A0] font-medium hover:underline">
            View all comparisons
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Helper function to generate comparison descriptions
function generateComparisonDescription(comparison: any): string {
  const phone1 = comparison.phone1;
  const phone2 = comparison.phone2;

  if (!phone1 || !phone2) return "Compare these Samsung phones side by side";

  // Check if comparing within the same series
  const isSameSeries = 
    phone1.model.includes(phone2.model.charAt(0)) || 
    phone2.model.includes(phone1.model.charAt(0));

  // Check price difference
  const priceDiff = Math.abs(phone1.price - phone2.price);

  if (isSameSeries && priceDiff > 100) {
    return `Is the ${getKeyDifference(phone1, phone2)} worth the extra $${priceDiff}?`;
  }

  if (phone1.series === "S" && phone2.series === "A") {
    return "Flagship performance vs. midrange value - which is better for you?";
  }

  if (phone1.series === "Z" || phone2.series === "Z") {
    return "Foldable innovation vs. traditional design - which suits your needs?";
  }

  return "Compare specs, features, and value to find your perfect Galaxy phone";
}

// Helper function to identify key differences between phones
function getKeyDifference(phone1: any, phone2: any): string {
  const largerPhone = parseInt(phone1.displaySize) > parseInt(phone2.displaySize) ? phone1 : phone2;
  
  if (Math.abs(parseInt(phone1.displaySize) - parseInt(phone2.displaySize)) > 0.3) {
    return "larger screen";
  }
  
  if (phone1.battery !== phone2.battery) {
    return "bigger battery";
  }
  
  if (phone1.mainCamera.includes("200MP") || phone2.mainCamera.includes("200MP")) {
    return "advanced camera";
  }
  
  return "premium features";
}
