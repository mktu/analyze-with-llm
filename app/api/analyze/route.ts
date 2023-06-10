import { analyzeGithub } from '@/services/llm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const json = await request.json();
    const url = json['url'];
    const history = json['history'];
    const question = json['question'];
    const res = await analyzeGithub({ url, history, question })
    return NextResponse.json({
        success: true,
        message: res.text
    });
}