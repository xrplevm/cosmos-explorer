import type { MetadataRoute } from "next";
import { getChainConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  const config = getChainConfig();

  return {
    name: config.branding.title,
    short_name: config.branding.title,
    description:
      config.branding.description ??
      `${config.network.chainName} blockchain explorer`,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
