import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface BentoConfig {
  name: string;
  github: string;
  xUsername: string;
  lastfmUsername: string;
  imageUrl: string;
  portfolioUrl: string;
  cacheBust: string;
}

interface BentoResponse {
  url?: string;
}

const OP_BENTO_API_URL = "https://opbento.vercel.app/api/bento";
const README_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "README.md");
const OP_BENTO_IMAGE_URL_PATTERN = /https:\/\/opbento\.vercel\.app\/api\/bento\/image\?[^\s"'<>]+/g;

const readEnv = (key: string, fallback: string): string => process.env[key]?.trim() || fallback;

const createConfig = (): BentoConfig => ({
  name: readEnv("NAME", "GAURAV YADAV"),
  github: readEnv("GITHUB", "Archduke1337"),
  xUsername: readEnv("X_USERNAME", "scren0x"),
  lastfmUsername: readEnv("LASTFM_USERNAME", "gurvv"),
  imageUrl: readEnv(
    "IMAGE_URL",
    "https://archduke.is-a.dev/_next/image?url=%2FADYPU%2Fhackwithmumbai.png&w=1920&q=75",
  ),
  portfolioUrl: readEnv("PORTFOLIO_URL", "https://archduke.is-a.dev"),
  cacheBust: readEnv("CACHE_BUST", process.env.GITHUB_SHA?.slice(0, 5) || crypto.randomUUID().slice(0, 5)),
});

const buildApiUrl = (config: BentoConfig = createConfig()): string => {
  const url = new URL(OP_BENTO_API_URL);

  url.searchParams.set("n", config.name);
  url.searchParams.set("g", config.github);
  url.searchParams.set("x", config.xUsername);
  url.searchParams.set("l", config.lastfmUsername);
  url.searchParams.set("i", config.imageUrl);
  url.searchParams.set("p", config.portfolioUrl);
  url.searchParams.set("z", config.cacheBust);

  return url.toString();
};

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
};

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

const fetchBentoUrl = async (apiUrl: string, retries = 3): Promise<string> => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as BentoResponse;

      if (!data.url || !isValidHttpUrl(data.url)) {
        throw new Error("No valid URL returned from API");
      }

      return data.url;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      await sleep(1000 * (attempt + 1));
    }
  }

  throw new Error("Unreachable code");
};

const replaceBentoUrls = (readme: string, newBentoUrl: string): string => {
  let replacementCount = 0;
  const updated = readme.replace(OP_BENTO_IMAGE_URL_PATTERN, () => {
    replacementCount += 1;
    return newBentoUrl;
  });

  if (replacementCount === 0) {
    throw new Error("README.md does not contain an OpBento image URL");
  }

  return updated;
};

const updateReadme = async (newBentoUrl: string): Promise<boolean> => {
  const readme = await readFile(README_PATH, "utf8");
  const updated = replaceBentoUrls(readme, newBentoUrl);

  if (updated === readme) {
    return false;
  }

  await writeFile(README_PATH, updated, "utf8");
  return true;
};

const main = async (): Promise<void> => {
  const apiUrl = buildApiUrl();
  const bentoUrl = await fetchBentoUrl(apiUrl);
  const updated = await updateReadme(bentoUrl);

  console.log(updated ? "README.md updated with new bento URL." : "README.md already uses latest bento URL.");
};

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error("Failed to update bento:", error);
    process.exitCode = 1;
  }
}

export { buildApiUrl, replaceBentoUrls };
