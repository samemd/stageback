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
        hostname: "jhhegz03qa.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
