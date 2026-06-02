import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Load environment variables
const loadEnv = () => {
  try {
    const envPath = resolve(import.meta.dir, ".env");
    const envContent = readFileSync(envPath, "utf-8");
    const envVars: Record<string, string> = {};
    
    envContent.split("\n").forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...value] = trimmedLine.split("=");
        if (key && value.length > 0) {
          envVars[key.trim()] = value.join("=").trim();
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.warn("Could not load .env file, using process.env");
    return process.env;
  }
};

const env = loadEnv();

const buildApiUrl = (): string => {
  const params = new URLSearchParams({
    n: env.NAME || "GAURAV",
    g: env.GITHUB || "archduke1337",
    x: env.X_USERNAME || "scren0x",
    l: env.LASTFM_USERNAME || "gurvv",
    i: env.IMAGE_URL || "https://img.sanishtech.com/u/b4dda0c96e5779d89350ad4319a4ca23.webp",
    p: env.PORTFOLIO_URL || "https://archduke.is-a.dev/",
    z: env.CACHE_BUST || "cd0f0"
  });
  
  return `https://opbento.vercel.app/api/bento?${params.toString()}`;
};

interface BentoResponse {
  url: string;
}

const fetchBentoUrl = async (url: string, retries = 3): Promise<string> => {
  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`Fetching bento URL (attempt ${i + 1}/${retries + 1})...`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = (await response.json()) as BentoResponse;
      
      if (!data.url) {
        throw new Error("No URL returned from API");
      }
      
      return data.url;
    } catch (error) {
      if (i === retries) {
        throw error;
      }
      console.warn(`Attempt ${i + 1} failed:`, (error as Error).message);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
  throw new Error("Unreachable code");
};

const updateReadme = (newBentoUrl: string): void => {
  const readmePath = resolve(import.meta.dir, "README.md");
  const readme = readFileSync(readmePath, "utf-8");

  const updated = readme.replace(
    /https:\/\/opbento\.vercel\.app\/api\/bento\/image\?[^\s"']+/g,
    newBentoUrl,
  );

  if (updated === readme) {
    throw new Error("README.md was not updated — no matching URL found");
  }

  writeFileSync(readmePath, updated, "utf-8");
  console.log("✅ README.md updated with new bento URL");
};

const main = async (): Promise<void> => {
  try {
    console.log("🚀 Starting bento URL update process...");
    const apiUrl = buildApiUrl();
    const newUrl = await fetchBentoUrl(apiUrl);
    console.log("✅ New bento URL fetched:", newUrl);

    updateReadme(newUrl);
    console.log("🎉 Bento URL update completed successfully!");
  } catch (error) {
    console.error("❌ Failed to update bento:", error);
    process.exit(1);
  }
};

await main();
