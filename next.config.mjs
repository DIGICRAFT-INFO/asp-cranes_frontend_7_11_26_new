/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_PUBLIC_API_URL is read from .env or Hostinger environment variables
  // https://aspcranes.com  → frontend
  // https://api.aspcranes.com → backend
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
