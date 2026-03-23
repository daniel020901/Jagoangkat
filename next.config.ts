import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  
  images: {
    remotePatterns:[
     {
      protocol: "https",
     
      pathname: "/**",
      hostname: "lh3.googleusercontent.com"
     },
     {
        protocol: "https",
        hostname: "thqnqeiimyazeuswqnec.supabase.co", 
        pathname: "/storage/v1/object/public/**",
      },
    ]
  }
};

export default nextConfig;
