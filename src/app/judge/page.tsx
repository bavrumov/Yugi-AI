import Link from 'next/link';
import { Suspense } from 'react';
import JudgeContent from '@/components/JudgeContent';

export default function JudgePage() {
  return (
    <>
      <Link 
        href="/"
        className="self-start mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:underline"
      >
        <span className="mr-1">←</span> Back to Home
      </Link>

      {/* Wrap client component in Suspense to prevent SSR issues */}
      <Suspense fallback={<div>Loading...</div>}>
        <JudgeContent />
      </Suspense>
    </>
  );
}
