"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type UserItem = { id: string; email: string; name: string | null; role: string; createdAt: string };
type AuditItem = { id: string; action: string; userId: string | null; resource: string | null; details: unknown; ip: string | null; createdAt: string };
type ContactItem = { id: string; name: string; email: string; message: string; status: string; source: string | null; createdAt: string };
type ProspectItem = { id: string; nom: string; email: string; societe: string | null; services: string[]; budget: string | null; status: string; createdAt: string; activities: { id: string; type: string; content: string }[] };
type PagedData<T> = { items: T[]; total: number; page: number; totalPages: number };

function TablesContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "users";
  const [users, setUsers] = useState<PagedData<UserItem> | null>(null);
  const [auditLogs, setAuditLogs] = useState<PagedData<AuditItem> | null>(null);
  const [contacts, setContacts] = useState<PagedData<ContactItem> | null>(null);
  const [prospects, setProspects] = useState<ProspectItem[] | null>(null);
  const [revenue, setRevenue] = useState<PagedData<{ id: string; amount: string; currency: string; periodType: string; periodValue: string; label: string | null; createdAt: string }> | null>(null);
  const [analytics, setAnalytics] = useState<PagedData<{ id: string; page: string; event: string; createdAt: string }> | null>(null);
  const [pageViews, setPageViews] = useState<PagedData<{ id: string; page: string; sessionId: string | null; duration: number | null; createdAt: string }> | null>(null);
  const [appSettings, setAppSettings] = useState<{ items: { id: string; key: string; value: string }[]; total: number } | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const [revenuePage, setRevenuePage] = useState(1);
  const [analyticsPage, setAnalyticsPage] = useState(1);
  const [pageViewsPage, setPageViewsPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createName, setCreateName] = useState("");
  const [createRole, setCreateRole] = useState<"user" | "admin" | "boss">("user");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    setError(null);
    fetch(`/api/users?page=${usersPage}&limit=10`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setUsers(json.data))
      .catch(() => setError("Impossible de charger les utilisateurs"));
  }, [usersPage]);

  const loadAuditLogs = useCallback(() => {
    setError(null);
    fetch(`/api/admin/audit-logs?page=${auditPage}&limit=10`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setAuditLogs(json.data))
      .catch(() => setError("Impossible de charger les journaux"));
  }, [auditPage]);

  const loadContacts = useCallback(() => {
    setError(null);
    fetch(`/api/admin/contacts?page=${contactsPage}&limit=10`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setContacts(json.data))
      .catch(() => setError("Impossible de charger les contacts"));
  }, [contactsPage]);

  const loadProspects = useCallback(() => {
    setError(null);
    fetch("/api/prospects")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((data) => setProspects(Array.isArray(data) ? data : []))
      .catch(() => setError("Impossible de charger les prospects (devis)"));
  }, []);

  const loadRevenue = useCallback(() => {
    setError(null);
    fetch(`/api/admin/revenue?page=${revenuePage}&limit=10`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setRevenue(json.data))
      .catch(() => setError("Impossible de charger les revenus"));
  }, [revenuePage]);

  const loadAnalytics = useCallback(() => {
    setError(null);
    fetch(`/api/admin/analytics?page=${analyticsPage}&limit=10`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setAnalytics(json.data))
      .catch(() => setError("Impossible de charger les analytics"));
  }, [analyticsPage]);

  const loadPageViews = useCallback(() => {
    setError(null);
    fetch(`/api/admin/page-views?page=${pageViewsPage}&limit=10`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setPageViews(json.data))
      .catch(() => setError("Impossible de charger les vues"));
  }, [pageViewsPage]);

  const loadAppSettings = useCallback(() => {
    setError(null);
    fetch("/api/admin/app-settings")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setAppSettings(json.data))
      .catch(() => setError("Impossible de charger les paramètres"));
  }, []);

  useEffect(() => {
    if (tab === "users") loadUsers();
  }, [tab, loadUsers]);

  useEffect(() => {
    if (tab === "audit") loadAuditLogs();
  }, [tab, loadAuditLogs]);

  useEffect(() => {
    if (tab === "contacts") loadContacts();
  }, [tab, loadContacts]);

  useEffect(() => {
    if (tab === "prospects") loadProspects();
  }, [tab, loadProspects]);

  useEffect(() => {
    if (tab === "revenue") loadRevenue();
  }, [tab, loadRevenue]);

  useEffect(() => {
    if (tab === "analytics") loadAnalytics();
  }, [tab, loadAnalytics]);

  useEffect(() => {
    if (tab === "pageviews") loadPageViews();
  }, [tab, loadPageViews]);

  useEffect(() => {
    if (tab === "settings") loadAppSettings();
  }, [tab, loadAppSettings]);

  const handleDeleteUser = (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    setDeletingId(id);
    setError(null);
    fetch(`/api/users/${id}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setSuccess("Utilisateur supprimé.");
          loadUsers();
        } else setError(json.error || "Erreur");
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setDeletingId(null));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail.trim()) return;
    setCreateSubmitting(true);
    setSuccess(null);
    setError(null);
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: createEmail.trim(),
        name: createName.trim() || undefined,
        role: createRole,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setSuccess("Utilisateur créé et sauvegardé en base.");
          setCreateOpen(false);
          setCreateEmail("");
          setCreateName("");
          setCreateRole("user");
          loadUsers();
        } else {
          setError(json.error || "Erreur à la création");
        }
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setCreateSubmitting(false));
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-heading text-2xl font-bold text-white">
        Tables
      </h1>
      <p className="mt-2 text-slate-400">
        Données chargées et sauvegardées depuis la base de données.
      </p>

      {success && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200 text-sm">
          {success}
        </div>
      )}

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-white/10">
        <Link
          href="/botoadmin/tables?tab=users"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "users"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Utilisateurs
        </Link>
        <Link
          href="/botoadmin/tables?tab=audit"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "audit"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Audit
        </Link>
        <Link
          href="/botoadmin/tables?tab=contacts"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "contacts"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Contacts
        </Link>
        <Link
          href="/botoadmin/tables?tab=prospects"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "prospects"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Devis (Prospects)
        </Link>
        <Link
          href="/botoadmin/tables?tab=revenue"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "revenue"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Revenue
        </Link>
        <Link
          href="/botoadmin/tables?tab=analytics"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "analytics"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Analytics
        </Link>
        <Link
          href="/botoadmin/tables?tab=pageviews"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "pageviews"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          PageView
        </Link>
        <Link
          href="/botoadmin/tables?tab=settings"
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "settings"
              ? "bg-slate-800 text-holographic-cyan border border-b-0 border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          AppSettings
        </Link>
      </nav>

      {error && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
          {error}
        </div>
      )}

      {tab === "users" && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-lg bg-holographic-cyan/20 px-4 py-2 text-sm font-medium text-holographic-cyan hover:bg-holographic-cyan/30"
            >
              + Créer un utilisateur
            </button>
          </div>
          {createOpen && (
            <form
              onSubmit={handleCreateUser}
              className="rounded-xl border border-white/10 bg-slate-800/80 p-4 space-y-3"
            >
              <h3 className="font-heading text-sm font-semibold text-white">Nouvel utilisateur (sauvegarde en base)</h3>
              <input
                id="admin-create-user-email"
                name="email"
                type="email"
                required
                placeholder="Email"
                autoComplete="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white placeholder-slate-500"
              />
              <input
                id="admin-create-user-name"
                name="name"
                type="text"
                placeholder="Nom (optionnel)"
                autoComplete="name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white placeholder-slate-500"
              />
              <select
                id="admin-create-user-role"
                name="role"
                value={createRole}
                onChange={(e) => setCreateRole(e.target.value as "user" | "admin" | "boss")}
                aria-label="Rôle utilisateur"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="boss">boss</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="rounded-lg bg-holographic-cyan px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
                >
                  {createSubmitting ? "Création…" : "Enregistrer en base"}
                </button>
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
          {users && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Email</th>
                  <th scope="col" className="p-4 font-medium">Nom</th>
                  <th scope="col" className="p-4 font-medium">Rôle</th>
                  <th scope="col" className="p-4 font-medium">Créé le</th>
                  <th scope="col" className="p-4 font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.items.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{u.email}</td>
                    <td className="p-4 text-slate-300">{u.name ?? "—"}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-holographic-cyan/20 px-2 py-0.5 text-xs text-holographic-cyan">{u.role}</span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="p-4">
                      <button
                        type="button"
                        disabled={deletingId === u.id}
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        {deletingId === u.id ? "…" : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-slate-400 text-sm">
            <span>{users.total} résultat(s)</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={users.page <= 1}
                onClick={() => setUsersPage((p) => p - 1)}
                className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10"
              >
                Précédent
              </button>
              <span className="py-1">Page {users.page} / {users.totalPages || 1}</span>
              <button
                type="button"
                disabled={users.page >= users.totalPages}
                onClick={() => setUsersPage((p) => p + 1)}
                className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
          )}
        </div>
      )}

      {tab === "contacts" && contacts && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Nom</th>
                  <th scope="col" className="p-4 font-medium">Email</th>
                  <th scope="col" className="p-4 font-medium">Message</th>
                  <th scope="col" className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{item.name}</td>
                    <td className="p-4 text-slate-300">{item.email}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{item.message}</td>
                    <td className="p-4 text-slate-500">{new Date(item.createdAt).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-slate-400 text-sm">
            <span>{contacts.total} contact(s)</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={contacts.page <= 1}
                onClick={() => setContactsPage((p) => p - 1)}
                className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10"
              >
                Précédent
              </button>
              <span className="py-1">Page {contacts.page} / {contacts.totalPages || 1}</span>
              <button
                type="button"
                disabled={contacts.page >= contacts.totalPages}
                onClick={() => setContactsPage((p) => p + 1)}
                className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "audit" && auditLogs && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Action</th>
                  <th scope="col" className="p-4 font-medium">Ressource</th>
                  <th scope="col" className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.items.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{log.action}</td>
                    <td className="p-4 text-slate-300">{log.resource ?? "—"}</td>
                    <td className="p-4 text-slate-400">{new Date(log.createdAt).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-slate-400 text-sm">
            <span>{auditLogs.total} entrée(s)</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={auditLogs.page <= 1}
                onClick={() => setAuditPage((p) => p - 1)}
                className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10"
              >
                Précédent
              </button>
              <span className="py-1">Page {auditLogs.page} / {auditLogs.totalPages || 1}</span>
              <button
                type="button"
                disabled={auditLogs.page >= auditLogs.totalPages}
                onClick={() => setAuditPage((p) => p + 1)}
                className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "prospects" && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <p className="p-4 text-slate-400 text-sm border-b border-white/10">
            Prospects (demandes de devis) — liaison avec Activités. Voir aussi <Link href="/botoadmin/crm" className="text-holographic-cyan hover:underline">CRM</Link>.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Nom</th>
                  <th scope="col" className="p-4 font-medium">Email</th>
                  <th scope="col" className="p-4 font-medium">Société</th>
                  <th scope="col" className="p-4 font-medium">Services</th>
                  <th scope="col" className="p-4 font-medium">Budget</th>
                  <th scope="col" className="p-4 font-medium">Statut</th>
                  <th scope="col" className="p-4 font-medium">Activités</th>
                  <th scope="col" className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {prospects === null ? (
                  <tr><td colSpan={8} className="p-4 text-slate-500">Chargement…</td></tr>
                ) : prospects.length === 0 ? (
                  <tr><td colSpan={8} className="p-4 text-slate-500">Aucun prospect.</td></tr>
                ) : (
                  prospects.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-white">{p.nom}</td>
                      <td className="p-4 text-slate-300">{p.email}</td>
                      <td className="p-4 text-slate-400">{p.societe ?? "—"}</td>
                      <td className="p-4 text-slate-400">{Array.isArray(p.services) ? p.services.join(", ") : "—"}</td>
                      <td className="p-4 text-slate-400">{p.budget ?? "—"}</td>
                      <td className="p-4"><span className="rounded-full bg-holographic-cyan/20 px-2 py-0.5 text-xs text-holographic-cyan">{p.status}</span></td>
                      <td className="p-4 text-slate-400">{Array.isArray(p.activities) ? p.activities.length : 0} activité(s)</td>
                      <td className="p-4 text-slate-500">{new Date(p.createdAt).toLocaleString("fr-FR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "revenue" && revenue && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Montant</th>
                  <th scope="col" className="p-4 font-medium">Devise</th>
                  <th scope="col" className="p-4 font-medium">Période</th>
                  <th scope="col" className="p-4 font-medium">Label</th>
                  <th scope="col" className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {revenue.items.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{r.amount}</td>
                    <td className="p-4 text-slate-300">{r.currency}</td>
                    <td className="p-4 text-slate-400">{r.periodType} / {r.periodValue ?? "—"}</td>
                    <td className="p-4 text-slate-400">{r.label ?? "—"}</td>
                    <td className="p-4 text-slate-500">{new Date(r.createdAt).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-slate-400 text-sm">
            <span>{revenue.total} entrée(s)</span>
            <div className="flex gap-2">
              <button type="button" disabled={revenue.page <= 1} onClick={() => setRevenuePage((p) => p - 1)} className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10">Précédent</button>
              <span className="py-1">Page {revenue.page} / {revenue.totalPages || 1}</span>
              <button type="button" disabled={revenue.page >= revenue.totalPages} onClick={() => setRevenuePage((p) => p + 1)} className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10">Suivant</button>
            </div>
          </div>
        </div>
      )}

      {tab === "analytics" && analytics && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Page</th>
                  <th scope="col" className="p-4 font-medium">Événement</th>
                  <th scope="col" className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.items.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{a.page}</td>
                    <td className="p-4 text-slate-300">{a.event}</td>
                    <td className="p-4 text-slate-500">{new Date(a.createdAt).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-slate-400 text-sm">
            <span>{analytics.total} entrée(s)</span>
            <div className="flex gap-2">
              <button type="button" disabled={analytics.page <= 1} onClick={() => setAnalyticsPage((p) => p - 1)} className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10">Précédent</button>
              <span className="py-1">Page {analytics.page} / {analytics.totalPages || 1}</span>
              <button type="button" disabled={analytics.page >= analytics.totalPages} onClick={() => setAnalyticsPage((p) => p + 1)} className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10">Suivant</button>
            </div>
          </div>
        </div>
      )}

      {tab === "pageviews" && pageViews && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Page</th>
                  <th scope="col" className="p-4 font-medium">Session</th>
                  <th scope="col" className="p-4 font-medium">Durée (s)</th>
                  <th scope="col" className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {pageViews.items.map((v) => (
                  <tr key={v.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{v.page}</td>
                    <td className="p-4 text-slate-300 font-mono text-xs">{v.sessionId ? `${v.sessionId.slice(0, 8)}…` : "—"}</td>
                    <td className="p-4 text-slate-400">{v.duration ?? "—"}</td>
                    <td className="p-4 text-slate-500">{new Date(v.createdAt).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-slate-400 text-sm">
            <span>{pageViews.total} entrée(s)</span>
            <div className="flex gap-2">
              <button type="button" disabled={pageViews.page <= 1} onClick={() => setPageViewsPage((p) => p - 1)} className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10">Précédent</button>
              <span className="py-1">Page {pageViews.page} / {pageViews.totalPages || 1}</span>
              <button type="button" disabled={pageViews.page >= pageViews.totalPages} onClick={() => setPageViewsPage((p) => p + 1)} className="rounded-lg px-3 py-1 bg-white/5 disabled:opacity-50 hover:bg-white/10">Suivant</button>
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && appSettings && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="p-4 font-medium">Clé</th>
                  <th scope="col" className="p-4 font-medium">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {appSettings.items.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white font-mono">{s.key}</td>
                    <td className="p-4 text-slate-300 max-w-md truncate">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/10 px-4 py-3 text-slate-400 text-sm">{appSettings.total} paramètre(s)</div>
        </div>
      )}
    </div>
  );
}

export default function AdminTablesPage() {
  return (
    <Suspense fallback={<div className="p-6 md:p-10 text-slate-400">Chargement…</div>}>
      <TablesContent />
    </Suspense>
  );
}
