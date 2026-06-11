import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Dumbbell, Home, Swords, Trophy, UserCircle } from "lucide-react";

const tabs = [
  {
    label: "Home",
    to: "/dashboard",
    icon: Home,
    match: ["/", "/dashboard"],
  },
  {
    label: "Career",
    to: "/mycareer",
    icon: Trophy,
    match: ["/mycareer", "/career", "/therise", "/therisehub", "/therise/create"],
  },
  {
    label: "Battle",
    to: "/simulate",
    icon: Swords,
    match: ["/simulate"],
  },
  {
    label: "Train",
    to: "/training-room",
    icon: Dumbbell,
    match: ["/training-room", "/bar-builder", "/freestyle-lab", "/recording-studio", "/my-work"],
  },
  {
    label: "Profile",
    to: "/battlers",
    icon: UserCircle,
    match: ["/battlers"],
  },
];

function isActivePath(pathname, tab) {
  return tab.match.some((path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-black/95 px-2 pt-2 shadow-2xl shadow-black backdrop-blur pb-[max(10px,env(safe-area-inset-bottom))]">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActivePath(pathname, tab);

          return (
            <NavLink
              key={tab.label}
              to={tab.to}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-black transition ${
                active
                  ? "bg-lime-400 text-black"
                  : "text-zinc-400 active:bg-zinc-900 active:text-white"
              }`}
            >
              <Icon size={21} strokeWidth={active ? 3 : 2.4} />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
