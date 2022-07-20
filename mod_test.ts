import { TDClient } from "./mod.ts";

const apikey = Deno.env.get("TD_API_KEY") as string;
const td = new TDClient("https://api.treasuredata.com", apikey);
