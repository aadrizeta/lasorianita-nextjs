import Image from "next/image";

interface GridButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction: "back" | "next";
}

export default function GridButton({ onClick, disabled, direction }: GridButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border cursor-pointer border-stone-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Image
        src={`/icons/${direction}.svg`}
        alt={`Arrow ${direction}`}
        width={35}
        height={35}
      />
    </button>
  );
};