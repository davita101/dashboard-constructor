// Plain module (no "use client") so the server layout can inline it as a string.
export const THEME_KEY = "dashboard-theme"

/** Runs in <head> before first paint, so a saved dark choice never flashes light. */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.classList.add("dark")}catch(e){}`
