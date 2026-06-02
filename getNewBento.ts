import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const apiUrl = "https://opbento.vercel.app/api/bento?n=GAURAV&g=archduke1337&x=scren0x&l=gurvv&i=https%3A%2F%2Fimg.sanishtech.com%2Fu%2Fb4dda0c96e5779d89350ad4319a4ca23.webp&p=https%3A%2F%2Farchduke.is-a.dev%2F&z=cd0f0";

interface BentoResponse {
  url: string;
}

const fetchBentoUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as BentoResponse;
  if (!data.url) {
    throw new Error("No URL returned from API");
  }
  return data.url;
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
  console.log("README.md updated with new bento URL");
};

const main = async (): Promise<void> => {
  try {
    console.log("Fetching new bento URL...");
    const newUrl = await fetchBentoUrl(apiUrl);
    console.log("New bento URL:", newUrl);

    updateReadme(newUrl);
  } catch (error) {
    console.error("Failed to update bento:", error);
    process.exit(1);
  }
};

await main();
