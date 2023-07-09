"use client"
import { HistoryInfo } from "@/types/analyze";
import { useCallback, useState } from "react";
import { atom, useRecoilState } from "recoil";

const HISTORY_PATH = '/api/histories'

export const historyState = atom<HistoryInfo[]>({
    key: 'historyState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});

export const useHistory = (url?: string) => {
    const [histories, setHistories] = useRecoilState(historyState)
    const deleteHistory = useCallback(async () => {
        const ret = await fetch(HISTORY_PATH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
                deleteHistory: true
            }),
        })
        if (ret.ok) {
            setHistories([])
        }
    }, [setHistories, url])
    return {
        histories,
        deleteHistory,
        setHistories
    }
}
