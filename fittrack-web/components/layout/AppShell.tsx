import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-4 px-4 py-6 md:grid-cols-[220px_1fr] md:px-6">
      <Sidebar />
      <main>
        <Topbar />
        {children}
      </main>
    </div>
  );
}
