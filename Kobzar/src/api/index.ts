import { SuggestionType } from "@/types";
import axios from "axios";

export async function fetchLocations(query: string): Promise<SuggestionType[]> {
  const res = await axios.get(
    `https://api.cv-library.co.uk/v1/locations?q=${encodeURIComponent(query)}`
  );
  return res.data;
}
