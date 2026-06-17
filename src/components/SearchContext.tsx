"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SearchContextType = {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isFancyFont: boolean;
  setIsFancyFont: (fancy: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFancyFont, setIsFancyFont] = useState(true);

  // Sync font preference class with document body
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isFancyFont) {
        document.documentElement.classList.add("fancy-font-active");
      } else {
        document.documentElement.classList.remove("fancy-font-active");
      }
    }
  }, [isFancyFont]);

  // Sync scroll locking when search is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isSearchOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [isSearchOpen]);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
        isFancyFont,
        setIsFancyFont,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
