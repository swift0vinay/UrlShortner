import supabase, { supabaseUrl } from "./supabase"

export async function createUrl({ title, long_url, prefix, user_id }, qrCode) {
    const short_url = Math.random().toString(36).substring(2, 6);
    const fileName = `qr-${short_url}`;

    const { error: storageError } = await supabase
        .storage
        .from("qrs")
        .upload(fileName, qrCode)
    if (storageError)
        throw new Error(storageError.message);
    const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

    const { data, error } = await supabase
        .from("urls")
        .insert([{
            title,
            long_url,
            prefix,
            user_id,
            short_url,
            qr
        }])
        .select();

    if (error) {
        console.error(error.message);
        throw new Error("Unable to create short url");
    }
    return data;
}

export async function getUrls(user_id) {
    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("user_id", user_id)
    if (error) {
        console.error(error.message);
        throw new Error("Unable to collect urls");
    }
    return data;
}

export async function deleteUrl(id) {
    const { data, error } = await supabase
        .from("urls")
        .delete()
        .eq("id", id);
    if (error) {
        console.error(error.message);
        throw new Error("Unable to delete url");
    }
    return data;
}

export async function getLongUrl(id) {
    const { data, error } = await supabase
        .from("urls")
        .select("id, long_url")
        .eq("short_url", id)
        .single();

    if (error) {
        console.error(error.message);
        throw new Error("Unable to fetch long url");
    }
    return data;
}


export async function getUrl({ id, user_id }) {
    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("id", id)
        .eq("user_id", user_id)
        .single();

    if (error) {
        console.error(error.message);
        throw new Error("Short url not found");
    }
    return data;
}

