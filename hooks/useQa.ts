"use client"
import { ClientUserId } from "@/utils/constants";
import { useCallback, useState } from "react"
import { useHistory } from "./useHistory";

const QA_PATH = '/api/analyze'
const template = `{ここに事象}に関連するIssue TitleとIssue URLを教えてください。
また、上記に関連するIssue Descriptionを100字以内で要約してください。
回答の際には、日本語で回答してください。関連する内容が見つからない場合、「わかりません」と答えてください。`

export const useQa = (url?: string) => {
    const { histories, setHistories, deleteHistory } = useHistory(url);
    const [question, setQuestion] = useState(histories.length > 0 ? '' : template);

    const sendQuestion = useCallback(async () => {
        if (!url) {
            return;
        }
        setHistories(before => [{
            userId: ClientUserId,
            message: question
        }, ...before]);
        const ret = await fetch(QA_PATH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
                histories: [],
                question
            }),
        })
        if (ret.status !== 200) {
            console.error(ret.statusText)
            return
        }
        const answer = (await ret.json()).message as string
        setHistories(before => [{
            userId: ClientUserId,
            message: answer
        }, ...before]);
    }, [url, question, setHistories]);

    return {
        question, setQuestion, histories, sendQuestion, deleteHistory
    }
}