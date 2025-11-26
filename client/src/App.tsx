import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import AdminSettings from "@/pages/AdminSettings";
import AdminMasterLogin from "@/pages/AdminMasterLogin";
import AdminMasterPanel from "@/pages/AdminMasterPanel";
import PlayerLogin from "@/pages/PlayerLogin";
import PlayerDashboard from "@/pages/PlayerDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/login" component={AdminMasterLogin} />
      <Route path="/admin/master" component={AdminMasterPanel} />
      <Route path="/player/login" component={PlayerLogin} />
      <Route path="/player/dashboard" component={PlayerDashboard} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
