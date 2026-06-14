import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-oswald)", "system-ui", "sans-serif"],
                serif: ["var(--font-serif)", "Georgia", "serif"],
                merriweather: ["var(--font-merriweather)", "serif"],
            },
        },
    },
    plugins: [],
};

export default config;
