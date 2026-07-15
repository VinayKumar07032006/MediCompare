import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "warning" | "danger" | "info" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  className = "",
  ...props
}) => {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-50 text-blue-700 border border-blue-200/50",
    secondary: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/50",
    danger: "bg-red-50 text-red-700 border border-red-200/50",
    info: "bg-sky-50 text-sky-700 border border-sky-200/50",
    neutral: "bg-slate-100 text-slate-800 border border-slate-200/50",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
