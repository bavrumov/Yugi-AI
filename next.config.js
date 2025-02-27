/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Prevents double rendedring of components during development, saves duplicate API call to LLM
    images: {
      domains: [],
    },
  }
  
  module.exports = nextConfig
  