import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG:true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co"
      },
      {
        protocol: "https",
        hostname: "media-hosting.imagekit.io"
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io"
      },
      // {
      //   protocol: "https",
      //   hostname: "media-hosting.imagekit.io"
      // },
      // {
      //   protocol: "https",
      //   hostname: "images.scalebranding.com"
      // },
      // {
      //   protocol: "https",
      //   hostname: "images.scalebranding.com"
      // },
    ],
  },
  compress: true,
  reactStrictMode: false,
  sassOptions: {
    includePaths: ['./styles'],
  },
  
};

export default nextConfig;

