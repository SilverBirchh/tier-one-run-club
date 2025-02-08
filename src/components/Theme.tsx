import { useEffect, useState } from "react";

export const Theme = () => {
  const [lightTheme, setLightTheme] = useState(true);

  useEffect(() => {
    const isDark = window.localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
        setLightTheme(!isDark);
  }, []);

  const click = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setLightTheme(true);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setLightTheme(false);
    }
  };
  return (
    <button
      onClick={click}
      className="text-foreground border-b-4 border-transparent !no-underline transition-all text-md"
    >
      {lightTheme ? "🌙" : "☀️"}
    </button>
  );
};
