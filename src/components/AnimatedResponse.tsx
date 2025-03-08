import { useEffect, useState } from 'react';

interface AnimatedResponseProps {
  query: string;
  response: string;
  speed?: number; // Characters per second
}

export default function AnimatedResponse({ query, response, speed = 400 }: AnimatedResponseProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  
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
    setDisplayText(characters[currentIndex]); // Start with the first character immediately

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
  
  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative animate-slideIn">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md backdrop-blur-sm text-gray-900 dark:text-gray-100">
        <div className="border-b border-gray-200 dark:border-gray-700 p-3">
          <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400">
            {query}
          </h3>
        </div>
        <div className="p-4 relative">
          <p className="whitespace-pre-wrap">{displayText}</p>
          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-gray-900 dark:bg-gray-100 animate-blink" />
          )}
          <button 
            onClick={handleCopy} 
            className="absolute bottom-2 right-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
