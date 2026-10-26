import type { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface MainLayoutProps {
  	children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className="min-h-screen bg-white">

			{/* Sticky Navbar */}
			<div className="sticky top-0 z-50 bg-white">
				<Navbar />
			</div>

			<div className="flex">

				{/* Independently Scrollable Sidebar */}
				<div className="sidebar-scroll sticky top-[66px] h-[calc(100vh-66px)] shrink-0 overflow-y-auto">
					<Sidebar />
				</div>

				{/* Main Content */}
				<main className="min-w-0 flex-1">
					{children}
				</main>

			</div>
		</div>
	);
}