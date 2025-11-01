import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Dashboard } from "@/pages/Dashboard";
import { Auth } from "@/pages/Auth";
import { Categories } from "@/pages/Categories";
import { Transactions } from "@/pages/Transactions";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/ui/spinner";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Layout>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/categories"
            element={
              user ? (
                <Layout>
                  <Categories />
                </Layout>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/transactions"
            element={
              user ? (
                <Layout>
                  <Transactions />
                </Layout>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/auth"
            element={!user ? <Auth /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
