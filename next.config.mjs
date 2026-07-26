/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/certificates/[certNo]/png': ['./public/assets/**/*'],
  },
};

export default nextConfig;
