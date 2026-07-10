import type { NextConfig } from "next";
import type { RemotePattern } from "@/types";

function patternFromOrigin(origin: string): RemotePattern | null {
  try {
    const url = new URL(origin);
    const protocol = url.protocol.replace(":", "");
    if (protocol !== "http" && protocol !== "https") return null;

    return {
      protocol,
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/**",  // ← /media/** থেকে /** করা হয়েছে
    };
  } catch {
    return null;
  }
}

const localOrigins = [
  "https://radiology-backend-do2p.onrender.com",
  "http://localhost:8000",
];

const envOrigin = process.env.NEXT_PUBLIC_API_URL;

const origins = envOrigin ? [...localOrigins, envOrigin] : localOrigins;

// Cloudinary আলাদাভাবে যোগ করা হয়েছে
const cloudinaryPattern: RemotePattern = {
  protocol: "https",
  hostname: "res.cloudinary.com",
  pathname: "/**",
};

const remotePatterns = [
  ...Array.from(new Set(origins))
    .map(patternFromOrigin)
    .filter((p): p is RemotePattern => p !== null),
  cloudinaryPattern,
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;