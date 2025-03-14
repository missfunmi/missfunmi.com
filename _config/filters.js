import { DateTime } from "luxon";

export default function (eleventyConfig) {
  // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
      format || "LLLL d, yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return the keys used in an object
  eleventyConfig.addFilter("getKeys", (target) => {
    return Object.keys(target);
  });

  // Exclude the following tags from being shown on the /tags page
  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "posts", "project-page"].indexOf(tag) === -1
    );
  });

  eleventyConfig.addFilter("sortAlphabetically", (strings) =>
    (strings || []).sort((b, a) => b.localeCompare(a))
  );

  eleventyConfig.addFilter("sortByPlacement", (entries) =>
    (entries || []).sort((a, b) => a.data.placement - b.data.placement)
  );

  // Excerpt filter (currently only used in the atom feed) - shortens post content to the first 80 words and adds a trailing ellipsis if the post length is greater than the excerpt
  eleventyConfig.addFilter("shortenToExcerpt", (post) => {
    let rawText = post.replace(/(<([^>]+)>)/gi, "");
    let excerpt = rawText.split(" ").slice(0, 80).join(" ");
    if (rawText.length > excerpt.length) {
      excerpt+=("...");
    }
    return excerpt;
  });
}
