'use client';

export interface Stage {
  id: string;
  message: string;
  status: 'active' | 'complete';
}

interface StageIndicatorProps {
  stages: Stage[];
}

export default function StageIndicator({ stages }: StageIndicatorProps) {
  return (
    <div className="space-y-1.5">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
            stage.status === 'complete'
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-800 dark:text-gray-200'
          }`}
        >
          {stage.status === 'complete' ? (
            <span className="text-green-500 dark:text-green-400 w-3 shrink-0">✓</span>
          ) : (
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400 animate-pulse shrink-0 ml-0.5" />
          )}
          <span>{stage.message}</span>
        </div>
      ))}
    </div>
  );
}
