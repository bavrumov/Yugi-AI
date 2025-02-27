import { useEffect, useState } from 'react';

interface AnimatedResponseProps {
  response: string;
  speed?: number; // Characters per second
}

export default function AnimatedResponse({ response, speed = 400 }: AnimatedResponseProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (!response) {
      setDisplayText('');
      return;
    }
    
    setIsTyping(true);
    setDisplayText('');
    
    const characters = response.split('');
    let currentIndex = -1; // Start at -1 to ensure the first character is added immediately, 0 skips first char
    
    // Calculate interval based on desired character per second rate
    const interval = 1000 / speed;
    
    const timer = setInterval(() => {
      if (currentIndex < characters.length - 1) { // len - 1 is used so it doesn't print undefined at the end
        setDisplayText((prev) => prev + characters[currentIndex]);
        currentIndex++;
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