import { analyzeGithub } from '@/logics';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const json = await request.json();
    const url = json['url'];
    const histories = json['histories'];
    const question = json['question'];
    const res = await analyzeGithub({ url, histories, question })
    return NextResponse.json({
        success: true,
        message: res.text
    });
}