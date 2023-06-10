import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from 'next/navigation';
import { UrlInfo } from "@/types/analyze";
import { getRepoRegisterInfo } from "@/utils/github";

const API_PATH = '/api/git-llm'
const REPO_PATH = '/api/repo'
const githubRepoRegex: RegExp = /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(\/.*)?$/i;


export const useUrl = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register, watch, formState: { errors }, setValue } = useForm({ mode: 'onChange' });
    const [checkingRegistered, setCheckingRegistered] = useState(false)
    const [repoInfo, setRepoInfo] = useState<UrlInfo>();

    useEffect(() => {
        if (searchParams.has('url')) {
            setValue('url', searchParams.get('url'));
        }
    }, [searchParams, setValue])

    const urlInput = register('url', {
        required: 'URLを入力してください',
        pattern: {
            value: githubRepoRegex,
            message: 'GithubのURLの形式で入力してください',
        }
    })
    const url = watch('url');
    const urlError = errors[urlInput.name]
    const checkRegisterStatus = useCallback(async () => {
        if (urlError || !url) {
            return
        }
        setCheckingRegistered(true)
        const ret = await getRepoRegisterInfo(url)
        setCheckingRegistered(false)
        if (!ret || ret.result === 'not found') {
            return
        }
        const { result, ...info } = ret;
        setRepoInfo(info);
    }, [url, urlError])
    useEffect(() => {
        checkRegisterStatus();
    }, [checkRegisterStatus])
    const deleteUrl = useCallback(async () => {
        await fetch(REPO_PATH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
                remove: true
            }),
        })
        await checkRegisterStatus();
    }, [checkRegisterStatus, url])
    const saveUrl = useCallback(async () => {
        const ret = await fetch(REPO_PATH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url
            }),
        })
        if (ret.status !== 200) {
            console.error(ret.statusText)
            return
        }
        let retry = 20;
        const id = setInterval(() => {
            checkRegisterStatus();
            if (--retry <= 0) {
                clearInterval(id)
            }
        }, 10000)
    }, [url, checkRegisterStatus]);
    const navigateToAnalyze = () => {
        if (repoInfo) {
            router.push(`/analyze/${repoInfo?.id}`)
        }
    }
    return {
        urlInput,
        errors,
        saveUrl,
        deleteUrl,
        navigateToAnalyze,
        repoInfo,
        urlError,
        checkingRegistered,
        url,
    }
}


export const useQa = (url: string) => {
    const { register, watch, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [histories, setHistories] = useState<string[]>([])
    const question = register('question', {
        required: '質問は必須項目です',
    })
    const questionInput = watch('question');
    const submit = useCallback(async () => {
        setHistories(before => [questionInput, ...before])
        const result = await fetch(API_PATH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url, question: questionInput, history: []
            }),
        })
        if (result.ok) {
            const json = await result.json();
            setHistories(before => [json['message'], ...before])
        }
        else {
            console.error(result.statusText)
        }
    }, [url, questionInput])

    return {
        question,
        errors,
        submit,
        histories
    }
}