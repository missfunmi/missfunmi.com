import 'dotenv/config';
import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import eleventySyntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
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

  // Other than the site logo, all other images are hosted in Cloudinary
  // Use in markdown as follows; last param is optional and will override the maxWidth default of 800
  // {% cldImage "image.png", "alt text", 680 %}
  eleventyConfig.addShortcode("cldImage", function (src, alt, maxWidth = 800) {
    const cloudName = "missfunmi";
    const base = `https://res.cloudinary.com/${cloudName}/image/upload`;
    const sizes = [400, maxWidth, 1200];

    const srcset = sizes
      .map(w => `${base}/f_auto,q_auto,w_${w}/${src} ${w}w`)
      .join(", ");

    return `<img
      src="${base}/f_auto,q_auto,w_${maxWidth}/${src}"
      srcset="${srcset}"
      sizes="(max-width: ${maxWidth}px) 100vw, ${maxWidth}px"
      alt="${alt}"
      loading="lazy"
      decoding="async"
    >`;
  });

  eleventyConfig.addPlugin(pluginFilters);
  eleventyConfig.addPlugin(readingTimePlugin);
  eleventyConfig.addPlugin(IdAttributePlugin, {});

  // Wrap code blocks with container, language label, and copy button
  eleventyConfig.addTransform("codeBlockWrapper", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      return content.replace(
        /<pre class="language-(\w+)"([^>]*)>([\s\S]*?)<\/pre>/g,
        '<div class="code-block"><span class="code-language">$1</span><button class="copy-button" aria-label="Copy code"></button><pre class="language-$1"$2>$3</pre></div>'
      );
    }
    return content;
  });

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
