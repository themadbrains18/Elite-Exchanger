/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lcw.nyc3.cdn.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'checkcryptoaddress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol :'http',
        hostname :'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol :'https',
        hostname :'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        // https://elite-exchange-7gch2fryja-el.a.run.app/
        protocol: 'https',
        hostname: 'elite-exchange-7gch2fryja-el.a.run.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'launchyourexchange.com',
        port: '8080',
        pathname: '/**',
      }
    ],
  },
  transpilePackages: ['react-ts-tradingview-widgets'],
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
      {
        source: "/coins/single",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://api.livecoinwatch.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
    ]
  },

  // experimental: {
  //   externalDir: true
  // },
  // // Potential new config flag:
  // disableExperimentalFeaturesWarning: true

}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
 
module.exports = withBundleAnalyzer(nextConfig)

// module.exports = nextConfig
