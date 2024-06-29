import { UAParser } from "ua-parser-js";
import supabase from "./supabase"

export async function getClicksForUrls(url_ids) {
    const { data, error } = await supabase
        .from("clicks")
        .select("*")
        .in("url_id", url_ids);

    if (error) {
        console.error(error.message);
        throw new Error("Unable to collect clicks information");
    }
    return data;
}

export async function getClicksForUrl(url_id) {
    const { data, error } = await supabase
        .from("clicks")
        .select("*")
        .eq("url_id", url_id);

    if (error) {
        console.error(error.message);
        throw new Error("Unable to load stats");
    }
    return data;
}

const parser = new UAParser();
export const storeClicks = async ({ id, long_url }) => {
    try {
        const res = parser.getResult();
        const device = res.type || "desktop";

        const response = await fetch("https://ipapi.co/json");
        const { city, country_name: country } = await response.json();

        await supabase.from("clicks")
            .insert({
                url_id: id,
                city: city,
                country: country,
                device: device,
            });
        window.location.href = long_url;
    } catch (error) {
        console.error(error);
        throw new Error("failed to collect click info");
    }
}
