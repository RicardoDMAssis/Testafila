import { Suspense } from "react";
import { Dashboard } from "../../components/dashboard";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flow-loading">Carregando painel…</div>}>
      <Dashboard />
    </Suspense>
  );
}
