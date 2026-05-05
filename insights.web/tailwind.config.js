/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx", "./src/**/*.ts"],
  theme: {
    colors: {
      primary: "var(--color-primary)",
      neutral: {
        0: "var(--color-neutral-0)",
        100: "var(--color-neutral-100)",
        200: "var(--color-neutral-200)",
        300: "var(--color-neutral-300)",
        400: "var(--color-neutral-400)",
        500: "var(--color-neutral-500)",
        600: "var(--color-neutral-600)",
        700: "var(--color-neutral-700)",
        900: "var(--color-neutral-900)",
        1000: "var(--color-neutral-1000)",
      },
      red: {
        50: "var(--color-red-50)",
        100: "var(--color-red-100)",
        200: "var(--color-red-200)",
        300: "var(--color-red-300)",
        400: "var(--color-red-400)",
        500: "var(--color-red-500)",
        600: "var(--color-red-600)",
        700: "var(--color-red-700)",
        800: "var(--color-red-800)",
        900: "var(--color-red-900)",
      },
      system: {
        error: {
          100: "var(--color-system-error-100)",
          500: "var(--color-system-error-500)",
        },
        alert: {
          100: "var(--color-system-alert-100)",
          500: "var(--color-system-alert-500)",
        },
        success: {
          100: "var(--color-system-success-100)",
          500: "var(--color-system-success-500)",
        },
      },
      password: {
        100: "var(--color-gray-100)",
        200: "var(--color-red-200)",
        300: "var(--color-yellow-300)",
        400: "var(--color-green-400)",
        500: "var(--color-green-500)",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "background-login": "url('/img/binary.png')",
      },
      boxShadow: {
        "shadow-rounded": "0px 0px 6px 2px rgba(77, 235, 50, 0.3)",
        "shadow-profile": "1px 1px 15px rgba(0, 0, 0, 0.3)",
        submenu: "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
        modal: "0px 20px 24px -4px rgba(16, 24, 40, 0.1), 0px 8px 8px -4px rgba(16, 24, 40, 0.04)",
      },
      transitionProperty: {
        width: "width, max-width, height, max-height, overflow, opacity",
      },
      colors: {
        body: "#F3F7F9",
        "system-success-500": "#28a745",
        "system-error-500": "#dc3545",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      animation: {
        enter: "enter .2s ease-out",
        leave: "leave .15s ease-in forwards",
      },
      keyframes: {
        enter: {
          "0%": {
            opacity: "0",
            transform: "scale(.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        leave: {
          "0%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(.9)",
          },
        },
      },
    },
  },
  plugins: [],
};
