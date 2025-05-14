import { useRoute } from "wouter";
import { Helmet } from "react-helmet";
import DeviceDetails from "@/components/device/DeviceDetails";
import { useQuery } from "@tanstack/react-query";
import { Phone } from "@shared/schema";

export default function DevicePage() {
  const [match, params] = useRoute("/device/:model");
  const deviceId = params?.model;

  const { data: phone, isLoading } = useQuery<Phone>({
    queryKey: [`/api/phones/${deviceId}`],
    enabled: !!deviceId,
  });

  if (!match) {
    return <div>Page not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>
          {isLoading
            ? "Loading Device Details | GalaxyAdvisor"
            : phone
            ? `${phone.model} Specs & Details | GalaxyAdvisor`
            : "Device Not Found | GalaxyAdvisor"}
        </title>
        <meta
          name="description"
          content={
            phone
              ? `Full specifications, features, and review of the ${phone.model}. Compare prices and find the best deals.`
              : "Galaxy phone specifications and details."
          }
        />
      </Helmet>

      <DeviceDetails deviceId={deviceId || ""} />
    </div>
  );
}
