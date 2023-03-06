import path from "path";

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: [".ts", ".tsx", ".vue", ".json"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@views": path.resolve(__dirname, "./src/views"),
        "@atoms": path.resolve(__dirname, "./src/components/atoms"),
        "@molecules": path.resolve(__dirname, "./src/components/molecules"),
        "@organisms": path.resolve(__dirname, "./src/components/organisms"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@assets": path.resolve(__dirname, "./src/assets"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        {
          test: /\.vue$/,
          loader: ["style", "css", "sass"],
        },
      ],
    },
  },
};
