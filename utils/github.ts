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

export const parseOwnerAndRepo = (url: string) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/(?:[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+)\/?$/;
    const match = url.match(regex);
    const repositoryUrl = match ? match[0] : '';
    const parts = repositoryUrl.split('/');
    if (parts.length < 2) {
        return {
            owner: '',
            repository: ''
        }
    }
    return {
        owner: parts[parts.length - 2],
        repository: parts[parts.length - 1]
    }
}