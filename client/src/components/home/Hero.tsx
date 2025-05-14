import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="gradient-bg text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Find Your Perfect Galaxy Upgrade
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg">
              Our AI recommends the best Samsung phone based on your usage habits, budget, and needs.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="#advisor-tool">
                <Button size="lg" className="w-full sm:w-auto bg-white text-[#1428A0] hover:bg-white/90">
                  Get Recommendations
                </Button>
              </Link>
              <Link href="/compare">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Compare Phones
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 ai-gradient rounded-full flex items-center justify-center z-10">
                <span className="font-bold">AI</span>
              </div>
              <div className="flex space-x-4">
                <div className="bg-white p-2 rounded-3xl shadow-lg transform -rotate-6">
                  <img 
                    src="https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMHBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=250&h=500&q=80" 
                    alt="Samsung Galaxy Phone" 
                    className="w-36 phone-display rounded-2xl object-cover"
                  />
                </div>
                <div className="bg-white p-2 rounded-3xl shadow-lg transform rotate-6 mt-12">
                  <img 
                    src="https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=500&q=80" 
                    alt="Samsung Galaxy Phone" 
                    className="w-36 phone-display rounded-2xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
