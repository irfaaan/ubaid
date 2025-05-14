import { Smartphone, Bot, Award } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Smartphone className="text-[#1428A0]" size={24} />,
      title: "Tell Us About Your Usage",
      description: "Share your current phone, how you use it, and what features matter most to you.",
      bgColor: "bg-[#1428A0]/10",
    },
    {
      icon: <Bot className="text-[#FF9500]" size={24} />,
      title: "AI Analyzes Your Needs",
      description: "Our AI engine compares all Samsung phones to find the perfect match for your requirements.",
      bgColor: "bg-[#FF9500]/10",
    },
    {
      icon: <Award className="text-[#6D87E8]" size={24} />,
      title: "Get Personalized Recommendations",
      description: "See tailored Samsung upgrade options with detailed comparisons and trade-in values.",
      bgColor: "bg-[#6D87E8]/10",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            Our AI advisor helps you find the perfect Samsung Galaxy upgrade in just a few steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className={`rounded-full w-12 h-12 flex items-center justify-center ${feature.bgColor} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
