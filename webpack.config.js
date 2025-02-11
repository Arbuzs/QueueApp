const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js", // Ensure the entry point is defined
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist/",  // Correct this to serve assets correctly
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Support JS and JSX files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/, // CSS Loader
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Image loader
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Allow imports without specifying extensions
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // Serve static files from 'public' folder
    },
    hot: true,
    open: true,
    historyApiFallback: true, // This will ensure React Router works correctly on page reloads
    port: 4000, // Ensure React runs on 4000
    setupMiddlewares: (middlewares, devServer) => {
      console.log("✅ Webpack Middleware Running");

      middlewares.unshift((req, res, next) => {
        console.log(`Request made to: ${req.url}`);
        next();
      });

      return middlewares;
    },
  },
};
