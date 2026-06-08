"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRandomMillenniumItem } from "@/lib/theme";
import { MILLENNIUM_ITEMS } from "@/lib/constants";

const SSR_DEFAULT = "ring";

export default function MillenniumBackground() {
  const [item, setItem] = useState<string>(SSR_DEFAULT);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const selectedItem = getRandomMillenniumItem();
    setItem(selectedItem);
    setVisible(true);

    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = `/images/millennium-items/${selectedItem}.png`;
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
      className={`fixed inset-0 z-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
        visible ? "opacity-10 dark:opacity-20" : "opacity-0"
      }`}
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Image
          src={`/images/millennium-items/${item}.png`}
          alt=""
          fill
          sizes="(max-width: 768px) 256px, 320px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
