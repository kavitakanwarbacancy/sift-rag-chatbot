// Backend wahi purana Express (server.js) hai.
// Next in teen routes ko uspe forward kar deta hai, isliye browser me ek hi origin dikhta hai.
const BACKEND = "http://localhost:5001";

module.exports = {
  devIndicators: false, 
  experimental: { proxyTimeout: 600000 },   
  async rewrites() {
    return [
      { source: "/upload", destination: `${BACKEND}/upload` },
      { source: "/chat", destination: `${BACKEND}/chat` },
      { source: "/files", destination: `${BACKEND}/files` },
    ];
  },
};
