"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getRandomMillenniumItem } from '@/lib/theme';

export default function MillenniumBackground() {
  const [item, setItem] = useState<string | null>(null);

  useEffect(() => {
    setItem(getRandomMillenniumItem());
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