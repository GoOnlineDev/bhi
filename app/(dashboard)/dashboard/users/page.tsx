import type { Metadata } from "next";
import UsersManager from "@/components/dashboard/users/users-manager";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return <UsersManager />;
}
