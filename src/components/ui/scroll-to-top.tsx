"use client";

import { useState, useEffect, useRef } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [onRed, setOnRed] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);

      if (!btnRef.current) return;
      const btnY = btnRef.current.getBoundingClientRect().top + btnRef.current.offsetHeight / 2;
      const redEls = document.querySelectorAll(".bg-soria-red");
      let overlapping = false;
      for (const el of redEls) {
        const r = el.getBoundingClientRect();
        if (btnY >= r.top && btnY <= r.bottom) { overlapping = true; break; }
      }
      setOnRed(overlapping);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      ref={btnRef}
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-all duration-100 cursor-pointer ${onRed ? "bg-[#2A2A2A] hover:bg-[#1a1a1a]" : "bg-soria-red hover:bg-red-900"
        } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
