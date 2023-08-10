/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  env: {
    API_ADDRESS: process.env.API_ADDRESS,
    API_BASE_URL: process.env.API_BASE_URL
  }
};

module.exports = config;
