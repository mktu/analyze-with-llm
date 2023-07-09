"use client"
import { ContainedButton, OutlinedButton } from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import { useQa } from '@/hooks/useQa';
import { FC } from 'react';
import Histories from './Histories';


type Props = {
    url: string,
    repoName: string,
}

const QaForm: FC<Props> = ({
    url,
    repoName
}) => {
    const { sendQuestion, setQuestion, question, deleteHistory } = useQa(url)
    return (
        <div className='flex flex-col gap-2 overflow-hidden p-2'>
            <div className='text-gray-500'>
                <a href={url} className='text-blue-600 underline mr-1'>
                    {repoName}
                </a>
                の分析を行います
            </div>
            <Histories url={url} />
            <TextArea minRows={2} value={question} onChange={(e) => {
                setQuestion(e.target.value)
            }} />
            <div className='w-full flex items-center gap-2'>
                <ContainedButton className='ml-auto' onClick={() => {
                    sendQuestion()
                }}>送信</ContainedButton>
                <OutlinedButton onClick={() => {
                    deleteHistory()
                }}>
                    履歴をクリア
                </OutlinedButton>
            </div>
        </div>
    )

};

export default QaForm;