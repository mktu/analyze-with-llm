import { HistoryInfo } from "@/types/analyze"
import { Database } from "@/types/supabase"
import { SupabaseClient } from "@supabase/supabase-js"


export const saveHistory = async (url: string, histories: HistoryInfo[], client: SupabaseClient<Database>) => {
    const result = await client.from('histories').insert(histories.map(v => ({
        user_id: v.userId,
        message: v.message,
        url
    })))

    if (result.error) {
        throw Error(result.error.message)
    }
}

export const removeHistory = async (url: string, client: SupabaseClient<Database>) => {
    const result = await client.from('histories').delete().eq('url', url);
    if (result.error) {
        throw Error(result.error.message)
    }
}

export const getHistories = async (url: string, client: SupabaseClient<Database>) => {
    const result = await client.from('histories').select('user_id,message').eq('url', url)

    if (result.error) {
        throw Error(result.error.message)
    }
    if (!result.data || result.data.length === 0) {
        return []
    }
    return result.data.map(v => ({
        userId: v.user_id,
        message: v.message
    })) as HistoryInfo[]
}