module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/src/scss/globals.scss";`,
        // additionalData: `@import "@/src/scss/globals.scss";`,
      },
    },
  },
  devServer: {
    port: 3000,
  },
};
