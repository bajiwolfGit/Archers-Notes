import Image from "next/image";


export function GoogleButton() {
  return (
    <button
      type="button"
      className="
        flex
        h-10
        w-full
        items-center
        justify-center
        gap-3
        rounded-full
        border
        border-[#E5E5E5]
        bg-white
        px-4
        text-[14px]
        font-semibold
        text-[#A3A3A3]
        cursor-pointer
        transition-colors
        duration-200
        hover:bg-[#F3F3F3]
        hover:border-[#C5C5C5]
        hover:text-[#343B37]
      "
    >
      <img
        src="/assets/google.svg"
        alt=""
        aria-hidden="true"
        className="h-5 w-5"
      />
      Continue with Google
    </button>
  );
}