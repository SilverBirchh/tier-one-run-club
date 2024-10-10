export const Theme = () => {
    const click = () => {
            if (
              localStorage.theme === "dark" ||
              (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
              document.documentElement.classList.remove("dark");
              localStorage.theme = "light";
            } else {
              document.documentElement.classList.add("dark");
              localStorage.theme = "dark";
            }
          
    }
    return (
        <button onClick={click}  className="text-foreground border-b-4 border-transparent !no-underline transition-all">Toggle Theme</button>
)
}