import React from "react";
import BarGodLogo from "@/BarGodLogo";
import SubNavButton from "@/SubNavButton";
import { ChevronLeft, BookOpenText, Mic, Home } from "lucide-react";

/**
 * TopBar
 * Use across sub-screens (Builder, Studio, My Work…)
 * Left: small logo (click → Home)
 * Right: customizable quick links
 */
export default function TopBar({
  right = "default", // "default" | "builder" | "studio" | "custom"
  customButtons = null,
}) {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3">
      {/* Logo → Home (already navigates in BarGodLogo) */}
      <div className="flex items-center gap-2">
        <BarGodLogo size="text-2xl" />
        {/* optional subtle 'Home' helper */}
        <SubNavButton
          to="/"
          label="Home"
          icon={<Home size={16} />}
          size="sm"
          variant="ghost"
          className="ml-2 hidden sm:inline-flex"
        />
      </div>

      <div className="flex items-center gap-2">
        {right === "default" && (
          <>
            <SubNavButton to="/training-room" label="Training Room" icon={<ChevronLeft size={16} />} />
            <SubNavButton to="/my-work" label="My Work" icon={<BookOpenText size={16} />} variant="primary" />
          </>
        )}

        {right === "builder" && (
          <>
            <SubNavButton to="/training-room" label="Training Room" icon={<ChevronLeft size={16} />} />
            <SubNavButton to="/recording-studio" label="Studio" icon={<Mic size={16} />} />
            <SubNavButton to="/my-work" label="My Work" icon={<BookOpenText size={16} />} variant="primary" />
          </>
        )}

        {right === "studio" && (
          <>
            <SubNavButton to="/training-room" label="Training Room" icon={<ChevronLeft size={16} />} />
            <SubNavButton to="/bar-builder" label="Bar Builder" icon={<BookOpenText size={16} />} />
            <SubNavButton to="/my-work" label="My Work" icon={<BookOpenText size={16} />} variant="primary" />
          </>
        )}

        {right === "custom" && customButtons}
      </div>
    </div>
  );
}
