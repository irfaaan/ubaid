import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Compare from "@/pages/Compare";
import BestUpgrades from "@/pages/BestUpgrades";
import FeatureGuides from "@/pages/FeatureGuides";
import SellYourPhone from "@/pages/SellYourPhone";
import DevicePage from "@/pages/DevicePage";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/compare" component={Compare} />
        <Route path="/best-upgrades" component={BestUpgrades} />
        <Route path="/feature-guides" component={FeatureGuides} />
        <Route path="/sell-your-phone" component={SellYourPhone} />
        <Route path="/device/:model" component={DevicePage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
