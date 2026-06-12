import { expect, test } from "bun:test";
import { buildApiUrl, replaceBentoUrls } from "./getNewBento";

test("buildApiUrl encodes Bento API parameters", () => {
  const apiUrl = buildApiUrl({
    name: "GAURAV YADAV",
    github: "Archduke1337",
    xUsername: "scren0x",
    lastfmUsername: "gurvv",
    imageUrl: "https://archduke.is-a.dev/_next/image?url=%2FADYPU%2Fhackwithmumbai.png&w=1920&q=75",
    portfolioUrl: "https://archduke.is-a.dev",
    cacheBust: "abc12",
  });
  const url = new URL(apiUrl);

  expect(`${url.origin}${url.pathname}`).toBe("https://opbento.vercel.app/api/bento");
  expect(url.searchParams.get("n")).toBe("GAURAV YADAV");
  expect(url.searchParams.get("g")).toBe("Archduke1337");
  expect(url.searchParams.get("x")).toBe("scren0x");
  expect(url.searchParams.get("l")).toBe("gurvv");
  expect(url.searchParams.get("i")).toBe("https://archduke.is-a.dev/_next/image?url=%2FADYPU%2Fhackwithmumbai.png&w=1920&q=75");
  expect(url.searchParams.get("p")).toBe("https://archduke.is-a.dev");
  expect(url.searchParams.get("z")).toBe("abc12");
});

test("replaceBentoUrls updates href and image src", () => {
  const readme = `
<a href="https://opbento.vercel.app/api/bento/image?g=Archduke1337&z=308a8">
  <img src="https://opbento.vercel.app/api/bento/image?g=Archduke1337&z=308a8" alt="OpBento" width="1200">
</a>
`;

  const updated = replaceBentoUrls(
    readme,
    "https://opbento.vercel.app/api/bento/image?g=Archduke1337&z=new",
  );

  expect(updated.match(/api\/bento\/image\?/g)?.length).toBe(2);
  expect(updated).toContain("z=new");
  expect(updated).not.toContain("z=308a8");
});

test("replaceBentoUrls requires an OpBento image URL", () => {
  expect(() =>
    replaceBentoUrls("README without OpBento", "https://opbento.vercel.app/api/bento/image?g=Archduke1337&z=new"),
  ).toThrow("README.md does not contain an OpBento image URL");
});
