import { useHistory } from '@/hooks/useHistory';
import { HistoryInfo } from '@/types/analyze';
import type { FC } from 'react'
import Message from './Message';

type Props = {
    url: string
}

const Histories: FC<Props> = ({ url }) => {
    const { histories } = useHistory(url)
    return (
        <div className='flex flex-col gap-2 max-h-[512px] min-h-[256px] overflow-auto bg-gray-100 p-2 rounded border'>
            {histories.length > 0 ? histories.map((v, index) => (
                <Message history={v} key={index} />
            )) : <p className='text-gray-700'>
                履歴はありません
            </p>}
        </div>
    );
};

export default Histories;