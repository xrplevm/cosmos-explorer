import type { Metadata, Viewport } from "next";
import { Work_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { getChainConfig } from "@/lib/config";
import { getBaseUrl } from "@/lib/metadata";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { GlobalSearch } from "@/components/global-search";
import { NetworkSwitcher } from "@/components/network-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

const config = getChainConfig();
const baseUrl = getBaseUrl();
const siteTitle = config.branding.title;
const siteDescription =
  config.branding.description ??
  `${config.network.chainName} blockchain explorer`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  applicationName: siteTitle,
  keywords: [
    config.network.chainName,
    "blockchain explorer",
    "cosmos",
    "XRPL",
    "EVM",
    "transactions",
    "blocks",
    "validators",
    "governance",
    "XRP",
  ],
  authors: [{ name: "XRPL EVM", url: config.links?.website }],
  creator: "XRPL EVM",
  openGraph: {
    type: "website",
    siteName: siteTitle,
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    url: baseUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteTitle,
            url: baseUrl,
            description: siteDescription,
            publisher: {
              "@type": "Organization",
              name: "XRPL EVM",
              url: config.links?.website ?? baseUrl,
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/favicon.png`,
              },
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/transactions/{search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
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
              <div className="relative">{children}</div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
