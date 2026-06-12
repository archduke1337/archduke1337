const apiUrl = "https://opbento.vercel.app/api/bento?n=GAURAV%20YADAV&g=Archduke1337&x=scren0x&l=gurvv&i=https%3A%2F%2Farchduke.is-a.dev%2F_next%2Fimage%3Furl%3D%252FADYPU%252Fhackwithmumbai.png%26w%3D1920%26q%3D75&p=https%3A%2F%2Farchduke.is-a.dev&z=308a8";
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