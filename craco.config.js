const path = require("path");

module.exports = {
  // ...
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    plugins: {
      add: [
        /* ... */
      ],
      remove: [
        /* ... */
      ],
    },
    configure: (webpackConfig, { env, paths }) => {
      /* ... */
      return webpackConfig;
    },
  },
};
