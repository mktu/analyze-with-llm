"use client"
import { useCallback, useState } from "react"

const QA_PATH = '/api/analyze'

export const useQa = (url?: string) => {
    const [question, setQuestion] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const sendQuestion = useCallback(async () => {
        if (!url) {
            return;
        }
        setHistory(before => [question, ...before]);
        const ret = await fetch(QA_PATH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
                history,
                question
            }),
        })
        if (ret.status !== 200) {
            console.error(ret.statusText)
            return
        }
        const answer = (await ret.json()).message as string
        setHistory(before => [answer, ...before]);
    }, [url, history, question]);
    return {
        question, setQuestion, history, sendQuestion
    }
}