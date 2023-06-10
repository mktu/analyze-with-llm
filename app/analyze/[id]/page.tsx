import { ContainedButton } from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import QaForm from '@/components/qa/QaForm';
import { useQa } from '@/hooks/useQa';
import { getUrlInfoById } from '@/services/llm';

type Props = {
    params: { id: string }
}

async function Analyze({ params }: Props) {
    const info = await getUrlInfoById(params.id);
    const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/(?:[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+)\/?$/;
    const match = info?.url.match(regex);
    const repositoryUrl = match ? match[0] : '';
    const parts = repositoryUrl.split('/');

    if (!info) {
        return (
            <div>リポジトリ情報を取得できませんでした</div>
        )
    }
    return (
        <QaForm url={info.url} repoName={parts[parts.length - 1]} />
    );
};

export default Analyze;