import QaForm from '@/components/qa/QaForm';
import { getHistoriesByUrl, getUrlInfoById } from '@/services/supabase';
import { parseOwnerAndRepo } from '@/utils/github';

type Props = {
    params: { id: string }
}

async function Analyze({ params }: Props) {
    const info = await getUrlInfoById(params.id);
    if (!info) {
        return (
            <div>リポジトリ情報を取得できませんでした</div>
        )
    }
    const histories = await getHistoriesByUrl(info.url);

    const { repository } = parseOwnerAndRepo(info.url);

    return (
        <QaForm url={info.url} repoName={repository} histories={histories} />
    );
};

export default Analyze;