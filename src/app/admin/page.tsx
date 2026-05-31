import { redirect } from "next/navigation";

// /admin redireciona para o dashboard.
export default function AdminIndex() {
  redirect("/admin/dashboard");
}
