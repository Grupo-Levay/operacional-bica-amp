import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Otimização de imagens: avif/webp reduzem peso e melhoram LCP.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

// Habilita o relatório de bundle com `ANALYZE=true npm run build`.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
