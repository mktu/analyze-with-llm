import { GetUrlInfo } from "@/types/analyze";

const REPO_PATH = '/api/repo'

export const getRepoRegisterInfo = async (url: string) => {
    if (!url) {
        return
    }
    const searchParams = new URLSearchParams({
        url
    });
    const response = await fetch(`${REPO_PATH}?${searchParams}`)
    const json = await response.json() as GetUrlInfo
    return json;
}

export const getRepoRegisterInfoById = async (id: string) => {
    if (!id) {
        return
    }
    const response = await fetch(`${REPO_PATH}/${id}`)
    const json = await response.json() as GetUrlInfo
    return json;
}