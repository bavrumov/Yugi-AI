import { useEffect, useState } from 'react';

interface AnimatedResponseProps {
  response: string;
  speed?: number; // Characters per second
}

export default function AnimatedResponse({ response, speed = 800 }: AnimatedResponseProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (!response) {
      setDisplayText('');
      return;
    }
    
    const characters = response.split('');

    // Calculate interval based on desired character per second rate
    const interval = 1000 / speed;
    let currentIndex = 0;

    setIsTyping(true);
    setDisplayText('');

    const timer = setInterval(() => {
      if (currentIndex < characters.length) {
        const char = characters[currentIndex];
        currentIndex++;
        setDisplayText((prev) => prev + char);
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [response, speed]);
  
  return (
    <div className="relative">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-md backdrop-blur-sm text-gray-900 dark:text-gray-100 animate-fadeIn">
        <p className="whitespace-pre-wrap">{displayText}</p>
        {isTyping && (
          <span className="inline-block w-2 h-4 ml-1 bg-gray-900 dark:bg-gray-100 animate-blink" />
        )}
      </div>
    </div>
  );
}
