import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { getChainConfig } from "@/lib/config";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const config = getChainConfig();

export const metadata: Metadata = {
  title: config.branding.title,
  description: `${config.network.chainName} blockchain explorer`,
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
          <Sidebar title={config.branding.title} chainEnv={config.network.chainEnv} />
          <div className="md:pl-60">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-end border-b border-border bg-background/80 px-4 pl-14 backdrop-blur-sm md:px-6 md:pl-6">
              <ThemeToggle />
            </header>
            <main className="min-h-[calc(100vh-3.5rem-1px)] p-4 md:p-6">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
