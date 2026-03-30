import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { getChainConfig } from "@/lib/config";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { GlobalSearch } from "@/components/global-search";
import { NetworkSwitcher } from "@/components/network-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

const config = getChainConfig();

export const metadata: Metadata = {
  title: config.branding.title,
  description:
    config.branding.description ??
    `${config.network.chainName} blockchain explorer`,
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={workSans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Sidebar title={config.branding.title} chainEnv={config.network.chainEnv} />
          <div className="md:pl-60">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-end gap-3 border-b border-border bg-background/80 px-4 pl-14 backdrop-blur-sm md:px-6 md:pl-6">
              <GlobalSearch
                bech32Prefix={config.network.bech32Prefix}
                evmSearch={config.features.evmSearch}
                accounts={config.features.accounts}
              />
              {config.explorerUrls && (
                <NetworkSwitcher
                  chainEnv={config.network.chainEnv}
                  explorerUrls={config.explorerUrls}
                />
              )}
              <ThemeToggle />
            </header>
            <main className="relative min-h-[calc(100vh-3.5rem-1px)] overflow-hidden p-4 md:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-60 -top-20 h-[800px] w-[500px] bg-[url('/bg-lines-left.webp')] bg-contain bg-no-repeat"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 -right-40 h-[800px] w-[500px] bg-[url('/bg-lines-right.png')] bg-contain bg-right-bottom bg-no-repeat"
              />
              <div className="relative animate-[page-enter_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">{children}</div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
