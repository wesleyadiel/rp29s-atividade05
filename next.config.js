/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output:'export',
  images: {
    loader: 'imgix',
    path: '',
  }
}

module.exports = nextConfig
