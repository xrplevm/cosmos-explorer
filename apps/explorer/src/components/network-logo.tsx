import Image from "next/image";

export function NetworkLogo({ className }: { className?: string }) {
  return (
    <>
      {/* Dark mode: white logo on dark background */}
      <Image
        src="/network_logo_dark.svg"
        alt="XRPL EVM Sidechain"
        width={1388}
        height={297}
        className={`hidden dark:block ${className ?? ""}`}
        priority
      />
      {/* Light mode: black logo on light background */}
      <Image
        src="/network_logo_light.svg"
        alt="XRPL EVM Sidechain"
        width={1388}
        height={297}
        className={`block dark:hidden ${className ?? ""}`}
        priority
      />
    </>
  );
}
