import { useEffect, useState } from "react";

export default function ThemeToggle() {

    const [darkMode, setDarkMode] =
        useState(
            localStorage.getItem("theme")
            === "dark"
        );

    useEffect(() => {

        document.body.setAttribute(
            "data-bs-theme",
            darkMode
                ? "dark"
                : "light"
        );

        localStorage.setItem(
            "theme",
            darkMode
                ? "dark"
                : "light"
        );

    }, [darkMode]);

    return (
        <button
            className="btn btn-outline-light"
            onClick={() =>
                setDarkMode(!darkMode)
            }
        >
            {darkMode ? "☀️" : "🌙"}
        </button>
    );
}