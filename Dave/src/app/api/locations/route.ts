import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");

  try {
    const res = await fetch(
      `https://api.cv-library.co.uk/v1/locations?q=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return Response.json(res, { status: res.status });
  } catch (e: any) {
    // Depends on the api what response is returned for error, still wouldnt want to pass the error object directly to client to not expose implementation detail of the backend
    console.log(e);
    return Response.json({ status: 400, message: "Something's wrong" });
  }
}
