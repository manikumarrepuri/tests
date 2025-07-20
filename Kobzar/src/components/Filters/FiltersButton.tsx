"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type FiltersButtonProps = {
  text: string;
  filterKey: string;
  filterType?: string | string[];
};

export default function FiltersButton({
  text,
  filterKey,
  filterType,
}: FiltersButtonProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isActive = filterType === filterKey;

  const handleClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("filter", filterKey);
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <button
      onClick={() => handleClick()}
      className={`filters-button ${isActive ? "active" : ""}`}
    >
      <span>{text}</span>
    </button>
  );
}
