import { Helmet } from "react-helmet";
import PhoneComparisonTool from "@/components/compare/PhoneComparisonTool";

export default function Compare() {
  return (
    <>
      <Helmet>
        <title>Compare Samsung Galaxy Phones | GalaxyAdvisor</title>
        <meta name="description" content="Compare the latest Samsung Galaxy phones side by side. See detailed specs, features, and prices to find the best phone for your needs." />
      </Helmet>
      
      <PhoneComparisonTool />
    </>
  );
}
