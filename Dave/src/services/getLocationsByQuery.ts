export const getLocationsByQuery = async (query: string) => {
  if (query.length < 1) return;
  try {
    // Typically I would proxy it via routes api, however due to cloudflare challenge I wasn't able to
    // const res = await fetch(`api/locations?q=${query}`);
    const res = await fetch(
      `https://api.cv-library.co.uk/v1/locations?q=${query}`,
    );

    const data = await res.json();
    return data;
  } catch (e: any) {
    console.log({ e });
  }
};
