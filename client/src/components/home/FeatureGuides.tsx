import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar } from "lucide-react";

export default function FeatureGuides() {
  const { data: guides, isLoading } = useQuery({
    queryKey: ["/api/guides"],
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-[#1428A0]/10 text-[#1428A0] text-sm font-medium rounded-full mb-3">
            Resources
          </span>
          <h2 className="text-3xl font-bold mb-3">Galaxy Feature Guides</h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            Learn about the latest Samsung features and how to make the most of them
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides?.map((guide: any, index: number) => (
              <Link key={index} href={`/feature-guides/${guide.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group cursor-pointer">
                  <img
                    src={guide.imageUrl}
                    alt={guide.title}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <CardContent className="p-6">
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
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/feature-guides" className="inline-flex items-center text-[#1428A0] font-medium hover:underline">
            Browse all guides
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

// Helper function to format dates
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}
