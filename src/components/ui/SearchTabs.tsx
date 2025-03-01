"use client";
import React from "react";

// Create a context to share the active tab value
const TabsContext = React.createContext<{ value: string }>({ value: "" });

interface TabsProps {
  defaultValue: string;
  className?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  className,
  onValueChange,
  children,
}: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value }}>
      <div className={className} data-value={value}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              value,
              onValueChange: handleValueChange,
            });
          }
          return child;
        })}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return <div className={className}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}

export function TabsTrigger({
  value,
  className,
  children,
  onValueChange,
}: TabsTriggerProps) {
  return (
    <button className={className} onClick={() => onValueChange?.(value)}>
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  // Use the context to determine if this content should be shown
  const { value: activeValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  if (!isActive) return null;
  return <div className={className}>{children}</div>;
}
