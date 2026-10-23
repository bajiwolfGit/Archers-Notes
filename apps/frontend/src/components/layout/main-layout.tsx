import type { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
