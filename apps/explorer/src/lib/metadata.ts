import type { Metadata } from "next";
import { getChainConfig } from "@/lib/config";

function getBaseUrl(): string {
  const config = getChainConfig();
  const chainEnv = config.network.chainEnv;
  return config.explorerUrls?.[chainEnv] ?? "https://governance.xrplevm.org";
}

interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
}

/**
 * Build consistent metadata for any explorer page, including OpenGraph and
 * Twitter card tags. Merges with the root layout defaults so only overrides
 * need to be supplied.
 */
export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const config = getChainConfig();
  const baseUrl = getBaseUrl();
  const siteTitle = config.branding.title;
  const siteDescription =
    config.branding.description ??
    `${config.network.chainName} blockchain explorer`;

  const pageDescription = description ?? siteDescription;
  const canonicalUrl = path ? `${baseUrl}${path}` : baseUrl;
  // The root layout defines title.template so child pages only need the
  // segment name (e.g. "Blocks"). The template appends "| XRPL EVM Explorer".
  const ogTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return {
    title: title ?? siteTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: pageDescription,
      url: canonicalUrl,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: pageDescription,
      images: ["/og-image.png"],
    },
  };
}

/** Re-export for convenience in metadata files. */
export { getBaseUrl };
