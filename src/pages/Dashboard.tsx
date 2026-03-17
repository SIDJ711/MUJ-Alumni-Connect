import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("alumni")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setCount(count ?? 0));
  }, []);

  const cards = [
    { label: "Total Alumni", value: count, icon: Users, onClick: () => navigate("/view-alumni") },
    { label: "Add New", value: "+", icon: UserPlus, onClick: () => navigate("/add-alumni") },
    { label: "Departments", value: "10+", icon: GraduationCap, onClick: undefined },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h2 className="text-xl font-display font-semibold text-foreground">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Signed in as {user?.email}
        </p>

        <div className="grid grid-cols-3 gap-6 mt-8">
          {cards.map((card) => (
            <button
              key={card.label}
              onClick={card.onClick}
              className="bg-card border border-border rounded-lg p-6 text-left hover:shadow-sm transition-shadow duration-150"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-display font-bold text-foreground mt-1">
                    {card.value}
                  </p>
                </div>
                <card.icon className="h-8 w-8 text-primary/40" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
