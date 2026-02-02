"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StageDialogHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StageDialogHeader({
  title,
  subtitle,
  icon,
}: StageDialogHeaderProps) {
  return (
    <DialogHeader className="mb-8 px-2">
      <div
        className="relative flex flex-col items-center justify-center text-center 
        rounded-2xl bg-gradient-to-br from-white via-gray-50/80 to-white
        shadow-xl shadow-black/5 border border-white/20 backdrop-blur-sm
        p-8 sm:p-10 md:p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br 
        before:from-white/40 before:via-transparent before:to-white/20 before:pointer-events-none"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.05),transparent_70%)] pointer-events-none" />

        {/* Optional Icon */}
        {icon && (
          <div
            className="relative mb-4 p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 
          shadow-lg shadow-primary/10 transition-transform duration-300 hover:scale-110"
          >
            <div className="text-primary flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}

        {/* Title with Gradient Text */}
        <DialogTitle
          className="relative text-3xl sm:text-4xl md:text-5xl font-bold 
        bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent
        tracking-tight leading-tight drop-shadow-sm"
        >
          {title}
        </DialogTitle>

        {/* Subtitle with better styling */}
        {subtitle && (
          <p
            className="relative text-base sm:text-lg text-muted-foreground/80 mt-4 max-w-lg 
          leading-relaxed font-medium"
          >
            {subtitle}
          </p>
        )}

        {/* Enhanced Decorative Elements */}
        <div className="relative flex items-center gap-2 mt-6">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1" />
          <div
            className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary/80 
          shadow-lg shadow-primary/30 animate-pulse"
          />
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1" />
        </div>

        {/* Subtle glow effect */}
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 
        blur-xl opacity-30 -z-10"
        />
      </div>
    </DialogHeader>
  );
}
