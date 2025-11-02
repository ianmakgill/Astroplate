import React from "react";

interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const Spacer: React.FC<SpacerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    xs: "h-4",    // 16px
    sm: "h-8",    // 32px
    md: "h-12",   // 48px
    lg: "h-16",   // 64px
    xl: "h-24",   // 96px
    "2xl": "h-32" // 128px
  };

  return <div className={sizeClasses[size]} aria-hidden="true" />;
};

export default Spacer;
