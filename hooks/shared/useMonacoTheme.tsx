"use client"

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useMonacoTheme() {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState<"vs" | "vs-dark">("vs");

  useEffect(() => {
    if (theme === "dark") {
      setEditorTheme("vs-dark");
    } else {
      setEditorTheme("vs");
    }
  }, [theme]);

  return editorTheme;
}