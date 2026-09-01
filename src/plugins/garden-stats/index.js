module.exports = {
  setupEleventy(eleventyConfig) {
    // Summarize the core link graph: note count, unique link count, and
    // the most-linked (by backlinks) visible notes.
    eleventyConfig.addFilter("gpGardenStats", function (graph, topCount) {
      const nodes = Object.values((graph && graph.nodes) || {}).filter(
        (node) => !node.hide
      );

      const linkCount = nodes.reduce(
        (sum, node) => sum + (node.outBound || []).length,
        0
      );

      const topLinked = [...nodes]
        .filter((node) => (node.backLinks || []).length > 0 && !node.home)
        .sort((a, b) => b.backLinks.length - a.backLinks.length)
        .slice(0, topCount || 3)
        .map((node) => ({
          url: node.url,
          title: node.title,
          backlinks: node.backLinks.length,
        }));

      return { noteCount: nodes.length, linkCount, topLinked };
    });
  },
};
