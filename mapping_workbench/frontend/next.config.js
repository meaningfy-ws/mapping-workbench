/** @type {import('next').NextConfig} */
require('dotenv').config();

const path = require('path')

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
    MW_BACKEND_ADDRESS: process.env.MW_BACKEND_ADDRESS,
    MW_BACKEND_BASE_URL: process.env.MW_BACKEND_BASE_URL
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  }
};

module.exports = config;
