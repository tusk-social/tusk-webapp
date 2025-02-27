"use client";

import { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export default function Tooltip({
  text,
  children,
  position = "bottom",
  delay = 0,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (delay > 0) {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-1",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-1",
  };

  // Arrow classes
  const arrowClasses = {
    top: "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800",
    bottom:
      "absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800",
    left: "absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800",
    right:
      "absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 shadow-lg border border-gray-700 pointer-events-none`}
        >
          {text}
          <div className={arrowClasses[position]}></div>
        </div>
      )}
    </div>
  );
}
