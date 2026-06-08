'use client';

import { useState } from 'react';
import QueryForm from '@/components/QueryForm';

export default function HomeQueryForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (queryText: string) => {
    setIsLoading(true);
    window.location.href = `/judge?q=${encodeURIComponent(queryText)}`;
  };

  return <QueryForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
