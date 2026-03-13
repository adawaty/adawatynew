/*
Cairo Circuit Futurism — Admin Dashboard
- View, filter, search & update lead_requests from Supabase
- Token-gated (VITE_ADMIN_TOKEN or any password in dev)
- Stats overview + table + status management
*/

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchLeads,
  fetchLeadStats,
  updateLeadStatus,
  deleteLead,
  type LeadRequest,
  type LeadStats,
} from "@/lib/supabaseService";
import {
  Search,
  RefreshCw,
  Trash2,
  LogOut,
  Users,
  TrendingUp,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BarChart3,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import SeoHead from "@/components/SeoHead";

const ADMIN_TOKEN_KEY = "adawaty_admin_token";
const PAGE_SIZE = 20;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  contacted: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  converted: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  closed: "bg-white/8 text-muted-foreground border-white/12",
};

const SOURCE_STYLES: Record<string, string> = {
  contact: "bg-primary/10 text-primary border-primary/20",
  pricing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  newsletter: "bg-accent/10 text-accent border-accent/20",
  audit: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "ai-visibility": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [val, setVal] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) { setError(true); return; }
    onLogin(val.trim());
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-50" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-radial-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Card className="glass-strong rounded-2xl p-8 glow-border-teal">
          <div className="text-center mb-6">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/15 ring-1 ring-primary/30 grid place-items-center mb-4">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter your admin token to continue</p>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-2">
              <Input
                type="password"
                placeholder="Admin token…"
                value={val}
                onChange={(e) => { setVal(e.target.value); setError(false); }}
                className={`bg-white/4 border-white/12 ${error ? "border-destructive" : ""}`}
                autoFocus
              />
              {error && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Token required
                </p>
              )}
            </div>
            <Button type="submit" className="w-full shadow-[0_0_30px_oklch(0.76_0.18_190/0.25)]">
              <ShieldCheck className="mr-2 h-4 w-4" /> Access Dashboard
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number | string; icon: React.ElementType; color: string;
}) {
  return (
    <Card className="glass premium-card rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{label}</div>
        </div>
        <div className={`h-9 w-9 rounded-xl grid place-items-center ${color.replace("text-", "bg-").replace("400", "500/10")} border border-white/10`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
    </Card>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [leads, setLeads] = useState<LeadRequest[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true); else setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetchLeads({ limit: PAGE_SIZE, offset: page * PAGE_SIZE, status: statusFilter, source: sourceFilter, search }),
        fetchLeadStats(),
      ]);
      if (leadsRes.ok) { setLeads(leadsRes.data); setTotal(leadsRes.count); }
      if (statsRes.ok && statsRes.stats) setStats(statsRes.stats);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, statusFilter, sourceFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: LeadRequest["status"]) => {
    const res = await updateLeadStatus(id, status);
    if (res.ok) {
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
      toast.success(`Status updated to "${status}"`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    const res = await deleteLead(id);
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setTotal((v) => v - 1);
      toast.success("Lead deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-40" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-radial-glow" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/8 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/15 ring-1 ring-primary/30 grid place-items-center">
                <div className="logo-dot h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <span className="font-semibold text-sm">Adawaty</span>
                <span className="ml-2 chip chip-teal text-[10px]">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => load(true)}
                disabled={refreshing}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="ml-1.5 hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-1.5 hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold gradient-text-static">Lead Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All submissions from contact form, pricing calculator & newsletter
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard label="Total leads" value={stats.total} icon={Users} color="text-primary" />
            <StatCard label="New / unread" value={stats.new} icon={MessageSquare} color="text-amber-400" />
            <StatCard label="Contacted" value={stats.contacted} icon={Mail} color="text-blue-400" />
            <StatCard label="Converted" value={stats.converted} icon={TrendingUp} color="text-emerald-400" />
          </div>
        )}

        {/* Source breakdown */}
        {stats && Object.keys(stats.bySource).length > 0 && (
          <Card className="glass rounded-2xl p-5 mb-6">
            <div className="text-sm font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> By source
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.bySource).map(([src, count]) => (
                <div key={src} className={`chip ${SOURCE_STYLES[src] ?? ""}`}>
                  {src}: <strong>{count}</strong>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="glass rounded-2xl p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pl-9 bg-white/4 border-white/12 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
              <SelectTrigger className="bg-white/4 border-white/12 h-9 w-full sm:w-40">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); setPage(0); }}>
              <SelectTrigger className="bg-white/4 border-white/12 h-9 w-full sm:w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="contact">Contact form</SelectItem>
                <SelectItem value="pricing">Pricing calc</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="glass rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Loading leads…</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Sparkles className="h-8 w-8 text-muted-foreground/40" />
              <span>No leads found</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-left">
                    {["Date", "Name", "Contact", "Source", "Type", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <>
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === lead.id ? null : (lead.id ?? null))}
                      >
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {formatDate(lead.created_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                          {lead.name || <span className="text-muted-foreground/50">—</span>}
                          {lead.company && (
                            <div className="text-xs text-muted-foreground">{lead.company}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                              <Mail className="h-3 w-3" /> {lead.email}
                            </a>
                          )}
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-xs mt-0.5 hover:text-primary transition-colors">
                              <Phone className="h-3 w-3" /> {lead.phone}
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`chip text-[10px] ${SOURCE_STYLES[lead.source ?? ""] ?? ""}`}>
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">{lead.request_type || "—"}</span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={lead.status ?? "new"}
                            onValueChange={(v) => handleStatusChange(lead.id!, v as LeadRequest["status"])}
                          >
                            <SelectTrigger className={`h-7 text-xs border px-2 w-28 ${STATUS_STYLES[lead.status ?? "new"] ?? ""}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => lead.id && handleDelete(lead.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </motion.tr>

                      {/* Expanded row */}
                      <AnimatePresence>
                        {expandedId === lead.id && (
                          <motion.tr
                            key={`${lead.id}-expanded`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan={7} className="px-4 pb-4 pt-0 bg-white/2">
                              <div className="rounded-xl border border-white/8 bg-white/3 p-4 text-sm">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {lead.notes && (
                                    <div>
                                      <div className="text-xs font-medium text-muted-foreground mb-1">Notes / Message</div>
                                      <p className="text-sm text-foreground leading-relaxed">{lead.notes}</p>
                                    </div>
                                  )}
                                  {lead.pricing && (
                                    <div>
                                      <div className="text-xs font-medium text-muted-foreground mb-1">Pricing data</div>
                                      <pre className="text-xs text-muted-foreground overflow-auto max-h-32 bg-black/20 rounded-lg p-2">
                                        {JSON.stringify(lead.pricing, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-xs font-medium text-muted-foreground mb-1">Lead ID</div>
                                    <code className="text-xs font-mono text-muted-foreground">{lead.id}</code>
                                  </div>
                                  {lead.lang && (
                                    <div>
                                      <div className="text-xs font-medium text-muted-foreground mb-1">Language</div>
                                      <span className="chip text-[11px]">{lead.lang}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
              <span className="text-xs text-muted-foreground">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2">{page + 1} / {totalPages}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Click any row to expand details • Changes save instantly to Supabase
        </p>
      </main>
    </div>
  );
}

// ── Page entry ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(ADMIN_TOKEN_KEY) : null
  );

  const handleLogin = (t: string) => {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, t);
    setToken(t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  };

  return (
    <>
      <SeoHead
        title="Admin | Adawaty"
        description="Admin dashboard"
        path="/admin"
        type="website"
      />
      {token ? <Dashboard onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} />}
    </>
  );
}
