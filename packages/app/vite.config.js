export default {
  server: {
    proxy: {
      "/api": "http://localhost:3001",
      "/auth": "http://localhost:3001",
      "/images": "http://localhost:3001"
    }
  }
};
