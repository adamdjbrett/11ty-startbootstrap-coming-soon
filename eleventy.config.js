import { DateTime } from "luxon";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import yaml from "js-yaml";
import * as sass from "sass";

const compileScss = async () => {
  const destination = "src/css/styles.css";

  await mkdir(dirname(destination), { recursive: true });

  const result = sass.compile("src/scss/styles.scss", {
    style: "compressed",
    loadPaths: ["node_modules"],
    sourceMap: false
  });

  await writeFile(destination, result.css);
};

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  eleventyConfig.addWatchTarget("src/scss/");

  eleventyConfig.addFilter("toAbsoluteUrl", (path, siteUrl) => {
    if (!siteUrl) {
      return path;
    }
    return new URL(path, siteUrl).href;
  });
  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) {
      return "";
    }

    if (value instanceof Date) {
      return DateTime.fromJSDate(value, { zone: "utc" }).toISODate();
    }

    if (typeof value === "string" && value.toLowerCase() === "now") {
      return DateTime.now().toUTC().toISODate();
    }

    return DateTime.fromISO(String(value), { zone: "utc" }).toISODate();
  });
  eleventyConfig.addFilter("currentYear", () => DateTime.now().toUTC().year);

  eleventyConfig.on("eleventy.before", async () => {
    await compileScss();
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}
