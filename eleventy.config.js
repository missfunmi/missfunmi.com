import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import eleventySyntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import lightningCSS from "@11tyrocks/eleventy-plugin-lightningcss";
import readingTimePlugin from "eleventy-plugin-reading-time";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import mila from "markdown-it-link-attributes";
import pluginFilters from "./src/_config/filters.js";

export default async function(eleventyConfig) {
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/feed/atom.xsl");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");

  eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpg,jpeg,gif}");
  eleventyConfig.addBundle("js", {
    toFileDirectory: "dist",
  });

  let markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  };
  let mdLib = markdownIt(markdownItOptions);

  // Opens absolute (i.e. external) links in a new tab
  const milaOptions = {
    matcher(href) {
      return href.match(/^https?:\/\//);
    },
    attrs: {
      target: "_blank",
      rel: "noopener",
    },
  };

  // Amend library to use above 'links in new tab' and some other amendments
  eleventyConfig.amendLibrary("md", (mdLib) =>
    mdLib.use(mila, milaOptions).use(markdownItAnchor).use(markdownItFootnote)
  );

  eleventyConfig.setLibrary("md", mdLib);

  eleventyConfig.addPlugin(eleventySyntaxHighlightPlugin, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(lightningCSS);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "svg", "auto"],
    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
    },
    sharpOptions: {
      animated: true,
    },
  });

  eleventyConfig.addPlugin(pluginFilters);
  eleventyConfig.addPlugin(readingTimePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, {});

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });
};

export const config = {
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "src",
		output: "_site"
	},
  pathPrefix: '/',
};
