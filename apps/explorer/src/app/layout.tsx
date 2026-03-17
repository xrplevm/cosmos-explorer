import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmos Explorer",
  description: "Cosmos blockchain explorer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Sidebar />
          <div className="pl-60">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
              <div />
              <ThemeToggle />
            </header>
            <main className="p-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
