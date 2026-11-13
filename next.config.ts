import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Uploaded logos live in the public Supabase Storage bucket `logos` (src/lib/files/paths.ts).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: supabaseUrl
      ? [{ protocol: "https", hostname: supabaseUrl.hostname, pathname: "/storage/v1/object/public/logos/**" }]
      : [],
  },
  experimental: {
    optimizePackageImports: ["recharts", "date-fns", "lucide-react", "@base-ui/react"],
    // The project form posts up to two 2 MB logos (MAX_LOGO_BYTES) through a Server Action.
    serverActions: { bodySizeLimit: "5mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
