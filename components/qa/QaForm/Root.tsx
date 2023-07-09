"use client"
import { historyState } from '@/hooks/useHistory';
import { HistoryInfo } from '@/types/analyze';
import type { FC } from 'react'
import { RecoilRoot } from 'recoil';
import QaForm from './QaForm';

type Props = {
    histories: HistoryInfo[],
    url: string,
    repoName: string,
}

const Root: FC<Props> = ({
    histories,
    url,
    repoName
}) => {
    return (
        <RecoilRoot initializeState={({ set }) => {
            set(historyState, histories)
        }}>
            <QaForm url={url} repoName={repoName} />
        </RecoilRoot>
    );
};

export default Root;