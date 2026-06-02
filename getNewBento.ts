const apiUrl = "https://opbento.vercel.app/api/bento?n=GAURAV&g=archduke1337&x=scren0x&l=gurvv&i=https%3A%2F%2Fimg.sanishtech.com%2Fu%2Fb4dda0c96e5779d89350ad4319a4ca23.webp&p=https%3A%2F%2Farchduke.is-a.dev%2F&z=cd0f0";
interface BentoResponse {
  url: string;
}

const fetchBentoUrl = async (apiUrl: string): Promise<string> => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: BentoResponse = (await response.json()) as BentoResponse;
    return data.url;
  } catch (error) {
    console.error("Error fetching Bento URL:", error);
    throw error;
  }
};

// @ts-ignore
await fetchBentoUrl(apiUrl);