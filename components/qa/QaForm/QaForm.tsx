"use client"
import { ContainedButton } from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import { useQa } from '@/hooks/useQa';
import { FC } from 'react';

type Props = {
    url: string,
    repoName: string
}

const QaForm: FC<Props> = ({
    url,
    repoName
}) => {
    const { sendQuestion, history, setQuestion, question } = useQa(url)
    return (
        <div className='flex flex-col gap-2'>
            <div className='text-gray-500'>
                <a href={url} className='text-blue-600 underline mr-1'>
                    {repoName}
                </a>
                の分析を行います
            </div>
            <div className='flex flex-col gap-2'>{history.map((v, index) => (
                <div key={index}>
                    {v}
                </div>
            ))}</div>
            <div className='text-gray-500'>
                質問
            </div>
            <div>
                <TextArea minRows={2} value={question} onChange={(e) => {
                    setQuestion(e.target.value)
                }} />
                <ContainedButton onClick={() => {
                    sendQuestion()
                }}>送信</ContainedButton>
            </div>
        </div>
    )

};

export default QaForm;