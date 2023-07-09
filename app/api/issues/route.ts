import { fetchIssues } from '@/services/repo';
import { NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
};

export async function GET(request: Request) {

    const res = await fetchIssues()

    return NextResponse.json({
        result: 'found',
        ...res
    });
}