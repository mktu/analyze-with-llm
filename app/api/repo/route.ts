import { clearEmbeddings, getUrlInfo, storeEmbeddings } from '@/services/llm';
import { GetUrlInfo } from '@/types/analyze';
import { NextFetchEvent, NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
};

export async function GET(request: Request) {
    const urlSearchParams = new URL(request.url);
    const url = urlSearchParams.searchParams.get('url')
    if (!url) {
        return NextResponse.json({
            message: 'url is not defined'
        }, { status: 400 });
    }
    const info = await getUrlInfo(url);
    if (!info) {
        return NextResponse.json({
            result: 'not found'
        } as GetUrlInfo);
    }
    return NextResponse.json({
        ...info,
        result: 'found'
    } as GetUrlInfo);
}

export async function POST(request: Request, context: NextFetchEvent) {
    const json = await request.json();
    const url = json['url'];
    const remove = json['remove']
    if (remove) {
        await clearEmbeddings(url);
    } else {
        await storeEmbeddings(url);
        // https://github.com/vercel/next.js/discussions/50441
        // context.waitUntil(storeEmbeddings(url));
    }
    return NextResponse.json({
        success: true,
        message: 'ok'
    });
}