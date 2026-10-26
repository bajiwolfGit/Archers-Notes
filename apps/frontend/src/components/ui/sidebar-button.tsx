
import Image from "next/image";
import Link from "next/link";

interface SidebarButtonProps {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export default function SidebarButton({
  icon,
  label,
  href,
  onClick,
  active = false,
}: SidebarButtonProps) {
  const className = `
    flex w-full items-center gap-4
    rounded-md px-4 py-3
    text-left text-sm font-medium
    transition-colors
    hover:bg-gray-100
    ${active ? "bg-green-50 text-[#00A651]" : "text-[#333B38]"}
  `;

  const content = (
    <>
      <Image src={icon} alt="" width={20} height={20} />
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}
