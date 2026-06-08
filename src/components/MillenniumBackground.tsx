"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRandomMillenniumItem } from "@/lib/theme";
import { MILLENNIUM_ITEMS } from "@/lib/constants";

const SSR_DEFAULT = MILLENNIUM_ITEMS[0];

export default function MillenniumBackground() {
  const [item, setItem] = useState<string>(SSR_DEFAULT);

  useEffect(() => {
    const selectedItem = getRandomMillenniumItem();
    setItem(selectedItem);

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

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 flex items-center justify-center opacity-10 dark:opacity-20 pointer-events-none"
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Image
          src={`/images/millennium-items/${item}.png`}
          alt=""
          fill
          sizes="(max-width: 768px) 256px, 320px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
