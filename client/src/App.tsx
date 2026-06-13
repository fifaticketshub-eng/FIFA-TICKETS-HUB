import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import Packages from "./pages/Packages";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import AuthEntry from "./pages/AuthEntry";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyTicket from "./pages/VerifyTicket";
import WhatsAppButton from "./components/WhatsAppButton";
import Navigation from "./components/Navigation";
import { trpc } from "./lib/trpc";

function AdminRoute() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="section-padding">
          <div className="container text-muted-foreground">Checking access...</div>
        </section>
      </div>
    );
  }

  if (!isAdmin) return null;

  return <AdminDashboard />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/matches"} component={Matches} />
      <Route path={"/matches/:id"} component={MatchDetail} />
      <Route path={"/packages"} component={Packages} />
      <Route path={"/about"} component={About} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/verify-ticket"} component={VerifyTicket} />
      <Route path={"/admin"} component={AdminRoute} />
      <Route path={"/admin/matches"} component={AdminRoute} />
      <Route path={"/admin/packages"} component={AdminRoute} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          {isLoading ? (
            <div className="flex min-h-screen items-center justify-center bg-fifa-navy text-white">
              Checking account...
            </div>
          ) : !user ? (
            <AuthEntry />
          ) : (
            <>
              <Navigation />
              <Router />
              <WhatsAppButton 
                phoneNumber="1234567890"
                message="Hello! I'm interested in FIFA World Cup tickets. Could you please provide availability and pricing information?"
              />
            </>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
