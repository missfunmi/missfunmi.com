import 'dotenv/config';
import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import eleventySyntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import dirOutputPlugin from "@11ty/eleventy-plugin-directory-output";
import { minify } from "terser";
import htmlmin from "html-minifier-terser";
import readingTimePlugin from "eleventy-plugin-reading-time";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import mila from "markdown-it-link-attributes";
import pluginFilters from "./src/_config/filters.js";

export default async function(eleventyConfig) {
  eleventyConfig.setQuietMode(true);
	eleventyConfig.addPlugin(dirOutputPlugin, {
    columns: {
      filesize: true,
			benchmark: true,
		},
		warningFileSize: 400 * 1000,
	});

  eleventyConfig.addBundle("css");
  eleventyConfig.addBundle("js");

	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/feed/atom.xsl");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpg,jpeg,gif}");

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

  eleventyConfig.addNunjucksAsyncFilter(
    "jsmin",
    async function (code, callback) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error("Terser error: ", err);
        callback(null, code);
      }
    }
  );

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg", "svg", "png", "auto"],
    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      fallback: "smallest"
    },
    sharpOptions: {
      animated: true,
    },
  });

  eleventyConfig.addPlugin(pluginFilters);
  eleventyConfig.addPlugin(readingTimePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, {});

  eleventyConfig.addTransform("htmlmin", function (content) {
		if ((this.page.outputPath || "").endsWith(".html")) {
			let minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
				minifyCSS: true,
        minifyJS: true
			});

			return minified;
		}

		// If not an HTML output, return content as-is
		return content;
	});

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });
};

export const config = {
	templateFormats: [
		"md",
		"njk",
    "js",
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
