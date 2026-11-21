/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '<https://ingresswithin.com/llms.txt>; rel="describedby"; type="text/markdown", </llms.txt>; rel="describedby"',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
