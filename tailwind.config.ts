import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},

		extend: {
			fontFamily: {
				prompt: ['"Prompt"', "sans-serif"],
			},

			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				// primary: {
				// 	DEFAULT: "#e0f2fe",
				// 	hover: "#bae6fd",
				// },
				// secondary: {
				// 	DEFAULT: "#0c4a6e",
				// 	hover: "#082f49",
				// 	foreground: "#fff",
				// },
				// accent: {
				// 	DEFAULT: "#7dd3fc",
				// 	hover: "#38bdf8",
				// },
				primary: {
					DEFAULT: "#fef3c7",
					hover: "#fde68a",
				},
				secondary: {
					DEFAULT: "#c2410c",
					hover: "#7c2d12",
					foreground: "#fff",
				},
				accent: {
					DEFAULT: "#fed7aa",
					hover: "#fdba74",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},

			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},

			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"slide-down": "slideDown 0.5s ease-out",
			},

			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				slideDown: {
					"0%": {
						transform: "translateY(-100%) translateX(-50%)",
						opacity: "0",
					},
					"100%": {
						transform: "translateY(-50%) translateX(-50%)",
						opacity: "1",
					},
				},
			},

			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
