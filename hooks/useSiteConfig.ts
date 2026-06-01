"use client";

import { useState, useEffect } from "react";

export function useSiteConfig(key: string, defaultValue: string) {
  // Always start with defaultValue to match server render (prevents hydration mismatch)
  const [value, setValue] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  // On mount: read from localStorage and mark as mounted
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`cruz_config_${key}`);
    // Explicitly handle null — revert to default if no override exists
    setValue(stored !== null ? stored : defaultValue);
  }, [key, defaultValue]);

  // Cross-tab sync via native storage event
  useEffect(() => {
    if (!mounted) return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `cruz_config_${key}`) {
        // e.newValue is null when item is removed — revert to default
        setValue(e.newValue !== null ? e.newValue : defaultValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, mounted, defaultValue]);

  // Same-window sync via custom event dispatched by admin panel
  useEffect(() => {
    if (!mounted) return;
    const handleLocalUpdate = () => {
      const stored = localStorage.getItem(`cruz_config_${key}`);
      // Handle removal: if stored is null, revert to defaultValue
      setValue(stored !== null ? stored : defaultValue);
    };
    window.addEventListener("storage_cruz_config", handleLocalUpdate);
    return () => window.removeEventListener("storage_cruz_config", handleLocalUpdate);
  }, [key, mounted, defaultValue]);

  const updateConfig = (newValue: string) => {
    localStorage.setItem(`cruz_config_${key}`, newValue);
    setValue(newValue);
    window.dispatchEvent(new Event("storage_cruz_config"));
  };

  return [value, updateConfig] as const;
}
