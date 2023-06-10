import UrlForm from '@/components/qa/UrlForm';
import type { FC } from 'react'

type Props = {
    children: React.ReactNode
}

const QaLayout: FC<Props> = ({
    children
}) => {
    return (
        <div className='p-3 shadow mt-5 w-[710px]'>
            {children}
        </div>
    );
};

export default QaLayout;