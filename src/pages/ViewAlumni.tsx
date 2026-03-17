import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Alumni {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  graduation_year: number;
  company: string;
}

export default function ViewAlumni() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAlumni = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("alumni")
      .select("id, name, email, phone, department, graduation_year, company")
      .order("created_at", { ascending: false });

    if (!error && data) setAlumni(data);
    setLoading(false);
  };

  useEffect(() => { fetchAlumni(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this alumni record?")) return;
    const { error } = await supabase.from("alumni").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Record deleted");
      setAlumni((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filtered = alumni.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      String(a.graduation_year).includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground">Alumni Records</h2>
            <p className="text-sm text-muted-foreground mt-1">{alumni.length} total records</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, dept, company..."
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Department</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Year</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Company</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">
                  {search ? "No matching records" : "No alumni records yet"}
                </td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors duration-150">
                    <td className="px-4 py-3 text-muted-foreground">{a.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{a.name}</td>
                    <td className="px-4 py-3">{a.email}</td>
                    <td className="px-4 py-3">{a.phone}</td>
                    <td className="px-4 py-3">{a.department}</td>
                    <td className="px-4 py-3">{a.graduation_year}</td>
                    <td className="px-4 py-3">{a.company}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(a.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
