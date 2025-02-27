"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRandomMillenniumItem } from "@/lib/theme";

export default function MillenniumBackground() {
  const [item, setItem] = useState<string | null>(null);

  useEffect(() => {
    const selectedItem = getRandomMillenniumItem();
    setItem(selectedItem);

    // Update the favicon dynamically
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.setAttribute("href", `/images/millennium-items/${selectedItem}.png`);
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = `/images/millennium-items/${selectedItem}.png`;
      document.head.appendChild(link);
    }
  }, []);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center opacity-10 dark:opacity-20 pointer-events-none">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Image 
          src={`/images/millennium-items/${item}.png`}
          alt={`Millennium ${item}`}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}