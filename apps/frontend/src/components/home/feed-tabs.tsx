"use client";

import Image from "next/image";

type FeedTab = "Trending" | "Latest";

interface FeedTabsProps {
	activeTab: FeedTab;
	onTabChange: (tab: FeedTab) => void;
}

export default function FeedTabs({
	activeTab,
	onTabChange,
}: FeedTabsProps) {
  const tabs: FeedTab[] = ["Trending", "Latest"];

	return (
		<div className="flex h-[36px] w-full rounded border border-[#00A651] p-[2px]">
			{tabs.map((tab) => (
				<button
					key={tab}
					type="button"
					onClick={() => onTabChange(tab)}
					aria-pressed={activeTab === tab}
					className={`flex flex-1 items-center justify-center gap-3 rounded-sm text-sm transition-colors ${
						activeTab === tab
						? "bg-[#00A651] text-white"
						: "bg-white text-[#00A651]"
					}`}
				>
					<Image
						src={
						tab === "Trending"
							? "/assets/icons/heart.svg"
							: "/assets/icons/calendar.svg"
						}
						alt=""
						width={20}
						height={20}
						className={
						activeTab === tab
							? "brightness-0 invert"
							: ""
						}
					/>

					<span>{tab}</span>
				</button>
			))}
		</div>
	);
}