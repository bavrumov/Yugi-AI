import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import MillenniumBackground from "@/components/MillenniumBackground";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper"; // Import the client-side ThemeProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: "/images/millennium-items/puzzle.png", // Default favicon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        <ThemeProviderWrapper>
          <MillenniumBackground />
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <main className="relative z-10 flex min-h-screen flex-col items-center p-4 sm:p-8">
            <div className="container max-w-4xl mx-auto flex flex-col items-center gap-8 py-8">
              {children}
            </div>
          </main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}