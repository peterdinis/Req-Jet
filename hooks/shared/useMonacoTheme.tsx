"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Custom React hook to provide the appropriate Monaco Editor theme
 * based on the current Next.js theme (`light` or `dark`).
 *
 * Returns `"vs"` for light mode and `"vs-dark"` for dark mode.
 *
 * @returns {"vs" | "vs-dark"} The Monaco Editor theme string.
 *
 * @example
 * ```ts
 * const editorTheme = useMonacoTheme();
 *
 * return (
 *   <Editor
 *     height="400px"
 *     defaultLanguage="javascript"
 *     theme={editorTheme}
 *     value="// Your code here"
 *   />
 * );
 * ```
 */
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
