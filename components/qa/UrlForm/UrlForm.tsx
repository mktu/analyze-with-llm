"use client"
import { ContainedButton, OutlinedButton, TextButton } from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import { useUrl } from '@/hooks/useUrl';
import type { FC } from 'react'

const UrlForm: FC = () => {
    const { urlInput, repoInfo, urlError, saveUrl, deleteUrl, checkingRegistered, navigateToAnalyze, url } = useUrl()

    return (
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex items-center gap-2 w-full'>
                <label htmlFor='github' className='text-gray-500' >URL(Github)</label>
                <TextInput className='w-[360px]' id='github' {...urlInput} />
                {checkingRegistered ? (
                    <div className='ml-auto'>問い合わせ中</div>
                ) : (<TextButton disabled={!Boolean(url) || Boolean(repoInfo) || Boolean(urlError)} onClick={() => {
                    saveUrl()
                }} className='ml-auto whitespace-nowrap'>登録する</TextButton>
                )}
            </div>
            {urlError && (
                <div className='text-red-400'>
                    {urlError.message?.toString()}
                </div>
            )}
            {
                repoInfo && (repoInfo.status === 'done' ? (
                    <div className='flex items-center gap-1'>
                        <div>✅ このリポジトリは既に登録されています</div>
                        <ContainedButton onClick={navigateToAnalyze} className='ml-auto whitespace-nowrap'>解析する</ContainedButton>
                        <TextButton onClick={deleteUrl} className='whitespace-nowrap'>削除する</TextButton>
                    </div>
                ) : repoInfo.status === 'inprogress' ? (
                    <div className='flex items-center gap-1'>
                        <div className='text-red-400'>✍️リポジトリを現在情報抽出中です✍️</div>
                        <OutlinedButton onClick={deleteUrl} className='ml-auto whitespace-nowrap'>中断する</OutlinedButton>
                    </div>
                ) : null)
            }
        </div>
    );

};

export default UrlForm;