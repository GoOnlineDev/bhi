'use client';

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ADMIN_ROLES, ROLES, canManageRole, type Role } from "@/convex/roles";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, Lock, Mail, PenSquare, Search, ShieldCheck, Users, X } from "lucide-react";
import { ROLE_META } from "../role-meta";
import AddUserDialog, { errorMessage } from "./add-user-dialog";

type RoleFilter = Role | "all";
type PendingChange = { userId: Id<"users">; name: string; from: Role; to: Role };

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function RoleBadge({ role }: { role: Role }) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", meta.badgeClass)}>
      <Icon className="h-3 w-3" aria-hidden />
      {meta.label}
    </Badge>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsersManager() {
  const data = useQuery(api.users.listUsers);
  const updateRole = useMutation(api.users.updateUserRole);
  const revokeInvite = useMutation(api.users.revokeInvite);
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.users.filter((u) => {
      const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
      const matchesSearch = !q || name.includes(q) || u.email.toLowerCase().includes(q);
      return matchesSearch && (roleFilter === "all" || u.role === roleFilter);
    });
  }, [data, search, roleFilter]);

  if (data === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (data === null) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardContent className="p-8">
          <Lock className="mx-auto mb-3 h-6 w-6 text-muted-foreground" aria-hidden />
          <h2 className="font-semibold text-foreground">Admins only</h2>
          <p className="mt-1 text-sm text-muted-foreground">Only admins and super admins can manage users.</p>
        </CardContent>
      </Card>
    );
  }

  const { me, users, invites } = data;
  const assignableRoles = ROLES.filter((r) => canManageRole(me.role, r));
  const countBy = (roles: readonly Role[]) => users.filter((u) => roles.includes(u.role)).length;

  const confirmChange = async () => {
    if (!pending) return;
    setSaving(true);
    try {
      await updateRole({ userId: pending.userId, role: pending.to });
      toast({ title: "Role updated", description: `${pending.name} is now ${ROLE_META[pending.to].label.toLowerCase()}.` });
      setPending(null);
    } catch (err) {
      toast({ title: "Couldn't update role", description: errorMessage(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const onRevoke = async (inviteId: Id<"userInvites">, email: string) => {
    try {
      await revokeInvite({ inviteId });
      toast({ title: "Invite revoked", description: `${email} will no longer get a role on sign-in.` });
    } catch (err) {
      toast({ title: "Couldn't revoke invite", description: errorMessage(err), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Manage who can access the dashboard and what they can do.</p>
        </div>
        <AddUserDialog assignableRoles={assignableRoles} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total accounts" value={users.length} icon={Users} />
        <StatCard label="Admins" value={countBy(ADMIN_ROLES)} icon={ShieldCheck} />
        <StatCard label="Editors" value={countBy(["editor"])} icon={PenSquare} />
        <StatCard label="Pending invites" value={invites.length} icon={Clock} />
      </div>

      <Card>
        <CardHeader className="gap-4 space-y-0 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">All users</CardTitle>
            <CardDescription>{filtered.length} of {users.length} shown</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email"
                aria-label="Search users"
                className="pl-9 sm:w-64"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleFilter)}>
              <SelectTrigger className="sm:w-40" aria-label="Filter by role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_META[r].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">User</TableHead>
                  <TableHead className="w-48">Role</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => {
                  const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;
                  const isMe = u._id === me._id;
                  const editable = !isMe && canManageRole(me.role, u.role);
                  return (
                    <TableRow key={u._id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {u.imageUrl && <AvatarImage src={u.imageUrl} alt="" />}
                            <AvatarFallback className="text-xs">{name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {name}
                              {isMe && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {editable ? (
                          <Select
                            value={u.role}
                            onValueChange={(to) => setPending({ userId: u._id, name, from: u.role, to: to as Role })}
                          >
                            <SelectTrigger className="h-9 w-40" aria-label={`Role for ${name}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {assignableRoles.map((r) => (
                                <SelectItem key={r} value={r}>{ROLE_META[r].label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <RoleBadge role={u.role} />
                        )}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {formatDate(u._creationTime)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-12 text-center text-sm text-muted-foreground">
                      No users match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {invites.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Pending invites</CardTitle>
            <CardDescription>These roles are applied when the person first signs in with that email.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {invites.map((inv) => (
                <li key={inv._id} className="flex flex-wrap items-center gap-3 px-6 py-3">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{inv.email}</span>
                  <RoleBadge role={inv.role} />
                  <span className="hidden text-xs text-muted-foreground sm:inline">Added {formatDate(inv._creationTime)}</span>
                  {canManageRole(me.role, inv.role) && (
                    <Button variant="ghost" size="sm" onClick={() => onRevoke(inv._id, inv.email)}>
                      <X className="mr-1 h-4 w-4" aria-hidden />
                      Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Roles</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map((r) => (
            <div key={r} className="rounded-lg border p-3">
              <RoleBadge role={r} />
              <p className="mt-2 text-xs text-muted-foreground">{ROLE_META[r].description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && !saving && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change role?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending && (
                <>
                  {pending.name} will change from <strong>{ROLE_META[pending.from].label}</strong> to{" "}
                  <strong>{ROLE_META[pending.to].label}</strong>. {ROLE_META[pending.to].description}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(e) => {
                e.preventDefault();
                confirmChange();
              }}
            >
              {saving ? "Saving..." : "Change role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
