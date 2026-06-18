import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.0.67:3000', '192.168.0.67', 'localhost:3000','192.168.1.2'],
};

export default nextConfig;
