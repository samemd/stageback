await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
