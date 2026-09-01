const axios = require("axios");

module.exports = {
  setupEleventy(eleventyConfig, context) {
    const { domain, token } = context.settings;

    // Fetched once per build and exposed as global data; every failure
    // degrades to an empty list so the build never depends on
    // webmention.io being reachable.
    eleventyConfig.addGlobalData("gpWebmentions", async () => {
      if (!domain || !token) {
        return [];
      }

      try {
        const response = await axios.get(
          "https://webmention.io/api/mentions.jf2",
          {
            params: { domain, token, "per-page": 1000 },
            timeout: 10000,
          }
        );

        return response.data?.children ?? [];
      } catch (error) {
        console.warn(
          `[webmentions] Could not fetch mentions: ${error.message}`
        );

        return [];
      }
    });

    // The mentions targeting one page, bucketed by kind.
    eleventyConfig.addFilter("gpMentionsFor", function (mentions, pageUrl) {
      const matching = (mentions || []).filter((mention) => {
        const target = mention["wm-target"] || "";

        try {
          return new URL(target).pathname === pageUrl;
        } catch {
          return false;
        }
      });

      return {
        likes: matching.filter((m) => m["wm-property"] === "like-of"),
        reposts: matching.filter((m) => m["wm-property"] === "repost-of"),
        replies: matching.filter(
          (m) =>
            m["wm-property"] === "in-reply-to" ||
            m["wm-property"] === "mention-of"
        ),
      };
    });
  },
};
