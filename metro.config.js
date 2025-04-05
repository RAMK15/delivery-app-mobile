const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure Metro bundler
config.server = {
  ...config.server,
  host: '127.0.0.1', // Use localhost IP
  port: 19000, // Use a different port
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Allow all origins
      res.setHeader('Access-Control-Allow-Origin', '*');
      return middleware(req, res, next);
    };
  },
};

// Increase the maximum number of workers
config.maxWorkers = 4;

module.exports = config; 