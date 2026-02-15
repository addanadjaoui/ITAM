import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeView, setActiveView] = useState("assets");
  const [searchTerm, setSearchTerm] = useState("");

  const value = {
    activeView,
    setActiveView,
    searchTerm,
    setSearchTerm,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personnalisé (BEST PRACTICE)
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}

