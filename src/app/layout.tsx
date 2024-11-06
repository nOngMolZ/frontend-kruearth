import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavRail from "@/components/ui/NavRail";
import { UserProvider } from "@/context/userContext";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Quiz Hub",
	description: "Quiz Game",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang={"en"}>
			<body className={inter.className}>
				<UserProvider>
					<AuthGuard>
						<div className="flex">
							<NavRail />
							<main className="sm:ml-16 md:ml-20 w-full h-full">
								{children}
							</main>
						</div>
					</AuthGuard>
				</UserProvider>
			</body>
		</html>
	);
}
