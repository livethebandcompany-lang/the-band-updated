import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.thebandcompany.in" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/t&c",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/privacypolicy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/reviews",
        destination: "/#reviews",
        permanent: true,
      },
      {
        source: "/pune",
        destination: "/blog/live-music-experiences-in-pune",
        permanent: true,
      },
      {
        source: "/karjat",
        destination: "/blog/best-live-music-band-karjat",
        permanent: true,
      },
      {
        source: "/lonavala",
        destination: "/blog/best-live-music-band-lonavala-guide",
        permanent: true,
      },
      {
        source: "/alibaug",
        destination: "/blog/why-live-music-is-perfect-match-for-alibaug-beach-wedding",
        permanent: true,
      },
      {
        source: "/mumbai",
        destination: "/blog/live-music-experiences-in-mumbai",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/services",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "unload=(self)",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
