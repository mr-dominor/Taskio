import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.clerk.com",
      port: "",
      pathname: "/**",
    },
    {
      protocol:"https",
      hostname:"images.unsplash.com"
    }
  ],
},

};

export default nextConfig;
