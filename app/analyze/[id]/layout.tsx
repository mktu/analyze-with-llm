import type { FC } from 'react'

type Props = {
    children: React.ReactNode
}

const QaLayout: FC<Props> = ({
    children
}) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default QaLayout;