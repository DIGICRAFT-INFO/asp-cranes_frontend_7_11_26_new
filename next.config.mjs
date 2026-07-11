/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_PUBLIC_API_URL is passed through automatically (it's a NEXT_PUBLIC_ var)
  // Set it in Vercel dashboard → Project Settings → Environment Variables
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
