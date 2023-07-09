import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { UrlInfo } from "@/types/analyze";
import { Database } from "@/types/supabase";
import { getHistories, removeHistory as removeHistoryInternal } from "./history";

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`);


export const getUrlInfoInternal = async (url: string, client: SupabaseClient<Database>) => {
    const result = await client.from('urls').select('url,status,id').eq('url', url)
    if (!result || !result.data || result.data.length === 0) {
        return null
    }
    return result.data[0] as UrlInfo
}

export const clearEmbeddings = async (url: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    await client.from('urls').delete().eq('url', url);
    await client.rpc('delete_documents_by_url', { url })
}

export const getUrlInfo = async (url: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    return await getUrlInfoInternal(url, client)
}

export const getUrlInfoById = async (id: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    const result = await client.from('urls').select('url,status,id').eq('id', id)
    if (!result || !result.data || result.data.length === 0) {
        return null
    }
    return result.data[0] as UrlInfo
}

export const getHistoriesByUrl = async (url: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    return await getHistories(url, client);
}

export const createSupabaseClient = () => {
    return createClient<Database>(supabaseUrl, privateKey);
}

export const removeHistory = async (url: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    return await removeHistoryInternal(url, client);
}
