import fg from "fast-glob";
import { readFile } from "node:fs/promises";
import matter from "gray-matter";

function validateFeatured(records) {
  const featured = records.filter((r) => r.featuredRank !== undefined);
  if (featured.length > 3)
    throw new Error(`Too many featured posts: ${featured.length} (max 3).`);

  const ranks = featured.map((r) => r.featuredRank);
  if (ranks.some((r) => typeof r !== "number" || r < 1 || r > 3)) {
    throw new Error(`Invalid featuredRank detected (allowed: 1–3).`);
  }
  const uniq = new Set(ranks);
  if (uniq.size !== ranks.length)
    throw new Error(`Duplicate featuredRank found.`);
}

async function collect() {
  const files = await fg("src/blog/**/*.md", { dot: false });
  const records = [];
  for (const file of files) {
    const src = await readFile(file, "utf8");
    const fm = matter(src).data || {};
    if (!fm.draft) {
      if (
        "featured" in fm &&
        fm.featured === true &&
        fm.featuredRank === undefined
      ) {
        // optional: deprecate boolean-only usage
        throw new Error(
          `'featured' boolean is deprecated. Use 'featuredRank: 1|2|3' in ${file}`,
        );
      }
      if (fm.featuredRank !== undefined)
        records.push({ file, featuredRank: fm.featuredRank });
    }
  }
  validateFeatured(records);
}

export default function featuredGuard() {
  return {
    name: "featured-guard",
    async buildStart() {
      await collect();
    },
    configureServer(server) {
      collect().catch((e) => {
        // fail fast in dev
        server.close();
        throw e;
      });
      // re-validate on content changes
      server.watcher.on("change", (file) => {
        if (file.includes("/src/blog/") && file.endsWith(".md")) {
          collect().catch((e) => {
            console.error(e);
          });
        }
      });
    },
  };
}
