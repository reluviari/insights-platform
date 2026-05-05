/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_INSIGHTS_API: process.env.NEXT_PUBLIC_INSIGHTS_API,
    NEXT_PUBLIC_EMBED_PBI_APP_URL: process.env.NEXT_PUBLIC_EMBED_PBI_APP_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

module.exports = nextConfig;
