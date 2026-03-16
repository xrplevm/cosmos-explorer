import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "cosmos-explorer/ui",
  description: "Component documentation for @cosmos-explorer/ui",
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
          disableTransitionOnChange
        >
          <Sidebar />
          <div className="pl-60">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-end border-b border-border bg-background/80 px-6 backdrop-blur-sm">
              <ThemeToggle />
            </header>
            <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
