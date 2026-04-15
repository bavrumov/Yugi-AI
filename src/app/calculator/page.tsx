import Link from 'next/link';
import HandCalculator from '@/components/HandCalculator';

export const metadata = {
  title: 'Hand Calculator — YugiAI',
  description: 'Hypergeometric probability calculator for Yu-Gi-Oh! deck building. Analyze starter and brick ratios for optimal opening hands.',
};

export default function CalculatorPage() {
  return (
    <>
      <div className="self-start w-full flex items-center justify-between mb-6">
        <Link
          href="/"
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span className="mr-1">←</span> Back to Home
        </Link>
        <Link
          href="/judge"
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          Ask the Judge <span className="ml-1">→</span>
        </Link>
      </div>

      <HandCalculator />
    </>
  );
}
