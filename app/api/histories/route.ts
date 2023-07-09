import { fetchIssues } from '@/services/repo';
import { getHistoriesByUrl, removeHistory } from '@/services/supabase';
import { NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
};

export async function GET(request: Request) {

    const urlSearchParams = new URL(request.url);
    const url = urlSearchParams.searchParams.get('url') || ''
    const res = await getHistoriesByUrl(url)
    return NextResponse.json({
        result: 'found',
        histories: res
    });
}

export async function POST(request: Request) {

    const { url, deleteHistory } = await request.json();

    if (deleteHistory) {
        await removeHistory(url)
    }
    return NextResponse.json({
        result: 'ok'
    });
}