// craco.config.js
//
// CRACO overrides for Create React App:
//  - Adds the @/ path alias so imports like `@/components/LandingPage` resolve
//    to src/components/LandingPage.
//  - Optionally disables hot-reload watching when DISABLE_HOT_RELOAD=true
//    (useful in Docker/Railway builds).
const path = require("path");
require("dotenv").config();

const disableHotReload = process.env.DISABLE_HOT_RELOAD === "true";

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      if (disableHotReload) {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => plugin.constructor.name !== "HotModuleReplacementPlugin"
        );
        webpackConfig.watch = false;
        webpackConfig.watchOptions = { ignored: /.*/ };
      } else {
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            "**/node_modules/**",
            "**/.git/**",
            "**/build/**",
            "**/dist/**",
            "**/coverage/**",
            "**/public/**",
          ],
        };
      }
      return webpackConfig;
    },
  },
};
