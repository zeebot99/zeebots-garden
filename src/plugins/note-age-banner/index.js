module.exports = {
  setupEleventy(eleventyConfig) {
    // Days since the given date, at build time. Invalid dates yield -1 so
    // the banner never shows for notes without a parseable timestamp.
    eleventyConfig.addFilter("gpDaysSince", function (value) {
      const then = new Date(value).getTime();

      if (Number.isNaN(then)) {
        return -1;
      }

      return Math.floor((Date.now() - then) / 86400000);
    });
  },
};
